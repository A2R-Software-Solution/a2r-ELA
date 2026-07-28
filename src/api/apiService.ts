/**
 * API Service
 * Defines all API endpoints and methods
 */

import {
  GamificationData,
} from '../models/GamificationModels';
import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { ApiConfig } from './apiConfig';
import {
  ApiResponse,
  EssaySubmissionRequest,
  EssaySubmissionResponse,
  StreakInfo,
  ProgressStats,
  UserProfile,
  UpdateUserProfileRequest,
  CategoryStats,
  UserPreferences,
  SaveUserPreferencesRequest,
} from '../models/EssayModels';
import { LeaderboardResponse } from '../models/LeaderboardModels';

// ============================================================================
// PDF MODELS (local to apiService — not essay domain models)
// ============================================================================

export interface PdfExtractionRequest {
  fileName: string;
  fileData: string; // base64 encoded PDF
}

export interface PdfExtractionResponse {
  success:   boolean;
  text:      string;
  wordCount: number;
  error?:    string;
}

// ============================================================================
// PSSA MODELS (local to apiService — not essay domain models)
// ============================================================================

export type PssaDomain =
  | 'reading_fiction'
  | 'reading_informational'
  | 'vocabulary'
  | 'poetry'
  | 'craft_and_structure';

export type PssaDifficulty = 'easy' | 'medium' | 'hard';

export interface GeneratePssaQuestionsRequest {
  grade:      string; // e.g. "3", "4" — ← NEW, drives grade-specific content on backend
  domain:     PssaDomain;
  difficulty: PssaDifficulty;
  count:      number; // max 20 per call
}

export interface PssaMcqQuestion {
  id:              string;
  type:            'mcq';
  question:        string;
  options:         { A: string; B: string; C: string; D: string };
  correct_answer:  'A' | 'B' | 'C' | 'D';
  explanation:     string;
}

export interface PssaShortAnswerQuestion {
  id:           string;
  type:         'short_answer';
  question:     string;
  model_answer: string;
}

export type PssaQuestion = PssaMcqQuestion | PssaShortAnswerQuestion;

export interface PssaPassage {
  type:  string;
  title: string;
  text:  string;
}

export interface PssaQuestionsResponse {
  passage:         PssaPassage;
  questions:       PssaQuestion[];
  domain:          PssaDomain;
  difficulty:      PssaDifficulty;
  total_questions: number;
}

export interface EvaluatePssaWritingRequest {
  question:       string;
  student_answer: string;
  difficulty:     PssaDifficulty;
  grade:          string; // e.g. "3", "4" — ← NEW, grade-appropriate scoring language
}

export interface PssaWritingEvaluationResponse {
  score:              number;
  max_score:          number;
  feedback:           string;
  what_they_did_well: string;
  how_to_improve:     string;
  xp_earned:          number;
}

// ============================================================================
// API SERVICE
// ============================================================================

class ApiService {

  // --------------------------------------------------------------------------
  // ESSAY
  // --------------------------------------------------------------------------

  /**
   * Submit an essay for PSSA-aligned evaluation
   */
  async submitEssay(
    request: EssaySubmissionRequest,
  ): Promise<AxiosResponse<ApiResponse<EssaySubmissionResponse>>> {
    return apiClient.post(ApiConfig.Endpoints.SUBMIT_ESSAY, request);
  }

