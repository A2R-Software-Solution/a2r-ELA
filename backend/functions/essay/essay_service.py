"""
Essay Service
Manages essay submissions, evaluations, and user grade/state preferences.
"""

from typing import Dict, Any, Optional
from datetime import datetime
from firebase_admin import firestore
from utils.validator import essay_validator
from llm.evaluator import essay_evaluator
from config.settings import settings
import traceback
from gamification.reward_engine import reward_engine


# ─── Game Suggestion Map ──────────────────────────────────────────────────────
# Maps each PSSA domain to a suggested game and a reason string.
# When a student scores <= 2 on a domain, they see this suggestion
# in the FeedbackDialog with a [Play Now] button to the Playground tab.
# game_name should match whatever you name the game in the Playground screen.

DOMAIN_GAME_MAP = {
    "focus": {
        "game_name":    "Focus Quest",
        "domain_label": "Focus",
        "reason":       "Practising Focus will help you stay on topic and strengthen your thesis.",
    },
    "content": {
        "game_name":    "Content Builder",
        "domain_label": "Content",
        "reason":       "Content Builder will help you develop richer ideas and stronger evidence.",
    },
    "organization": {
        "game_name":    "Structure Sprint",
        "domain_label": "Organization",
        "reason":       "Structure Sprint will help you arrange your ideas in a clear, logical order.",
    },
    "style": {
        "game_name":    "Style Studio",
        "domain_label": "Style",
        "reason":       "Style Studio will help you vary your sentences and choose stronger words.",
    },
    "conventions": {
        "game_name":    "Grammar Galaxy",
        "domain_label": "Conventions",
        "reason":       "Grammar Galaxy will help you master punctuation, spelling, and grammar.",
    },
}

# Score threshold — suggest a game if any domain is at or below this value
SUGGESTION_THRESHOLD = 2


