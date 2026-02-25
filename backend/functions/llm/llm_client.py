import requests
import json
from typing import Dict, Any, List, Optional
from config.settings import settings
import traceback

class LLMClient:
    """OpenRouter LLM Client for essay evaluation"""
    
    def __init__(self):
        self.api_key = settings.OPENROUTER_API_KEY
        self.base_url = settings.OPENROUTER_BASE_URL
        self.model = settings.OPENROUTER_MODEL
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
            "HTTP-Referer": "https://github.com/yourusername/e-learning-app",
            "X-Title": "E-Learning Essay App"
        }
        
        print(f"LLMClient initialized")
        print(f"Base URL: {self.base_url}")
        print(f"Model: {self.model}")
        print(f"API Key present: {bool(self.api_key)}")
        if self.api_key:
            print(f"API Key length: {len(self.api_key)}")
    
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
        url = f"{self.base_url}/chat/completions"
        
        payload = {
            "model": self.model,
            "messages": messages,
            "temperature": temperature or settings.LLM_TEMPERATURE,
            "max_tokens": max_tokens or settings.LLM_MAX_TOKENS
        }
        
        print(f"Making LLM API request to: {url}")
        print(f"Payload model: {payload['model']}")
        print(f"Messages count: {len(messages)}")
        
        try:
            response = requests.post(
                url,
                headers=self.headers,
                json=payload,
                timeout=settings.LLM_TIMEOUT
            )
            
            print(f"Response status code: {response.status_code}")
            
            if response.status_code != 200:
                print(f"Error response body: {response.text}")
            
            response.raise_for_status()
            result = response.json()
            print(f"LLM API call successful")
            return result
            
        except requests.exceptions.Timeout as e:
            print(f"LLM API Timeout: {str(e)}")
            raise Exception(f"LLM API Timeout after {settings.LLM_TIMEOUT} seconds")
        except requests.exceptions.ConnectionError as e:
            print(f"LLM API Connection Error: {str(e)}")
            raise Exception(f"Failed to connect to LLM API: {str(e)}")
        except requests.exceptions.HTTPError as e:
            print(f"LLM API HTTP Error: {str(e)}")
            print(f"Response text: {e.response.text if hasattr(e, 'response') else 'No response'}")
            raise Exception(f"LLM API HTTP Error: {str(e)}")
        except requests.exceptions.RequestException as e:
            print(f"LLM API Request Error: {str(e)}")
            print(f"Traceback: {traceback.format_exc()}")
            raise Exception(f"LLM API Error: {str(e)}")
        except json.JSONDecodeError as e:
            print(f"Failed to parse LLM response as JSON: {str(e)}")
            raise Exception(f"Invalid JSON response from LLM API")
    
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
        
        messages = [
            {
                "role": "user",
                "content": prompt
            }
        ]
        
        try:
            response = self.create_chat_completion(messages)
            
            # Extract the assistant's message
            assistant_message = response.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            print(f"Received response from LLM, length: {len(assistant_message)}")
            print(f"Response preview: {assistant_message[:200]}...")
            
            # Strategy 1: Direct JSON parse
            try:
                evaluation = json.loads(assistant_message)
                print(f"Successfully parsed JSON response (direct)")
                return evaluation
            except json.JSONDecodeError:
                pass
            
            # Strategy 2: Extract from markdown code blocks
            if "```json" in assistant_message:
                try:
                    json_start = assistant_message.find("```json") + 7
                    json_end = assistant_message.find("```", json_start)
                    json_str = assistant_message[json_start:json_end].strip()
                    evaluation = json.loads(json_str)
                    print(f"Successfully parsed JSON from markdown code block")
                    return evaluation
                except Exception as e:
                    print(f"Failed to extract from markdown: {str(e)}")
            
            # Strategy 3: Extract from any code block
            if "```" in assistant_message:
                try:
                    json_start = assistant_message.find("```") + 3
                    if assistant_message[json_start:json_start+10].strip().split()[0].isalpha():
                        json_start = assistant_message.find("\n", json_start) + 1
                    json_end = assistant_message.find("```", json_start)
                    json_str = assistant_message[json_start:json_end].strip()
                    evaluation = json.loads(json_str)
                    print(f"Successfully parsed JSON from generic code block")
                    return evaluation
                except Exception as e:
                    print(f"Failed to extract from code block: {str(e)}")

            # Strategy 4: Find first { ... } block in the response
            try:
                json_start = assistant_message.find("{")
                json_end = assistant_message.rfind("}") + 1
                if json_start != -1 and json_end > json_start:
                    json_str = assistant_message[json_start:json_end]
                    evaluation = json.loads(json_str)
                    print(f"Successfully parsed JSON from raw brace extraction")
                    return evaluation
            except Exception as e:
                print(f"Failed brace extraction: {str(e)}")
            
            # All strategies failed — return safe fallback with correct PSSA keys
            print(f"All JSON parsing strategies failed")
            print(f"Raw response: {assistant_message[:500]}")
            return {
                "raw_scores": {          # ✅ correct key matching PSSA domains
                    "focus": 1,
                    "content": 1,
                    "organization": 1,
                    "style": 1,
                    "conventions": 1,
                },
                "raw_justifications": {
                    "focus": "Could not parse LLM response",
                    "content": "Could not parse LLM response",
                    "organization": "Could not parse LLM response",
                    "style": "Could not parse LLM response",
                    "conventions": "Could not parse LLM response",
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
            print(f"Traceback: {traceback.format_exc()}")
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
            
            feedback = response.get("choices", [{}])[0].get("message", {}).get("content", "Great work on your essay! Keep practicing to improve further.")
            print(f"Generated feedback successfully")
            return feedback
        except Exception as e:
            print(f"Error generating feedback: {str(e)}")
            return "Great work on your essay! Keep practicing to improve further."

# Initialize global LLM client
llm_client = LLMClient()