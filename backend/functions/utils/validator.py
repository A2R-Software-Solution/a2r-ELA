import re
from typing import Dict, Any, Tuple, List
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
        if not essay_text or not essay_text.strip():
            return False, "Essay text cannot be empty"

        word_limits = settings.get_word_limits(category)
        min_words = word_limits["min"]
        max_words = word_limits["max"]

        word_count = EssayValidator.count_words(essay_text)

        if word_count < min_words:
            return False, f"Essay must be at least {min_words} words. Current: {word_count} words"

        if word_count > max_words:
            return False, f"Essay must not exceed {max_words} words. Current: {word_count} words"

        return True, ""

    @staticmethod
    def count_words(text: str) -> int:
        words = text.strip().split()
        words = [w for w in words if w]
        return len(words)

    @staticmethod
    def count_sentences(text: str) -> int:
        sentences = re.split(r'[.!?]+\s+', text.strip())
        if text.strip() and text.strip()[-1] in '.!?':
            pass
        sentences = [s.strip() for s in sentences if s.strip()]
        return len(sentences)

    @staticmethod
    def validate_category(category: str) -> Tuple[bool, str]:
        valid_categories = list(settings.ESSAY_CATEGORIES.keys())
        if category.lower() not in valid_categories:
            return False, f"Invalid category. Must be one of: {', '.join(valid_categories)}"
        return True, ""

    @staticmethod
    def sanitize_essay_text(text: str) -> str:
        text = re.sub(r'\s+', ' ', text)
        return text.strip()

    @staticmethod
    def validate_submission_data(data: Dict[str, Any]) -> Tuple[bool, str, Dict[str, Any]]:
        if "essay_text" not in data:
            return False, "Missing required field: essay_text", {}

        if "category" not in data:
            return False, "Missing required field: category", {}

        is_valid, error = EssayValidator.validate_category(data["category"])
        if not is_valid:
            return False, error, {}

        sanitized_text = EssayValidator.sanitize_essay_text(data["essay_text"])

        is_valid, error = EssayValidator.validate_essay_text(
            sanitized_text,
            data["category"]
        )
        if not is_valid:
            return False, error, {}

        sanitized_data = {
            "essay_text": sanitized_text,
            "category": data["category"].lower(),
            "word_count": EssayValidator.count_words(sanitized_text)
        }

        return True, "", sanitized_data


# Initialize validator (used by essay_routes.py)
essay_validator = EssayValidator()


# Standalone function (used by file_routes.py)
def validate_request_data(
    data: Dict[str, Any],
    required_fields: List[str]
) -> Dict[str, Any]:
    """
    Validate that all required fields are present and non-empty in request data.

    Args:
        data: The request data dictionary
        required_fields: List of field names that must be present

    Returns:
        Dictionary with 'valid' (bool) and 'message' (str) keys
    """
    for field in required_fields:
        if field not in data:
            return {
                "valid": False,
                "message": f"Missing required field: {field}"
            }
        if data[field] is None or (isinstance(data[field], str) and not data[field].strip()):
            return {
                "valid": False,
                "message": f"Field '{field}' cannot be empty"
            }
    return {"valid": True, "message": ""}