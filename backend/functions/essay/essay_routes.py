#Essay_routes.py
import json
from firebase_functions import https_fn, options
from auth.auth_service import require_auth
from essay.essay_service import essay_service
from essay.progress_service import progress_service
from utils.responses import response_builder

# Configure CORS
cors_options = options.CorsOptions(
    cors_origins="*",
    cors_methods=["GET", "POST", "OPTIONS"]
)

@https_fn.on_request(cors=cors_options)
@require_auth
def submit_essay(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Submit an essay for evaluation
    
    Endpoint: POST /submit_essay
    Headers: Authorization: Bearer <firebase_token>
    Body: {
        "essay_text": "...",
        "category": "essay_writing" | "ela" | "math" | "science"
    }
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "POST":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Parse request body
        request_data = req.get_json()
        
        if not request_data:
            return response_builder.validation_error("Request body is required")
        
        # Submit essay
        result = essay_service.submit_essay(user_id, request_data)
        
        # Update progress
        progress_update = progress_service.update_progress_after_submission(
            user_id,
            result["category"],
            result["total_score"]
        )
        
        # Add progress info to response
        result["progress"] = {
            "current_streak": progress_update["current_streak"],
            "max_streak": progress_update["max_streak"],
            "total_essays": progress_update["total_essays_submitted"],
            "streak_updated": progress_update["streak_updated"]
        }
        
        return response_builder.success(
            data=result,
            message="Essay submitted and evaluated successfully"
        )
        
    except ValueError as e:
        return response_builder.validation_error(str(e))
    except Exception as e:
        print(f"Error in submit_essay: {str(e)}")
        return response_builder.internal_error(
            "Failed to process essay submission"
        )


@https_fn.on_request(cors=cors_options)
@require_auth
def get_essay_submission(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get a specific essay submission
    
    Endpoint: GET /get_essay_submission?submission_id=<id>
    Headers: Authorization: Bearer <firebase_token>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Get submission_id from query params
        submission_id = req.args.get("submission_id")
        
        if not submission_id:
            return response_builder.validation_error("submission_id is required")
        
        # Get submission
        submission = essay_service.get_submission(submission_id, user_id)
        
        return response_builder.success(
            data=submission,
            message="Submission retrieved successfully"
        )
        
    except ValueError as e:
        return response_builder.not_found(str(e))
    except Exception as e:
        print(f"Error in get_essay_submission: {str(e)}")
        return response_builder.internal_error(
            "Failed to retrieve submission"
        )


@https_fn.on_request(cors=cors_options)
@require_auth
def get_user_submissions(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's essay submissions
    
    Endpoint: GET /get_user_submissions?limit=10&category=essay_writing
    Headers: Authorization: Bearer <firebase_token>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Get query params
        limit = int(req.args.get("limit", 10))
        category = req.args.get("category")
        
        # Get submissions
        submissions = essay_service.get_user_submissions(
            user_id,
            limit=limit,
            category=category
        )
        
        return response_builder.success(
            data={
                "submissions": submissions,
                "count": len(submissions)
            },
            message="Submissions retrieved successfully"
        )
        
    except Exception as e:
        print(f"Error in get_user_submissions: {str(e)}")
        return response_builder.internal_error(
            "Failed to retrieve submissions"
        )


@https_fn.on_request(cors=cors_options)
@require_auth
def get_streak(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's current streak information
    
    Endpoint: GET /get_streak
    Headers: Authorization: Bearer <firebase_token>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Get streak info
        streak_info = progress_service.get_streak_info(user_id)
        
        return response_builder.success(
            data=streak_info,
            message="Streak information retrieved successfully"
        )
        
    except Exception as e:
        print(f"Error in get_streak: {str(e)}")
        return response_builder.internal_error(
            "Failed to retrieve streak information"
        )


@https_fn.on_request(cors=cors_options)
@require_auth
def get_progress_stats(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's overall progress statistics
    
    Endpoint: GET /get_progress_stats
    Headers: Authorization: Bearer <firebase_token>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Get overall stats
        stats = progress_service.get_overall_stats(user_id)
        
        return response_builder.success(
            data=stats,
            message="Progress statistics retrieved successfully"
        )
        
    except Exception as e:
        print(f"Error in get_progress_stats: {str(e)}")
        return response_builder.internal_error(
            "Failed to retrieve progress statistics"
        )


@https_fn.on_request(cors=cors_options)
@require_auth
def get_category_stats(req: https_fn.Request, user_id: str) -> https_fn.Response:
    """
    Get user's category-wise statistics
    
    Endpoint: GET /get_category_stats
    Headers: Authorization: Bearer <firebase_token>
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "GET":
        return response_builder.error("Method not allowed", status=405)
    
    try:
        # Get category stats
        category_stats = progress_service.get_category_stats(user_id)
        
        return response_builder.success(
            data=category_stats,
            message="Category statistics retrieved successfully"
        )
        
    except Exception as e:
        print(f"Error in get_category_stats: {str(e)}")
        return response_builder.internal_error(
            "Failed to retrieve category statistics"
        )
        
@https_fn.on_request(cors=cors_options)
def submit_essay_no_auth(req: https_fn.Request) -> https_fn.Response:
    """
    Test endpoint for essay submission WITHOUT authentication
    For debugging only - remove in production
    
    Endpoint: POST /submit_essay_no_auth
    Body: {
        "essay_text": "...",
        "category": "essay_writing" | "ela" | "math" | "science"
    }
    """
    if req.method == "OPTIONS":
        return https_fn.Response(status=204)
    
    if req.method != "POST":
        return https_fn.Response(
            json.dumps({"error": "Method not allowed"}),
            status=405
        )
    
    try:
        print("=== SUBMIT ESSAY NO AUTH (DEBUG) ===")
        
        # Parse request body
        request_data = req.get_json()
        
        if not request_data:
            return https_fn.Response(
                json.dumps({"error": "Request body is required"}),
                status=400
            )
        
        essay_text = request_data.get("essay_text", "")
        category = request_data.get("category", "essay_writing")
        
        print(f"Essay text length: {len(essay_text)}")
        print(f"Category: {category}")
        print(f"First 100 chars: {essay_text[:100]}...")
        
        # Use a test user ID for debugging
        test_user_id = "debug_test_user_123"
        
        # Submit essay
        print("Calling essay_service.submit_essay()...")
        result = essay_service.submit_essay(test_user_id, request_data)
        
        print(f"Essay submission successful! ID: {result.get('submission_id')}")
        print(f"Total score: {result.get('total_score')}")
        print(f"Grade: {result.get('grade')}")
        
        # Return simplified response
        return https_fn.Response(
            json.dumps({
                "success": True,
                "message": "Essay submitted and evaluated successfully",
                "submission_id": result.get("submission_id"),
                "total_score": result.get("total_score"),
                "grade": result.get("grade"),
                "category": result.get("category"),
                "word_count": result.get("word_count"),
                "personalized_feedback": result.get("personalized_feedback")[:200] + "..." if result.get("personalized_feedback") else ""
            }, indent=2),
            status=200,
            headers={"Content-Type": "application/json"}
        )
        
    except ValueError as e:
        print(f"Validation error: {e}")
        return https_fn.Response(
            json.dumps({"error": str(e)}),
            status=400
        )
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"ERROR in submit_essay_no_auth: {error_details}")
        
        return https_fn.Response(
            json.dumps({
                "error": str(e),
                "details": error_details
            }),
            status=500
        )




@https_fn.on_request(cors=cors_options)
def test_essay_evaluator(req: https_fn.Request) -> https_fn.Response:
    """
    Test the essay evaluator directly
    """
    print("=== TEST ESSAY EVALUATOR ===")
    
    try:
        from llm.evaluator import essay_evaluator
        
        # Test with a simple essay
        test_essay = """Education is very important for everyone. 
        It helps us learn new skills and gain knowledge. 
        With education, we can get better jobs and improve our lives."""
        
        print(f"Testing with essay length: {len(test_essay)}")
        
        # Try evaluation
        result = essay_evaluator.evaluate_essay(test_essay, "essay_writing")
        
        print(f"Evaluation completed. Keys: {list(result.keys())}")
        
        return https_fn.Response(
            json.dumps({
                "success": True,
                "result": result,
                "test": "Essay evaluator test completed"
            }, indent=2),
            status=200,
            headers={"Content-Type": "application/json"}
        )
        
    except Exception as e:
        import traceback
        error_details = traceback.format_exc()
        print(f"Essay evaluator test failed: {error_details}")
        
        return https_fn.Response(
            json.dumps({
                "success": False,
                "error": str(e),
                "traceback": error_details
            }),
            status=500
        )