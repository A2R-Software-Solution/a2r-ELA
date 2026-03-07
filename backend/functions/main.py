"""
E-Learning App Backend - Essay Evaluation System
Firebase Cloud Functions Entry Point
"""

import firebase_admin
from firebase_admin import credentials

# Initialize Firebase Admin SDK
# In Cloud Functions, credentials are automatically provided
# Only initialize if not already initialized
if not firebase_admin._apps:
    try:
        firebase_admin.initialize_app()
    except Exception as e:
        print(f"Firebase initialization: {e}")

# Import configuration and validate (but don't fail on errors)
from config.settings import settings

try:
    settings.validate_config()
    print("Configuration validated successfully")
except ValueError as e:
    print(f"Configuration warning: {str(e)}")
    print("Set OPENROUTER_API_KEY in Firebase Functions config")

# Import all cloud functions
from essay.essay_routes import (
    submit_essay,
    get_essay_submission,
    get_user_submissions,
    get_streak,
    get_progress_stats,
    get_category_stats,
    submit_essay_no_auth,
    test_essay_evaluator,
    # NEW: user preference endpoints
    save_user_preferences,
    get_user_preferences,
    # Gamification
    get_gamification,
)
from test_llm import test_llm_connection
from gamification.game_routes import submit_game_result


# User profile functions
from user.user_routes import (
    get_user_profile,
    update_user_profile,
)

# File upload functions
from file.file_routes import (
    extract_pdf_text,
    extract_pdf_text_authenticated,
)

# Health check endpoint
from firebase_functions import https_fn, options

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"])
)
def health_check(req: https_fn.Request) -> https_fn.Response:
    """
    Health check endpoint to verify service is running

    Endpoint: GET /health_check
    """
    import json

    health_data = {
        "status":      "healthy",
        "service":     "elearning-essay-backend",
        "version":     "1.0.0",
        "environment": settings.ENVIRONMENT,
        "rubric":      "PSSA Writing Domain (PA)",
        "endpoints": {
            # Essay
            "submit_essay":              "POST /submit_essay",
            "get_essay_submission":      "GET  /get_essay_submission",
            "get_user_submissions":      "GET  /get_user_submissions",
            # Progress
            "get_streak":                "GET  /get_streak",
            "get_progress_stats":        "GET  /get_progress_stats",
            "get_category_stats":        "GET  /get_category_stats",
            # Preferences
            "save_user_preferences":     "POST /save_user_preferences",
            "get_user_preferences":      "GET  /get_user_preferences",
            # User Profile
            "get_user_profile":          "GET  /get_user_profile",
            "update_user_profile":       "POST /update_user_profile",
            # File
            "extract_pdf_text":          "POST /extract_pdf_text",
            "extract_pdf_text_authenticated": "POST /extract_pdf_text_authenticated",
            # Health
            "health_check":              "GET  /health_check",
            #Gamification
            "get_gamification":          "GET  /get_gamification",
            "submit_game_result":        "POST /submit_game_result",
        }
    }

    return https_fn.Response(
        response=json.dumps(health_data),
        status=200,
        headers={"Content-Type": "application/json"}
    )


# Export all functions
# Firebase will automatically detect these exports
__all__ = [
    # Essay
    'submit_essay',
    'get_essay_submission',
    'get_user_submissions',
    'get_streak',
    'get_progress_stats',
    'get_category_stats',
    'submit_essay_no_auth',
    'test_essay_evaluator',
    # Preferences
    'save_user_preferences',
    'get_user_preferences',
    # User Profile
    'get_user_profile',
    'update_user_profile',
    # File
    'extract_pdf_text',
    'extract_pdf_text_authenticated',
    # Utils
    'health_check',
    'test_llm_connection',
    # Gamification
    'get_gamification',
    'submit_game_result',
]

print("E-Learning Essay Backend initialized")
print(f"Environment:     {settings.ENVIRONMENT}")
print(f"LLM Model:       {settings.OPENROUTER_MODEL}")
print(f"Rubric:          PSSA Writing Domain")
print(f"Supported states: {settings.SUPPORTED_STATES}")