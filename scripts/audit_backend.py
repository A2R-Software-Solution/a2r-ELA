"""Local production checks. External API/database operations are mocked."""
import json
import os
import sys
from pathlib import Path
from unittest.mock import patch

root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(root / 'backend/functions'))
os.environ['CORS_ORIGINS'] = json.dumps(['https://allowed.example'])

from flask import Flask, request
import main
from auth.auth_service import AuthService, require_auth
from essay.essay_service import essay_service
from gamification.reward_engine import reward_engine

app = Flask('local-production-audit')
with app.test_request_context('/'):
    response = require_auth(lambda req, uid: None)(request)
    assert response.status_code == 401 and response.get_json(silent=True) is not None
    print('AUTH_ERROR_JSON_VALID:', response.get_json(silent=True) is not None)

with app.test_request_context('/submit_essay_no_auth', method='POST', json={'essay_text': 'audit'}):
    with patch.object(essay_service, 'submit_essay', return_value={}) as mocked:
        response = main.submit_essay_no_auth(request)
        assert response.status_code == 404 and not mocked.called
        print('UNAUTHENTICATED_ESSAY_SERVICE_REACHED:', mocked.called)

with app.test_request_context('/submit_game_result', method='POST',
                              json={'game_id': 'invalid', 'score': 0},
                              headers={'Origin': 'https://blocked.example', 'Authorization': 'Bearer fake'}):
    with patch.object(AuthService, 'get_user_id_from_token', return_value='audit-user'):
        response = main.submit_game_result(request)
        assert response.headers.get('Access-Control-Allow-Origin') is None
        print('DISALLOWED_ORIGIN_RESPONSE_CORS:', response.headers.get('Access-Control-Allow-Origin'))

print('LEVEL_BEFORE_UPPER_BOUND:', reward_engine.get_level_from_xp(99999)[0])
print('LEVEL_AFTER_UPPER_BOUND:', reward_engine.get_level_from_xp(100000)[0])
assert reward_engine.get_level_from_xp(100000)[0] == reward_engine.get_level_from_xp(99999)[0]
