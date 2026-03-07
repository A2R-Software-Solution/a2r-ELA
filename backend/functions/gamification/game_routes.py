"""
Game Routes
API endpoint for submitting mini-game results and awarding XP.
"""

from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from gamification.reward_engine import reward_engine
from utils.responses import response_builder

cors_options = options.CorsOptions(
    cors_origins="*",
    cors_methods=["GET", "POST", "OPTIONS"]
)


@https_fn.on_request(cors=cors_options)
@require_auth
def submit_game_result(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Submit a mini-game result and award XP.

    Endpoint: POST /submit_game_result
    Headers:  Authorization: Bearer <firebase_token>
    Body: {
        "game_id":         "bug_catcher" | "jumbled_story",
        "score":           0-100,
        "time_taken":      120,   (seconds, required for jumbled_story)
        "lives_remaining": 3      (0-3,     required for bug_catcher)
    }

    Response: {
        "rewards": {
            "xp_earned":             30,
            "total_xp":              330,
            "level":                 2,
            "level_name":            "Word Explorer",
            "level_up":              false,
            "next_threshold":        500,
            "newly_unlocked_badges": []
        }
    }
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        data = req.get_json()

        if not data:
            return response_builder.validation_error("Request body is required")

        game_id = data.get("game_id")
        score   = data.get("score")

        # ── Validate required fields ──────────────────────────────────────────
        if not game_id:
            return response_builder.validation_error("game_id is required")

        if score is None:
            return response_builder.validation_error("score is required")

        if game_id not in ("bug_catcher", "jumbled_story"):
            return response_builder.validation_error(
                f"Invalid game_id '{game_id}'. Must be 'bug_catcher' or 'jumbled_story'"
            )

        if not isinstance(score, (int, float)) or not (0 <= score <= 100):
            return response_builder.validation_error("score must be a number between 0 and 100")

        score          = int(score)
        time_taken     = data.get("time_taken")
        lives_remaining = data.get("lives_remaining")

        # ── Calculate XP ──────────────────────────────────────────────────────
        xp_earned = reward_engine.calculate_game_xp(
            game_id=game_id,
            score=score,
            time_taken=time_taken,
            lives_remaining=lives_remaining,
        )

        # ── Get current gamification state ────────────────────────────────────
        current       = reward_engine.get_or_create_gamification(user_id)
        current_xp    = current.get("xp", 0)
        current_level = current.get("level", 1)
        badges_earned = list(current.get("badges_earned", []))
        total_essays  = current.get("total_essays_submitted", 0)

        # ── Update XP and level ───────────────────────────────────────────────
        new_total_xp              = current_xp + xp_earned
        new_level, new_level_name = reward_engine.get_level_from_xp(new_total_xp)
        level_up                  = new_level > current_level

        # ── Check badges — pass game_scores so game badges can unlock ─────────
        game_scores    = {game_id: score}
        newly_unlocked = reward_engine.check_badges(
            already_earned=badges_earned,
            raw_scores={},
            new_total_xp=new_total_xp,
            new_level=new_level,
            total_essays=total_essays,
            game_scores=game_scores,
        )

        badges_earned += [b["id"] for b in newly_unlocked]

        # ── Save to Firestore ─────────────────────────────────────────────────
        reward_engine.save_gamification(
            user_id=user_id,
            xp=new_total_xp,
            level=new_level,
            level_name=new_level_name,
            badges_earned=badges_earned,
            total_essays_submitted=total_essays,
        )

        return response_builder.success(
            data={
                "game_id": game_id,
                "score":   score,
                "rewards": {
                    "xp_earned":             xp_earned,
                    "total_xp":              new_total_xp,
                    "level":                 new_level,
                    "level_name":            new_level_name,
                    "level_up":              level_up,
                    "next_threshold":        reward_engine.get_next_level_threshold(new_level),
                    "newly_unlocked_badges": newly_unlocked,
                },
            },
            message="Game result submitted successfully"
        )

    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in submit_game_result: {str(e)}")
        return response_builder.internal_error("Failed to submit game result")