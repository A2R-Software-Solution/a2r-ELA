"""
File Service
Handles PDF text extraction and file processing
"""

import base64
import logging
from typing import Dict, Any
from PyPDF2 import PdfReader
from io import BytesIO

logger = logging.getLogger(__name__)


class FileService:
    """Service for file operations including PDF text extraction"""

    MAX_FILE_SIZE = 100 * 1024  # 100KB in bytes
    ALLOWED_MIME_TYPES = ['application/pdf']

    @staticmethod
    def extract_text_from_pdf(file_data: str, file_name: str) -> Dict[str, Any]:
        """
        Extract text from a base64-encoded PDF file
        
        Args:
            file_data: Base64-encoded PDF file data
            file_name: Name of the PDF file
            
        Returns:
            Dictionary with success status, extracted text, and word count
        """
        try:
            # Decode base64 data
            pdf_bytes = base64.b64decode(file_data)
            
            # Validate file size
            file_size = len(pdf_bytes)
            if file_size > FileService.MAX_FILE_SIZE:
                return {
                    'success': False,
                    'text': '',
                    'wordCount': 0,
                    'error': f'File size ({file_size} bytes) exceeds maximum allowed size ({FileService.MAX_FILE_SIZE} bytes)'
                }
            
            # Create PDF reader from bytes
            pdf_file = BytesIO(pdf_bytes)
            pdf_reader = PdfReader(pdf_file)
            
            # Extract text from all pages
            extracted_text = ""
            for page_num, page in enumerate(pdf_reader.pages):
                try:
                    page_text = page.extract_text()
                    if page_text:
                        extracted_text += page_text + "\n"
                except Exception as page_error:
                    logger.warning(f"Error extracting text from page {page_num} of {file_name}: {str(page_error)}")
                    continue
            
            # Clean up the extracted text
            cleaned_text = FileService._clean_text(extracted_text)
            
            # Check if any text was extracted
            if not cleaned_text or cleaned_text.strip() == "":
                return {
                    'success': False,
                    'text': '',
                    'wordCount': 0,
                    'error': 'No text could be extracted from the PDF. The file may be scanned or image-based.'
                }
            
            # Count words
            word_count = len(cleaned_text.split())
            
            logger.info(f"Successfully extracted {word_count} words from {file_name}")
            
            return {
                'success': True,
                'text': cleaned_text,
                'wordCount': word_count,
                'error': None
            }
            
        except base64.binascii.Error as b64_error:
            logger.error(f"Base64 decoding error for {file_name}: {str(b64_error)}")
            return {
                'success': False,
                'text': '',
                'wordCount': 0,
                'error': 'Invalid file data. File may be corrupted.'
            }
            
        except Exception as e:
            logger.error(f"Error extracting text from PDF {file_name}: {str(e)}")
            return {
                'success': False,
                'text': '',
                'wordCount': 0,
                'error': f'Failed to extract text from PDF: {str(e)}'
            }

    @staticmethod
    def _clean_text(text: str) -> str:
        """
        Clean extracted text by removing excessive whitespace and formatting
        
        Args:
            text: Raw extracted text
            
        Returns:
            Cleaned text
        """
        if not text:
            return ""
        
        # Replace multiple spaces with single space
        cleaned = ' '.join(text.split())
        
        # Replace multiple newlines with double newline
        lines = cleaned.split('\n')
        cleaned_lines = [line.strip() for line in lines if line.strip()]
        cleaned = '\n\n'.join(cleaned_lines)
        
        return cleaned.strip()

    @staticmethod
    def validate_file_data(file_name: str, file_data: str) -> Dict[str, Any]:
        """
        Validate file before processing
        
        Args:
            file_name: Name of the file
            file_data: Base64-encoded file data
            
        Returns:
            Dictionary with validation result
        """
        # Check file name
        if not file_name or not file_name.lower().endswith('.pdf'):
            return {
                'valid': False,
                'error': 'Only PDF files are supported'
            }
        
        # Check if data is provided
        if not file_data:
            return {
                'valid': False,
                'error': 'No file data provided'
            }
        
        # Try to decode base64 to check validity
        try:
            decoded_data = base64.b64decode(file_data)
            
            # Check file size
            if len(decoded_data) > FileService.MAX_FILE_SIZE:
                return {
                    'valid': False,
                    'error': f'File size exceeds {FileService.MAX_FILE_SIZE // 1024}KB limit'
                }
                
        except Exception as e:
            return {
                'valid': False,
                'error': f'Invalid file data: {str(e)}'
            }
        
        return {
            'valid': True,
            'error': None
        }