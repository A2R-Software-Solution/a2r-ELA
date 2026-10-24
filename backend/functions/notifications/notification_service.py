"""
Notification Service
Stores FCM device tokens and sends push notifications.

Firestore structure:
    users/{uid}/devices/{token} {
        platform:      "android" | "ios"
        streak_alerts: bool
        updated_at:    datetime
    }
"""

from datetime import datetime, timedelta
from typing import Dict, Optional

from dateutil.tz import gettz
from firebase_admin import firestore, messaging

from config.settings import settings

DEVICES = "devices"

# Channel the app creates for server pushes (see NotificationService.ts)
ANDROID_CHANNEL_ID = "general"


class NotificationService:

    def __init__(self):
        self._db = None

    @property
    def db(self):
        if self._db is None:
            self._db = firestore.client()
        return self._db

    def _devices(self, user_id: str):
        return (
            self.db.collection(settings.COLLECTION_USERS)
            .document(user_id)
            .collection(DEVICES)
        )

    # --------------------------------------------------------------------------
    # TOKENS
    # --------------------------------------------------------------------------

    def register_token(
        self, user_id: str, token: str, platform: str, streak_alerts: bool
    ) -> None:
        self._devices(user_id).document(token).set({
            "platform":      platform,
            "streak_alerts": streak_alerts,
            "updated_at":    datetime.utcnow(),
        })

    def unregister_token(self, user_id: str, token: str) -> None:
        self._devices(user_id).document(token).delete()

    def delete_all_tokens(self, user_id: str) -> None:
        for doc in self._devices(user_id).stream():
            doc.reference.delete()

    # --------------------------------------------------------------------------
    # SENDING
    # --------------------------------------------------------------------------

    def send_to_user(
        self,
        user_id: str,
        title: str,
        body: str,
        data: Optional[Dict[str, str]] = None,
        only_streak_alerts: bool = False,
    ) -> int:
        """Send a push to every device of a user. Returns the success count."""
        docs = list(self._devices(user_id).stream())
        if only_streak_alerts:
            docs = [d for d in docs if d.to_dict().get("streak_alerts", True)]
        tokens = [d.id for d in docs]
        if not tokens:
            return 0

        message = messaging.MulticastMessage(
            tokens=tokens,
            notification=messaging.Notification(title=title, body=body),
            data={k: str(v) for k, v in (data or {}).items()},
            android=messaging.AndroidConfig(
                priority="high",
                notification=messaging.AndroidNotification(channel_id=ANDROID_CHANNEL_ID),
            ),
        )
        response = messaging.send_each_for_multicast(message)

        # Drop tokens FCM says are dead so we stop sending to them
        for token, result in zip(tokens, response.responses):
            if not result.success and isinstance(
                result.exception,
                (messaging.UnregisteredError, messaging.SenderIdMismatchError),
            ):
                self.unregister_token(user_id, token)

        return response.success_count

    def send_streak_at_risk_reminders(self) -> int:
        """
        Notify users whose last submission was yesterday (local time), i.e.
        their streak breaks if they don't practice before midnight today.
        """
        tz = gettz(settings.STREAK_TIMEZONE)
        today_start = datetime.now(tz).replace(hour=0, minute=0, second=0, microsecond=0)
        yesterday_start = today_start - timedelta(days=1)

        query = (
            self.db.collection(settings.COLLECTION_USER_PROGRESS)
            .where("last_submission_date", ">=", yesterday_start)
            .where("last_submission_date", "<", today_start)
        )

        sent = 0
        for doc in query.stream():
            streak = doc.to_dict().get("current_streak", 0)
            if streak < 1:
                continue
            try:
                sent += self.send_to_user(
                    doc.id,
                    "Your streak is at risk! 🔥",
                    f"Practice today to keep your {streak}-day streak alive.",
                    {"type": "streak_at_risk"},
                    only_streak_alerts=True,
                )
            except Exception as e:
                print(f"Streak reminder failed for {doc.id}: {e}")
        return sent


notification_service = NotificationService()
