"""
Vocab Routes
GET /get_daily_vocab — returns a random vocab word + meaning using Groq
"""

import json
from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from llm.llm_client import groq_client
from utils.responses import success_response, error_response


@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET"])
)
@require_auth
def get_daily_vocab(
    req: https_fn.Request,
    user_id: str
) -> https_fn.Response:
    """
    Returns a random vocabulary word + meaning + part of speech
    Uses Groq for fast inference
    
    Endpoint: GET /get_daily_vocab
    Auth: Required
    """
    try:
        prompt = """Generate a single random English vocabulary word suitable for middle school students (grades 6-8).

Return ONLY a JSON object with no extra text:
{
  "word": "the vocabulary word",
  "part_of_speech": "noun/verb/adjective/adverb",
  "meaning": "clear and simple definition in one sentence",
  "example": "one example sentence using the word"
}"""

        messages = [{"role": "user", "content": prompt}]
        response = groq_client.create_chat_completion(
            messages=messages,
            temperature=0.9,
            max_tokens=2048
        )

        choice = (response.get("choices") or [{}])[0]
        if choice.get("finish_reason") == "length":
            print("get_daily_vocab: model output reached token limit")
            return error_response("Vocabulary generation was incomplete. Please retry.", 503)

        content = (
            choice
                    .get("message", {})
                    .get("content", "") or ""
        )

        # Parse JSON
        vocab = None

        try:
            vocab = json.loads(content)
        except json.JSONDecodeError:
            pass

        if not vocab and "```json" in content:
            try:
                start = content.find("```json") + 7
                end = content.find("```", start)
                vocab = json.loads(content[start:end].strip())
            except Exception:
                pass

        if not vocab:
            try:
                start = content.find("{")
                end = content.rfind("}") + 1
                if start != -1 and end > start:
                    vocab = json.loads(content[start:end])
            except Exception:
                pass

        required_fields = ("word", "part_of_speech", "meaning", "example")
        if not isinstance(vocab, dict) or not all(
            isinstance(vocab.get(field), str) and vocab[field].strip()
            for field in required_fields
        ):
            print("get_daily_vocab: model returned invalid vocabulary JSON")
            return error_response("Vocabulary is temporarily unavailable. Please retry.", 503)

        return success_response(vocab)

    except Exception as e:
        print(f"get_daily_vocab error: {str(e)}")
        return error_response(str(e), 500)
