"""
Essay Service
Manages essay submissions, evaluations, and user grade/state preferences.
"""

from typing import Dict, Any
from datetime import datetime
from firebase_admin import firestore
from utils.validator import essay_validator
from llm.evaluator import essay_evaluator
from config.settings import settings
import traceback


class EssayService:
    """Service for managing essay submissions and evaluations"""

    def __init__(self):
        self._db = None
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
                            state       — optional (defaults to user pref or PA)
                            grade       — optional (defaults to user pref or 6)

        Returns:
            Evaluation results with submission ID
        """
        try:
            # ------------------------------------------------------------------
            # Step 1: Validate core essay fields
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
            # Step 2: Extract and validate state + grade
            # Falls back to defaults if missing or invalid
            # ------------------------------------------------------------------
            state = self._resolve_state(essay_data.get("state", ""))
            grade = self._resolve_grade(essay_data.get("grade", ""))

            print(f"Step 2: State={state}, Grade={grade}, "
                  f"Category={category}, Words={word_count}")

            # ------------------------------------------------------------------
            # Step 3: Evaluate the essay with PSSA rubric
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
            # Stores BOTH raw PSSA scores and converted scores as agreed
            # ------------------------------------------------------------------
            print(f"Step 4: Preparing Firestore document")
            timestamp = datetime.utcnow()

            submission_data = {
                # User info
                "user_id":       user_id,

                # Essay content
                "essay_text":    essay_text,
                "category":      category,
                "word_count":    word_count,

                # State / grade context
                "state":         state,
                "student_grade": grade,
                "grade_band":    evaluation_results.get("grade_band", ""),
                "rubric_type":   evaluation_results.get("rubric_type", "PSSA Writing Domain"),

                # PSSA raw scores (1-4 per domain) — for teacher reports / analytics
                "raw_scores": evaluation_results.get("raw_scores", {}),

                # Converted domain scores (5-20 per domain)
                "converted_scores": evaluation_results.get("converted_scores", {}),

                # Totals
                "pssa_total":      evaluation_results.get("pssa_total", 0),   # out of 20
                "converted_score": evaluation_results.get("converted_score", 0),  # out of 100
                "total_score":     evaluation_results.get("converted_score", 0),  # alias

                # Grade letter
                "grade": evaluation_results.get("grade", "F"),

                # Justifications and feedback
                "rubric_justifications": evaluation_results.get("rubric_justifications", {}),
                "strengths":             evaluation_results.get("strengths", []),
                "areas_for_improvement": evaluation_results.get("areas_for_improvement", []),
                "personalized_feedback": evaluation_results.get("personalized_feedback", ""),

                # Timestamps
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
            # Step 6: Build and return API response
            # ------------------------------------------------------------------
            response = {
                "submission_id":    submission_id,

                # Scoring
                "total_score":      evaluation_results.get("converted_score", 0),
                "pssa_total":       evaluation_results.get("pssa_total", 0),
                "converted_score":  evaluation_results.get("converted_score", 0),
                "grade":            evaluation_results.get("grade", "F"),

                # PSSA domain scores
                "raw_scores":       evaluation_results.get("raw_scores", {}),
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
    # USER PREFERENCES — State & Grade
    # --------------------------------------------------------------------------

    def save_user_preferences(
        self,
        user_id: str,
        state: str,
        grade: str,
    ) -> Dict[str, Any]:
        """
        Save a user's state and grade preference to Firestore.

        Args:
            user_id: Firebase user ID
            state:   State code e.g. 'PA'
            grade:   Grade string e.g. '7'

        Returns:
            Saved preferences dict
        """
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
        """
        Retrieve a user's saved state and grade preferences.

        Args:
            user_id: Firebase user ID

        Returns:
            Preferences dict with state and grade,
            or defaults if not set
        """
        doc = self.db.collection(
            settings.COLLECTION_USER_PREFERENCES
        ).document(user_id).get()

        if doc.exists:
            data = doc.to_dict()
            return {
                "state": data.get("state", settings.DEFAULT_STATE),
                "grade": data.get("grade", settings.DEFAULT_GRADE),
            }

        # Return defaults if user has never set preferences
        return {
            "state": settings.DEFAULT_STATE,
            "grade": settings.DEFAULT_GRADE,
        }

    # --------------------------------------------------------------------------
    # EXISTING METHODS (unchanged)
    # --------------------------------------------------------------------------

    def get_submission(
        self,
        submission_id: str,
        user_id: str,
    ) -> Dict[str, Any]:
        """
        Retrieve an essay submission.

        Args:
            submission_id: Submission document ID
            user_id:       User ID (for authorization)

        Returns:
            Submission data dict
        """
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
        """
        Get user's essay submissions.

        Args:
            user_id:  User ID
            limit:    Maximum number of submissions to return
            category: Optional category filter

        Returns:
            List of submissions
        """
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

            # Convert Firestore timestamps to ISO strings so they are JSON serializable
            for field in ["submitted_at", "created_at", "updated_at"]:
                if field in submission_data and hasattr(submission_data[field], "isoformat"):
                    submission_data[field] = submission_data[field].isoformat()

            submissions.append(submission_data)

        return submissions

    # --------------------------------------------------------------------------
    # PRIVATE HELPERS
    # --------------------------------------------------------------------------

    def _resolve_state(self, state: str) -> str:
        """
        Validate state or fall back to default.

        Args:
            state: Raw state string from request

        Returns:
            Valid state code
        """
        if state and settings.is_valid_state(state):
            return state.upper().strip()
        print(f"Invalid or missing state '{state}', "
              f"defaulting to {settings.DEFAULT_STATE}")
        return settings.DEFAULT_STATE

    def _resolve_grade(self, grade: str) -> str:
        """
        Validate grade or fall back to default.

        Args:
            grade: Raw grade string from request

        Returns:
            Valid grade string
        """
        if grade and settings.is_valid_grade(str(grade)):
            return str(grade).lower().strip()
        print(f"Invalid or missing grade '{grade}', "
              f"defaulting to {settings.DEFAULT_GRADE}")
        return settings.DEFAULT_GRADE


# Initialize service
essay_service = EssayService()