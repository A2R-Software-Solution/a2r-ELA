import os
from typing import Dict, Any, List

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

    # -------------------------------------------------------------------------
    # PSSA Rubric Configuration
    # Replaces old generic RUBRIC_CATEGORIES
    # 5 official PSSA Writing Assessment domains scored 1-4 each
    # Raw total: 5-20, Converted total: 25-100 (multiply by 5)
    # -------------------------------------------------------------------------
    PSSA_DOMAINS: List[str] = [
        "focus",
        "content",
        "organization",
        "style",
        "conventions",
    ]

    # Keep old name as alias so existing code doesn't break immediately
    # TODO: migrate all references from RUBRIC_CATEGORIES to PSSA_DOMAINS
    RUBRIC_CATEGORIES: List[str] = PSSA_DOMAINS

    # PSSA scoring scale
    PSSA_MAX_RAW_PER_DOMAIN: int = 4
    PSSA_MIN_RAW_PER_DOMAIN: int = 1
    PSSA_NUM_DOMAINS: int = 5
    PSSA_MAX_RAW_TOTAL: int = 20        # 5 domains × 4
    PSSA_CONVERSION_MULTIPLIER: int = 5  # raw × 5 = 100-point scale
    PSSA_MAX_CONVERTED_TOTAL: int = 100

    # -------------------------------------------------------------------------
    # State / Grade Configuration
    # -------------------------------------------------------------------------
    SUPPORTED_STATES: List[str] = ["PA"]

    SUPPORTED_GRADES: List[str] = [
        "prek", "k",
        "1", "2", "3", "4", "5",
        "6", "7", "8",
        "9", "10", "11", "12",
    ]

    # Display labels for frontend dropdown
    GRADE_DISPLAY_LABELS: Dict[str, str] = {
        "prek": "Pre-K",
        "k":    "Kindergarten",
        "1":    "Grade 1",
        "2":    "Grade 2",
        "3":    "Grade 3",
        "4":    "Grade 4",
        "5":    "Grade 5",
        "6":    "Grade 6",
        "7":    "Grade 7",
        "8":    "Grade 8",
        "9":    "Grade 9",
        "10":   "Grade 10",
        "11":   "Grade 11",
        "12":   "Grade 12",
    }

    STATE_DISPLAY_LABELS: Dict[str, str] = {
        "PA": "Pennsylvania",
    }

    # Default state and grade (used as fallback if not set by user)
    DEFAULT_STATE: str = "PA"
    DEFAULT_GRADE: str = "6"

    # -------------------------------------------------------------------------
    # Scoring Configuration
    # -------------------------------------------------------------------------
    MAX_SCORE: int = 100

    # Grade letter thresholds (unchanged)
    GRADE_THRESHOLDS: Dict[str, int] = {
        "A": 90,
        "B": 80,
        "C": 70,
        "D": 60,
    }

    # -------------------------------------------------------------------------
    # Progress Tracking
    # -------------------------------------------------------------------------
    MAX_STREAK_DAYS: int = 365
    STREAK_TIMEZONE: str = "UTC"

    # -------------------------------------------------------------------------
    # Firestore Collections
    # -------------------------------------------------------------------------
    COLLECTION_USERS: str = "users"
    COLLECTION_USER_PROGRESS: str = "user_progress"
    COLLECTION_ESSAY_SUBMISSIONS: str = "essay_submissions"
    COLLECTION_USER_PREFERENCES: str = "user_preferences"   # NEW — stores state/grade
    COLLECTION_GAMIFICATION: str = "gamification"      # NEW — stores XP, level, rewards history
    
    # -------------------------------------------------------------------------
    # Gamification — XP & Levels
    # -------------------------------------------------------------------------
    LEVEL_THRESHOLDS: Dict[int, tuple] = {
        1: (0,     999,   "Beginner Writer"),
        2: (1000,  4999,  "Word Explorer"),
        3: (5000,  14999, "Story Builder"),
        4: (15000, 29999, "Essay Master"),
        5: (30000, 99999, "Writing Legend"),
    }

    XP_VALUES: Dict[str, int] = {
        "essay_base":     50,
        "domain_perfect": 25,
        "streak_daily":   10,
        "streak_7_day":   150,
        "streak_30_day":  500,
    }

    # -------------------------------------------------------------------------
    # LLM Configuration
    # -------------------------------------------------------------------------
    LLM_TEMPERATURE: float = 0.3
    LLM_MAX_TOKENS: int = 1500
    LLM_TIMEOUT: int = 60  # seconds

    # -------------------------------------------------------------------------
    # Environment
    # -------------------------------------------------------------------------
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "False").lower() == "true"

    # -------------------------------------------------------------------------
    # Class methods
    # -------------------------------------------------------------------------
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

    @classmethod
    def is_valid_state(cls, state: str) -> bool:
        """Check if a state code is supported"""
        return state.upper().strip() in cls.SUPPORTED_STATES

    @classmethod
    def is_valid_grade(cls, grade: str) -> bool:
        """Check if a grade string is supported"""
        return grade.lower().strip() in cls.SUPPORTED_GRADES

    @classmethod
    def get_grade_display(cls, grade: str) -> str:
        """Get human-readable grade label"""
        return cls.GRADE_DISPLAY_LABELS.get(grade.lower(), f"Grade {grade}")

    @classmethod
    def get_state_display(cls, state: str) -> str:
        """Get human-readable state label"""
        return cls.STATE_DISPLAY_LABELS.get(state.upper(), state)

    @classmethod
    def convert_pssa_to_100(cls, pssa_total: int) -> int:
        """Convert raw PSSA total (0-20) to 100-point scale"""
        return min(pssa_total * cls.PSSA_CONVERSION_MULTIPLIER, cls.MAX_SCORE)


# Initialize settings
settings = Settings()