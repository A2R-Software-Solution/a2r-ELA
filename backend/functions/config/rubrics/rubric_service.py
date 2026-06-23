"""
Rubric Service
Resolves the correct rubric and grade-band expectations
given a (state, grade) pair and formats them for LLM prompt injection.

Currently supported states: PA
"""

from typing import Dict, Any
from config.rubrics.pa_rubric import (
    PSSA_DOMAINS,
    SCORE_DESCRIPTORS,
    GRADE_BAND_EXPECTATIONS,
    NON_SCORABLE,
    get_grade_band,
    get_band_expectations,
    convert_raw_to_100,
    get_supported_grades,
    get_domain_names,
)

# ---------------------------------------------------------------------------
# SUPPORTED STATES REGISTRY
# Add new states here as you expand
# ---------------------------------------------------------------------------
SUPPORTED_STATES = {
    "PA": {
        "name": "Pennsylvania",
        "rubric_type": "PSSA Writing Domain",
        "domains": get_domain_names(),
        "max_raw_per_domain": 4,
        "num_domains": 5,
        "max_raw_total": 20,
        "max_converted_total": 100,
    }
}


class RubricService:
    """
    Service that resolves rubric data for a given state and grade.
    Used by the LLM prompt builder and the essay evaluator.
    """

    def get_rubric_context(
        self,
        state: str,
        grade: str
    ) -> Dict[str, Any]:
        """
        Get the full rubric context for a given state and grade.
        This is the main method called by prompts.py.

        Args:
            state: State code e.g. 'PA'
            grade: Grade string e.g. '5', '8', 'k', 'prek'

        Returns:
            Dictionary containing:
                - state_info
                - rubric_type
                - domains
                - score_descriptors
                - grade_band
                - band_expectations
                - prompt_block  ← ready-to-inject string for LLM prompt
                - scoring_note  ← scoring instruction for LLM

        Raises:
            ValueError if state or grade is not supported
        """
        # Validate state
        state_upper = state.upper().strip()
        if state_upper not in SUPPORTED_STATES:
            raise ValueError(
                f"State '{state}' is not supported. "
                f"Supported states: {list(SUPPORTED_STATES.keys())}"
            )

        # Validate grade and get band
        try:
            band_key = get_grade_band(grade)
            band_expectations = get_band_expectations(grade)
        except ValueError as e:
            raise ValueError(str(e))

        state_info = SUPPORTED_STATES[state_upper]

        # Build the prompt block
        prompt_block = self._build_prompt_block(
            state_upper,
            grade,
            band_key,
            band_expectations
        )

        return {
            "state": state_upper,
            "grade": grade,
            "state_info": state_info,
            "rubric_type": state_info["rubric_type"],
            "domains": PSSA_DOMAINS,
            "score_descriptors": SCORE_DESCRIPTORS,
            "grade_band": band_expectations["band_label"],
            "band_expectations": band_expectations,
            "prompt_block": prompt_block,
            "scoring_note": self._build_scoring_note(state_upper),
            "domain_names": get_domain_names(),
        }

    def _build_prompt_block(
        self,
        state: str,
        grade: str,
        band_key: str,
        band: dict
    ) -> str:
        """
        Build the rubric section string to inject into the LLM prompt.

        Args:
            state: State code
            grade: Grade string
            band_key: Internal band key
            band: Grade band expectations dictionary

        Returns:
            Formatted rubric string for LLM prompt injection
        """
        lines = []

        lines.append(
            f"OFFICIAL RUBRIC: {state} {SUPPORTED_STATES[state]['rubric_type']} "
            f"(Grade {grade.upper()} — {band['band_label']})"
        )
        lines.append("=" * 60)
        lines.append("")
        lines.append(f"GRADE BAND OVERVIEW:")
        lines.append(band["overview"])
        lines.append("")

        # Build each domain section
        for domain_key in get_domain_names():
            domain = PSSA_DOMAINS[domain_key]
            descriptors = SCORE_DESCRIPTORS[domain_key]
            band_expectation = band.get(domain_key, "")

            lines.append(f"DOMAIN: {domain['name'].upper()}")
            lines.append(f"Definition: {domain['description']}")
            lines.append(f"Grade {grade.upper()} expectation: {band_expectation}")
            lines.append("Score levels:")
            for score in [4, 3, 2, 1]:
                lines.append(f"  {score} — {descriptors[score]}")
            lines.append("")

        lines.append(f"SCORING GUIDANCE FOR GRADE {grade.upper()}:")
        lines.append(band.get("scoring_guidance", ""))
        lines.append("")
        lines.append(NON_SCORABLE_NOTE)

        return "\n".join(lines)

    def _build_scoring_note(self, state: str) -> str:
        """
        Build the scoring instruction note for the LLM.

        Args:
            state: State code

        Returns:
            Scoring instruction string
        """
        info = SUPPORTED_STATES[state]
        return (
            f"Score each domain from 1 to {info['max_raw_per_domain']}. "
            f"There are {info['num_domains']} domains. "
            f"Maximum raw total is {info['max_raw_total']}. "
            f"Do NOT convert scores — return raw 1-4 values only. "
            f"The system will handle conversion to 100-point scale."
        )

    def validate_raw_scores(
        self,
        raw_scores: Dict[str, int],
        state: str = "PA"
    ) -> Dict[str, int]:
        """
        Validate and clamp raw domain scores to valid range.

        Args:
            raw_scores: dict of domain → raw score from LLM
            state: State code

        Returns:
            Validated and clamped scores dict
        """
        max_score = SUPPORTED_STATES.get(
            state.upper(), {}
        ).get("max_raw_per_domain", 4)

        validated = {}
        for domain in get_domain_names():
            raw = raw_scores.get(domain, 1)
            try:
                raw_int = int(raw)
            except (TypeError, ValueError):
                raw_int = 1
            validated[domain] = max(1, min(max_score, raw_int))

        return validated

    def process_llm_scores(
        self,
        raw_scores: Dict[str, int],
        state: str = "PA"
    ) -> Dict[str, Any]:
        """
        Take raw LLM scores, validate them, and produce the full
        scoring result including both raw and converted values.

        Args:
            raw_scores: Raw domain scores from LLM (1-4 each)
            state: State code

        Returns:
            Full scoring dict:
                raw_scores       — validated 1-4 per domain
                converted_scores — 0-20 per domain
                pssa_total       — sum of raw (max 20)
                converted_score  — total on 100-point scale (max 100)
        """
        validated = self.validate_raw_scores(raw_scores, state)
        return convert_raw_to_100(validated)

    def get_supported_states(self) -> list:
        """Return list of supported state codes."""
        return list(SUPPORTED_STATES.keys())

    def get_supported_grades(self) -> list:
        """Return list of supported grade strings."""
        return get_supported_grades()

    def is_valid_state(self, state: str) -> bool:
        """Check if a state code is supported."""
        return state.upper().strip() in SUPPORTED_STATES

    def is_valid_grade(self, grade: str) -> bool:
        """Check if a grade string is supported."""
        return grade.lower().strip() in [
            g.lower() for g in get_supported_grades()
        ]


# ---------------------------------------------------------------------------
# NON-SCORABLE NOTE (injected into every prompt)
# ---------------------------------------------------------------------------
NON_SCORABLE_NOTE = (
    "NON-SCORABLE: If the essay is completely illegible, incoherent, "
    "insufficient to assess, or blank — assign a score of 1 to all domains "
    "and note the reason in justifications."
)

# ---------------------------------------------------------------------------
# Global instance
# ---------------------------------------------------------------------------
rubric_service = RubricService()