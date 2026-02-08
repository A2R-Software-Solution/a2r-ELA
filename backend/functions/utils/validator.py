import re
from typing import Dict, Any, Tuple
from config.settings import settings

class EssayValidator:
    """Validation utilities for essay submissions"""
    
    @staticmethod
    def validate_essay_text(essay_text: str, category: str = "essay_writing") -> Tuple[bool, str]:
        """
        Validate essay text
        
        Args:
            essay_text: The essay content
            category: Essay category
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        # Check if essay is empty
        if not essay_text or not essay_text.strip():
            return False, "Essay text cannot be empty"
        
        # Get word limits for category
        word_limits = settings.get_word_limits(category)
        min_words = word_limits["min"]
        max_words = word_limits["max"]
        
        # Count words
        word_count = EssayValidator.count_words(essay_text)
        
        # Validate word count
        if word_count < min_words:
            return False, f"Essay must be at least {min_words} words. Current: {word_count} words"
        
        if word_count > max_words:
            return False, f"Essay must not exceed {max_words} words. Current: {word_count} words"
        
        # REMOVED: Sentence check - too strict for now
        # sentences = EssayValidator.count_sentences(essay_text)
        # if sentences < 3:
        #     return False, "Essay must contain at least 3 sentences"
        
        return True, ""
    
    @staticmethod
    def count_words(text: str) -> int:
        """
        Count words in text
        
        Args:
            text: Text to count
            
        Returns:
            Word count
        """
        # Remove extra whitespace and split
        words = text.strip().split()
        # Filter out empty strings
        words = [w for w in words if w]
        return len(words)
    
    @staticmethod
    def count_sentences(text: str) -> int:
        """
        Count sentences in text - IMPROVED
        
        Args:
            text: Text to analyze
            
        Returns:
            Sentence count
        """
        # Split by common sentence endings, including variations
        # This regex looks for . ! ? followed by space or end of string
        sentences = re.split(r'[.!?]+\s+', text.strip())
        # Also handle last sentence that might not have trailing space
        if text.strip() and text.strip()[-1] in '.!?':
            # Already counted
            pass
        # Filter out empty strings and whitespace
        sentences = [s.strip() for s in sentences if s.strip()]
        return len(sentences)
    
    @staticmethod
    def validate_category(category: str) -> Tuple[bool, str]:
        """
        Validate essay category
        
        Args:
            category: Category name
            
        Returns:
            Tuple of (is_valid, error_message)
        """
        valid_categories = list(settings.ESSAY_CATEGORIES.keys())
        
        if category.lower() not in valid_categories:
            return False, f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        
        return True, ""
    
    @staticmethod
    def sanitize_essay_text(text: str) -> str:
        """
        Sanitize essay text
        
        Args:
            text: Raw essay text
            
        Returns:
            Sanitized text
        """
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove leading/trailing whitespace
        text = text.strip()
        return text
    
    @staticmethod
    def validate_submission_data(data: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
        """
        Validate complete essay submission data
        
        Args:
            data: Submission data dictionary
            
        Returns:
            Tuple of (is_valid, error_message, sanitized_data)
        """
        # Check required fields
        if "essay_text" not in data:
            return False, "Missing required field: essay_text", {}
        
        if "category" not in data:
            return False, "Missing required field: category", {}
        
        # Validate category
        is_valid, error = EssayValidator.validate_category(data["category"])
        if not is_valid:
            return False, error, {}
        
        # Sanitize essay text
        sanitized_text = EssayValidator.sanitize_essay_text(data["essay_text"])
        
        # Validate essay text
        is_valid, error = EssayValidator.validate_essay_text(
            sanitized_text, 
            data["category"]
        )
        if not is_valid:
            return False, error, {}
        
        # Build sanitized data
        sanitized_data = {
            "essay_text": sanitized_text,
            "category": data["category"].lower(),
            "word_count": EssayValidator.count_words(sanitized_text)
        }
        
        return True, "", sanitized_data

# Initialize validator
essay_validator = EssayValidator()