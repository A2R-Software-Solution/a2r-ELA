import os
from typing import Dict, Any

class Settings:
    """Application configuration settings"""
    
    # OpenRouter Configuration
    OPENROUTER_API_KEY: str = os.getenv("OPENROUTER_API_KEY", "")
    OPENROUTER_BASE_URL: str = "https://openrouter.ai/api/v1"
    OPENROUTER_MODEL: str = "google/gemma-3n-e4b-it:free"
    
    # Essay Validation
    MIN_WORDS: int = 50
    MAX_WORDS: int = 500
    
    # Essay Categories with word limits
    ESSAY_CATEGORIES: Dict[str, Dict[str, int]] = {
        "essay_writing": {"min": 50, "max": 500},
        "ela": {"min": 50, "max": 400},
        "math": {"min": 30, "max": 300},
        "science": {"min": 50, "max": 450}
    }
    
    # Scoring Configuration
    MAX_SCORE: int = 100
    RUBRIC_CATEGORIES: list = [
        "content_and_ideas",
        "organization_and_structure",
        "language_and_vocabulary",
        "grammar_and_mechanics",
        "coherence_and_clarity"
    ]
    POINTS_PER_RUBRIC: int = 20
    
    # Progress Tracking
    MAX_STREAK_DAYS: int = 365
    STREAK_TIMEZONE: str = "UTC"
    
    # Firestore Collections
    COLLECTION_USERS: str = "users"
    COLLECTION_USER_PROGRESS: str = "user_progress"
    COLLECTION_ESSAY_SUBMISSIONS: str = "essay_submissions"
    
    # LLM Configuration
    LLM_TEMPERATURE: float = 0.3
    LLM_MAX_TOKENS: int = 1500
    LLM_TIMEOUT: int = 60  # seconds
    
    # Environment
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"
    
    @classmethod
    def get_word_limits(cls, category: str) -> Dict[str, int]:
        """Get word limits for a specific category"""
        return cls.ESSAY_CATEGORIES.get(
            category.lower(), 
            {"min": cls.MIN_WORDS, "max": cls.MAX_WORDS}
        )
    
    @classmethod
    def validate_config(cls) -> bool:
        """Validate that required configuration is present"""
        if not cls.OPENROUTER_API_KEY:
            raise ValueError("OPENROUTER_API_KEY environment variable is required")
        return True

# Initialize settings
settings = Settings()