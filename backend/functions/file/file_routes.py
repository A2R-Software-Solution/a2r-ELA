"""
File Routes
API endpoints for file operations
"""

from firebase_functions import https_fn
from firebase_admin import auth
import logging
from typing import Any
from file.file_service import FileService
from utils.responses import success_response, error_response
from utils.validator import validate_request_data

logger = logging.getLogger(__name__)


@https_fn.on_request()
def extract_pdf_text(req: https_fn.Request) -> https_fn.Response:
    """
    Extract text from a PDF file
    
    Request body:
    {
        "fileName": "document.pdf",
        "fileData": "base64_encoded_pdf_data"
    }
    
    Response:
    {
        "success": true,
        "data": {
            "success": true,
            "text": "extracted text content",
            "wordCount": 450
        }
    }
    """
    # Handle CORS preflight
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    # Set CORS headers for actual request
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        # Only allow POST requests
        if req.method != 'POST':
            return error_response(
                'Method not allowed. Use POST.',
                status_code=405,
                headers=headers
            )
        
        # Get request data
        request_json = req.get_json(silent=True)
        
        if not request_json:
            return error_response(
                'Invalid request body. JSON expected.',
                status_code=400,
                headers=headers
            )
        
        # Validate required fields
        validation_result = validate_request_data(
            request_json,
            required_fields=['fileName', 'fileData']
        )
        
        if not validation_result['valid']:
            return error_response(
                validation_result['message'],
                status_code=400,
                headers=headers
            )
        
        file_name = request_json.get('fileName')
        file_data = request_json.get('fileData')
        
        logger.info(f"Received PDF text extraction request for file: {file_name}")
        
        # Validate file data
        validation = FileService.validate_file_data(file_name, file_data)
        
        if not validation['valid']:
            logger.warning(f"File validation failed for {file_name}: {validation['error']}")
            return error_response(
                validation['error'],
                status_code=400,
                headers=headers
            )
        
        # Extract text from PDF
        result = FileService.extract_text_from_pdf(file_data, file_name)
        
        if result['success']:
            logger.info(f"Successfully extracted text from {file_name}: {result['wordCount']} words")
            return success_response(
                data=result,
                message='Text extracted successfully',
                headers=headers
            )
        else:
            logger.error(f"Failed to extract text from {file_name}: {result['error']}")
            return error_response(
                result['error'],
                status_code=422,
                headers=headers
            )
            
    except Exception as e:
        logger.error(f"Unexpected error in extract_pdf_text: {str(e)}")
        return error_response(
            'An unexpected error occurred while processing the PDF',
            status_code=500,
            headers=headers
        )


@https_fn.on_request()
def extract_pdf_text_authenticated(req: https_fn.Request) -> https_fn.Response:
    """
    Extract text from a PDF file (authenticated version)
    Requires Firebase Authentication token
    
    Same as extract_pdf_text but requires authentication
    """
    # Handle CORS preflight
    if req.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)
    
    # Set CORS headers
    headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
    
    try:
        # Verify Firebase Auth token
        authorization_header = req.headers.get('Authorization')
        
        if not authorization_header or not authorization_header.startswith('Bearer '):
            return error_response(
                'Unauthorized. Please provide a valid authentication token.',
                status_code=401,
                headers=headers
            )
        
        id_token = authorization_header.split('Bearer ')[1]
        
        try:
            # Verify the token
            decoded_token = auth.verify_id_token(id_token)
            user_id = decoded_token['uid']
            logger.info(f"Authenticated request from user: {user_id}")
            
        except Exception as auth_error:
            logger.warning(f"Authentication failed: {str(auth_error)}")
            return error_response(
                'Invalid authentication token',
                status_code=401,
                headers=headers
            )
        
        # Only allow POST requests
        if req.method != 'POST':
            return error_response(
                'Method not allowed. Use POST.',
                status_code=405,
                headers=headers
            )
        
        # Get request data
        request_json = req.get_json(silent=True)
        
        if not request_json:
            return error_response(
                'Invalid request body. JSON expected.',
                status_code=400,
                headers=headers
            )
        
        # Validate required fields
        validation_result = validate_request_data(
            request_json,
            required_fields=['fileName', 'fileData']
        )
        
        if not validation_result['valid']:
            return error_response(
                validation_result['message'],
                status_code=400,
                headers=headers
            )
        
        file_name = request_json.get('fileName')
        file_data = request_json.get('fileData')
        
        logger.info(f"User {user_id} requested PDF text extraction for: {file_name}")
        
        # Validate file data
        validation = FileService.validate_file_data(file_name, file_data)
        
        if not validation['valid']:
            logger.warning(f"File validation failed for {file_name}: {validation['error']}")
            return error_response(
                validation['error'],
                status_code=400,
                headers=headers
            )
        
        # Extract text from PDF
        result = FileService.extract_text_from_pdf(file_data, file_name)
        
        if result['success']:
            logger.info(f"Successfully extracted text from {file_name} for user {user_id}: {result['wordCount']} words")
            return success_response(
                data=result,
                message='Text extracted successfully',
                headers=headers
            )
        else:
            logger.error(f"Failed to extract text from {file_name}: {result['error']}")
            return error_response(
                result['error'],
                status_code=422,
                headers=headers
            )
            
    except Exception as e:
        logger.error(f"Unexpected error in extract_pdf_text_authenticated: {str(e)}")
        return error_response(
            'An unexpected error occurred while processing the PDF',
            status_code=500,
            headers=headers
        )