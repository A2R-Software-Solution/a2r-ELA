"""
Notification Routes

Endpoints:
    POST /register_device_token   — save/refresh this device's FCM token
    POST /unregister_device_token — remove it (on sign-out)
    Scheduled: streak_at_risk_reminder — daily push to users about to lose a streak
"""

from config.settings import settings
from firebase_functions import https_fn, options, scheduler_fn
from auth.auth_service import require_auth
from notifications.notification_service import notification_service
from utils.responses import response_builder

cors_options = options.CorsOptions(
    cors_origins=settings.CORS_ORIGINS,
    cors_methods=["POST", "OPTIONS"],
)

_PLATFORMS = ("android", "ios")


@https_fn.on_request(cors=cors_options)
@require_auth
def register_device_token(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """Body: { "token": str, "platform": "android"|"ios", "streak_alerts": bool }"""
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        body = req.get_json(silent=True) or {}
        token = body.get("token")
        platform = body.get("platform")

        if not token or not isinstance(token, str):
            return response_builder.validation_error("token is required")
        if platform not in _PLATFORMS:
            return response_builder.validation_error("platform must be android or ios")

        notification_service.register_token(
            user_id, token, platform, bool(body.get("streak_alerts", True))
        )
        return response_builder.success(message="Device registered")
    except Exception as e:
        print(f"Error in register_device_token: {e}")
        return response_builder.internal_error("Failed to register device")


@https_fn.on_request(cors=cors_options)
@require_auth
def unregister_device_token(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """Body: { "token": str }"""
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        token = (req.get_json(silent=True) or {}).get("token")
        if not token or not isinstance(token, str):
            return response_builder.validation_error("token is required")

        notification_service.unregister_token(user_id, token)
        return response_builder.success(message="Device unregistered")
    except Exception as e:
        print(f"Error in unregister_device_token: {e}")
        return response_builder.internal_error("Failed to unregister device")


@scheduler_fn.on_schedule(
    schedule="0 19 * * *",  # 7 PM daily
    timezone=settings.STREAK_TIMEZONE,
)
def streak_at_risk_reminder(event: scheduler_fn.ScheduledEvent) -> None:
    sent = notification_service.send_streak_at_risk_reminders()
    print(f"Streak-at-risk reminders sent: {sent}")
