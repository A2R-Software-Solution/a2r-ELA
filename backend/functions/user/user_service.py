"""
User Service
Manages user profile data in Firestore.

Handles display_name, birthdate, and photo_url (base64 compressed avatar).
Separate from essay_service.py — user profile is its own domain.

Firestore structure:
    users/{uid} {
        display_name: str | None
        birthdate:    str | None  (MM/DD/YYYY)
        photo_url:    str | None  (base64 compressed avatar)
        created_at:   datetime
        updated_at:   datetime
    }
"""

from typing import Dict, Any, Optional
from datetime import datetime
from firebase_admin import firestore, auth
from config.settings import settings


class UserService:
    """Service for managing user profile data in Firestore"""

    # Firestore collection name
    COLLECTION = "users"

    def __init__(self):
        self._db = None

    @property
    def db(self):
        """Lazy load Firestore client — same pattern as essay_service.py"""
        if self._db is None:
            self._db = firestore.client()
        return self._db

    # --------------------------------------------------------------------------
    # GET USER PROFILE
    # --------------------------------------------------------------------------

    def get_user_profile(self, user_id: str) -> Dict[str, Any]:
        """
        Get user profile from Firestore.

        Args:
            user_id: Firebase user ID

        Returns:
            Profile dict with display_name, birthdate, photo_url, created_at.
            Returns empty defaults if document doesn't exist yet —
            no error thrown, first-time users are handled gracefully.
        """
        doc = self.db.collection(self.COLLECTION).document(user_id).get()

        if doc.exists:
            data = doc.to_dict()
            return {
                "display_name": data.get("display_name"),
                "birthdate":    data.get("birthdate"),
                "photo_url":    data.get("photo_url"),
                "created_at":   self._serialize_timestamp(data.get("created_at")),
                "updated_at":   self._serialize_timestamp(data.get("updated_at")),
            }

        # First time — document doesn't exist yet, return clean defaults
        return {
            "display_name": None,
            "birthdate":    None,
            "photo_url":    None,
            "created_at":   None,
            "updated_at":   None,
        }

    # --------------------------------------------------------------------------
    # UPDATE USER PROFILE
    # --------------------------------------------------------------------------

    def update_user_profile(
        self,
        user_id: str,
        data: Dict[str, Any],
    ) -> Dict[str, Any]:
        """
        Update user profile in Firestore.

        Accepts any combination of fields — only provided fields are updated
        (merge=True). Always updates updated_at timestamp.

        Args:
            user_id: Firebase user ID
            data:    Dict with any of: display_name, birthdate, photo_url

        Returns:
            Updated profile dict
        """
        now = datetime.utcnow()

        # Build update payload — only include fields that were passed in
        update_payload: Dict[str, Any] = {
            "user_id":    user_id,
            "updated_at": now,
        }

        if "display_name" in data:
            update_payload["display_name"] = data["display_name"]

        if "birthdate" in data:
            update_payload["birthdate"] = data["birthdate"]

        if "photo_url" in data:
            # photo_url can be None (to remove photo) or a base64 string
            update_payload["photo_url"] = data["photo_url"]

        # Set created_at only if document is being created for the first time
        doc_ref = self.db.collection(self.COLLECTION).document(user_id)
        doc = doc_ref.get()

        if not doc.exists:
            update_payload["created_at"] = now

        # merge=True so we only update provided fields, not overwrite the whole doc
        doc_ref.set(update_payload, merge=True)

        print(f"Updated profile for {user_id}: fields={list(data.keys())}")

        # Return the current state of the document
        return self.get_user_profile(user_id)

    # --------------------------------------------------------------------------
    # DELETE PHOTO
    # --------------------------------------------------------------------------

    def delete_user_photo(self, user_id: str) -> Dict[str, Any]:
        """
        Remove user's profile photo by setting photo_url to None.

        Args:
            user_id: Firebase user ID

        Returns:
            Updated profile dict
        """
        return self.update_user_profile(user_id, {"photo_url": None})

    # --------------------------------------------------------------------------
    # DELETE USER ACCOUNT
    # --------------------------------------------------------------------------

    def delete_user_account(self, user_id: str) -> None:
        """
        Permanently delete a user account and all associated data.

        Deletes in this order:
            1. All essay submissions       (essay_submissions where user_id == uid)
            2. User preferences            (user_preferences/{uid})
            3. User progress               (user_progress/{uid})
            4. Gamification data           (gamification/{uid})
            5. User profile                (users/{uid})
            6. Firebase Auth user          (firebase_admin.auth.delete_user)

        Steps 1-5 are Firestore. Step 6 is Firebase Auth.
        If any step fails, the exception propagates up to the route handler
        which returns a 500 to the client.

        Args:
            user_id: Firebase user ID (uid)
        """
        print(f"Starting account deletion for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 1: Delete all essay submissions
        # Queried by user_id field — same pattern as essay_service.py
        # ------------------------------------------------------------------
        essays_ref = (
            self.db
            .collection(settings.COLLECTION_ESSAY_SUBMISSIONS)
            .where("user_id", "==", user_id)
            .stream()
        )

        essay_count = 0
        for doc in essays_ref:
            doc.reference.delete()
            essay_count += 1

        print(f"Deleted {essay_count} essay submissions for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 2: Delete user preferences
        # Stored as a single doc with uid as document ID
        # ------------------------------------------------------------------
        self.db.collection(
            settings.COLLECTION_USER_PREFERENCES
        ).document(user_id).delete()

        print(f"Deleted user_preferences for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 3: Delete user progress
        # Stored as a single doc with uid as document ID
        # ------------------------------------------------------------------
        self.db.collection(
            settings.COLLECTION_USER_PROGRESS
        ).document(user_id).delete()

        print(f"Deleted user_progress for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 4: Delete gamification data
        # Stored as a single doc with uid as document ID
        # Removing this also removes the user from all leaderboards
        # since leaderboard_service.py queries gamification collection
        # ------------------------------------------------------------------
        self.db.collection(
            settings.COLLECTION_GAMIFICATION
        ).document(user_id).delete()

        print(f"Deleted gamification data for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 5: Delete user profile document
        # ------------------------------------------------------------------
        self.db.collection(
            self.COLLECTION
        ).document(user_id).delete()

        print(f"Deleted users profile for user: {user_id}")

        # ------------------------------------------------------------------
        # Step 6: Delete Firebase Auth user
        # Must be last — once this is done, the uid is gone permanently
        # ------------------------------------------------------------------
        auth.delete_user(user_id)

        print(f"Deleted Firebase Auth user: {user_id}")
        print(f"Account deletion complete for user: {user_id}")

    # --------------------------------------------------------------------------
    # PRIVATE HELPERS
    # --------------------------------------------------------------------------

    def _serialize_timestamp(self, value: Any) -> Optional[str]:
        """
        Convert Firestore timestamp to ISO string for JSON serialization.
        Same pattern used in essay_service.py get_user_submissions fix.

        Returns None if value is None or cannot be converted.
        """
        if value is None:
            return None
        if hasattr(value, "isoformat"):
            return value.isoformat()
        return str(value)


# Lazy initialization — same pattern as progress_service.py
user_service = UserService()