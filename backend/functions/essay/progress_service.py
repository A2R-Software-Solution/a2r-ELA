#progress_service.py
from typing import Dict, Any
from datetime import datetime, timedelta
from firebase_admin import firestore
from config.settings import settings

class ProgressService:
    """Service for tracking user progress and streaks"""
    
    def __init__(self):
        # Lazy initialization - only create client when needed
        self._db = None
    
    @property
    def db(self):
        """Lazy load Firestore client"""
        if self._db is None:
            self._db = firestore.client()
        return self._db
    
    def get_or_create_progress(self, user_id: str) -> Dict[str, Any]:
        """
        Get or create user progress document
        
        Args:
            user_id: Firebase user ID
            
        Returns:
            Progress data dictionary
        """
        progress_ref = self.db.collection(
            settings.COLLECTION_USER_PROGRESS
        ).document(user_id)
        
        progress = progress_ref.get()
        
        if progress.exists:
            return progress.to_dict()
        
        # Create new progress document
        initial_progress = {
            "user_id": user_id,
            "current_streak": 0,
            "max_streak": 0,
            "total_essays_submitted": 0,
            "last_submission_date": None,
            "category_scores": {
                "essay_writing": {"count": 0, "avg_score": 0, "total_score": 0},
                "ela": {"count": 0, "avg_score": 0, "total_score": 0},
                "math": {"count": 0, "avg_score": 0, "total_score": 0},
                "science": {"count": 0, "avg_score": 0, "total_score": 0}
            },
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        progress_ref.set(initial_progress)
        return initial_progress
    
    def update_progress_after_submission(
        self,
        user_id: str,
        category: str,
        score: int
    ) -> Dict[str, Any]:
        """
        Update user progress after essay submission
        
        Args:
            user_id: User ID
            category: Essay category
            score: Score received
            
        Returns:
            Updated progress data
        """
        progress_ref = self.db.collection(
            settings.COLLECTION_USER_PROGRESS
        ).document(user_id)
        
        # Get current progress
        progress = self.get_or_create_progress(user_id)
        
        # Update streak
        current_date = datetime.utcnow().date()
        last_submission = progress.get("last_submission_date")
        
        if last_submission:
            # Convert Firestore timestamp to date if needed
            if hasattr(last_submission, 'date'):
                last_submission = last_submission.date()
            elif isinstance(last_submission, datetime):
                last_submission = last_submission.date()
        
        current_streak = progress.get("current_streak", 0)
        max_streak = progress.get("max_streak", 0)
        
        # Calculate new streak
        if last_submission is None:
            # First submission
            new_streak = 1
        elif last_submission == current_date:
            # Same day submission - keep streak
            new_streak = current_streak
        elif last_submission == current_date - timedelta(days=1):
            # Consecutive day submission
            new_streak = current_streak + 1
        else:
            # Streak broken
            new_streak = 1
        
        # Update max streak
        new_max_streak = max(max_streak, new_streak)
        
        # Update category scores
        category_scores = progress.get("category_scores", {})
        if category not in category_scores:
            category_scores[category] = {"count": 0, "avg_score": 0, "total_score": 0}
        
        cat_data = category_scores[category]
        cat_data["count"] += 1
        cat_data["total_score"] += score
        cat_data["avg_score"] = cat_data["total_score"] / cat_data["count"]
        
        # Update total essays
        total_essays = progress.get("total_essays_submitted", 0) + 1
        
        # Prepare update data
        update_data = {
            "current_streak": new_streak,
            "max_streak": new_max_streak,
            "total_essays_submitted": total_essays,
            "last_submission_date": datetime.utcnow(),
            "category_scores": category_scores,
            "updated_at": datetime.utcnow()
        }
        
        # Update Firestore
        progress_ref.update(update_data)
        
        # Return updated progress
        return {
            "current_streak": new_streak,
            "max_streak": new_max_streak,
            "total_essays_submitted": total_essays,
            "category_scores": category_scores,
            "streak_updated": new_streak != current_streak
        }
    
    def get_streak_info(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's streak information
        
        Args:
            user_id: User ID
            
        Returns:
            Streak info dictionary
        """
        progress = self.get_or_create_progress(user_id)
        
        current_streak = progress.get("current_streak", 0)
        max_streak = progress.get("max_streak", 0)
        last_submission = progress.get("last_submission_date")
        
        # Check if streak is still valid
        if last_submission:
            if hasattr(last_submission, 'date'):
                last_submission_date = last_submission.date()
            elif isinstance(last_submission, datetime):
                last_submission_date = last_submission.date()
            else:
                last_submission_date = last_submission
            
            current_date = datetime.utcnow().date()
            days_since_last = (current_date - last_submission_date).days
            
            # If more than 1 day has passed, streak is broken
            if days_since_last > 1:
                current_streak = 0
        
        return {
            "current_streak": current_streak,
            "max_streak": max_streak,
            "days_until_year": max(0, 365 - current_streak),
            "streak_active": current_streak > 0,
            "last_submission_date": last_submission.isoformat() if last_submission else None
        }
    
    def get_category_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's category-wise statistics
        
        Args:
            user_id: User ID
            
        Returns:
            Category statistics
        """
        progress = self.get_or_create_progress(user_id)
        category_scores = progress.get("category_scores", {})
        
        return {
            "essay_writing": category_scores.get("essay_writing", {"count": 0, "avg_score": 0}),
            "ela": category_scores.get("ela", {"count": 0, "avg_score": 0}),
            "math": category_scores.get("math", {"count": 0, "avg_score": 0}),
            "science": category_scores.get("science", {"count": 0, "avg_score": 0})
        }
    
    def get_overall_stats(self, user_id: str) -> Dict[str, Any]:
        """
        Get user's overall statistics
        
        Args:
            user_id: User ID
            
        Returns:
            Overall statistics
        """
        progress = self.get_or_create_progress(user_id)
        streak_info = self.get_streak_info(user_id)
        category_stats = self.get_category_stats(user_id)
        
        return {
            "total_essays_submitted": progress.get("total_essays_submitted", 0),
            "current_streak": streak_info["current_streak"],
            "max_streak": streak_info["max_streak"],
            "category_stats": category_stats,
            "progress_percentage": min(100, int((streak_info["current_streak"] / 365) * 100))
        }

# DON'T initialize here - let it initialize lazily
progress_service = ProgressService()