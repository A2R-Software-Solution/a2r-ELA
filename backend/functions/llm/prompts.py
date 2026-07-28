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
    def get_detail_detective_prompt(original_sentence: str, improved_sentence: str) -> str:
        """
        Generate a Groq evaluation prompt for the Detail Detective game.
        Rates how much a student improved a weak sentence by adding details.

        Args:
            original_sentence: The weak sentence shown to the student e.g. "Pizza is good."
            improved_sentence: The student's expanded version

        Returns:
            Formatted prompt string for Groq
        """
        prompt = f"""You are a friendly writing coach evaluating a middle school student's writing improvement exercise.

The student was given a weak, vague sentence and asked to expand it with specific details, facts, and examples.

ORIGINAL WEAK SENTENCE:
"{original_sentence}"

STUDENT'S IMPROVED VERSION:
"{improved_sentence}"

EVALUATION CRITERIA:
- Score 1: No real improvement. Student barely changed the sentence or made it shorter.
- Score 2: Slight improvement. Added a word or two but still very vague.
- Score 3: Good improvement. Added some details or examples that make the sentence more interesting.
- Score 4: Great improvement. Added specific facts, vivid details, or good examples.
- Score 5: Excellent improvement. Rich details, specific examples, and the sentence is engaging and informative.

SCORING RULES:
1. If the improved sentence is shorter than or same length as the original, maximum score is 2.
2. If the student just copied the original, score is 1.
3. Focus on quality of detail added, not just length.
4. Be encouraging — this is a student learning to write.

XP MAPPING:
- Score 1 → xp_earned: 10
- Score 2 → xp_earned: 20
- Score 3 → xp_earned: 35
- Score 4 → xp_earned: 50
- Score 5 → xp_earned: 60

Return ONLY valid JSON, no markdown, no extra text:

{{
    "score": 3,
    "max_score": 5,
    "feedback": "Great job adding specific details! Your improved sentence tells us much more about the topic.",
    "what_they_did_well": "Added specific examples and descriptive words",
    "how_to_improve": "Try adding a fact or a number to make it even stronger",
    "xp_earned": 35
}}"""

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


# =============================================================================
# PSSA Practice Prompts — question generation + writing evaluation
# =============================================================================

