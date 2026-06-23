"""
Leaderboard Routes
API endpoints for grade and state leaderboards.

Endpoints:
    GET /get_grade_leaderboard  — top 10 users in same grade ranked by XP
    GET /get_state_leaderboard  — top 10 users in same state ranked by XP

Both endpoints require authentication (Bearer token).
The user's grade/state is read from their saved preferences in Firestore.
"""

from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from utils.responses import ResponseBuilder
from leaderboard.leaderboard_service import leaderboard_service
from config.settings import settings

# CORS options — same pattern as other routes
_CORS = options.CorsOptions(cors_origins="*", cors_methods=["GET", "OPTIONS"])


# ------------------------------------------------------------------------------
# GET GRADE LEADERBOARD
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=_CORS)
@require_auth
def get_grade_leaderboard(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get top 10 users in the same grade as the current user, ranked by XP.

    Endpoint: GET /get_grade_leaderboard
    Auth:     Required (Bearer token)

    Query params:
        grade (optional): override grade — defaults to user's saved preference

    Response:
        {
            "success": true,
            "data": {
                "entries": [
                    {
                        "rank":            1,
                        "display_name":    "Alex M.",
                        "xp":              2450,
                        "level":           2,
                        "level_name":      "Word Explorer",
                        "essay_count":     18,
                        "avg_score":       87.5,
                        "is_current_user": false
                    },
                    ...
                ],
                "current_user_rank": 4,
                "filter_label":      "Grade 6",
                "total_users":       42
            }
        }
    """
    try:
        # Allow optional grade override via query param
        # Otherwise fall back to user's saved preference
        grade = req.args.get("grade", "").strip()

        if not grade:
            # Load from user preferences
            grade = _get_user_grade(user_id)

        if not grade:
            return ResponseBuilder.validation_error(
                "Grade not found. Please set your grade in preferences."
            )

        if not settings.is_valid_grade(grade):
            return ResponseBuilder.validation_error(
                f"Invalid grade '{grade}'. Supported grades: {settings.SUPPORTED_GRADES}"
            )

        # Build leaderboard
        result = leaderboard_service.get_grade_leaderboard(
            current_user_id=user_id,
            grade=grade,
        )

        return ResponseBuilder.success(
            data=result,
            message=f"Grade leaderboard fetched successfully",
        )

    except Exception as e:
        print(f"[get_grade_leaderboard] Error for user {user_id}: {e}")
        return ResponseBuilder.internal_error("Failed to fetch grade leaderboard")


# ------------------------------------------------------------------------------
# GET STATE LEADERBOARD
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=_CORS)
@require_auth
def get_state_leaderboard(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get top 10 users in the same state as the current user, ranked by XP.

    Endpoint: GET /get_state_leaderboard
    Auth:     Required (Bearer token)

    Query params:
        state (optional): override state — defaults to user's saved preference

    Response:
        {
            "success": true,
            "data": {
                "entries": [...],
                "current_user_rank": 2,
                "filter_label":      "Pennsylvania",
                "total_users":       128
            }
        }
    """
    try:
        # Allow optional state override via query param
        state = req.args.get("state", "").strip()

        if not state:
            # Load from user preferences
            state = _get_user_state(user_id)

        if not state:
            return ResponseBuilder.validation_error(
                "State not found. Please set your state in preferences."
            )

        if not settings.is_valid_state(state):
            return ResponseBuilder.validation_error(
                f"Invalid state '{state}'. Supported states: {settings.SUPPORTED_STATES}"
            )

        # Build leaderboard
        result = leaderboard_service.get_state_leaderboard(
            current_user_id=user_id,
            state=state,
        )

        return ResponseBuilder.success(
            data=result,
            message="State leaderboard fetched successfully",
        )

    except Exception as e:
        print(f"[get_state_leaderboard] Error for user {user_id}: {e}")
        return ResponseBuilder.internal_error("Failed to fetch state leaderboard")


# ------------------------------------------------------------------------------
# PRIVATE HELPERS
# ------------------------------------------------------------------------------

def _get_user_grade(user_id: str) -> str:
    """
    Read the user's saved grade from user_preferences collection.
    Returns empty string if not found.
    """
    try:
        from firebase_admin import firestore
        db = firestore.client()
        doc = db.collection(settings.COLLECTION_USER_PREFERENCES).document(user_id).get()
        if doc.exists:
            return doc.to_dict().get("grade", "")
        return ""
    except Exception as e:
        print(f"[_get_user_grade] Error: {e}")
        return ""


def _get_user_state(user_id: str) -> str:
    """
    Read the user's saved state from user_preferences collection.
    Returns empty string if not found.
    """
    try:
        from firebase_admin import firestore
        db = firestore.client()
        doc = db.collection(settings.COLLECTION_USER_PREFERENCES).document(user_id).get()
        if doc.exists:
            return doc.to_dict().get("state", "")
        return ""
    except Exception as e:
        print(f"[_get_user_state] Error: {e}")
        return ""