class EssayService:
    """Service for managing essay submissions and evaluations"""

    def __init__(self):
        self._db       = None
        self.validator = essay_validator
        self.evaluator = essay_evaluator

    @property
    def db(self):
        """Lazy load Firestore client"""
        if self._db is None:
            self._db = firestore.client()
        return self._db

    # --------------------------------------------------------------------------
    # ESSAY SUBMISSION
    # --------------------------------------------------------------------------

    def submit_essay(
        self,
        user_id: str,
        essay_data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Process and evaluate an essay submission.

        Args:
            user_id:    Firebase user ID
            essay_data: Dictionary containing:
                            essay_text  — required
                            category    — required
                            state       — optional
                            grade       — optional

        Returns:
            Evaluation results including game_suggestion
        """
        try:
            # ------------------------------------------------------------------
            # Step 1: Validate
            # ------------------------------------------------------------------
            print(f"Step 1: Validating submission for user {user_id}")
            is_valid, error_msg, sanitized_data = self.validator.validate_submission_data(
                essay_data
            )

            if not is_valid:
                print(f"Validation failed: {error_msg}")
                raise ValueError(error_msg)

            essay_text = sanitized_data["essay_text"]
            category   = sanitized_data["category"]
            word_count = sanitized_data["word_count"]

            # ------------------------------------------------------------------
            # Step 2: Resolve state + grade
            # ------------------------------------------------------------------
            state = self._resolve_state(essay_data.get("state", ""))
            grade = self._resolve_grade(essay_data.get("grade", ""))

            print(f"Step 2: State={state}, Grade={grade}, "
                  f"Category={category}, Words={word_count}")

            # ------------------------------------------------------------------
            # Step 3: Evaluate essay
            # ------------------------------------------------------------------
            print(f"Step 3: Evaluating essay")
            try:
                evaluation_results = self.evaluator.evaluate_essay(
                    essay_text,
                    category,
                    state=state,
                    grade=grade,
                )
                print(f"Evaluation completed — "
                      f"converted_score={evaluation_results.get('converted_score')}, "
                      f"pssa_total={evaluation_results.get('pssa_total')}")
            except Exception as eval_error:
                print(f"ERROR in evaluator.evaluate_essay: {str(eval_error)}")
                print(f"Traceback: {traceback.format_exc()}")
                raise Exception(f"Essay evaluation failed: {str(eval_error)}")

            # ------------------------------------------------------------------
            # Step 4: Build Firestore document
            # ------------------------------------------------------------------
            print(f"Step 4: Preparing Firestore document")
            timestamp = datetime.utcnow()

            raw_scores = evaluation_results.get("raw_scores", {})

            submission_data = {
                "user_id":       user_id,
                "essay_text":    essay_text,
                "category":      category,
                "word_count":    word_count,
                "state":         state,
                "student_grade": grade,
                "grade_band":    evaluation_results.get("grade_band", ""),
                "rubric_type":   evaluation_results.get("rubric_type", "PSSA Writing Domain"),
                "raw_scores":              raw_scores,
                "converted_scores":        evaluation_results.get("converted_scores", {}),
                "pssa_total":              evaluation_results.get("pssa_total", 0),
                "converted_score":         evaluation_results.get("converted_score", 0),
                "total_score":             evaluation_results.get("converted_score", 0),
                "grade":                   evaluation_results.get("grade", "F"),
                "rubric_justifications":   evaluation_results.get("rubric_justifications", {}),
                "strengths":               evaluation_results.get("strengths", []),
                "areas_for_improvement":   evaluation_results.get("areas_for_improvement", []),
                "personalized_feedback":   evaluation_results.get("personalized_feedback", ""),
                "submitted_at": timestamp,
                "created_at":   timestamp,
            }

            # ------------------------------------------------------------------
            # Step 5: Save to Firestore
            # ------------------------------------------------------------------
            print(f"Step 5: Saving to Firestore")
            submission_ref = self.db.collection(
                settings.COLLECTION_ESSAY_SUBMISSIONS
            ).document()

            submission_ref.set(submission_data)
            submission_id = submission_ref.id
            print(f"Saved submission: {submission_id}")

            # ------------------------------------------------------------------
            # Step 6: Generate game suggestion from raw scores
            # ------------------------------------------------------------------
            print(f"Step 6: Generating game suggestion")
            game_suggestion = self._get_game_suggestion(raw_scores)
            if game_suggestion:
                print(f"Game suggestion: {game_suggestion['game_name']} "
                      f"(weak domain: {game_suggestion['domain']} "
                      f"score: {game_suggestion['score']})")
            else:
                print("No game suggestion — all domains scored > 2")

            # ------------------------------------------------------------------
            # Step 7: Process gamification rewards
            # Note: streak_bonus_xp is passed in from essay_routes after
            #       progress_service runs. We default to 0 here and let
            #       essay_routes call apply_streak_bonus() separately.
            # ------------------------------------------------------------------
            print(f"Step 7: Processing gamification rewards")
            rewards = reward_engine.process_essay_submission(
                user_id,
                raw_scores,
            )
            print(f"Rewards processed: {rewards}")

            # ------------------------------------------------------------------
            # Step 8: Build and return API response
            # ------------------------------------------------------------------
            response = {
                "submission_id":    submission_id,

                # Scoring
                "total_score":      evaluation_results.get("converted_score", 0),
                "pssa_total":       evaluation_results.get("pssa_total", 0),
                "converted_score":  evaluation_results.get("converted_score", 0),
                "grade":            evaluation_results.get("grade", "F"),

                # PSSA domain scores
                "raw_scores":       raw_scores,
                "converted_scores": evaluation_results.get("converted_scores", {}),
                "rubric_scores":    evaluation_results.get("converted_scores", {}),

                # Context
                "state":            state,
                "student_grade":    grade,
                "grade_band":       evaluation_results.get("grade_band", ""),
                "rubric_type":      evaluation_results.get("rubric_type", ""),

                # Feedback
                "rubric_justifications": evaluation_results.get("rubric_justifications", {}),
                "personalized_feedback": evaluation_results.get("personalized_feedback", ""),
                "strengths":             evaluation_results.get("strengths", []),
                "areas_for_improvement": evaluation_results.get("areas_for_improvement", []),

                # Meta
                "word_count":   word_count,
                "category":     category,
                "submitted_at": timestamp.isoformat(),

                # Gamification
                "rewards":          rewards,

                # Practice suggestion — null if all domains >= 3
                "game_suggestion":  game_suggestion,
            }

            return response

        except ValueError as ve:
            print(f"ValueError in submit_essay: {str(ve)}")
            raise
        except Exception as e:
            print(f"CRITICAL ERROR in submit_essay: {str(e)}")
            print(f"Full traceback: {traceback.format_exc()}")
            raise

    # --------------------------------------------------------------------------
    # GAME SUGGESTION
    # --------------------------------------------------------------------------

    def _get_game_suggestion(
        self,
        raw_scores: Dict[str, int],
    ) -> Optional[Dict[str, Any]]:
        """
        Find the weakest PSSA domain and return a game suggestion.

        Only returns a suggestion if the weakest domain scored
        <= SUGGESTION_THRESHOLD (2). If all domains are >= 3,
        returns None — no suggestion needed.

        Tiebreak: if multiple domains share the lowest score,
        the first one in PSSA_DOMAINS order wins.

        Args:
            raw_scores: { focus: 1-4, content: 1-4, ... }

        Returns:
            Game suggestion dict or None
        """
        if not raw_scores:
            return None

        # Find the domain with the lowest score
        weakest_domain = None
        weakest_score  = 5  # higher than max possible (4)

        for domain in settings.PSSA_DOMAINS:
            score = raw_scores.get(domain, 0)
            if score < weakest_score:
                weakest_score  = score
                weakest_domain = domain

        # Only suggest if the weakest domain is at or below the threshold
        if weakest_domain is None or weakest_score > SUGGESTION_THRESHOLD:
            return None

        game_info = DOMAIN_GAME_MAP.get(weakest_domain)
        if not game_info:
            return None

        return {
            "domain":       weakest_domain,
            "domain_label": game_info["domain_label"],
            "score":        weakest_score,
            "game_name":    game_info["game_name"],
            "reason":       game_info["reason"],
        }

    # --------------------------------------------------------------------------
    # USER PREFERENCES — State & Grade
    # --------------------------------------------------------------------------

    def save_user_preferences(
        self,
        user_id: str,
        state: str,
        grade: str,
    ) -> Dict[str, Any]:
        """Save a user's state and grade preference to Firestore."""
        resolved_state = self._resolve_state(state)
        resolved_grade = self._resolve_grade(grade)

        prefs = {
            "user_id":    user_id,
            "state":      resolved_state,
            "grade":      resolved_grade,
            "updated_at": datetime.utcnow(),
        }

        self.db.collection(
            settings.COLLECTION_USER_PREFERENCES
        ).document(user_id).set(prefs, merge=True)

        print(f"Saved preferences for {user_id}: state={resolved_state}, grade={resolved_grade}")
        return prefs

    def get_user_preferences(self, user_id: str) -> Dict[str, Any]:
        """Retrieve a user's saved state and grade preferences."""
        doc = self.db.collection(
            settings.COLLECTION_USER_PREFERENCES
        ).document(user_id).get()

        if doc.exists:
            data = doc.to_dict()
            return {
                "state": data.get("state", settings.DEFAULT_STATE),
                "grade": data.get("grade", settings.DEFAULT_GRADE),
            }

        return {
            "state": settings.DEFAULT_STATE,
            "grade": settings.DEFAULT_GRADE,
        }

    # --------------------------------------------------------------------------
    # EXISTING METHODS — unchanged
    # --------------------------------------------------------------------------

    def get_submission(
        self,
        submission_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """Retrieve an essay submission."""
        submission_ref = self.db.collection(
            settings.COLLECTION_ESSAY_SUBMISSIONS
        ).document(submission_id)

        submission = submission_ref.get()

        if not submission.exists:
            raise ValueError("Submission not found")

        submission_data = submission.to_dict()

        if submission_data.get("user_id") != user_id:
            raise ValueError("Unauthorized access to submission")

        return submission_data

    def get_user_submissions(
        self,
        user_id: str,
        limit: int = 10,
        category: str = None,
    ) -> list:
        """Get user's essay submissions."""
        query = (
            self.db.collection(settings.COLLECTION_ESSAY_SUBMISSIONS)
            .where("user_id", "==", user_id)
            .order_by("submitted_at", direction=firestore.Query.DESCENDING)
            .limit(limit)
        )

        if category:
            query = query.where("category", "==", category.lower())

        submissions = []
        for doc in query.stream():
            submission_data = doc.to_dict()
            submission_data["submission_id"] = doc.id

            for field in ["submitted_at", "created_at", "updated_at"]:
                if field in submission_data and hasattr(submission_data[field], "isoformat"):
                    submission_data[field] = submission_data[field].isoformat()

            submissions.append(submission_data)

        return submissions

    # --------------------------------------------------------------------------
    # PRIVATE HELPERS
    # --------------------------------------------------------------------------

    def _resolve_state(self, state: str) -> str:
        if state and settings.is_valid_state(state):
            return state.upper().strip()
        print(f"Invalid or missing state '{state}', defaulting to {settings.DEFAULT_STATE}")
        return settings.DEFAULT_STATE

    def _resolve_grade(self, grade: str) -> str:
        if grade and settings.is_valid_grade(str(grade)):
            return str(grade).lower().strip()
        print(f"Invalid or missing grade '{grade}', defaulting to {settings.DEFAULT_GRADE}")
        return settings.DEFAULT_GRADE


# Initialize service
essay_service = EssayService()