"""
Leaderboard Service
Handles leaderboard queries from Firestore.

Queries the gamification + user_preferences collections to build
top-10 leaderboards filtered by grade or state.

Firestore structure used:
    gamification/{uid} {
        xp:           int
        level:        int
        level_name:   str
        essay_count:  int
        avg_score:    float
    }

    user_preferences/{uid} {
        state: str   (e.g. "PA")
        grade: str   (e.g. "6")
    }

    users/{uid} {
        display_name: str
    }
"""

from typing import Dict, Any, List, Optional
from firebase_admin import firestore
from config.settings import settings


class LeaderboardService:
    """Service for building grade and state leaderboards"""

    # Firestore collections
    COLLECTION_GAMIFICATION   = settings.COLLECTION_GAMIFICATION       # "gamification"
    COLLECTION_PREFERENCES    = settings.COLLECTION_USER_PREFERENCES   # "user_preferences"
    COLLECTION_USERS          = settings.COLLECTION_USERS              # "users"

    TOP_N = 10  # Number of users to return

    def __init__(self):
        self._db = None

    @property
    def db(self):
        """Lazy load Firestore client — same pattern as other services"""
        if self._db is None:
            self._db = firestore.client()
        return self._db

    # --------------------------------------------------------------------------
    # PUBLIC METHODS
    # --------------------------------------------------------------------------

    def get_grade_leaderboard(
        self,
        current_user_id: str,
        grade: str,
    ) -> Dict[str, Any]:
        """
        Get top 10 users in the same grade ranked by XP.

        Args:
            current_user_id: Firebase UID of the requesting user
            grade:           Grade string (e.g. "6") from their preferences

        Returns:
            Dict with:
              - entries: list of top 10 leaderboard entries
              - current_user_rank: rank of the current user (or None if not in top 10)
              - filter_label: human-readable label e.g. "Grade 6"
        """
        # 1. Get all UIDs in the same grade from user_preferences
        uids_in_grade = self._get_uids_by_grade(grade)

        # 2. Build leaderboard from those UIDs
        return self._build_leaderboard(
            uids          = uids_in_grade,
            current_user_id = current_user_id,
            filter_label  = settings.get_grade_display(grade),
        )

    def get_state_leaderboard(
        self,
        current_user_id: str,
        state: str,
    ) -> Dict[str, Any]:
        """
        Get top 10 users in the same state ranked by XP.

        Args:
            current_user_id: Firebase UID of the requesting user
            state:           State code (e.g. "PA") from their preferences

        Returns:
            Dict with:
              - entries: list of top 10 leaderboard entries
              - current_user_rank: rank of the current user (or None if not in top 10)
              - filter_label: human-readable label e.g. "Pennsylvania"
        """
        # 1. Get all UIDs in the same state from user_preferences
        uids_in_state = self._get_uids_by_state(state)

        # 2. Build leaderboard from those UIDs
        return self._build_leaderboard(
            uids            = uids_in_state,
            current_user_id = current_user_id,
            filter_label    = settings.get_state_display(state),
        )

    # --------------------------------------------------------------------------
    # PRIVATE — FIRESTORE QUERIES
    # --------------------------------------------------------------------------

    def _get_uids_by_grade(self, grade: str) -> List[str]:
        """
        Query user_preferences collection for all users with matching grade.

        Returns list of UIDs.
        """
        docs = (
            self.db
            .collection(self.COLLECTION_PREFERENCES)
            .where("grade", "==", grade.lower().strip())
            .stream()
        )
        return [doc.id for doc in docs]

    def _get_uids_by_state(self, state: str) -> List[str]:
        """
        Query user_preferences collection for all users with matching state.

        Returns list of UIDs.
        """
        docs = (
            self.db
            .collection(self.COLLECTION_PREFERENCES)
            .where("state", "==", state.upper().strip())
            .stream()
        )
        return [doc.id for doc in docs]

    def _get_gamification_data(self, uids: List[str]) -> Dict[str, Dict]:
        """
        Batch-fetch gamification docs for a list of UIDs.

        Firestore doesn't support IN queries > 30 items,
        so we chunk if necessary.

        Returns dict: { uid -> gamification_data }
        """
        if not uids:
            return {}

        result = {}

        # Chunk into groups of 30 (Firestore IN query limit)
        for i in range(0, len(uids), 30):
            chunk = uids[i:i + 30]
            docs = (
                self.db
                .collection(self.COLLECTION_GAMIFICATION)
                .where("__name__", "in", [
                    self.db.collection(self.COLLECTION_GAMIFICATION).document(uid)
                    for uid in chunk
                ])
                .stream()
            )
            for doc in docs:
                result[doc.id] = doc.to_dict()

        return result

    def _get_display_names(self, uids: List[str]) -> Dict[str, str]:
        """
        Batch-fetch display names from users collection.

        Returns dict: { uid -> display_name }
        """
        if not uids:
            return {}

        result = {}
        for uid in uids:
            doc = self.db.collection(self.COLLECTION_USERS).document(uid).get()
            if doc.exists:
                data = doc.to_dict()
                result[uid] = data.get("display_name") or "Anonymous"
            else:
                result[uid] = "Anonymous"

        return result

    # --------------------------------------------------------------------------
    # PRIVATE — LEADERBOARD BUILDER
    # --------------------------------------------------------------------------

    def _build_leaderboard(
        self,
        uids: List[str],
        current_user_id: str,
        filter_label: str,
    ) -> Dict[str, Any]:
        """
        Core leaderboard builder.

        1. Fetches gamification data for all UIDs
        2. Fetches display names
        3. Sorts by XP descending
        4. Returns top 10 + current user's rank

        Args:
            uids:            List of user IDs to include
            current_user_id: UID of requesting user (to highlight their row)
            filter_label:    Human-readable filter label for the frontend

        Returns:
            {
                entries: [...],
                current_user_rank: int | None,
                filter_label: str,
                total_users: int,
            }
        """
        if not uids:
            return {
                "entries":           [],
                "current_user_rank": None,
                "filter_label":      filter_label,
                "total_users":       0,
            }

        # Fetch gamification data individually (more reliable than IN query with doc refs)
        gamification_map: Dict[str, Dict] = {}
        for uid in uids:
            doc = self.db.collection(self.COLLECTION_GAMIFICATION).document(uid).get()
            if doc.exists:
                gamification_map[uid] = doc.to_dict()

        # Only include users who have gamification data (have used the app)
        active_uids = list(gamification_map.keys())

        if not active_uids:
            return {
                "entries":           [],
                "current_user_rank": None,
                "filter_label":      filter_label,
                "total_users":       0,
            }

        # Fetch display names for active users
        display_names = self._get_display_names(active_uids)

        # Build sortable list
        user_list = []
        for uid in active_uids:
            g_data = gamification_map[uid]
            user_list.append({
                "uid":         uid,
                "display_name": display_names.get(uid, "Anonymous"),
                "xp":          g_data.get("xp", 0),
                "level":       g_data.get("level", 1),
                "level_name":  g_data.get("level_name", "Beginner Writer"),
                "essay_count": g_data.get("essay_count", 0),
                "avg_score":   round(g_data.get("avg_score", 0.0), 1),
            })

        # Sort by XP descending
        user_list.sort(key=lambda u: u["xp"], reverse=True)

        # Assign ranks
        current_user_rank: Optional[int] = None
        for idx, user in enumerate(user_list):
            user["rank"] = idx + 1
            if user["uid"] == current_user_id:
                current_user_rank = idx + 1

        # Top 10 entries for response
        top_10 = user_list[:self.TOP_N]

        # Build response entries — exclude internal uid from response
        entries = []
        for user in top_10:
            entries.append({
                "rank":           user["rank"],
                "display_name":   user["display_name"],
                "xp":             user["xp"],
                "level":          user["level"],
                "level_name":     user["level_name"],
                "essay_count":    user["essay_count"],
                "avg_score":      user["avg_score"],
                "is_current_user": user["uid"] == current_user_id,
            })

        # If current user is outside top 10, append their entry at the bottom
        if current_user_rank and current_user_rank > self.TOP_N:
            current_user_data = next(
                (u for u in user_list if u["uid"] == current_user_id), None
            )
            if current_user_data:
                entries.append({
                    "rank":            current_user_data["rank"],
                    "display_name":    current_user_data["display_name"],
                    "xp":              current_user_data["xp"],
                    "level":           current_user_data["level"],
                    "level_name":      current_user_data["level_name"],
                    "essay_count":     current_user_data["essay_count"],
                    "avg_score":       current_user_data["avg_score"],
                    "is_current_user": True,
                })

        return {
            "entries":           entries,
            "current_user_rank": current_user_rank,
            "filter_label":      filter_label,
            "total_users":       len(user_list),
        }


# Lazy singleton — same pattern as other services
leaderboard_service = LeaderboardService()