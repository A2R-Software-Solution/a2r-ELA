from typing import Dict, Any, List
from config.rubrics.rubric_service import rubric_service
from config.settings import settings


class EssayPrompts:
    """Prompts for essay evaluation using LLM"""

    @staticmethod
    def get_evaluation_prompt(
        essay_text: str,
        category: str = "essay_writing",
        state: str = "PA",
        grade: str = "6",
    ) -> str:
        """
        Generate evaluation prompt for the LLM with state-specific rubric.

        Args:
            essay_text: The student's essay
            category:   Essay category
            state:      State code e.g. 'PA'
            grade:      Grade string e.g. '5', '8', 'k'

        Returns:
            Formatted prompt string with PSSA rubric injected
        """
        # Get rubric context for this state + grade
        try:
            rubric_ctx = rubric_service.get_rubric_context(state, grade)
        except ValueError:
            # Fallback to defaults if invalid state/grade
            rubric_ctx = rubric_service.get_rubric_context(
                settings.DEFAULT_STATE,
                settings.DEFAULT_GRADE
            )

        rubric_block  = rubric_ctx["prompt_block"]
        scoring_note  = rubric_ctx["scoring_note"]
        grade_band    = rubric_ctx["grade_band"]
        rubric_type   = rubric_ctx["rubric_type"]
        domain_names  = rubric_ctx["domain_names"]  # list of 5 keys

        # Build example JSON with domain keys
        example_raw = {d: 3 for d in domain_names}
        example_justifications = {
            "focus":        "Clear controlling idea with evident task awareness",
            "content":      "Sufficient development with relevant details",
            "organization": "Logical order with functional transitions",
            "style":        "Appropriate word choice and sentence variety",
            "conventions":  "Sufficient control with few non-interfering errors",
        }
        example_strengths = [
            "Clear and focused controlling idea",
            "Good use of supporting details",
            "Appropriate formal style for grade level",
        ]
        example_improvements = [
            "Add more specific examples to strengthen content",
            "Use more varied transitions between paragraphs",
            "Review punctuation and capitalization conventions",
        ]
        example_pssa_total = sum(example_raw.values())           # 15
        example_converted  = example_pssa_total * settings.PSSA_CONVERSION_MULTIPLIER  # 75

        import json
        example_json = json.dumps(
            {
                "raw_scores": example_raw,
                "raw_justifications": example_justifications,
                "pssa_total": example_pssa_total,
                "converted_score": example_converted,
                "strengths": example_strengths,
                "areas_for_improvement": example_improvements,
            },
            indent=4,
        )

        prompt = f"""You are an expert essay evaluator trained in the {state} {rubric_type}.

You are evaluating a student essay written at the {grade_band} level.
Category: {category}

{rubric_block}

ESSAY TO EVALUATE:
\"\"\"
{essay_text}
\"\"\"

EVALUATION INSTRUCTIONS:
1. Read the essay carefully with the grade-band expectations in mind.
2. Score each of the 5 PSSA domains on a scale of 1 to 4 using the score level descriptors above.
3. {scoring_note}
4. Provide a brief justification (1-2 sentences) for each domain score.
5. List 2-3 specific strengths of the essay.
6. List 2-3 specific, actionable areas for improvement.
7. Be fair and realistic — most student essays score between 2 and 3 per domain.
8. Do NOT give all 1s unless the essay is truly non-scorable.

IMPORTANT: Return ONLY valid JSON. No markdown, no extra text, no code blocks.

Use exactly this structure (raw scores must be integers 1-4):
{example_json}
"""
        return prompt

    @staticmethod
    def get_feedback_prompt(
        essay_text: str,
        raw_scores: Dict[str, int],
        converted_score: int,
        strengths: List[str],
        areas_for_improvement: List[str],
        grade: str = "6",
        state: str = "PA",
    ) -> str:
        """
        Generate personalized feedback prompt.

        Args:
            essay_text:           The student's essay
            raw_scores:           Dict of domain → raw score (1-4)
            converted_score:      Total score on 100-point scale
            strengths:            List of strengths from evaluation
            areas_for_improvement: List of improvement areas
            grade:                Student's grade
            state:                State code

        Returns:
            Formatted feedback prompt
        """
        grade_display = settings.get_grade_display(grade)

        # Format domain scores for prompt
        score_lines = []
        for domain in settings.PSSA_DOMAINS:
            raw  = raw_scores.get(domain, 1)
            converted = raw * settings.PSSA_CONVERSION_MULTIPLIER
            label = domain.replace("_", " ").title()
            score_lines.append(
                f"  - {label}: {raw}/4 (converted: {converted}/20)"
            )
        scores_block = "\n".join(score_lines)

        strengths_block = (
            "\n".join(f"  - {s}" for s in strengths)
            if strengths
            else "  - Good effort on completing the essay"
        )
        improvements_block = (
            "\n".join(f"  - {a}" for a in areas_for_improvement)
            if areas_for_improvement
            else "  - Keep practicing to improve"
        )

        prompt = f"""Generate personalized, encouraging feedback for a {grade_display} student
based on their {state} PSSA Writing Domain evaluation.

ESSAY EXCERPT:
\"\"\"{essay_text[:300]}...\"\"\"

EVALUATION RESULTS (Total: {converted_score}/100):
{scores_block}

STRENGTHS:
{strengths_block}

AREAS FOR IMPROVEMENT:
{improvements_block}

INSTRUCTIONS:
Write feedback that:
1. Opens with genuine, specific praise referencing actual strengths (2-3 sentences)
2. Gives constructive, actionable improvement advice tied to the lowest-scoring domain (2-3 sentences)
3. Closes with encouragement appropriate for a {grade_display} student (1-2 sentences)

TONE: Supportive, constructive, age-appropriate for {grade_display}, encouraging
LENGTH: 5-7 sentences total

Respond with the feedback text ONLY. No JSON, no labels, no headings."""

        return prompt

    @staticmethod
    def get_bug_catcher_prompt() -> str:
        """
        Generate a prompt for the LLM to create a Bug Catcher game level.
        Returns a paragraph split into words with exactly 5 seeded errors.
        """
        prompt = """You are a creative writing teacher creating an educational grammar game for middle school students.

Generate a short paragraph (15-20 words) about any everyday topic (school, nature, sports, food, animals, etc.).
The paragraph must contain exactly 5 errors — a mix of spelling, grammar, and punctuation mistakes.

Return ONLY valid JSON in exactly this structure, no markdown, no extra text:

{
    "words": ["The", "dog", "runned", "quickly", "threw", ...],
    "errors": [
        {"id": "e1", "wordIndex": 2,  "word": "runned", "fix": "ran",     "type": "grammar"},
        {"id": "e2", "wordIndex": 4,  "word": "threw",  "fix": "through", "type": "spelling"},
        {"id": "e3", "wordIndex": 8,  "word": "dont",   "fix": "don't",   "type": "punctuation"},
        {"id": "e4", "wordIndex": 11, "word": "there",  "fix": "their",   "type": "spelling"},
        {"id": "e5", "wordIndex": 14, "word": "was",    "fix": "were",    "type": "grammar"}
    ]
}

Rules:
1. "words" must be the full paragraph split into individual word tokens (include punctuation attached to words e.g. "quickly,")
2. "errors" must have exactly 5 entries
3. "wordIndex" must be the exact index of that word in the "words" array (0-based)
4. "type" must be one of: "spelling", "grammar", "punctuation"
5. The errors must be subtle enough to be a fun challenge but not too obscure
6. Do NOT return markdown, code blocks, or any text outside the JSON"""

        return prompt

    @staticmethod
    def get_jumbled_story_prompt() -> str:
        """
        Generate a prompt for the LLM to create a Jumbled Story game level.
        Returns a 6-sentence story with a correctIndex for each sentence.
        """
        prompt = """You are a creative writing teacher creating an educational story ordering game for middle school students.

Write a short story with exactly 6 sentences about any engaging everyday topic (an adventure, a problem solved, a fun event, etc.).
The sentences must have a clear logical order that students can figure out.

Return ONLY valid JSON in exactly this structure, no markdown, no extra text:

{
    "title": "The Lost Puppy",
    "sentences": [
        {"id": "s1", "text": "Emma was walking home from school when she heard a faint whimpering sound.", "correctIndex": 0},
        {"id": "s2", "text": "She followed the sound and found a small puppy stuck under a bush.",          "correctIndex": 1},
        {"id": "s3", "text": "Emma gently pulled the puppy free and checked if it was hurt.",              "correctIndex": 2},
        {"id": "s4", "text": "She noticed a tag on its collar with a phone number.",                       "correctIndex": 3},
        {"id": "s5", "text": "Emma called the number and the owner arrived within minutes.",               "correctIndex": 4},
        {"id": "s6", "text": "The owner thanked Emma and she walked home feeling proud.",                  "correctIndex": 5}
    ]
}

Rules:
1. Exactly 6 sentences
2. "correctIndex" must be 0-5 representing the correct position in the story
3. Each sentence must clearly belong in its numbered position
4. The story must have a clear beginning, middle, and end
5. Do NOT return markdown, code blocks, or any text outside the JSON"""

        return prompt

    @staticmethod
    def get_grade_from_score(score: int) -> str:
        """
        Convert numeric score to letter grade.

        Args:
            score: Total score (0-100)

        Returns:
            Letter grade (A-F)
        """
        if score >= settings.GRADE_THRESHOLDS["A"]:
            return "A"
        elif score >= settings.GRADE_THRESHOLDS["B"]:
            return "B"
        elif score >= settings.GRADE_THRESHOLDS["C"]:
            return "C"
        elif score >= settings.GRADE_THRESHOLDS["D"]:
            return "D"
        else:
            return "F"


# Initialize prompts instance
essay_prompts = EssayPrompts()