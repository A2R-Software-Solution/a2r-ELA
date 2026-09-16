from config.environment import env
from typing import Dict, Any, List

class Settings:
    """Application configuration settings"""
    GAME_XP_RULES = env("GAME_XP_RULES", dict)
    DETAIL_MAX_SCORE = env("DETAIL_MAX_SCORE", int)
    BOSS_BASE_XP = env("BOSS_BASE_XP", int)
    BOSS_PERSONAL_BEST_XP = env("BOSS_PERSONAL_BEST_XP", int)
    PSSA_AVAILABLE_GRADES = env("PSSA_AVAILABLE_GRADES", list)
    PSSA_DEFAULT_GRADE = env("PSSA_DEFAULT_GRADE", str)
    PSSA_DEFAULT_DOMAIN = env("PSSA_DEFAULT_DOMAIN", str)
    PSSA_DEFAULT_DIFFICULTY = env("PSSA_DEFAULT_DIFFICULTY", str)
    PSSA_DEFAULT_QUESTION_COUNT = env("PSSA_DEFAULT_QUESTION_COUNT", int)
    PSSA_MIN_QUESTIONS = env("PSSA_MIN_QUESTIONS", int)
    PSSA_MAX_QUESTIONS = env("PSSA_MAX_QUESTIONS", int)
    TEST_USER_ID = env("TEST_USER_ID", str)
    STREAK_BONUS_XP = env("STREAK_BONUS_XP", dict, integer_keys=True)
    SUGGESTION_THRESHOLD = env("SUGGESTION_THRESHOLD", int)
    
    NB_FUNCTION_REGION = env("NB_FUNCTION_REGION", str)
    NB_FUNCTION_TIMEOUT_SECONDS = env("NB_FUNCTION_TIMEOUT_SECONDS", int)
    NB_FUNCTION_MEMORY_MB = env("NB_FUNCTION_MEMORY_MB", int)
    NB_FUNCTION_MAX_INSTANCES = env("NB_FUNCTION_MAX_INSTANCES", int)
    CORS_ORIGINS = env("CORS_ORIGINS", list)
    MAX_FILE_SIZE = env("MAX_FILE_SIZE", int)
    MAX_PHOTO_SIZE = env("MAX_PHOTO_SIZE", int)
    COLLECTION_PSSA_CONTENT = env("COLLECTION_PSSA_CONTENT", str)
    PSSA_MAX_CONTENT_CHARS = env("PSSA_MAX_CONTENT_CHARS", int)
    LLM_CREATIVE_TEMPERATURE = env("LLM_CREATIVE_TEMPERATURE", float)
    VOCAB_TEMPERATURE = env("VOCAB_TEMPERATURE", float)
    VOCAB_MAX_TOKENS = env("VOCAB_MAX_TOKENS", int)
    GAME_MAX_TOKENS = env("GAME_MAX_TOKENS", int)
    LLM_REASONING_MIN_TOKENS = env("LLM_REASONING_MIN_TOKENS", int)
    PSSA_MAX_TOKENS = env("PSSA_MAX_TOKENS", int)
    PSSA_LARGE_MAX_TOKENS = env("PSSA_LARGE_MAX_TOKENS", int)
    PSSA_SMALL_MAX_TOKENS = env("PSSA_SMALL_MAX_TOKENS", int)
    PSSA_LARGE_QUESTION_THRESHOLD = env("PSSA_LARGE_QUESTION_THRESHOLD", int)
    SERVICE_NAME = env("SERVICE_NAME", str)
    SERVICE_VERSION = env("SERVICE_VERSION", str)

    # Groq Configuration
    GROQ_API_KEY: str = env("NB_GROQ_API_KEY", str)
    GROQ_BASE_URL: str = env("GROQ_BASE_URL", str).rstrip("/")
    GROQ_MODEL: str = env("GROQ_MODEL", str)
    
    # PSSA Groq Configuration (3 separate API keys/accounts for PSSA practice,
    # round-robined to avoid hitting any single org's TPM rate limit)
    PSSA_GROQ_API_KEY_1: str = env("PSSA_GROQ_API_KEY_1", str, allow_blank=True)
    PSSA_GROQ_API_KEY_2: str = env("PSSA_GROQ_API_KEY_2", str, allow_blank=True)
    PSSA_GROQ_API_KEY: str = env("PSSA_GROQ_API_KEY", str, allow_blank=True)
    PSSA_GROQ_MODEL: str = env("PSSA_GROQ_MODEL", str)
    
    # Essay Validation
    MIN_WORDS: int = env("MIN_WORDS", int)
    MAX_WORDS: int = env("MAX_WORDS", int)
    
    # Essay Categories with word limits
    ESSAY_CATEGORIES: Dict[str, Dict[str, int]] = env("ESSAY_CATEGORIES", dict)

    # -------------------------------------------------------------------------
    # PSSA Rubric Configuration
    # Replaces old generic RUBRIC_CATEGORIES
    # 5 official PSSA Writing Assessment domains scored 1-4 each
    # Raw total: 5-20, Converted total: 25-100 (multiply by 5)
    # -------------------------------------------------------------------------
    PSSA_DOMAINS: List[str] = env("PSSA_DOMAINS", list)

    # Keep old name as alias so existing code doesn't break immediately
    # TODO: migrate all references from RUBRIC_CATEGORIES to PSSA_DOMAINS
    RUBRIC_CATEGORIES: List[str] = PSSA_DOMAINS

    # PSSA scoring scale
    PSSA_MAX_RAW_PER_DOMAIN: int = env("PSSA_MAX_RAW_PER_DOMAIN", int)
    PSSA_MIN_RAW_PER_DOMAIN: int = env("PSSA_MIN_RAW_PER_DOMAIN", int)
    PSSA_NUM_DOMAINS: int = env("PSSA_NUM_DOMAINS", int)
    PSSA_MAX_RAW_TOTAL: int = env("PSSA_MAX_RAW_TOTAL", int)        # 5 domains × 4
    PSSA_CONVERSION_MULTIPLIER: int = env("PSSA_CONVERSION_MULTIPLIER", int)  # raw × 5 = 100-point scale
    PSSA_MAX_CONVERTED_TOTAL: int = env("PSSA_MAX_CONVERTED_TOTAL", int)

    # -------------------------------------------------------------------------
    # State / Grade Configuration
    # -------------------------------------------------------------------------
    SUPPORTED_STATES: List[str] = env("SUPPORTED_STATES", list)

    SUPPORTED_GRADES: List[str] = env("SUPPORTED_GRADES", list)

    # Display labels for frontend dropdown
    GRADE_DISPLAY_LABELS: Dict[str, str] = env("GRADE_DISPLAY_LABELS", dict)

    STATE_DISPLAY_LABELS: Dict[str, str] = env("STATE_DISPLAY_LABELS", dict)

    # Default state and grade (used as fallback if not set by user)
    DEFAULT_STATE: str = env("DEFAULT_STATE", str)
    DEFAULT_GRADE: str = env("DEFAULT_GRADE", str)

    # -------------------------------------------------------------------------
    # Scoring Configuration
    # -------------------------------------------------------------------------
    MAX_SCORE: int = env("MAX_SCORE", int)

    # Grade letter thresholds (unchanged)
    GRADE_THRESHOLDS: Dict[str, int] = env("GRADE_THRESHOLDS", dict)

    # -------------------------------------------------------------------------
    # Progress Tracking
    # -------------------------------------------------------------------------
    MAX_STREAK_DAYS: int = env("MAX_STREAK_DAYS", int)
    STREAK_TIMEZONE: str = env("STREAK_TIMEZONE", str)

    # -------------------------------------------------------------------------
    # Firestore Collections
    # -------------------------------------------------------------------------
    COLLECTION_USERS: str = env("COLLECTION_USERS", str)
    COLLECTION_USER_PROGRESS: str = env("COLLECTION_USER_PROGRESS", str)
    COLLECTION_ESSAY_SUBMISSIONS: str = env("COLLECTION_ESSAY_SUBMISSIONS", str)
    COLLECTION_USER_PREFERENCES: str = env("COLLECTION_USER_PREFERENCES", str)   # NEW — stores state/grade
    COLLECTION_GAMIFICATION: str = env("COLLECTION_GAMIFICATION", str)      # NEW — stores XP, level, rewards history
    
    # -------------------------------------------------------------------------
    # Gamification — XP & Levels
    # -------------------------------------------------------------------------
    LEVEL_THRESHOLDS: Dict[int, tuple] = env("LEVEL_THRESHOLDS", dict, integer_keys=True)

    XP_VALUES: Dict[str, int] = env("XP_VALUES", dict)

    # -------------------------------------------------------------------------
    # LLM Configuration
    # -------------------------------------------------------------------------
    LLM_TEMPERATURE: float = env("LLM_TEMPERATURE", float)
    LLM_MAX_TOKENS: int = env("LLM_MAX_TOKENS", int)
    LLM_TIMEOUT: int = env("LLM_TIMEOUT", int)  # seconds per individual Groq call

    # -------------------------------------------------------------------------
    # Environment
    # -------------------------------------------------------------------------
    ENVIRONMENT: str = env("ENVIRONMENT", str)
    DEBUG: bool = env("NB_DEBUG", bool)

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
        from config.validation import validate
        validate(cls)
        if not cls.GROQ_API_KEY:
            raise ValueError("NB_GROQ_API_KEY environment variable is required")
        for i, key in enumerate([cls.PSSA_GROQ_API_KEY_1, cls.PSSA_GROQ_API_KEY_2, cls.PSSA_GROQ_API_KEY], start=1):
            if not key:
                print(f"Warning: PSSA_GROQ_API_KEY_{i} not set — PSSA round-robin will have fewer keys to rotate")
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
