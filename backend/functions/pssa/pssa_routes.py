"""
PSSA Practice Routes
POST /generate_pssa_questions  — generate fresh practice questions
POST /evaluate_pssa_writing    — evaluate student's short answer / writing response
"""

import json
from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from llm.llm_client import round_robin_groq_client as pssa_groq_client
from llm.prompts import pssa_prompts
from utils.responses import success_response, error_response


def _parse_json_response(content: str) -> dict:
    """3-strategy JSON parser — matches pattern used across codebase"""

    # Strategy 1: Direct parse
    try:
        return json.loads(content)
    except json.JSONDecodeError:
        pass

    # Strategy 2: Extract from ```json ... ``` block
    if "```json" in content:
        try:
            start = content.find("```json") + 7
            end = content.find("```", start)
            return json.loads(content[start:end].strip())
        except Exception:
            pass

    # Strategy 3: Find first { ... } block
    try:
        start = content.find("{")
        end = content.rfind("}") + 1
        if start != -1 and end > start:
            return json.loads(content[start:end])
    except Exception:
        pass

    return None


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"])
)
@require_auth
def generate_pssa_questions(
    req: https_fn.Request,
    user_id: str
) -> https_fn.Response:
    """
    Generate fresh PSSA-style practice questions using LLM.

    Endpoint: POST /generate_pssa_questions
    Auth: Required

    Body:
    {
        "domain": "reading_fiction" | "reading_informational" | "vocabulary" | "poetry" | "craft_and_structure",
        "difficulty": "easy" | "medium" | "hard",
        "count": 5 | 10 | 15 | 20
    }
    """
    try:
        body = req.get_json(silent=True) or {}

        # Validate inputs
        domain = body.get("domain", "reading_fiction")
        difficulty = body.get("difficulty", "medium")
        count = int(body.get("count", 10))

        valid_domains = [
            "reading_fiction",
            "reading_informational",
            "vocabulary",
            "poetry",
            "craft_and_structure",
        ]
        valid_difficulties = ["easy", "medium", "hard"]

        if domain not in valid_domains:
            return error_response(
                f"Invalid domain. Must be one of: {', '.join(valid_domains)}", 400
            )

        if difficulty not in valid_difficulties:
            return error_response(
                f"Invalid difficulty. Must be one of: {', '.join(valid_difficulties)}", 400
            )

        if not (1 <= count <= 20):
            return error_response("Count must be between 1 and 20", 400)

        print(f"Generating PSSA questions — domain: {domain}, difficulty: {difficulty}, count: {count}, user: {user_id}")

        # Build prompt and call LLM
        prompt = pssa_prompts.get_question_generation_prompt(domain, difficulty, count)
        max_tokens = 4000 if count > 8 else 2500
        raw_content = pssa_groq_client.call(prompt, temperature=0.7, max_tokens=max_tokens)


        # Parse response
        result = _parse_json_response(raw_content)

        if not result:
            print(f"Failed to parse PSSA question generation response: {raw_content[:300]}")
            return error_response("Failed to generate questions. Please try again.", 500)

        # Validate structure
        if "questions" not in result or "passage" not in result:
            print(f"Invalid response structure: {result}")
            return error_response("Invalid response from LLM. Please try again.", 500)

        print(f"Successfully generated {len(result.get('questions', []))} questions")
        return success_response(result)

    except Exception as e:
        print(f"generate_pssa_questions error: {str(e)}")
        return error_response(str(e), 500)


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["POST"])
)
@require_auth
def evaluate_pssa_writing(
    req: https_fn.Request,
    user_id: str
) -> https_fn.Response:
    """
    Evaluate a student's short answer or writing response for a PSSA question.

    Endpoint: POST /evaluate_pssa_writing
    Auth: Required

    Body:
    {
        "question": "The question text",
        "student_answer": "What the student wrote",
        "difficulty": "easy" | "medium" | "hard"
    }
    """
    try:
        body = req.get_json(silent=True) or {}

        question = body.get("question", "").strip()
        student_answer = body.get("student_answer", "").strip()
        difficulty = body.get("difficulty", "medium")

        if not question:
            return error_response("question is required", 400)

        if not student_answer:
            return error_response("student_answer is required", 400)

        if difficulty not in ["easy", "medium", "hard"]:
            return error_response("difficulty must be easy, medium, or hard", 400)

        print(f"Evaluating PSSA writing response — user: {user_id}, difficulty: {difficulty}")

        # Build prompt and call LLM
        prompt = pssa_prompts.get_writing_evaluation_prompt(
            question=question,
            student_answer=student_answer,
            difficulty=difficulty
        )
        raw_content = pssa_groq_client.call(prompt, temperature=0.3, max_tokens=500)

        # Parse response
        result = _parse_json_response(raw_content)

        if not result:
            print(f"Failed to parse PSSA writing evaluation response: {raw_content[:300]}")
            # Fallback so student isn't penalized for LLM failure
            return success_response({
                "score": 2,
                "max_score": 4,
                "feedback": "Good effort! Keep practicing your writing.",
                "what_they_did_well": "You attempted the question.",
                "how_to_improve": "Try to add more specific details in your answer.",
                "xp_earned": 15
            })

        return success_response(result)

    except Exception as e:
        print(f"evaluate_pssa_writing error: {str(e)}")
        return error_response(str(e), 500)