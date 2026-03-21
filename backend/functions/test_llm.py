# functions/test_llm.py
# This will test if the LLM API is working and show the actual response

from firebase_functions import https_fn, options
import json
import traceback
from config.settings import settings
from llm.llm_client import llm_client
from llm.prompts import essay_prompts

@https_fn.on_request(
    cors=options.CorsOptions(cors_origins="*", cors_methods=["GET", "POST"])
)
def test_llm_connection(req: https_fn.Request) -> https_fn.Response:
    """
    Test endpoint to verify LLM API connection
    
    Endpoint: GET /test_llm_connection
    """
    results = {}
    
    # Test 1: Check API key
    results["api_key_present"] = bool(settings.OPENROUTER_API_KEY)
    results["api_key_length"] = len(settings.OPENROUTER_API_KEY) if settings.OPENROUTER_API_KEY else 0
    results["base_url"] = settings.OPENROUTER_BASE_URL
    results["model"] = settings.OPENROUTER_MODEL
    
    # Test 2: Try a simple LLM call
    try:
        messages = [
            {"role": "user", "content": "Say 'Hello World' and nothing else."}
        ]
        
        response = llm_client.create_chat_completion(messages, max_tokens=50)
        
        results["llm_test"] = "SUCCESS"
        results["llm_response"] = response.get("choices", [{}])[0].get("message", {}).get("content", "")
        
    except Exception as e:
        results["llm_test"] = "FAILED"
        results["llm_error"] = str(e)
        results["llm_traceback"] = traceback.format_exc()
    
    # Test 3: Try the actual essay evaluation prompt
    try:
        test_essay = "Education is important for personal growth and success. It helps us learn new skills and understand the world better."
        
        eval_prompt = essay_prompts.get_evaluation_prompt(test_essay, "essay_writing")
        
        messages = [
            {"role": "user", "content": eval_prompt}
        ]
        
        eval_response = llm_client.create_chat_completion(messages, max_tokens=1500)
        raw_eval = eval_response.get("choices", [{}])[0].get("message", {}).get("content", "")
        
        results["eval_test"] = "SUCCESS"
        results["eval_prompt_length"] = len(eval_prompt)
        results["eval_raw_response"] = raw_eval
        results["eval_response_length"] = len(raw_eval)
        
        # Try to parse as JSON
        try:
            # First try direct parse
            eval_json = json.loads(raw_eval)
            results["eval_json_parse"] = "SUCCESS - Direct parse"
            results["eval_parsed_data"] = eval_json
        except json.JSONDecodeError as je:
            results["eval_json_parse"] = "FAILED - Direct parse"
            results["eval_json_error"] = str(je)
            
            # Try extracting from markdown
            if "```json" in raw_eval:
                try:
                    json_start = raw_eval.find("```json") + 7
                    json_end = raw_eval.find("```", json_start)
                    json_str = raw_eval[json_start:json_end].strip()
                    eval_json = json.loads(json_str)
                    results["eval_json_parse"] = "SUCCESS - Extracted from markdown"
                    results["eval_parsed_data"] = eval_json
                except Exception as e2:
                    results["eval_json_parse"] = "FAILED - Markdown extraction also failed"
                    results["eval_markdown_error"] = str(e2)
            else:
                results["eval_json_parse"] = "FAILED - No markdown blocks found"
        
    except Exception as e:
        results["eval_test"] = "FAILED"
        results["eval_error"] = str(e)
        results["eval_traceback"] = traceback.format_exc()
    
    return https_fn.Response(
        response=json.dumps(results, indent=2),
        status=200,
        headers={"Content-Type": "application/json"}
    )