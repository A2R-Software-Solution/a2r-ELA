"""Transaction-based reward updates shared by essay and game handlers."""
import hashlib
from datetime import datetime, timezone
from flask import has_request_context, request
from firebase_admin import firestore
from config.settings import settings


def award(engine, user_id, xp, *, raw_scores=None, game_scores=None,
          essay_count=0, boss_score=None, event_id=None):
    """No network/AI evaluation runs inside the retryable transaction."""
    fingerprint = None
    if event_id is None and has_request_context():
        key = request.headers.get('Idempotency-Key')
        if key:
            event_id = request.path + ':' + key
            fingerprint = hashlib.sha256(request.get_data()).hexdigest()
    ref = engine.db.collection(settings.COLLECTION_GAMIFICATION).document(user_id)
    event_ref = ref.collection('reward_events').document(hashlib.sha256(event_id.encode()).hexdigest()) if event_id else None

    @firestore.transactional
    def commit(transaction):
        if event_ref:
            event = event_ref.get(transaction=transaction)
            if event.exists:
                previous = event.to_dict()
                if previous.get('fingerprint') != fingerprint:
                    raise ValueError('Idempotency key already used for another request')
                return previous['result']
        snapshot = ref.get(transaction=transaction)
        current = snapshot.to_dict() if snapshot.exists else {}
        result, update = compute(engine, current, xp, raw_scores=raw_scores,
                                 game_scores=game_scores, essay_count=essay_count, boss_score=boss_score)
        now = datetime.now(timezone.utc)
        update.update(user_id=user_id, updated_at=now)
        if not snapshot.exists:
            update['created_at'] = now
        transaction.set(ref, update, merge=True)
        if event_ref:
            transaction.set(event_ref, {'fingerprint': fingerprint, 'result': result, 'created_at': now})
        return result

    return commit(engine.db.transaction())


def compute(engine, current, xp, *, raw_scores=None, game_scores=None, essay_count=0, boss_score=None):
    """Calculate the next state from the transaction's latest snapshot."""
    personal_best = current.get('boss_battle_personal_best', 0)
    beat_best = boss_score is not None and boss_score > personal_best
    if boss_score is not None:
        xp = settings.BOSS_PERSONAL_BEST_XP if beat_best else settings.BOSS_BASE_XP
    old_xp = current.get('xp', 0)
    total_xp = old_xp + xp
    level, name = engine.get_level_from_xp(total_xp)
    old_level = engine.get_level_from_xp(old_xp)[0]
    total_essays = current.get('total_essays_submitted', 0) + essay_count
    badges = list(current.get('badges_earned', []))
    unlocked = engine.check_badges(badges, raw_scores or {}, total_xp, level, total_essays,
                                   game_scores=game_scores or {}, beat_personal_best=beat_best)
    update = {
        'xp': total_xp, 'level': level, 'level_name': name,
        'badges_earned': badges + [b['id'] for b in unlocked],
        'total_essays_submitted': total_essays,
        'boss_battle_personal_best': max(personal_best, boss_score) if boss_score is not None else personal_best,
    }
    result = {'xp_earned': xp, 'total_xp': total_xp, 'level': level, 'level_name': name,
              'level_up': level > old_level, 'next_threshold': engine.get_next_level_threshold(level),
              'newly_unlocked_badges': unlocked}
    if boss_score is not None:
        result['boss_battle'] = {'converted_score': boss_score, 'personal_best': update['boss_battle_personal_best'],
                                 'beat_personal_best': beat_best, 'improvement': max(0, boss_score - personal_best)}
    return result, update
