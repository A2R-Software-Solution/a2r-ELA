from firebase_admin import auth
from typing import Optional, Dict, Any
from functools import wraps
from firebase_functions import https_fn
from utils.responses import response_builder
from config.settings import settings

class AuthService:
    """Firebase Authentication Service"""
    
    @staticmethod
    def verify_token(id_token: str) -> Optional[Dict[str, Any]]:
        """
        Verify Firebase ID token
        
        Args:
            id_token: Firebase ID token from client
            
        Returns:
            Decoded token with user info or None if invalid
        """
        try:
            decoded_token = auth.verify_id_token(id_token)
            return decoded_token
        except auth.InvalidIdTokenError:
            raise ValueError("Invalid authentication token")
        except auth.ExpiredIdTokenError:
            raise ValueError("Authentication token has expired")
        except Exception as e:
            raise ValueError(f"Authentication error: {str(e)}")
    
    @staticmethod
    def get_user_id_from_token(id_token: str) -> str:
        """
        Extract user ID from token
        
        Args:
            id_token: Firebase ID token
            
        Returns:
            User ID string
        """
        decoded_token = AuthService.verify_token(id_token)
        return decoded_token.get("uid")
    
    @staticmethod
    def get_user_info(user_id: str) -> Dict[str, Any]:
        """
        Get user information from Firebase Auth
        
        Args:
            user_id: Firebase user ID
            
        Returns:
            User information dictionary
        """
        try:
            user = auth.get_user(user_id)
            return {
                "uid": user.uid,
                "email": user.email,
                "display_name": user.display_name,
                "email_verified": user.email_verified,
                "created_at": user.user_metadata.creation_timestamp
            }
        except auth.UserNotFoundError:
            raise ValueError(f"User {user_id} not found")
        except Exception as e:
            raise ValueError(f"Error fetching user info: {str(e)}")

def require_auth(func):
    """
    Decorator to require authentication for Cloud Functions
    
    Usage:
        @require_auth
        def my_function(req, user_id):
            # user_id is automatically extracted from token
            pass
    """
    @wraps(func)
    def wrapper(req: https_fn.Request):
        auth_header = req.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer ") or not auth_header[7:].strip():
            return response_builder.unauthorized("Missing or invalid Authorization header")
        try:
            user_id = AuthService.get_user_id_from_token(auth_header[7:].strip())
            if not user_id:
                return response_builder.unauthorized("Invalid authentication token")
        except ValueError as error:
            return response_builder.unauthorized(str(error))
        except Exception:
            return response_builder.internal_error("Authentication failed")
        return func(req, user_id)
    return wrapper


def development_only(func):
    """Retain development tools without exposing them in production."""
    @wraps(func)
    def wrapper(*args, **kwargs):
        if settings.ENVIRONMENT.lower() == "production" or not settings.DEBUG:
            return response_builder.not_found("Endpoint unavailable")
        return func(*args, **kwargs)
    return wrapper


# Initialize auth service
auth_service = AuthService()
