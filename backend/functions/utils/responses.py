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
        return ResponseBuilder.error(error, status=400)

    @staticmethod
    def unauthorized(error: str = "Unauthorized") -> https_fn.Response:
        return ResponseBuilder.error(error, status=401)

    @staticmethod
    def not_found(error: str = "Resource not found") -> https_fn.Response:
        return ResponseBuilder.error(error, status=404)

    @staticmethod
    def internal_error(error: str = "Internal server error") -> https_fn.Response:
        return ResponseBuilder.error(error, status=500)


# Initialize response builder (used by essay_routes.py)
response_builder = ResponseBuilder()


# Standalone functions (used by file_routes.py)
# These support an extra `headers` parameter for per-request CORS headers

def success_response(
    data: Any = None,
    message: str = "Success",
    status: int = 200,
    headers: Dict[str, str] = None
) -> https_fn.Response:
    """Standalone success response with optional headers override"""
    response_body = {
        "success": True,
        "message": message,
        "data": data
    }
    merged_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
    if headers:
        merged_headers.update(headers)
    return https_fn.Response(
        response=json.dumps(response_body),
        status=status,
        headers=merged_headers
    )


def error_response(
    error: str = "An error occurred",
    status_code: int = 400,
    headers: Dict[str, str] = None,
    details: Dict[str, Any] = None
) -> https_fn.Response:
    """Standalone error response with optional headers override"""
    response_body = {
        "success": False,
        "error": error
    }
    if details:
        response_body["details"] = details
    merged_headers = {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
    }
    if headers:
        merged_headers.update(headers)
    return https_fn.Response(
        response=json.dumps(response_body),
        status=status_code,
        headers=merged_headers
    )