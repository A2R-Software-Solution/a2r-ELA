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
        # Try to use Application Default Credentials (works in Cloud Functions)
        firebase_admin.initialize_app()
    except Exception as e:
        print(f"Firebase initialization: {e}")
        # This is okay during deployment - it will work in production

# Import configuration and validate (but don't fail on errors)
from config.settings import settings

try:
    settings.validate_config()
    print("Configuration validated successfully")
except ValueError as e:
    print(f"Configuration warning: {str(e)}")
    print("Set OPENROUTER_API_KEY in Firebase Functions config")

# Import all cloud functions
# These will be automatically discovered and deployed by Firebase
from essay.essay_routes import (
    submit_essay,
    get_essay_submission,
    get_user_submissions,
    get_streak,
    get_progress_stats,
    get_category_stats,
    submit_essay_no_auth,      # Add this
    test_essay_evaluator       # Add this

)
from test_llm import test_llm_connection


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
        "status": "healthy",
        "service": "elearning-essay-backend",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "endpoints": {
            "submit_essay": "POST /submit_essay",
            "get_essay_submission": "GET /get_essay_submission",
            "get_user_submissions": "GET /get_user_submissions",
            "get_streak": "GET /get_streak",
            "get_progress_stats": "GET /get_progress_stats",
            "get_category_stats": "GET /get_category_stats"
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
    'submit_essay',
    'get_essay_submission',
    'get_user_submissions',
    'get_streak',
    'get_progress_stats',
    'get_category_stats',
    'health_check',
    'test_llm_connection',
    "submit_essay_no_auth",    # Add this
    "test_essay_evaluator",    # Add this
]

print("E-Learning Essay Backend initialized")
print(f"Environment: {settings.ENVIRONMENT}")
print(f"LLM Model: {settings.OPENROUTER_MODEL}")