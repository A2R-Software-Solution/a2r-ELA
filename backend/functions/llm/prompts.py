from typing import Dict

class EssayPrompts:
    """Prompts for essay evaluation using LLM"""
    
    @staticmethod
    def get_evaluation_prompt(essay_text: str, category: str = "essay_writing") -> str:
        """
        Generate evaluation prompt for the LLM
        
        Args:
            essay_text: The student's essay
            category: Essay category
            
        Returns:
            Formatted prompt string
        """
        
        prompt = f"""You are an expert essay evaluator. Evaluate this student essay and assign fair, realistic scores.

SCORING RUBRICS (Each worth 20 points):
1. Content & Ideas: Relevance, depth, and quality of ideas
2. Organization & Structure: Logical flow and paragraph organization
3. Language & Vocabulary: Word choice and language quality
4. Grammar & Mechanics: Spelling, punctuation, and grammar
5. Coherence & Clarity: Clear expression and readability

SCORING GUIDELINES:
- 18-20: Excellent work, minor or no issues
- 15-17: Good work with some room for improvement
- 12-14: Satisfactory with several areas to improve
- 9-11: Needs significant improvement
- 0-8: Major issues present

ESSAY (Category: {category}):
{essay_text}

INSTRUCTIONS:
Evaluate this essay fairly. Most student essays should score 50-80 points total. Don't give all zeros unless the essay is completely off-topic or unintelligible.

Return ONLY valid JSON (no markdown, no extra text):
{{
    "rubric_scores": {{
        "content_and_ideas": 15,
        "organization_and_structure": 14,
        "language_and_vocabulary": 13,
        "grammar_and_mechanics": 16,
        "coherence_and_clarity": 15
    }},
    "rubric_justifications": {{
        "content_and_ideas": "Clear main ideas with good examples",
        "organization_and_structure": "Well-structured with logical flow",
        "language_and_vocabulary": "Good word choice, some variety",
        "grammar_and_mechanics": "Mostly correct with few errors",
        "coherence_and_clarity": "Ideas connect well and are clear"
    }},
    "total_score": 73,
    "strengths": [
        "Clear and relevant main topic",
        "Good organization and structure",
        "Appropriate language for the topic"
    ],
    "areas_for_improvement": [
        "Add more specific examples",
        "Vary sentence structure more",
        "Expand on key points"
    ]
}}"""
        
        return prompt
    
    @staticmethod
    def get_feedback_prompt(
        essay_text: str,
        rubric_scores: Dict[str, int],
        total_score: int,
        strengths: list,
        areas_for_improvement: list
    ) -> str:
        """
        Generate personalized feedback prompt
        
        Args:
            essay_text: The student's essay
            rubric_scores: Dictionary of rubric scores
            total_score: Total score
            strengths: List of strengths
            areas_for_improvement: List of improvement areas
            
        Returns:
            Formatted feedback prompt
        """
        
        prompt = f"""Generate personalized, encouraging feedback for a student based on their essay evaluation.

ESSAY EXCERPT:
\"\"\"{essay_text[:300]}...\"\"\"

EVALUATION RESULTS:
- Total Score: {total_score}/100
- Content & Ideas: {rubric_scores.get('content_and_ideas', 0)}/20
- Organization & Structure: {rubric_scores.get('organization_and_structure', 0)}/20
- Language & Vocabulary: {rubric_scores.get('language_and_vocabulary', 0)}/20
- Grammar & Mechanics: {rubric_scores.get('grammar_and_mechanics', 0)}/20
- Coherence & Clarity: {rubric_scores.get('coherence_and_clarity', 0)}/20

STRENGTHS:
{chr(10).join(f'- {s}' for s in strengths) if strengths else '- Good effort on completing the essay'}

AREAS FOR IMPROVEMENT:
{chr(10).join(f'- {a}' for a in areas_for_improvement) if areas_for_improvement else '- Keep practicing to improve'}

INSTRUCTIONS:
Create personalized feedback that:
1. Starts with genuine praise highlighting specific strengths (2-3 sentences)
2. Provides constructive criticism with actionable steps (2-3 sentences)
3. Ends with encouragement and motivation (1-2 sentences)

TONE: Supportive, constructive, age-appropriate, encouraging
LENGTH: 5-7 sentences total

Respond with the feedback text only (no JSON, no labels)."""
        
        return prompt
    
    @staticmethod
    def get_grade_from_score(score: int) -> str:
        """
        Convert numeric score to letter grade
        
        Args:
            score: Total score (0-100)
            
        Returns:
            Letter grade (A-F)
        """
        if score >= 90:
            return "A"
        elif score >= 80:
            return "B"
        elif score >= 70:
            return "C"
        elif score >= 60:
            return "D"
        else:
            return "F"

# Initialize prompts instance
essay_prompts = EssayPrompts()