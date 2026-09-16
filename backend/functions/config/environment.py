"""Typed dotenv access shared by Firebase and standalone scripts."""
import json
import math
import os
from pathlib import Path
from dotenv import dotenv_values


def load_environment():
    root = Path(__file__).resolve().parents[1]
    values = dict(dotenv_values(root / '.env'))
    project = os.getenv('GCLOUD_PROJECT') or os.getenv('GOOGLE_CLOUD_PROJECT')
    if project:
        values.update(dotenv_values(root / f'.env.{project}'))
    if os.getenv('FUNCTIONS_EMULATOR', '').lower() == 'true':
        values.update(dotenv_values(root / '.env.local'))
    for key, value in values.items():
        if value is not None:
            os.environ.setdefault(key, value)


def env(name, value_type, *, allow_blank=False, integer_keys=False):
    """Read a required value; the schema supplies types, never fallback values."""
    raw = os.getenv(name)
    if raw is None or (not allow_blank and not raw.strip()):
        raise ValueError(f'Required environment variable {name} is missing or blank')
    try:
        if value_type is bool:
            if raw.lower() not in ('true', 'false'):
                raise ValueError()
            return raw.lower() == 'true'
        if value_type in (dict, list):
            result = json.loads(raw)
            if not isinstance(result, value_type):
                raise ValueError()
            if integer_keys:
                result = {int(k): v for k, v in result.items()}
            return result
        value = value_type(raw)
        if isinstance(value, (int, float)) and (not math.isfinite(value) or value < 0):
            raise ValueError()
        return value
    except (ValueError, TypeError):
        raise ValueError(f'Invalid environment variable {name}; expected {value_type.__name__}') from None


load_environment()
