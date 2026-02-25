from typing import Dict, Any, Optional
from llm.llm_client import llm_client
from llm.prompts import essay_prompts
from config.settings import settings
import json

class EssayEvaluator:
    """Service for evaluating essays using LLM"""
    
    def __init__(self):
        self.llm_client = llm_client
        self.prompts = essay_prompts
    
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
        # Resolve state and grade defaults
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
            
            # Step 3: Extract raw scores from LLM response (1-4 per domain)
            # LLM returns "raw_scores" key — NOT "rubric_scores"
            raw_scores = evaluation_result.get("raw_scores", {})
            
            # Ensure all PSSA domains are present, fallback to minimum score (1)
            for domain in settings.PSSA_DOMAINS:
                if domain not in raw_scores:
                    raw_scores[domain] = 1
                else:
                    # Clamp to valid range 1-4
                    raw_scores[domain] = min(4, max(1, int(raw_scores[domain])))
            
            # Convert raw (1-4) to converted (5-20) per domain
            converted_scores = {
                domain: raw * settings.PSSA_CONVERSION_MULTIPLIER
                for domain, raw in raw_scores.items()
            }
            
            pssa_total = sum(raw_scores.values())            # 5–20
            converted_score = sum(converted_scores.values()) # 25–100
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
            
            personalized_feedback = feedback_response.get("choices", [{}])[0].get(
                "message", {}
            ).get("content", "Great effort on your essay! Keep practicing.")
            
            # Step 5: Compile final results
            results = {
                "total_score":      converted_score,
                "pssa_total":       pssa_total,
                "converted_score":  converted_score,
                "grade":            self.prompts.get_grade_from_score(converted_score),
                "rubric_scores":    converted_scores,  # alias for frontend (5-20 per domain)
                "raw_scores":       raw_scores,         # 1-4 per domain
                "converted_scores": converted_scores,   # 5-20 per domain
                "rubric_justifications": evaluation_result.get("raw_justifications", {}),
                "strengths":             strengths,
                "areas_for_improvement": improvements,
                "personalized_feedback": personalized_feedback,
                "category":      category,
                "word_count":    len(essay_text.split()),
                "state":         resolved_state,
                "student_grade": resolved_grade,
                "grade_band":    self._get_grade_band(resolved_grade),
                "rubric_type":   "PSSA Writing Domain",
            }
            
            return results
            
        except Exception as e:
            return self._generate_fallback_evaluation(
                essay_text, category, resolved_state, resolved_grade, str(e)
            )
    
    def _get_grade_band(self, grade: str) -> str:
        """Map a grade string to a PSSA grade band label"""
        grade_bands = {
            "prek": "Pre-K",
            "k": "Kindergarten",
            "1": "Grades 1-2", "2": "Grades 1-2",
            "3": "Grades 3-4", "4": "Grades 3-4",
            "5": "Grades 5-6", "6": "Grades 5-6",
            "7": "Grades 7-8", "8": "Grades 7-8",
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
        
        # Basic scoring based on word count (raw 1-4)
        base_raw = min(4, max(1, round((word_count / settings.MAX_WORDS) * 4)))
        
        raw_scores = {domain: base_raw for domain in settings.PSSA_DOMAINS}
        converted_scores = {
            domain: raw * settings.PSSA_CONVERSION_MULTIPLIER
            for domain, raw in raw_scores.items()
        }
        pssa_total = sum(raw_scores.values())
        converted_score = sum(converted_scores.values())

        return {
            "total_score":      converted_score,
            "pssa_total":       pssa_total,
            "converted_score":  converted_score,
            "grade":            self.prompts.get_grade_from_score(converted_score),
            "rubric_scores":    converted_scores,
            "raw_scores":       raw_scores,
            "converted_scores": converted_scores,
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
        base_score = min(85, int((word_count / settings.MAX_WORDS) * 100))
        return base_score

# Initialize evaluator
essay_evaluator = EssayEvaluator()