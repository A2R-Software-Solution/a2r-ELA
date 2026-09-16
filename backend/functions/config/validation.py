"""Validate relationships and shapes without supplying configuration defaults."""
from dateutil.tz import gettz
from urllib.parse import urlparse


def validate(settings):
    def check(condition, name):
        if not condition:
            raise ValueError(f'Invalid configuration: {name}')

    for name in ('SUPPORTED_GRADES', 'SUPPORTED_STATES', 'PSSA_DOMAINS', 'PSSA_AVAILABLE_GRADES', 'CORS_ORIGINS'):
        value = getattr(settings, name)
        check(isinstance(value, list) and bool(value) and all(isinstance(x, str) and x.strip() for x in value), name)
    check(settings.DEFAULT_STATE in settings.SUPPORTED_STATES, 'DEFAULT_STATE')
    check(settings.DEFAULT_GRADE in settings.SUPPORTED_GRADES, 'DEFAULT_GRADE')
    check(settings.PSSA_DEFAULT_GRADE in settings.PSSA_AVAILABLE_GRADES, 'PSSA_DEFAULT_GRADE')
    check(set(settings.PSSA_AVAILABLE_GRADES).issubset(settings.SUPPORTED_GRADES), 'PSSA_AVAILABLE_GRADES')
    check(settings.PSSA_MIN_QUESTIONS <= settings.PSSA_DEFAULT_QUESTION_COUNT <= settings.PSSA_MAX_QUESTIONS, 'PSSA question limits')
    check(settings.PSSA_DEFAULT_DIFFICULTY in ('easy', 'medium', 'hard'), 'PSSA_DEFAULT_DIFFICULTY')
    check(settings.MIN_WORDS <= settings.MAX_WORDS, 'MIN_WORDS/MAX_WORDS')
    for name in ('LLM_TIMEOUT', 'LLM_MAX_TOKENS', 'MAX_FILE_SIZE', 'MAX_PHOTO_SIZE', 'MAX_STREAK_DAYS', 'MAX_SCORE', 'NB_FUNCTION_TIMEOUT_SECONDS', 'DETAIL_MAX_SCORE'):
        check(type(getattr(settings, name)) is int and getattr(settings, name) > 0, name)
    for name in ('LLM_TEMPERATURE', 'LLM_CREATIVE_TEMPERATURE', 'VOCAB_TEMPERATURE'):
        check(0 <= getattr(settings, name) <= 2, name)
    check(settings.NB_FUNCTION_MEMORY_MB in (128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768), 'NB_FUNCTION_MEMORY_MB')
    check(settings.NB_FUNCTION_TIMEOUT_SECONDS <= 3600, 'NB_FUNCTION_TIMEOUT_SECONDS')
    # Firestore's document size is a platform limit, not an application default.
    check(settings.MAX_PHOTO_SIZE < 1048576, 'MAX_PHOTO_SIZE must leave room within the Firestore document limit')
    for category, limits in settings.ESSAY_CATEGORIES.items():
        check(isinstance(limits, dict) and set(limits) == {'min', 'max'}, f'ESSAY_CATEGORIES.{category}')
        check(all(type(v) is int and v >= 0 for v in limits.values()) and limits['min'] <= limits['max'], f'ESSAY_CATEGORIES.{category}')
    check(bool(settings.LEVEL_THRESHOLDS), 'LEVEL_THRESHOLDS')
    previous = None
    for key, value in sorted(settings.LEVEL_THRESHOLDS.items()):
        check(isinstance(value, (list, tuple)) and len(value) == 3, 'LEVEL_THRESHOLDS entries')
        low, high, label = value
        check(type(low) is int and type(high) is int and 0 <= low <= high and isinstance(label, str) and bool(label), 'LEVEL_THRESHOLDS ranges')
        check(previous is None and low == 0 or previous is not None and low == previous + 1, 'LEVEL_THRESHOLDS must be contiguous from zero')
        previous = high
    check(settings.PSSA_NUM_DOMAINS == len(settings.PSSA_DOMAINS), 'PSSA_NUM_DOMAINS')
    check(settings.PSSA_MAX_RAW_TOTAL == settings.PSSA_NUM_DOMAINS * settings.PSSA_MAX_RAW_PER_DOMAIN, 'PSSA_MAX_RAW_TOTAL')
    check(settings.PSSA_MAX_CONVERTED_TOTAL == settings.PSSA_MAX_RAW_TOTAL * settings.PSSA_CONVERSION_MULTIPLIER, 'PSSA_MAX_CONVERTED_TOTAL')
    check(settings.PSSA_MAX_CONVERTED_TOTAL == settings.MAX_SCORE, 'MAX_SCORE')
    for name, required_keys in (
        ('XP_VALUES', {'essay_base', 'domain_perfect'}),
        ('GAME_XP_RULES', {'base', 'bonus', 'high_score', 'perfect_score', 'perfect_lives', 'jumbled_speed_seconds', 'topic_speed_seconds'}),
    ):
        data = getattr(settings, name)
        check(required_keys.issubset(data) and all(type(v) is int and v >= 0 for v in data.values()), name)
    for name in ('GRADE_DISPLAY_LABELS', 'STATE_DISPLAY_LABELS'):
        check(all(isinstance(k, str) and isinstance(v, str) for k, v in getattr(settings, name).items()), name)
    for name in ('GRADE_THRESHOLDS', 'STREAK_BONUS_XP'):
        check(all(type(v) is int and v >= 0 for v in getattr(settings, name).values()), name)
    for name in dir(settings):
        if name.startswith('COLLECTION_'):
            value = getattr(settings, name)
            check(bool(value) and '/' not in value, name)
    parsed = urlparse(settings.GROQ_BASE_URL)
    check(parsed.scheme in ('http', 'https') and bool(parsed.netloc) and not parsed.username and not parsed.password, 'GROQ_BASE_URL')
    try:
        check(gettz(settings.STREAK_TIMEZONE) is not None, 'STREAK_TIMEZONE')
    except Exception:
        raise ValueError('Invalid configuration: STREAK_TIMEZONE') from None
