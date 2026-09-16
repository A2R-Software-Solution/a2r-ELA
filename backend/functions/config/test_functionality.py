"""Regression checks use fake Firestore state and mock external AI/auth calls."""
import copy
import threading
import unittest
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime, timezone
from unittest.mock import patch
from flask import Flask, request
import main
from config.settings import settings, Settings
from config.validation import validate
from auth.auth_service import AuthService, require_auth
from essay.essay_service import essay_service
from essay.progress_service import progress_service
from gamification.reward_engine import reward_engine
from gamification.atomic_rewards import award
from llm.llm_client import RoundRobinGroqClient


class FakeSnapshot:
    def __init__(self, value):
        self.exists = value is not None
        self.value = copy.deepcopy(value)
    def to_dict(self):
        return copy.deepcopy(self.value)


class FakeReference:
    def __init__(self, db, path):
        self.db, self.path = db, path
    def collection(self, name):
        return FakeReference(self.db, self.path + '/' + name)
    def document(self, name):
        return self.collection(name)
    def get(self, transaction=None):
        return FakeSnapshot(self.db.data.get(self.path))


class FakeTransaction:
    def __init__(self, db):
        self.db = db
    def set(self, ref, data, merge=False):
        self.db.data[ref.path] = {**(self.db.data.get(ref.path, {}) if merge else {}), **copy.deepcopy(data)}


class FakeDB:
    def __init__(self):
        self.data = {}
        self.lock = threading.RLock()
    def collection(self, name):
        return FakeReference(self, name)
    def transaction(self):
        return FakeTransaction(self)


def serial_transaction(func):
    def execute(transaction):
        with transaction.db.lock:
            return func(transaction)
    return execute


