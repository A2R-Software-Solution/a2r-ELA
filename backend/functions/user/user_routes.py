"""
User Routes
API endpoints for user profile management.

Handles display_name, birthdate, and photo_url (base64 compressed avatar).
Separate from essay_routes.py — user profile is its own domain.

Endpoints:
    GET  /get_user_profile    — fetch profile data from Firestore
    POST /update_user_profile — update any combination of profile fields
"""

import re
from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from user.user_service import user_service
from utils.responses import response_builder

# Configure CORS — same pattern as essay_routes.py
cors_options = options.CorsOptions(
    cors_origins="*",
    cors_methods=["GET", "POST", "OPTIONS"]
)

# MM/DD/YYYY validation pattern (4-digit year)
_BIRTHDATE_PATTERN = re.compile(
    r"^(0[1-9]|1[0-2])/(0[1-9]|[12]\d|3[01])/(\d{4})$"
)

# Max photo size — 2MB base64 string
# A compressed 200x200 avatar is ~15-30KB so this is very generous
_MAX_PHOTO_SIZE = 2 * 1024 * 1024  # 2MB in characters


# ------------------------------------------------------------------------------
# GET USER PROFILE
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def get_user_profile(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user profile data from Firestore.

    Endpoint: GET /get_user_profile
    Headers:  Authorization: Bearer <firebase_token>

    Returns:
        {
            "display_name": str | None,
            "birthdate":    str | None,  (MM/DD/YYYY)
            "photo_url":    str | None,  (base64)
            "created_at":   str | None,
            "updated_at":   str | None,
        }
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)

    try:
        profile = user_service.get_user_profile(user_id)

        return response_builder.success(
            data=profile,
            message="Profile retrieved successfully"
        )

    except Exception as e:
        print(f"Error in get_user_profile: {str(e)}")
        return response_builder.internal_error("Failed to retrieve profile")


# ------------------------------------------------------------------------------
# UPDATE USER PROFILE
# ------------------------------------------------------------------------------

@https_fn.on_request(cors=cors_options)
@require_auth
def update_user_profile(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Update user profile fields in Firestore.
    All fields are optional — only provided fields are updated.

    Endpoint: POST /update_user_profile
    Headers:  Authorization: Bearer <firebase_token>
    Body (all optional): {
        "display_name": "John Doe",
        "birthdate":    "02/18/2012",   (MM/DD/YYYY)
        "photo_url":    "<base64>",     (compressed avatar, max 2MB)
    }

    To remove photo: pass "photo_url": null
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)

    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)

    try:
        request_data = req.get_json()

        if not request_data:
            return response_builder.validation_error("Request body is required")

        # Must provide at least one field to update
        allowed_fields = {"display_name", "birthdate", "photo_url"}
        provided_fields = set(request_data.keys()) & allowed_fields

        if not provided_fields:
            return response_builder.validation_error(
                f"At least one field required: {sorted(allowed_fields)}"
            )

        # ------------------------------------------------------------------
        # Validate display_name
        # ------------------------------------------------------------------
        if "display_name" in request_data:
            display_name = request_data["display_name"]

            if display_name is not None:
                if not isinstance(display_name, str):
                    return response_builder.validation_error(
                        "display_name must be a string"
                    )

                display_name = display_name.strip()

                if len(display_name) < 1:
                    return response_builder.validation_error(
                        "display_name cannot be empty"
                    )

                if len(display_name) > 50:
                    return response_builder.validation_error(
                        "display_name cannot exceed 50 characters"
                    )

                request_data["display_name"] = display_name

        # ------------------------------------------------------------------
        # Validate birthdate
        # ------------------------------------------------------------------
        if "birthdate" in request_data:
            birthdate = request_data["birthdate"]

            if birthdate is not None:
                if not isinstance(birthdate, str):
                    return response_builder.validation_error(
                        "birthdate must be a string"
                    )

                if not _BIRTHDATE_PATTERN.match(birthdate):
                    return response_builder.validation_error(
                        "birthdate must be in MM/DD/YYYY format (e.g. 08/22/1998)"
                    )

        # ------------------------------------------------------------------
        # Validate photo_url
        # ------------------------------------------------------------------
        if "photo_url" in request_data:
            photo_url = request_data["photo_url"]

            if photo_url is not None:
                if not isinstance(photo_url, str):
                    return response_builder.validation_error(
                        "photo_url must be a base64 string or null"
                    )

                if len(photo_url) > _MAX_PHOTO_SIZE:
                    return response_builder.validation_error(
                        "photo_url exceeds maximum size of 2MB"
                    )

                # Must be a valid base64 data URI
                # e.g. "data:image/jpeg;base64,/9j/4AAQ..."
                if not photo_url.startswith("data:image/"):
                    return response_builder.validation_error(
                        "photo_url must be a base64 data URI "
                        "(e.g. data:image/jpeg;base64,...)"
                    )

        # ------------------------------------------------------------------
        # Build update data — only include fields that were in request
        # ------------------------------------------------------------------
        update_data = {
            field: request_data[field]
            for field in allowed_fields
            if field in request_data
        }

        updated_profile = user_service.update_user_profile(user_id, update_data)

        return response_builder.success(
            data=updated_profile,
            message="Profile updated successfully"
        )

    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in update_user_profile: {str(e)}")
        return response_builder.internal_error("Failed to update profile")