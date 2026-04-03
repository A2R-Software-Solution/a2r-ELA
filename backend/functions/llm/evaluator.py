from typing import Dict, Any, Optional
from config.settings import settings
import json


class EssayEvaluator:
    """Service for evaluating essays using LLM"""

    def __init__(self):
        self._llm_client = None
        self._prompts = None

    @property
    def llm_client(self):
        """Lazy-loaded LLM client — imported only on first use"""
        if self._llm_client is None:
            from llm.llm_client import llm_client
            self._llm_client = llm_client
        return self._llm_client

    @property
    def prompts(self):
        """Lazy-loaded prompts — imported only on first use"""
        if self._prompts is None:
            from llm.prompts import essay_prompts
            self._prompts = essay_prompts
        return self._prompts

    def evaluate_essay(
        self,
        essay_text: str,
        category: str = "essay_writing",
        state: str = None,
        grade: str = None,
        user_context: Dict[str, Any] = None,
    ) -> Dict[str, Any]:
        """
        Evaluate an essay and return comprehensive results

        Args:
            essay_text:   The student's essay
            category:     Essay category
            state:        State code e.g. 'PA' (defaults to settings.DEFAULT_STATE)
            grade:        Grade string e.g. '7' (defaults to settings.DEFAULT_GRADE)
            user_context: Optional user context for personalization

        Returns:
            Evaluation results dictionary
        """
        resolved_state = state if state else settings.DEFAULT_STATE
        resolved_grade = grade if grade else settings.DEFAULT_GRADE

        try:
            # Step 1: Generate evaluation prompt
            evaluation_prompt = self.prompts.get_evaluation_prompt(
                essay_text,
                category
            )

            # Step 2: Get LLM evaluation
            evaluation_result = self.llm_client.evaluate_essay(
                essay_text,
                evaluation_prompt,
                category
            )

            # Step 3: Extract raw scores (1-4 per domain)
            raw_scores = evaluation_result.get("raw_scores", {})

            # Ensure all PSSA domains are present, fallback to minimum score (1)
            for domain in settings.PSSA_DOMAINS:
                if domain not in raw_scores:
                    raw_scores[domain] = 1
                else:
                    raw_scores[domain] = min(4, max(1, int(raw_scores[domain])))

            # Convert raw (1-4) to converted (5-20) per domain
            converted_scores = {
                domain: raw * settings.PSSA_CONVERSION_MULTIPLIER
                for domain, raw in raw_scores.items()
            }

            pssa_total = sum(raw_scores.values())             # 5–20
            converted_score = sum(converted_scores.values())  # 25–100
            converted_score = min(converted_score, 100)

            # Step 4: Generate personalized feedback
            strengths = evaluation_result.get("strengths", [])
            improvements = evaluation_result.get("areas_for_improvement", [])

            feedback_prompt = self.prompts.get_feedback_prompt(
                essay_text,
                raw_scores,
                converted_score,
                strengths,
                improvements
            )

            messages = [{"role": "user", "content": feedback_prompt}]
            feedback_response = self.llm_client.create_chat_completion(
                messages,
                temperature=0.7
            )

            personalized_feedback = (
                feedback_response.get("choices", [{}])[0]
                                 .get("message", {})
                                 .get("content", "Great effort on your essay! Keep practicing.")
            )

            # Step 5: Compile final results
            return {
                "total_score":           converted_score,
                "pssa_total":            pssa_total,
                "converted_score":       converted_score,
                "grade":                 self.prompts.get_grade_from_score(converted_score),
                "rubric_scores":         converted_scores,
                "raw_scores":            raw_scores,
                "converted_scores":      converted_scores,
                "rubric_justifications": evaluation_result.get("raw_justifications", {}),
                "strengths":             strengths,
                "areas_for_improvement": improvements,
                "personalized_feedback": personalized_feedback,
                "category":              category,
                "word_count":            len(essay_text.split()),
                "state":                 resolved_state,
                "student_grade":         resolved_grade,
                "grade_band":            self._get_grade_band(resolved_grade),
                "rubric_type":           "PSSA Writing Domain",
            }

        except Exception as e:
            return self._generate_fallback_evaluation(
                essay_text, category, resolved_state, resolved_grade, str(e)
            )

    def _get_grade_band(self, grade: str) -> str:
        """Map a grade string to a PSSA grade band label"""
        grade_bands = {
            "prek": "Pre-K",
            "k":    "Kindergarten",
            "1": "Grades 1-2",  "2": "Grades 1-2",
            "3": "Grades 3-4",  "4": "Grades 3-4",
            "5": "Grades 5-6",  "6": "Grades 5-6",
            "7": "Grades 7-8",  "8": "Grades 7-8",
            "9": "Grades 9-10", "10": "Grades 9-10",
            "11": "Grades 11-12", "12": "Grades 11-12",
        }
        return grade_bands.get(str(grade).lower(), f"Grade {grade}")

    def _generate_fallback_evaluation(
        self,
        essay_text: str,
        category: str,
        state: str = None,
        grade: str = None,
        error_message: str = "",
    ) -> Dict[str, Any]:
        """Generate a basic evaluation if LLM fails"""
        word_count = len(essay_text.split())
        resolved_state = state if state else settings.DEFAULT_STATE
        resolved_grade = grade if grade else settings.DEFAULT_GRADE

        base_raw = min(4, max(1, round((word_count / settings.MAX_WORDS) * 4)))

        raw_scores = {domain: base_raw for domain in settings.PSSA_DOMAINS}
        converted_scores = {
            domain: raw * settings.PSSA_CONVERSION_MULTIPLIER
            for domain, raw in raw_scores.items()
        }
        pssa_total = sum(raw_scores.values())
        converted_score = sum(converted_scores.values())

        return {
            "total_score":           converted_score,
            "pssa_total":            pssa_total,
            "converted_score":       converted_score,
            "grade":                 self.prompts.get_grade_from_score(converted_score),
            "rubric_scores":         converted_scores,
            "raw_scores":            raw_scores,
            "converted_scores":      converted_scores,
            "rubric_justifications": {
                domain: "Automated evaluation" for domain in settings.PSSA_DOMAINS
            },
            "strengths":             ["Good effort on completing the essay"],
            "areas_for_improvement": ["Continue practicing to improve your writing"],
            "personalized_feedback": (
                "Thank you for your submission! Our AI system encountered an issue, "
                "but we've provided a basic evaluation. Keep practicing your writing skills!"
            ),
            "category":         category,
            "word_count":       word_count,
            "state":            resolved_state,
            "student_grade":    resolved_grade,
            "grade_band":       self._get_grade_band(resolved_grade),
            "rubric_type":      "PSSA Writing Domain",
            "evaluation_error": error_message,
        }

    def quick_score(self, essay_text: str) -> int:
        """Quick scoring without full evaluation (for testing)"""
        word_count = len(essay_text.split())
        return min(85, int((word_count / settings.MAX_WORDS) * 100))


