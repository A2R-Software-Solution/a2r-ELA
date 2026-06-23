from firebase_admin import auth
from typing import Optional, Dict, Any
from functools import wraps
from firebase_functions import https_fn

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
        # Extract token from Authorization header
        auth_header = req.headers.get("Authorization", "")
        
        if not auth_header.startswith("Bearer "):
            return https_fn.Response(
                response={"error": "Missing or invalid Authorization header"},
                status=401,
                headers={"Content-Type": "application/json"}
            )
        
        id_token = auth_header.split("Bearer ")[1]
        
        try:
            # Verify token and extract user ID
            user_id = AuthService.get_user_id_from_token(id_token)
            
            # Call the original function with user_id
            return func(req, user_id)
            
        except ValueError as e:
            return https_fn.Response(
                response={"error": str(e)},
                status=401,
                headers={"Content-Type": "application/json"}
            )
        except Exception as e:
            return https_fn.Response(
                response={"error": "Authentication failed"},
                status=500,
                headers={"Content-Type": "application/json"}
            )
    
    return wrapper

# Initialize auth service
auth_service = AuthService()