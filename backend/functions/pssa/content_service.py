"""
pssa/content_service.py
-----------------------
Fetches grade-specific PSSA ELA content from Firestore.
Uses an in-memory cache so Firestore is only hit once per
grade per cold start — subsequent requests are served instantly.

Usage:
    from pssa.content_service import content_service

    grade_content = content_service.get_content("3")  # returns str
"""

from firebase_admin import firestore
from config.settings import settings

# ── Firestore collection name (must match seed_content.py) ───────────────────
_COLLECTION = "pssa_content"

# ── In-memory cache  { "3": "...content...", "4": "...content..." } ──────────
# Resets on every Firebase Function cold start — acceptable because content
# rarely changes and Firestore reads are fast.
_cache: dict[str, str] = {}

# ── Max characters injected into the LLM prompt ───────────────────────────────
# Groq has a strict per-request token limit (TPM). The raw seeded content can be
# very long (full PDF text), which was overflowing the prompt and causing a
# 413 "Request Entity Too Large" error from Groq → surfaced as a 500 to the app.
# ~4 chars/token is a safe rule of thumb, so this keeps grade_content comfortably
# within budget even after adding STATIC_FORMAT_RULES + instructions on top.
_MAX_CONTENT_CHARS = 6000


class PssaContentService:
    """
    Service for retrieving grade-specific PSSA ELA reference content.
    All public methods are intentionally synchronous — Firebase Admin SDK
    Firestore calls are synchronous by default in Python.
    """

    def get_content(self, grade: str, max_chars: int = _MAX_CONTENT_CHARS) -> str:
        """
        Return the PSSA reference content string for the given grade,
        truncated to a safe length for LLM prompt injection.

        Args:
            grade:     Grade string e.g. "3", "4", "5"
                       Must be a value in settings.SUPPORTED_GRADES.
            max_chars: Max characters to return. Pass a larger value (or a
                       falsy value like 0/None) to bypass truncation if the
                       full content is ever needed elsewhere.

        Returns:
            Content string to be injected into the LLM prompt.

        Raises:
            ValueError: If grade is not supported or content not found in Firestore.
        """
        grade = grade.strip().lower()

        # ── Validate grade against settings ──────────────────────────────────
        if not settings.is_valid_grade(grade):
            raise ValueError(
                f"Grade '{grade}' is not supported. "
                f"Supported grades: {', '.join(settings.SUPPORTED_GRADES)}"
            )

        # ── Return from cache if available ───────────────────────────────────
        if grade in _cache:
            print(f"[content_service] Cache hit for grade {grade}")
            return self._truncate(_cache[grade], max_chars)

        # ── Fetch from Firestore ──────────────────────────────────────────────
        print(f"[content_service] Cache miss — fetching grade {grade} from Firestore")

        db      = firestore.client()
        doc_id  = f"grade_{grade}"
        doc_ref = db.collection(_COLLECTION).document(doc_id)
        doc     = doc_ref.get()

        if not doc.exists:
            raise ValueError(
                f"No PSSA content found in Firestore for grade '{grade}'. "
                f"Run seed_content.py to populate pssa_content/{doc_id}."
            )

        content = doc.to_dict().get("content", "").strip()

        if not content:
            raise ValueError(
                f"PSSA content for grade '{grade}' exists in Firestore "
                f"but is empty. Re-run seed_content.py."
            )

        # ── Store full content in cache, return truncated version ────────────
        _cache[grade] = content
        print(
            f"[content_service] Loaded grade {grade} content "
            f"({len(content)} chars) — cached for this instance"
        )
        return self._truncate(content, max_chars)

    @staticmethod
    def _truncate(content: str, max_chars: int) -> str:
        """
        Truncate content to max_chars, cutting at the last whole sentence/line
        where possible so the LLM doesn't receive a mid-word/mid-sentence cutoff.
        """
        if not max_chars or len(content) <= max_chars:
            return content

        truncated = content[:max_chars]

        # Prefer cutting at the last paragraph break, then sentence end,
        # so we don't hand the LLM a broken sentence.
        cut_point = truncated.rfind("\n\n")
        if cut_point == -1 or cut_point < max_chars * 0.5:
            cut_point = truncated.rfind(". ")
        if cut_point == -1 or cut_point < max_chars * 0.5:
            cut_point = max_chars  # fallback: hard cut

        result = truncated[:cut_point].rstrip()
        print(
            f"[content_service] Truncated content from {len(content)} "
            f"to {len(result)} chars for prompt injection"
        )
        return result

    def clear_cache(self) -> None:
        """
        Clear the in-memory cache.
        Useful in tests or if content is updated mid-session.
        """
        _cache.clear()
        print("[content_service] Cache cleared")

    def get_cached_grades(self) -> list[str]:
        """Return list of grades currently in cache — useful for debugging."""
        return list(_cache.keys())


# ── Singleton instance ────────────────────────────────────────────────────────
content_service = PssaContentService()