  /**
   * Get a specific essay submission by ID
   */
  async getEssaySubmission(
    submissionId: string,
  ): Promise<AxiosResponse<ApiResponse<EssaySubmissionResponse>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_ESSAY_SUBMISSION, {
      params: { submission_id: submissionId },
    });
  }

  /**
   * Get user's essay submissions
   */
  async getUserSubmissions(
    limit: number = 10,
    category?: string,
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_USER_SUBMISSIONS, {
      params: {
        limit,
        ...(category && { category }),
      },
    });
  }

  // --------------------------------------------------------------------------
  // USER PREFERENCES — State & Grade
  // --------------------------------------------------------------------------

  /**
   * Save user's state and grade preferences to Firestore.
   * Backend is the source of truth.
   */
  async saveUserPreferences(
    request: SaveUserPreferencesRequest,
  ): Promise<AxiosResponse<ApiResponse<UserPreferences>>> {
    return apiClient.post(ApiConfig.Endpoints.SAVE_USER_PREFERENCES, request);
  }

  /**
   * Get user's saved state and grade preferences.
   * Also returns supported_states and supported_grades for dropdown population.
   */
  async getUserPreferences(): Promise<AxiosResponse<ApiResponse<UserPreferences>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_USER_PREFERENCES);
  }

  // --------------------------------------------------------------------------
  // PROGRESS & STATS
  // --------------------------------------------------------------------------

  /**
   * Get user's current streak
   */
  async getStreak(): Promise<AxiosResponse<ApiResponse<StreakInfo>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_STREAK);
  }

  /**
   * Get user's progress statistics
   */
  async getProgressStats(): Promise<AxiosResponse<ApiResponse<ProgressStats>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_PROGRESS_STATS);
  }

  /**
   * Get category-wise statistics
   */
  async getCategoryStats(): Promise<AxiosResponse<ApiResponse<CategoryStats>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_CATEGORY_STATS);
  }

  // --------------------------------------------------------------------------
  // GAMIFICATION
  // --------------------------------------------------------------------------

  /**
   * Get user's current XP and level data
   */
  async getGamification(): Promise<AxiosResponse<ApiResponse<GamificationData>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_GAMIFICATION);
  }


  // --------------------------------------------------------------------------
  // VOCAB
  // --------------------------------------------------------------------------

  /**
   * Get a daily vocabulary word generated by Groq LLM
   */
  async getDailyVocab(): Promise<AxiosResponse<ApiResponse<{
    word: string;
    part_of_speech: string;
    meaning: string;
    example: string;
  }>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_DAILY_VOCAB);
  }


  // --------------------------------------------------------------------------
  // PSSA PRACTICE
  // --------------------------------------------------------------------------

  /**
   * Generate fresh PSSA-style practice questions for a single domain.
   * Backend caps count at 20 per call — caller batches across domains if needed.
   */
  async generatePssaQuestions(
    request: GeneratePssaQuestionsRequest,
  ): Promise<AxiosResponse<ApiResponse<PssaQuestionsResponse>>> {
    return apiClient.post(ApiConfig.Endpoints.GENERATE_PSSA_QUESTIONS, request);
  }

  /**
   * Evaluate a student's short answer / writing response for a PSSA question.
   */
  async evaluatePssaWriting(
    request: EvaluatePssaWritingRequest,
  ): Promise<AxiosResponse<ApiResponse<PssaWritingEvaluationResponse>>> {
    return apiClient.post(ApiConfig.Endpoints.EVALUATE_PSSA_WRITING, request);
  }

  // --------------------------------------------------------------------------
  // LEADERBOARD
  // --------------------------------------------------------------------------

  /**
   * Get top 10 users in the same grade as the current user, ranked by XP.
   * Grade is read from user's saved preferences on the backend.
   *
   * @param gradeOverride  Optional grade string to override saved preference
   */
  async getGradeLeaderboard(
    gradeOverride?: string,
  ): Promise<AxiosResponse<ApiResponse<LeaderboardResponse>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_GRADE_LEADERBOARD, {
      params: gradeOverride ? { grade: gradeOverride } : {},
    });
  }

  /**
   * Get top 10 users in the same state as the current user, ranked by XP.
   * State is read from user's saved preferences on the backend.
   *
   * @param stateOverride  Optional state code to override saved preference e.g. "PA"
   */
  async getStateLeaderboard(
    stateOverride?: string,
  ): Promise<AxiosResponse<ApiResponse<LeaderboardResponse>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_STATE_LEADERBOARD, {
      params: stateOverride ? { state: stateOverride } : {},
    });
  }

  // --------------------------------------------------------------------------
  // USER PROFILE
  // --------------------------------------------------------------------------

  /**
   * Get user profile data from Firestore.
   * Returns display_name, birthdate, photo_url, created_at, updated_at.
   * Returns null values for fields not yet set — never throws for missing data.
   */
  async getUserProfile(): Promise<AxiosResponse<ApiResponse<UserProfile>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_USER_PROFILE);
  }

  /**
   * Update any combination of user profile fields in Firestore.
   * All fields are optional — only provided fields are updated.
   *
   * To remove photo: pass { photo_url: null }
   */
  async updateUserProfile(
    request: UpdateUserProfileRequest,
  ): Promise<AxiosResponse<ApiResponse<UserProfile>>> {
    return apiClient.post(ApiConfig.Endpoints.UPDATE_USER_PROFILE, request);
  }

  /**
   * Permanently delete the current user's account and all associated data.
   * Backend deletes: essay_submissions, user_preferences, user_progress,
   * gamification, users doc, and Firebase Auth user — in that order.
   */
  async deleteAccount(): Promise<AxiosResponse<ApiResponse<null>>> {
    return apiClient.delete(ApiConfig.Endpoints.DELETE_ACCOUNT);
  }

  // --------------------------------------------------------------------------
  // FILE
  // --------------------------------------------------------------------------

  /**
   * Extract text from a base64-encoded PDF file
   */
  async extractPdfText(
    request: PdfExtractionRequest,
  ): Promise<PdfExtractionResponse> {
    try {
      const response: AxiosResponse<ApiResponse<PdfExtractionResponse>> =
        await apiClient.post(ApiConfig.Endpoints.EXTRACT_PDF_TEXT, request);

      if (response.data.success && response.data.data) {
        return response.data.data;
      } else {
        return {
          success:   false,
          text:      '',
          wordCount: 0,
          error:     response.data.message || 'Failed to extract text from PDF',
        };
      }
    } catch (error: any) {
      console.error('Error extracting PDF text:', error);
      return {
        success:   false,
        text:      '',
        wordCount: 0,
        error:     error.response?.data?.message || 'Failed to extract text from PDF',
      };
    }
  }

  // --------------------------------------------------------------------------
  // HEALTH
  // --------------------------------------------------------------------------

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<AxiosResponse<Record<string, any>>> {
    return apiClient.get(ApiConfig.Endpoints.HEALTH_CHECK);
  }
}

// Export singleton instance
export const apiService = new ApiService();
export default apiService;