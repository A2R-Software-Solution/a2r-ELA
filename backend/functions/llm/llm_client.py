import requests
import json
from typing import Dict, Any, List, Optional
from config.settings import settings
import traceback


class LLMClient:
    """OpenRouter LLM Client for essay evaluation"""

    def __init__(self):
        self._api_key = None
        self._base_url = None
        self._model = None
        self._headers = None
        self._initialized = False

    def _ensure_initialized(self):
        """Lazy initialization — only runs on first actual use, not at import time"""
        if not self._initialized:
            self._api_key = settings.OPENROUTER_API_KEY
            self._base_url = settings.OPENROUTER_BASE_URL
            self._model = settings.OPENROUTER_MODEL
            self._headers = {
                "Authorization": f"Bearer {self._api_key}",
                "Content-Type": "application/json",
                "HTTP-Referer": "https://github.com/yourusername/e-learning-app",
                "X-Title": "E-Learning Essay App"
            }
            self._initialized = True

    @property
    def api_key(self):
        self._ensure_initialized()
        return self._api_key

    @property
    def base_url(self):
        self._ensure_initialized()
        return self._base_url

    @property
    def model(self):
        self._ensure_initialized()
        return self._model

    @property
    def headers(self):
        self._ensure_initialized()
        return self._headers

    def create_chat_completion(
        self,
        messages: List[Dict[str, str]],
        temperature: float = None,
        max_tokens: int = None
    ) -> Dict[str, Any]:
        """
        Create a chat completion using OpenRouter API

        Args:
            messages: List of message dictionaries with 'role' and 'content'
            temperature: Sampling temperature (0-1)
            max_tokens: Maximum tokens to generate

        Returns:
            API response dictionary
        """
        self._ensure_initialized()

        url = f"{self.base_url}/chat/completions"

        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature or settings.LLM_TEMPERATURE,
            "max_tokens": max_tokens or settings.LLM_MAX_TOKENS
        }

        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=settings.LLM_TIMEOUT
            )

            if response.status_code != 200:
                print(f"LLM error response [{response.status_code}]: {response.text}")

            response.raise_for_status()
            result = response.json()
            return result

        except requests.exceptions.Timeout:
            raise Exception(f"LLM API Timeout after {settings.LLM_TIMEOUT} seconds")
        except requests.exceptions.ConnectionError as e:
            raise Exception(f"Failed to connect to LLM API: {str(e)}")
        except requests.exceptions.HTTPError as e:
            body = e.response.text if hasattr(e, 'response') else 'No response'
            raise Exception(f"LLM API HTTP Error: {str(e)} — {body}")
        except requests.exceptions.RequestException as e:
            raise Exception(f"LLM API Error: {str(e)}")
        except json.JSONDecodeError:
            raise Exception("Invalid JSON response from LLM API")

    def evaluate_essay(
        self,
        essay_text: str,
        prompt: str,
        category: str = "essay_writing"
    ) -> Dict[str, Any]:
        """
        Evaluate an essay using the LLM

        Args:
            essay_text: The student's essay text
            prompt: The evaluation prompt
            category: Essay category

        Returns:
            Parsed evaluation response
        """
        print(f"Starting essay evaluation for category: {category}")

        messages = [{"role": "user", "content": prompt}]

        try:
            response = self.create_chat_completion(messages)
            assistant_message = (
                response.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "")
            )

            print(f"Received LLM response, length: {len(assistant_message)}")

            # Strategy 1: Direct JSON parse
            try:
                return json.loads(assistant_message)
            except json.JSONDecodeError:
                pass

            # Strategy 2: Extract from ```json ... ``` block
            if "```json" in assistant_message:
                try:
                    start = assistant_message.find("```json") + 7
                    end = assistant_message.find("```", start)
                    return json.loads(assistant_message[start:end].strip())
                except Exception:
                    pass

            # Strategy 3: Extract from any ``` ... ``` block
            if "```" in assistant_message:
                try:
                    start = assistant_message.find("```") + 3
                    if assistant_message[start:start + 10].strip().split()[0].isalpha():
                        start = assistant_message.find("\n", start) + 1
                    end = assistant_message.find("```", start)
                    return json.loads(assistant_message[start:end].strip())
                except Exception:
                    pass

            # Strategy 4: Find first { ... } block
            try:
                start = assistant_message.find("{")
                end = assistant_message.rfind("}") + 1
                if start != -1 and end > start:
                    return json.loads(assistant_message[start:end])
            except Exception:
                pass

            # All strategies failed — return safe fallback
            print(f"All JSON parsing strategies failed. Raw response: {assistant_message[:500]}")
            return {
                "raw_scores": {
                    "focus": 1,
                    "content": 1,
                    "organization": 1,
                    "style": 1,
                    "conventions": 1,
                },
                "raw_justifications": {
                    domain: "Could not parse LLM response"
                    for domain in ["focus", "content", "organization", "style", "conventions"]
                },
                "strengths": ["Good effort on completing the essay"],
                "areas_for_improvement": ["Keep practicing to improve your writing"],
                "pssa_total": 5,
                "converted_score": 25,
                "error": "Failed to parse JSON response",
                "raw_response": assistant_message,
            }

        except Exception as e:
            print(f"Error in evaluate_essay: {str(e)}")
            print(traceback.format_exc())
            raise

    def generate_feedback(
        self,
        essay_text: str,
        rubric_scores: Dict[str, int],
        total_score: int
    ) -> str:
        """
        Generate personalized feedback based on scores

        Args:
            essay_text: The student's essay
            rubric_scores: Dictionary of domain -> converted scores (5-20)
            total_score: Total score (25-100)

        Returns:
            Personalized feedback text
        """
        score_lines = "\n".join(
            f"- {domain.replace('_', ' ').title()}: {score}/20"
            for domain, score in rubric_scores.items()
        )

        prompt = f"""Based on the following essay evaluation, provide personalized, encouraging feedback for the student.

Essay excerpt: "{essay_text[:200]}..."

Scores:
- Total Score: {total_score}/100
{score_lines}

Provide:
1. A brief positive comment about strengths (2-3 sentences)
2. One specific area for improvement with actionable advice (2-3 sentences)
3. An encouraging closing statement (1 sentence)

Keep the tone supportive, constructive, and age-appropriate for students."""

        try:
            messages = [{"role": "user", "content": prompt}]
            response = self.create_chat_completion(messages, temperature=0.7)
            return (
                response.get("choices", [{}])[0]
                        .get("message", {})
                        .get("content", "Great work on your essay! Keep practicing to improve further.")
            )
        except Exception as e:
            print(f"Error generating feedback: {str(e)}")
            return "Great work on your essay! Keep practicing to improve further."


# Lightweight singleton — no network calls until first use
llm_client = LLMClient()