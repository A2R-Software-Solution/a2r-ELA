import json
from typing import Any, Dict
from firebase_functions import https_fn

class ResponseBuilder:
    """Utility for building standardized API responses"""
    
    @staticmethod
    def success(
        data: Any = None,
        message: str = "Success",
        status: int = 200
    ) -> https_fn.Response:
        """
        Build success response
        
        Args:
            data: Response data
            message: Success message
            status: HTTP status code
            
        Returns:
            Firebase HTTPS Response
        """
        response_body = {
            "success": True,
            "message": message,
            "data": data
        }
        
        return https_fn.Response(
            response=json.dumps(response_body),
            status=status,
            headers={
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        )
    
    @staticmethod
    def error(
        error: str,
        status: int = 400,
        details: Dict[str, Any] = None
    ) -> https_fn.Response:
        """
        Build error response
        
        Args:
            error: Error message
            status: HTTP status code
            details: Additional error details
            
        Returns:
            Firebase HTTPS Response
        """
        response_body = {
            "success": False,
            "error": error
        }
        
        if details:
            response_body["details"] = details
        
        return https_fn.Response(
            response=json.dumps(response_body),
            status=status,
            headers={
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        )
    
    @staticmethod
    def validation_error(error: str) -> https_fn.Response:
        """Build validation error response"""
        return ResponseBuilder.error(error, status=400)
    
    @staticmethod
    def unauthorized(error: str = "Unauthorized") -> https_fn.Response:
        """Build unauthorized error response"""
        return ResponseBuilder.error(error, status=401)
    
    @staticmethod
    def not_found(error: str = "Resource not found") -> https_fn.Response:
        """Build not found error response"""
        return ResponseBuilder.error(error, status=404)
    
    @staticmethod
    def internal_error(error: str = "Internal server error") -> https_fn.Response:
        """Build internal server error response"""
        return ResponseBuilder.error(error, status=500)

# Initialize response builder
response_builder = ResponseBuilder()