class FunctionalityTests(unittest.TestCase):
    def setUp(self):
        self.app = Flask(__name__)

    def test_auth_errors_are_json_and_valid_auth_reaches_handler(self):
        handler = require_auth(lambda req, uid: main.https_fn.Response(uid))
        with self.app.test_request_context('/'):
            response = handler(request)
            self.assertEqual(response.status_code, 401)
            self.assertIn('error', response.get_json())
        with self.app.test_request_context('/', headers={'Authorization': 'Bearer fake'}):
            with patch.object(AuthService, 'get_user_id_from_token', return_value='user'):
                self.assertEqual(handler(request).get_data(as_text=True), 'user')

    def test_production_debug_routes_do_not_call_ai(self):
        with patch.object(settings, 'ENVIRONMENT', 'production'), patch.object(settings, 'DEBUG', True):
            for name in ('submit_essay_no_auth', 'test_essay_evaluator', 'test_llm_connection'):
                with self.app.test_request_context('/' + name, method='POST', json={'essay_text': 'test'}):
                    with patch.object(essay_service, 'submit_essay') as service:
                        self.assertEqual(getattr(main, name)(request).status_code, 404)
                        service.assert_not_called()

    def test_high_xp_keeps_highest_level(self):
        highest = max(settings.LEVEL_THRESHOLDS, key=lambda k: settings.LEVEL_THRESHOLDS[k][0])
        self.assertEqual(reward_engine.get_level_from_xp(10**9)[0], highest)

    def test_game_routes_preserve_response_contracts(self):
        from llm.evaluator import detail_detective_evaluator, essay_evaluator
        db = FakeDB()
        headers = {'Authorization': 'Bearer test'}
        with patch.object(reward_engine, '_db', db), patch('gamification.atomic_rewards.firestore.transactional', serial_transaction), patch.object(AuthService, 'get_user_id_from_token', return_value='u'):
            with self.app.test_request_context('/submit_game_result', method='POST', headers=headers,
                                               json={'game_id': 'bug_catcher', 'score': 100, 'lives_remaining': 3}):
                response = main.submit_game_result(request)
                self.assertEqual(response.status_code, 200)
                self.assertEqual(response.get_json()['data']['rewards']['xp_earned'], 50)
            with self.app.test_request_context('/detail_detective_evaluate', method='POST', headers=headers,
                                               json={'original_sentence': 'A bird flew.', 'improved_sentence': 'A blue bird flew over the tree.'}):
                with patch.object(detail_detective_evaluator, 'evaluate', return_value={'score': 5, 'xp_earned': 40}):
                    response = main.detail_detective_evaluate(request)
                    self.assertEqual(response.status_code, 200)
                    self.assertEqual(response.get_json()['data']['evaluation']['score'], 5)
                    self.assertEqual(response.get_json()['data']['rewards']['total_xp'], 90)
            with self.app.test_request_context('/boss_battle_submit', method='POST', headers=headers,
                                               json={'essay_text': 'word ' * settings.MIN_WORDS}):
                with patch.object(essay_evaluator, 'evaluate_essay', return_value={'converted_score': 90, 'raw_scores': {}}) as evaluate:
                    response = main.boss_battle_submit(request)
                    self.assertEqual(response.status_code, 200)
                    data = response.get_json()['data']
                    self.assertEqual(data['boss_battle']['personal_best'], 90)
                    self.assertEqual(data['rewards']['xp_earned'], settings.BOSS_PERSONAL_BEST_XP)
                    self.assertEqual(evaluate.call_args.kwargs['state'], settings.DEFAULT_STATE)
                    self.assertEqual(evaluate.call_args.kwargs['grade'], settings.DEFAULT_GRADE)

    def test_round_robin_filters_blank_keys(self):
        with patch.object(settings, 'PSSA_GROQ_API_KEY_1', ''), patch.object(settings, 'PSSA_GROQ_API_KEY_2', ''):
            self.assertEqual(len(RoundRobinGroqClient()._clients), int(bool(settings.PSSA_GROQ_API_KEY)))
        with patch.object(settings, 'PSSA_GROQ_API_KEY_1', ''), patch.object(settings, 'PSSA_GROQ_API_KEY_2', ''), patch.object(settings, 'PSSA_GROQ_API_KEY', ''):
            with self.assertRaisesRegex(ValueError, 'at least one'):
                RoundRobinGroqClient().call('test')

    def test_game_rewards_preserve_previous_values(self):
        self.assertEqual(reward_engine.calculate_game_xp('bug_catcher', 100, lives_remaining=3), 50)
        self.assertEqual(reward_engine.calculate_game_xp('jumbled_story', 100, time_taken=30), 50)
        self.assertEqual(reward_engine.calculate_game_xp('stay_on_topic', 100, time_taken=45), 50)
        self.assertEqual(reward_engine.calculate_game_xp('word_swap', 100), 40)

    def test_parallel_rewards_accumulate_and_event_retry_is_deduplicated(self):
        db = FakeDB()
        with patch.object(reward_engine, '_db', db), patch('gamification.atomic_rewards.firestore.transactional', serial_transaction):
            with ThreadPoolExecutor(max_workers=4) as pool:
                results = list(pool.map(lambda i: award(reward_engine, 'u', 20, event_id=str(i)), range(12)))
            self.assertEqual(db.data[settings.COLLECTION_GAMIFICATION + '/u']['xp'], 240)
            original = award(reward_engine, 'u', 20, event_id='0')
            self.assertEqual(original, results[0])
            self.assertEqual(db.data[settings.COLLECTION_GAMIFICATION + '/u']['xp'], 240)

    def test_boss_personal_best_awarded_once_for_same_score(self):
        db = FakeDB()
        with patch.object(reward_engine, '_db', db), patch('gamification.atomic_rewards.firestore.transactional', serial_transaction):
            first = award(reward_engine, 'u', 0, boss_score=90, essay_count=1)
            second = award(reward_engine, 'u', 0, boss_score=90, essay_count=1)
            self.assertEqual(first['xp_earned'], settings.BOSS_PERSONAL_BEST_XP)
            self.assertEqual(second['xp_earned'], settings.BOSS_BASE_XP)
            self.assertFalse(second['boss_battle']['beat_personal_best'])

    def test_request_idempotency_preserves_reward_and_rejects_payload_change(self):
        db = FakeDB()
        with patch.object(reward_engine, '_db', db), patch('gamification.atomic_rewards.firestore.transactional', serial_transaction):
            for unused in range(2):
                with self.app.test_request_context('/game', method='POST', json={'score': 100}, headers={'Idempotency-Key': 'same'}):
                    result = award(reward_engine, 'u', 50)
                    self.assertEqual(result['total_xp'], 50)
            with self.app.test_request_context('/game', method='POST', json={'score': 20}, headers={'Idempotency-Key': 'same'}):
                with self.assertRaises(ValueError):
                    award(reward_engine, 'u', 20)

    def test_progress_parallel_submissions_count_once_each(self):
        db = FakeDB()
        with patch.object(progress_service, '_db', db), patch('essay.progress_service.firestore.transactional', serial_transaction):
            with ThreadPoolExecutor(max_workers=4) as pool:
                list(pool.map(lambda unused: progress_service.update_progress_after_submission('u', 'ela', 80), range(12)))
        progress = db.data[settings.COLLECTION_USER_PROGRESS + '/u']
        self.assertEqual(progress['total_essays_submitted'], 12)
        self.assertEqual(progress['category_scores']['ela']['avg_score'], 80)
        self.assertEqual(progress['current_streak'], 1)

    def test_streak_uses_local_calendar_day(self):
        class FixedDatetime(datetime):
            @classmethod
            def now(cls, tz=None):
                return datetime(2026, 1, 2, 20, 0, tzinfo=timezone.utc).astimezone(tz)
        stored = {'current_streak': 2, 'last_submission_date': datetime(2026, 1, 1, 20, tzinfo=timezone.utc)}
        with patch.object(settings, 'STREAK_TIMEZONE', 'Asia/Kolkata'), patch.object(progress_service, 'get_or_create_progress', return_value=stored), patch('essay.progress_service.datetime', FixedDatetime):
            self.assertTrue(progress_service.get_streak_info('u')['streak_active'])

    def test_bad_nested_settings_are_rejected(self):
        with patch.object(Settings, 'ESSAY_CATEGORIES', {'ela': {'min': 10, 'max': 1}}):
            with self.assertRaisesRegex(ValueError, 'ESSAY_CATEGORIES'):
                validate(Settings)
        with patch.object(Settings, 'LEVEL_THRESHOLDS', {1: [0, 10, 'A'], 2: [9, 20, 'B']}):
            with self.assertRaisesRegex(ValueError, 'LEVEL_THRESHOLDS'):
                validate(Settings)


if __name__ == '__main__':
    unittest.main()
