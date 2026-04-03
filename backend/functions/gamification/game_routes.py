"""
Game Routes
API endpoints for submitting mini-game results and awarding XP.
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
        "game_id":         "bug_catcher" | "jumbled_story" | "stay_on_topic" | "word_swap",
        "score":           0-100,
        "time_taken":      120,   (seconds, required for jumbled_story / stay_on_topic)
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

        valid_game_ids = ("bug_catcher", "jumbled_story", "stay_on_topic", "word_swap")
        if game_id not in valid_game_ids:
            return response_builder.validation_error(
                f"Invalid game_id '{game_id}'. Must be one of: {', '.join(valid_game_ids)}"
            )

        if not isinstance(score, (int, float)) or not (0 <= score <= 100):
            return response_builder.validation_error("score must be a number between 0 and 100")

        score           = int(score)
        time_taken      = data.get("time_taken")
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

        # ── Check badges ──────────────────────────────────────────────────────
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


# =============================================================================
# Detail Detective — AI sentence improvement evaluation (uses Groq)
# =============================================================================

@https_fn.on_request(cors=cors_options)
@require_auth
def detail_detective_evaluate(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Evaluate a student's sentence improvement for the Detail Detective game.
    Uses Groq for fast real-time scoring.

    Endpoint: POST /detail_detective_evaluate
    Headers:  Authorization: Bearer <firebase_token>
    Body: {
        "original_sentence": "Pizza is good.",
        "improved_sentence": "Pizza is a delicious Italian dish loved worldwide."
    }

    Response: {
        "evaluation": {
            "score":              3,
            "max_score":          5,
            "feedback":           "Great job adding specific details!",
            "what_they_did_well": "Added descriptive words and examples",
            "how_to_improve":     "Try adding a specific fact or number",
            "xp_earned":          35
        },
        "rewards": {
            "xp_earned":             35,
            "total_xp":              365,
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

        original_sentence = data.get("original_sentence", "").strip()
        improved_sentence = data.get("improved_sentence", "").strip()

        # ── Validate ──────────────────────────────────────────────────────────
        if not original_sentence:
            return response_builder.validation_error("original_sentence is required")

        if not improved_sentence:
            return response_builder.validation_error("improved_sentence is required")

        if len(improved_sentence) > 1000:
            return response_builder.validation_error(
                "improved_sentence must be under 1000 characters"
            )

        # ── Evaluate via Groq ─────────────────────────────────────────────────
        from llm.evaluator import detail_detective_evaluator
        evaluation = detail_detective_evaluator.evaluate(
            original_sentence=original_sentence,
            improved_sentence=improved_sentence,
        )

        xp_earned = evaluation.get("xp_earned", 20)

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

        # ── Check badges ──────────────────────────────────────────────────────
        game_scores    = {"detail_detective": evaluation.get("score", 1) * 20}  # convert 1-5 → 20-100
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
                "evaluation": evaluation,
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
            message="Sentence evaluated successfully"
        )

    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in detail_detective_evaluate: {str(e)}")
        return response_builder.internal_error("Failed to evaluate sentence")


# =============================================================================
# Boss Battle — weekly personal best essay challenge (reuses essay evaluator)
# =============================================================================

@https_fn.on_request(cors=cors_options)
@require_auth
def boss_battle_submit(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Submit a Boss Battle essay and compare against personal best.
    Reuses the existing essay evaluator (OpenRouter) — no new LLM needed.

    Endpoint: POST /boss_battle_submit
    Headers:  Authorization: Bearer <firebase_token>
    Body: {
        "essay_text": "...",
        "state":      "PA",   (optional, defaults to user preference)
        "grade":      "6"     (optional, defaults to user preference)
    }

    Response: {
        "evaluation": { ...full essay scores... },
        "boss_battle": {
            "converted_score":    75,
            "personal_best":      70,
            "beat_personal_best": true,
            "improvement":        5
        },
        "rewards": {
            "xp_earned":             250,
            "total_xp":              580,
            "level":                 2,
            "level_name":            "Word Explorer",
            "level_up":              false,
            "next_threshold":        1000,
            "newly_unlocked_badges": [...]
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

        essay_text = data.get("essay_text", "").strip()
        state      = data.get("state", "PA")
        grade      = data.get("grade", "6")

        # ── Validate ──────────────────────────────────────────────────────────
        if not essay_text:
            return response_builder.validation_error("essay_text is required")

        word_count = len(essay_text.split())
        if word_count < 50:
            return response_builder.validation_error(
                f"Essay must be at least 50 words (got {word_count})"
            )

        # ── Evaluate essay via existing OpenRouter evaluator ──────────────────
        from llm.evaluator import essay_evaluator
        evaluation = essay_evaluator.evaluate_essay(
            essay_text=essay_text,
            category="essay_writing",
            state=state,
            grade=grade,
        )

        converted_score = evaluation.get("converted_score", 0)

        # ── Get current gamification state + personal best ────────────────────
        current        = reward_engine.get_or_create_gamification(user_id)
        current_xp     = current.get("xp", 0)
        current_level  = current.get("level", 1)
        badges_earned  = list(current.get("badges_earned", []))
        total_essays   = current.get("total_essays_submitted", 0)
        personal_best  = current.get("boss_battle_personal_best", 0)

        beat_personal_best = converted_score > personal_best
        improvement        = converted_score - personal_best if beat_personal_best else 0

        # ── XP: +250 for beating personal best, +50 base otherwise ───────────
        xp_earned = 250 if beat_personal_best else 50

        new_total_xp              = current_xp + xp_earned
        new_level, new_level_name = reward_engine.get_level_from_xp(new_total_xp)
        level_up                  = new_level > current_level

        # ── Update personal best if beaten ────────────────────────────────────
        new_personal_best = converted_score if beat_personal_best else personal_best

        # ── Check badges ──────────────────────────────────────────────────────
        game_scores    = {"boss_battle": converted_score}
        newly_unlocked = reward_engine.check_badges(
            already_earned=badges_earned,
            raw_scores=evaluation.get("raw_scores", {}),
            new_total_xp=new_total_xp,
            new_level=new_level,
            total_essays=total_essays + 1,
            game_scores=game_scores,
            beat_personal_best=beat_personal_best,
        )

        badges_earned += [b["id"] for b in newly_unlocked]

        # ── Save to Firestore ─────────────────────────────────────────────────
        reward_engine.save_gamification(
            user_id=user_id,
            xp=new_total_xp,
            level=new_level,
            level_name=new_level_name,
            badges_earned=badges_earned,
            total_essays_submitted=total_essays + 1,
            boss_battle_personal_best=new_personal_best,
        )

        return response_builder.success(
            data={
                "evaluation": evaluation,
                "boss_battle": {
                    "converted_score":    converted_score,
                    "personal_best":      new_personal_best,
                    "beat_personal_best": beat_personal_best,
                    "improvement":        improvement,
                },
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
            message="Boss Battle submitted successfully"
        )

    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in boss_battle_submit: {str(e)}")
        return response_builder.internal_error("Failed to submit Boss Battle")