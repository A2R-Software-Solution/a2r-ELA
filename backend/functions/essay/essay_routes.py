"""
Essay Routes
API endpoints for essay operations including PSSA-aligned evaluation
and user state/grade preference management.
"""

import json
from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from essay.essay_service import essay_service
from essay.progress_service import progress_service
from config.settings import settings
from utils.responses import response_builder

# Configure CORS
cors_options = options.CorsOptions(
    cors_origins="*",
    cors_methods=["GET", "POST", "OPTIONS"]
)


# ------------------------------------------------------------------------------
# ESSAY SUBMISSION
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def submit_essay(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Submit an essay for PSSA-aligned evaluation.

    Endpoint: POST /submit_essay
    Headers:  Authorization: Bearer <firebase_token>
    Body: {
        "essay_text": "...",
        "category":   "essay_writing" | "ela" | "math" | "science",
        "state":      "PA",
        "grade":      "7"
    }

    Response includes:
        rewards.xp_earned
        rewards.streak_bonus_xp   ← new: bonus from 7/30-day streak
        rewards.newly_unlocked_badges
        game_suggestion           ← new: suggested game for weakest domain
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        request_data = req.get_json()

        if not request_data:
            return response_builder.validation_error("Request body is required")

        if "essay_text" not in request_data:
            return response_builder.validation_error("essay_text is required")

        if "category" not in request_data:
            return response_builder.validation_error("category is required")

        state = request_data.get("state", settings.DEFAULT_STATE)
        grade = str(request_data.get("grade", settings.DEFAULT_GRADE))

        if not settings.is_valid_state(state):
            print(f"Warning: invalid state '{state}' in request, will use default")

        if not settings.is_valid_grade(grade):
            print(f"Warning: invalid grade '{grade}' in request, will use default")

        # ── Step 1: Submit essay (XP calculated inside, streak_bonus = 0) ────
        result = essay_service.submit_essay(user_id, request_data)

        # ── Step 2: Update streak progress ───────────────────────────────────
        progress_update = progress_service.update_progress_after_submission(
            user_id,
            result["category"],
            result["total_score"],
        )

        result["progress"] = {
            "current_streak": progress_update["current_streak"],
            "max_streak":     progress_update["max_streak"],
            "total_essays":   progress_update["total_essays_submitted"],
            "streak_updated": progress_update["streak_updated"],
        }

        # ── Step 3: Apply streak bonus XP if a milestone was hit ─────────────
        # progress_service returns streak_bonus_xp > 0 only when the streak
        # reaches exactly 7 or 30 days. We then call apply_streak_bonus()
        # which adds the XP on top, rechecks badges, and returns updated values
        # to merge into the existing rewards dict.
        streak_bonus_xp = progress_update.get("streak_bonus_xp", 0)

        if streak_bonus_xp > 0:
            print(f"Streak milestone! Applying +{streak_bonus_xp} bonus XP")
            from gamification.reward_engine import reward_engine

            streak_rewards = reward_engine.apply_streak_bonus(user_id, streak_bonus_xp)

            if streak_rewards:
                # Merge streak rewards on top of essay rewards
                # streak_rewards has fresher total_xp, level, newly_unlocked_badges
                existing_rewards = result.get("rewards", {})

                # Combine newly unlocked badges from both passes
                essay_badges  = existing_rewards.get("newly_unlocked_badges", [])
                streak_badges = streak_rewards.get("newly_unlocked_badges", [])
                all_new_badges = essay_badges + streak_badges

                result["rewards"] = {
                    # XP breakdown
                    "xp_earned":       existing_rewards.get("xp_earned", 0),
                    "streak_bonus_xp": streak_bonus_xp,

                    # Use streak_rewards values — they reflect the final state
                    "total_xp":       streak_rewards.get("total_xp",       existing_rewards.get("total_xp", 0)),
                    "level":          streak_rewards.get("level",          existing_rewards.get("level", 1)),
                    "level_name":     streak_rewards.get("level_name",     existing_rewards.get("level_name", "Beginner Writer")),
                    "level_up":       streak_rewards.get("level_up",       existing_rewards.get("level_up", False)),
                    "next_threshold": streak_rewards.get("next_threshold", existing_rewards.get("next_threshold", 1000)),

                    # All badges from both passes
                    "newly_unlocked_badges": all_new_badges,
                }

        return response_builder.success(
            data=result,
            message="Essay submitted and evaluated successfully"
        )

    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in submit_essay: {str(e)}")
        return response_builder.internal_error("Failed to process essay submission")


# ------------------------------------------------------------------------------
# USER PREFERENCES — State & Grade
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def save_user_preferences(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Save user's state and grade preferences to Firestore.

    Endpoint: POST /save_user_preferences
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        request_data = req.get_json()

        if not request_data:
            return response_builder.validation_error("Request body is required")

        state = request_data.get("state", "")
        grade = str(request_data.get("grade", ""))

        if not state:
            return response_builder.validation_error("state is required")

        if not grade:
            return response_builder.validation_error("grade is required")

        if not settings.is_valid_state(state):
            return response_builder.validation_error(
                f"Invalid state '{state}'. "
                f"Supported states: {settings.SUPPORTED_STATES}"
            )

        if not settings.is_valid_grade(grade):
            return response_builder.validation_error(
                f"Invalid grade '{grade}'. "
                f"Supported grades: {settings.SUPPORTED_GRADES}"
            )

        prefs = essay_service.save_user_preferences(user_id, state, grade)

        return response_builder.success(
            data={
                "state":         prefs["state"],
                "grade":         prefs["grade"],
                "state_display": settings.get_state_display(prefs["state"]),
                "grade_display": settings.get_grade_display(prefs["grade"]),
            },
            message="Preferences saved successfully"
        )

    except Exception as e:
        print(f"Error in save_user_preferences: {str(e)}")
        return response_builder.internal_error("Failed to save preferences")


@https_fn.on_request(cors=cors_options)
@require_auth
def get_user_preferences(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's saved state and grade preferences.

    Endpoint: GET /get_user_preferences
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        prefs = essay_service.get_user_preferences(user_id)

        return response_builder.success(
            data={
                "state":         prefs["state"],
                "grade":         prefs["grade"],
                "state_display": settings.get_state_display(prefs["state"]),
                "grade_display": settings.get_grade_display(prefs["grade"]),
                "supported_states": [
                    {"code": s, "label": settings.get_state_display(s)}
                    for s in settings.SUPPORTED_STATES
                ],
                "supported_grades": [
                    {"code": g, "label": settings.get_grade_display(g)}
                    for g in settings.SUPPORTED_GRADES
                ],
            },
            message="Preferences retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_user_preferences: {str(e)}")
        return response_builder.internal_error("Failed to retrieve preferences")


# ------------------------------------------------------------------------------
# EXISTING ENDPOINTS — unchanged
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def get_essay_submission(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get a specific essay submission.

    Endpoint: GET /get_essay_submission?submission_id=<id>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        submission_id = req.args.get("submission_id")

        if not submission_id:
            return response_builder.validation_error("submission_id is required")

        submission = essay_service.get_submission(submission_id, user_id)

        return response_builder.success(
            data=submission,
            message="Submission retrieved successfully"
        )

    except ValueError as e:
        return response_builder.not_found(str(e))
    except Exception as e:
        print(f"Error in get_essay_submission: {str(e)}")
        return response_builder.internal_error("Failed to retrieve submission")


@https_fn.on_request(cors=cors_options)
@require_auth
def get_user_submissions(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's essay submissions.

    Endpoint: GET /get_user_submissions?limit=10&category=essay_writing
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        limit    = int(req.args.get("limit", 10))
        category = req.args.get("category")

        submissions = essay_service.get_user_submissions(
            user_id,
            limit=limit,
            category=category,
        )

        return response_builder.success(
            data={
                "submissions": submissions,
                "count":       len(submissions),
            },
            message="Submissions retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_user_submissions: {str(e)}")
        return response_builder.internal_error("Failed to retrieve submissions")


@https_fn.on_request(cors=cors_options)
@require_auth
def get_streak(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's current streak information.

    Endpoint: GET /get_streak
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        streak_info = progress_service.get_streak_info(user_id)

        return response_builder.success(
            data=streak_info,
            message="Streak information retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_streak: {str(e)}")
        return response_builder.internal_error("Failed to retrieve streak information")


@https_fn.on_request(cors=cors_options)
@require_auth
def get_progress_stats(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's overall progress statistics.

    Endpoint: GET /get_progress_stats
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        stats = progress_service.get_overall_stats(user_id)

        return response_builder.success(
            data=stats,
            message="Progress statistics retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_progress_stats: {str(e)}")
        return response_builder.internal_error("Failed to retrieve progress statistics")


@https_fn.on_request(cors=cors_options)
@require_auth
def get_category_stats(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's category-wise statistics.

    Endpoint: GET /get_category_stats
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        category_stats = progress_service.get_category_stats(user_id)

        return response_builder.success(
            data=category_stats,
            message="Category statistics retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_category_stats: {str(e)}")
        return response_builder.internal_error("Failed to retrieve category statistics")


@https_fn.on_request(cors=cors_options)
def submit_essay_no_auth(req: https_fn.Request) -> https_fn.Response:
    """
    Test endpoint — no auth. Remove in production.

    Endpoint: POST /submit_essay_no_auth
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405
        )

    try:
        print("=== SUBMIT ESSAY NO AUTH (DEBUG) ===")

        request_data = req.get_json()

        if not request_data:
            return https_fn.Response(
                json.dumps({"error": "Request body is required"}),
                status=400
            )

        test_user_id = "debug_test_user_123"
        result       = essay_service.submit_essay(test_user_id, request_data)

        return https_fn.Response(
            json.dumps({
                "success":          True,
                "message":          "Essay submitted and evaluated successfully",
                "submission_id":    result.get("submission_id"),
                "total_score":      result.get("total_score"),
                "pssa_total":       result.get("pssa_total"),
                "converted_score":  result.get("converted_score"),
                "grade":            result.get("grade"),
                "state":            result.get("state"),
                "student_grade":    result.get("student_grade"),
                "grade_band":       result.get("grade_band"),
                "raw_scores":       result.get("raw_scores"),
                "converted_scores": result.get("converted_scores"),
                "category":         result.get("category"),
                "word_count":       result.get("word_count"),
                "game_suggestion":  result.get("game_suggestion"),
                "rewards":          result.get("rewards"),
                "personalized_feedback": (
                    result.get("personalized_feedback", "")[:200] + "..."
                    if result.get("personalized_feedback") else ""
                ),
            }, indent=2),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except ValueError as e:
        return https_fn.Response(json.dumps({"error": str(e)}), status=400)
    except Exception as e:
        import traceback
        return https_fn.Response(
            json.dumps({"error": str(e), "details": traceback.format_exc()}),
            status=500
        )


# ------------------------------------------------------------------------------
# GAMIFICATION
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def get_gamification(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's current XP, level, and badge data.

    Endpoint: GET /get_gamification
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        from gamification.reward_engine import reward_engine

        data = reward_engine.get_or_create_gamification(user_id)

        xp            = data.get("xp", 0)
        level         = data.get("level", 1)
        level_name    = data.get("level_name", "Beginner Writer")
        badges_earned = data.get("badges_earned", [])
        total_essays  = data.get("total_essays_submitted", 0)

        badge_progress = reward_engine.build_badge_progress(
            badges_earned=badges_earned,
            total_essays=total_essays,
            total_xp=xp,
            level=level,
        )

        return response_builder.success(
            data={
                "xp":             xp,
                "level":          level,
                "level_name":     level_name,
                "badges_earned":  badges_earned,
                "badge_progress": badge_progress,
            },
            message="Gamification data retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_gamification: {str(e)}")
        return response_builder.internal_error("Failed to retrieve gamification data")


@https_fn.on_request(cors=cors_options)
def test_essay_evaluator(req: https_fn.Request) -> https_fn.Response:
    """Test the essay evaluator directly"""
    print("=== TEST ESSAY EVALUATOR ===")

    try:
        from llm.evaluator import essay_evaluator

        test_essay = """Education is very important for everyone.
        It helps us learn new skills and gain knowledge.
        With education, we can get better jobs and improve our lives."""

        result = essay_evaluator.evaluate_essay(
            test_essay,
            "essay_writing",
            state="PA",
            grade="7",
        )

        return https_fn.Response(
            json.dumps({
                "success": True,
                "result":  result,
                "test":    "Essay evaluator test completed"
            }, indent=2),
            status=200,
            headers={"Content-Type": "application/json"}
        )

    except Exception as e:
        import traceback
        return https_fn.Response(
            json.dumps({
                "success":   False,
                "error":     str(e),
                "traceback": traceback.format_exc()
            }),
            status=500
        )