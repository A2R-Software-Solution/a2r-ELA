from typing import Dict, Any
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
        user_context: Dict[str, Any] = None
    ) -> Dict[str, Any]:
        """
        Evaluate an essay and return comprehensive results
        
        Args:
            essay_text: The student's essay
            category: Essay category
            user_context: Optional user context for personalization
            
        Returns:
            Evaluation results dictionary
        """
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
            
            # Step 3: Validate and extract scores
            rubric_scores = evaluation_result.get("rubric_scores", {})
            total_score = evaluation_result.get("total_score", 0)
            
            # Ensure all rubrics are present
            for rubric in settings.RUBRIC_CATEGORIES:
                if rubric not in rubric_scores:
                    rubric_scores[rubric] = 0
            
            # Recalculate total score if needed
            if total_score == 0 or total_score > 100:
                total_score = sum(rubric_scores.values())
            
            # Cap at 100
            total_score = min(total_score, 100)
            
            # Step 4: Generate personalized feedback
            strengths = evaluation_result.get("strengths", [])
            improvements = evaluation_result.get("areas_for_improvement", [])
            
            feedback_prompt = self.prompts.get_feedback_prompt(
                essay_text,
                rubric_scores,
                total_score,
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
                "total_score": total_score,
                "grade": self.prompts.get_grade_from_score(total_score),
                "rubric_scores": rubric_scores,
                "rubric_justifications": evaluation_result.get("rubric_justifications", {}),
                "strengths": strengths,
                "areas_for_improvement": improvements,
                "personalized_feedback": personalized_feedback,
                "category": category,
                "word_count": len(essay_text.split())
            }
            
            return results
            
        except Exception as e:
            # Fallback evaluation if LLM fails
            return self._generate_fallback_evaluation(essay_text, category, str(e))
    
    def _generate_fallback_evaluation(
        self,
        essay_text: str,
        category: str,
        error_message: str
    ) -> Dict[str, Any]:
        """
        Generate a basic evaluation if LLM fails
        
        Args:
            essay_text: The essay text
            category: Essay category
            error_message: Error that occurred
            
        Returns:
            Basic evaluation results
        """
        word_count = len(essay_text.split())
        
        # Basic scoring based on word count
        base_score = min(70, int((word_count / settings.MAX_WORDS) * 100))
        
        rubric_scores = {
            rubric: base_score // 5 for rubric in settings.RUBRIC_CATEGORIES
        }
        
        return {
            "total_score": base_score,
            "grade": self.prompts.get_grade_from_score(base_score),
            "rubric_scores": rubric_scores,
            "rubric_justifications": {
                rubric: "Automated evaluation" for rubric in settings.RUBRIC_CATEGORIES
            },
            "strengths": ["Good effort on completing the essay"],
            "areas_for_improvement": ["Continue practicing to improve your writing"],
            "personalized_feedback": "Thank you for your submission! Our AI system encountered an issue, but we've provided a basic evaluation. Keep practicing your writing skills!",
            "category": category,
            "word_count": word_count,
            "evaluation_error": error_message
        }
    
    def quick_score(self, essay_text: str) -> int:
        """
        Quick scoring without full evaluation (for testing)
        
        Args:
            essay_text: The essay text
            
        Returns:
            Score (0-100)
        """
        word_count = len(essay_text.split())
        base_score = min(85, int((word_count / settings.MAX_WORDS) * 100))
        return base_score

# Initialize evaluator
essay_evaluator = EssayEvaluator()