class PSSAPrompts:
    """Prompts for PSSA practice question generation and evaluation"""

    # NOTE: Old hardcoded Grade-4-only PDF_CONTEXT has been removed.
    # Grade-specific reference content now comes from Firestore via
    # pssa/content_service.py and is injected per-request as `grade_content`.
    #
    # This STATIC_FORMAT_RULES block is grade-agnostic — question types,
    # domains, and formatting rules that apply to every grade. The actual
    # passage/vocabulary source material is 100% driven by grade_content.
    STATIC_FORMAT_RULES = """
QUESTION TYPES:
1. Multiple Choice (MCQ) — 4 options (A/B/C/D), exactly one correct answer
2. Short Answer — student writes 1-2 sentences, a model answer is provided for self-check
3. Writing Response — student writes a paragraph, AI evaluates it

DOMAINS COVERED:
- Reading Comprehension (Fiction & Informational Text): Main idea, inference, text evidence, summarizing
- Vocabulary & Context Clues: Synonyms, antonyms, meaning from context, prefixes/suffixes
- Poetry: Mood, imagery, personification, author's word choice
- Craft & Structure: Author's purpose, text features, text structure, reliable sources
- Writing: Constructed response, extended response

DIFFICULTY LEVELS:
- Easy: Straightforward recall, clear correct answer, familiar vocabulary
- Medium: Requires inference or text evidence, slightly complex vocabulary
- Hard: Higher-order thinking, author's purpose, figurative language, extended analysis

PASSAGE STYLE:
- Fiction: Short story (4-6 sentences) with a clear character, problem, and resolution
- Informational: Short factual paragraph (3-5 sentences) about science/nature/social topics
- Poetry: 3-line haiku or short poem with imagery and a clear mood

FORMAT RULES:
- MCQ options must be concise (2-5 words each)
- Short answer questions must have a clear model answer
- Questions must directly relate to the passage provided
- Every session must include a fresh passage — never reuse the same story
"""

    @staticmethod
    def get_question_generation_prompt(
        domain: str,
        difficulty: str,
        count: int,
        grade: str,
        grade_content: str,
    ) -> str:
        """
        Generate a prompt to create fresh PSSA-style questions.

        Args:
            domain:        e.g. 'reading_fiction', 'vocabulary', 'poetry', 'craft_and_structure'
            difficulty:    'easy', 'medium', or 'hard'
            count:         number of questions (student's choice)
            grade:         grade string e.g. '3', '4' — used for display + tone
            grade_content: grade-specific reference content fetched from Firestore
                           via pssa/content_service.py (replaces old hardcoded PDF_CONTEXT)

        Returns:
            Formatted prompt string
        """

        grade_display = settings.get_grade_display(grade)

        # Map domain to passage type and question focus
        domain_config = {
            "reading_fiction": {
                "passage_type": "Fiction",
                "focus": "main idea, character traits, inference, text evidence, theme, summarizing",
            },
            "reading_informational": {
                "passage_type": "Informational Text",
                "focus": "central idea, key details, text structure, summarizing, author's purpose",
            },
            "vocabulary": {
                "passage_type": "Vocabulary sentences (no passage needed — use standalone sentences)",
                "focus": "synonyms, antonyms, context clues, prefixes, suffixes, word meaning",
            },
            "poetry": {
                "passage_type": "Poetry (short 3-4 line poem)",
                "focus": "mood, imagery, personification, word choice, figurative language",
            },
            "craft_and_structure": {
                "passage_type": "Short mixed text",
                "focus": "author's purpose, text features, reliable sources, text structure, quotation marks",
            },
        }

        config = domain_config.get(domain, domain_config["reading_fiction"])
        passage_type = config["passage_type"]
        focus = config["focus"]

        # Difficulty instructions
        difficulty_instructions = {
            "easy": "Use simple vocabulary. Questions should test direct recall. Answers are clearly stated in the passage.",
            "medium": "Use grade-appropriate vocabulary. Questions require some inference or finding text evidence.",
            "hard": "Use challenging vocabulary. Questions require higher-order thinking, author's purpose analysis, or extended inference.",
        }
        diff_instruction = difficulty_instructions.get(difficulty, difficulty_instructions["medium"])

        # ── MCQ / short-answer distribution ──────────────────────────
        # Guarantees at least 1 MCQ whenever count >= 1.
        if count == 1:
            mcq_count   = 1
            short_count = 0
        elif count <= 5:
            mcq_count   = count - 1
            short_count = 1
        elif count <= 10:
            mcq_count   = count - 2
            short_count = 2
        else:
            mcq_count   = count - 3
            short_count = 3

        # Safety net — never allow 0 MCQs for any count >= 1
        if mcq_count <= 0 and count >= 1:
            mcq_count   = 1
            short_count = max(0, count - 1)
        # ──────────────────────────────────────────────────────────────────

        prompt = f"""You are a {grade_display} PSSA ELA expert creating a fresh practice session for a student.

GRADE-SPECIFIC REFERENCE CONTENT ({grade_display}):
{grade_content}

GENERAL FORMAT RULES:
{PSSAPrompts.STATIC_FORMAT_RULES}

SESSION REQUIREMENTS:
- Grade: {grade_display}
- Domain: {domain.replace('_', ' ').title()}
- Difficulty: {difficulty.title()}
- Total Questions: {count}
- MCQ Questions: {mcq_count}
- Short Answer Questions: {short_count}

DIFFICULTY INSTRUCTION:
{diff_instruction}

PASSAGE TYPE: {passage_type}
QUESTION FOCUS: {focus}

INSTRUCTIONS:
1. Write a fresh, original passage appropriate for the domain, difficulty, and {grade_display} reading level, grounded in the grade-specific reference content above.
2. Generate exactly {mcq_count} MCQ questions and {short_count} short answer questions based on the passage.
3. For MCQ: provide 4 options (A/B/C/D), mark the correct answer, and give a brief explanation.
4. For Short Answer: provide a model answer (1-2 sentences) for student self-check.
5. Questions must directly relate to the passage.
6. Never reuse passages or questions from previous sessions.
7. Keep language age-appropriate for {grade_display} students.

Return ONLY valid JSON, no markdown, no extra text:

{{
    "passage": {{
        "type": "{passage_type}",
        "title": "Short title for the passage",
        "text": "The full passage text here."
    }},
    "questions": [
        {{
            "id": "q1",
            "type": "mcq",
            "question": "What is the main idea of the passage?",
            "options": {{
                "A": "First option",
                "B": "Second option",
                "C": "Third option",
                "D": "Fourth option"
            }},
            "correct_answer": "B",
            "explanation": "Brief explanation of why B is correct."
        }},
        {{
            "id": "q2",
            "type": "short_answer",
            "question": "What text evidence supports your answer?",
            "model_answer": "A model answer the student can compare their response to."
        }}
    ],
    "domain": "{domain}",
    "difficulty": "{difficulty}",
    "total_questions": {count}
}}"""

        return prompt

    @staticmethod
    def get_writing_evaluation_prompt(
        question: str,
        student_answer: str,
        difficulty: str,
        grade: str = "4",
    ) -> str:
        """
        Evaluate a student's short answer or writing response.

        Args:
            question:       The question asked
            student_answer: What the student wrote
            difficulty:     'easy', 'medium', or 'hard'
            grade:          grade string e.g. '3', '4' — used for grade-appropriate scoring language

        Returns:
            Formatted evaluation prompt
        """

        grade_display = settings.get_grade_display(grade)

        prompt = f"""You are a supportive {grade_display} PSSA ELA writing coach evaluating a student's short answer.

QUESTION ASKED:
"{question}"

STUDENT'S ANSWER:
"{student_answer}"

DIFFICULTY LEVEL: {difficulty.title()}

EVALUATION CRITERIA:
- Score 1: Answer is missing, off-topic, or shows no understanding
- Score 2: Partial answer — some understanding but incomplete or vague
- Score 3: Good answer — addresses the question with a relevant detail
- Score 4: Excellent answer — clear, complete, uses text evidence or specific details

SCORING RULES:
1. Be encouraging — this is a {grade_display} student learning to write
2. If the answer is blank or just one word, score is 1
3. Focus on whether the student understood the question and responded meaningfully
4. Do not penalize for minor spelling or grammar errors
5. Calibrate your expectations to what is realistic for a {grade_display} student

XP MAPPING:
- Score 1 → xp_earned: 5
- Score 2 → xp_earned: 15
- Score 3 → xp_earned: 25
- Score 4 → xp_earned: 40

Return ONLY valid JSON, no markdown, no extra text:

{{
    "score": 3,
    "max_score": 4,
    "feedback": "Encouraging 1-2 sentence feedback specific to what the student wrote.",
    "what_they_did_well": "One specific thing they did well.",
    "how_to_improve": "One specific, actionable improvement tip.",
    "xp_earned": 25
}}"""

        return prompt


# Initialize PSSA prompts instance
pssa_prompts = PSSAPrompts()