# =============================================================================
# Detail Detective Evaluator — uses Groq for fast sentence improvement scoring
# =============================================================================

class DetailDetectiveEvaluator:
    """
    Evaluates sentence improvement for the Detail Detective game.
    Uses Groq (fast inference) instead of OpenRouter.
    """

    def __init__(self):
        self._groq_client = None
        self._prompts = None

    @property
    def groq_client(self):
        """Lazy-loaded Groq client — imported only on first use"""
        if self._groq_client is None:
            from llm.llm_client import groq_client
            self._groq_client = groq_client
        return self._groq_client

    @property
    def prompts(self):
        """Lazy-loaded prompts — imported only on first use"""
        if self._prompts is None:
            from llm.prompts import essay_prompts
            self._prompts = essay_prompts
        return self._prompts

    def evaluate(
        self,
        original_sentence: str,
        improved_sentence: str,
    ) -> Dict[str, Any]:
        """
        Evaluate a student's sentence improvement attempt.

        Args:
            original_sentence: The weak sentence shown to the student
            improved_sentence: The student's expanded version

        Returns:
            Dict with score (1-5), feedback, what_they_did_well,
            how_to_improve, and xp_earned
        """
        print(f"DetailDetectiveEvaluator: evaluating improvement")

        # Basic validation before hitting the API
        if not improved_sentence or not improved_sentence.strip():
            return self._empty_response()

        if improved_sentence.strip().lower() == original_sentence.strip().lower():
            return self._copied_response()

        try:
            prompt = self.prompts.get_detail_detective_prompt(
                original_sentence,
                improved_sentence
            )

            result = self.groq_client.evaluate_sentence_improvement(
                original=original_sentence,
                improved=improved_sentence,
                prompt=prompt
            )

            # Clamp score and xp to valid ranges just in case
            score     = min(5, max(1, int(result.get("score", 2))))
            xp_earned = min(60, max(10, int(result.get("xp_earned", 20))))

            return {
                "score":             score,
                "max_score":         5,
                "feedback":          result.get("feedback", "Good effort!"),
                "what_they_did_well": result.get("what_they_did_well", ""),
                "how_to_improve":    result.get("how_to_improve", ""),
                "xp_earned":         xp_earned,
                "success":           True,
            }

        except Exception as e:
            print(f"DetailDetectiveEvaluator error: {str(e)}")
            return self._fallback_response()

    def _empty_response(self) -> Dict[str, Any]:
        """Student submitted nothing"""
        return {
            "score":             1,
            "max_score":         5,
            "feedback":          "Try adding some details to the sentence!",
            "what_they_did_well": "",
            "how_to_improve":    "Write a longer sentence with specific details, facts, or examples.",
            "xp_earned":         10,
            "success":           True,
        }

    def _copied_response(self) -> Dict[str, Any]:
        """Student just copied the original"""
        return {
            "score":             1,
            "max_score":         5,
            "feedback":          "It looks like the sentence wasn't changed. Try expanding it with new details!",
            "what_they_did_well": "",
            "how_to_improve":    "Add facts, examples, or descriptive words to make the sentence more interesting.",
            "xp_earned":         10,
            "success":           True,
        }

    def _fallback_response(self) -> Dict[str, Any]:
        """Groq API failed — give partial credit so student isn't penalized"""
        return {
            "score":             2,
            "max_score":         5,
            "feedback":          "Good effort! Keep adding more details to make your sentences shine.",
            "what_they_did_well": "You gave it a try!",
            "how_to_improve":    "Try adding a specific fact, number, or example.",
            "xp_earned":         20,
            "success":           False,
        }


# =============================================================================
# Singletons — no imports or network calls until first use
# =============================================================================
essay_evaluator = EssayEvaluator()
detail_detective_evaluator = DetailDetectiveEvaluator()