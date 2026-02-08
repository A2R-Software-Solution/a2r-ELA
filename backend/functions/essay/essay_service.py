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
        # Lazy initialization - only create client when needed
        self._db = None
        self.validator = essay_validator
        self.evaluator = essay_evaluator
    
    @property
    def db(self):
        """Lazy load Firestore client"""
        if self._db is None:
            self._db = firestore.client()
        return self._db
    
    def submit_essay(
        self,
        user_id: str,
        essay_data: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Process and evaluate an essay submission
        
        Args:
            user_id: Firebase user ID
            essay_data: Dictionary containing essay_text and category
            
        Returns:
            Evaluation results with submission ID
        """
        try:
            # Step 1: Validate submission data
            print(f"Step 1: Validating submission data for user {user_id}")
            is_valid, error_msg, sanitized_data = self.validator.validate_submission_data(
                essay_data
            )
            
            if not is_valid:
                print(f"Validation failed: {error_msg}")
                raise ValueError(error_msg)
            
            essay_text = sanitized_data["essay_text"]
            category = sanitized_data["category"]
            word_count = sanitized_data["word_count"]
            
            print(f"Step 2: Evaluating essay - Category: {category}, Words: {word_count}")
            
            # Step 2: Evaluate the essay
            try:
                evaluation_results = self.evaluator.evaluate_essay(
                    essay_text,
                    category
                )
                print(f"Evaluation completed successfully")
            except Exception as eval_error:
                print(f"ERROR in evaluator.evaluate_essay: {str(eval_error)}")
                print(f"Traceback: {traceback.format_exc()}")
                raise Exception(f"Essay evaluation failed: {str(eval_error)}")
            
            # Step 3: Prepare submission document
            print(f"Step 3: Preparing submission document")
            timestamp = datetime.utcnow()
            
            submission_data = {
                "user_id": user_id,
                "essay_text": essay_text,
                "category": category,
                "word_count": word_count,
                "total_score": evaluation_results["total_score"],
                "grade": evaluation_results["grade"],
                "rubric_scores": evaluation_results["rubric_scores"],
                "rubric_justifications": evaluation_results.get("rubric_justifications", {}),
                "strengths": evaluation_results.get("strengths", []),
                "areas_for_improvement": evaluation_results.get("areas_for_improvement", []),
                "personalized_feedback": evaluation_results["personalized_feedback"],
                "submitted_at": timestamp,
                "created_at": timestamp
            }
            
            # Step 4: Save to Firestore
            print(f"Step 4: Saving to Firestore")
            submission_ref = self.db.collection(
                settings.COLLECTION_ESSAY_SUBMISSIONS
            ).document()
            
            submission_ref.set(submission_data)
            submission_id = submission_ref.id
            print(f"Submission saved with ID: {submission_id}")
            
            # Step 5: Prepare response
            response = {
                "submission_id": submission_id,
                "total_score": evaluation_results["total_score"],
                "grade": evaluation_results["grade"],
                "rubric_scores": evaluation_results["rubric_scores"],
                "personalized_feedback": evaluation_results["personalized_feedback"],
                "strengths": evaluation_results.get("strengths", []),
                "areas_for_improvement": evaluation_results.get("areas_for_improvement", []),
                "word_count": word_count,
                "category": category,
                "submitted_at": timestamp.isoformat()
            }
            
            return response
            
        except ValueError as ve:
            # Re-raise validation errors
            print(f"ValueError in submit_essay: {str(ve)}")
            raise
        except Exception as e:
            # Log the full error with traceback
            print(f"CRITICAL ERROR in submit_essay: {str(e)}")
            print(f"Full traceback: {traceback.format_exc()}")
            raise
    
    def get_submission(self, submission_id: str, user_id: str) -> Dict[str, Any]:
        """
        Retrieve an essay submission
        
        Args:
            submission_id: Submission document ID
            user_id: User ID (for authorization)
            
        Returns:
            Submission data
        """
        submission_ref = self.db.collection(
            settings.COLLECTION_ESSAY_SUBMISSIONS
        ).document(submission_id)
        
        submission = submission_ref.get()
        
        if not submission.exists:
            raise ValueError("Submission not found")
        
        submission_data = submission.to_dict()
        
        # Verify ownership
        if submission_data.get("user_id") != user_id:
            raise ValueError("Unauthorized access to submission")
        
        return submission_data
    
    def get_user_submissions(
        self,
        user_id: str,
        limit: int = 10,
        category: str = None
    ) -> list:
        """
        Get user's essay submissions
        
        Args:
            user_id: User ID
            limit: Maximum number of submissions to return
            category: Optional category filter
            
        Returns:
            List of submissions
        """
        query = self.db.collection(
            settings.COLLECTION_ESSAY_SUBMISSIONS
        ).where("user_id", "==", user_id).order_by(
            "submitted_at", direction=firestore.Query.DESCENDING
        ).limit(limit)
        
        if category:
            query = query.where("category", "==", category.lower())
        
        submissions = []
        for doc in query.stream():
            submission_data = doc.to_dict()
            submission_data["submission_id"] = doc.id
            submissions.append(submission_data)
        
        return submissions

# DON'T initialize here - let it initialize lazily
essay_service = EssayService()