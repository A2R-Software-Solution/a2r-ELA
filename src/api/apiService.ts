/**
 * API Service
 * Defines all API endpoints and methods
 * TypeScript equivalent of Retrofit ApiService interface
 */

import { AxiosResponse } from 'axios';
import { apiClient } from './apiClient';
import { ApiConfig } from './apiConfig';
import {
  ApiResponse,
  EssaySubmissionRequest,
  EssaySubmissionResponse,
  StreakInfo,
  ProgressStats,
  CategoryStats,
} from '../models/EssayModels';

/**
 * API Service class with all endpoint methods
 */
class ApiService {
  /**
   * Submit an essay for evaluation
   */
  async submitEssay(
    request: EssaySubmissionRequest
  ): Promise<AxiosResponse<ApiResponse<EssaySubmissionResponse>>> {
    return apiClient.post(ApiConfig.Endpoints.SUBMIT_ESSAY, request);
  }

  /**
   * Get a specific essay submission by ID
   */
  async getEssaySubmission(
    submissionId: string
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
    category?: string
  ): Promise<AxiosResponse<ApiResponse<Record<string, any>>>> {
    return apiClient.get(ApiConfig.Endpoints.GET_USER_SUBMISSIONS, {
      params: {
        limit,
        ...(category && { category }),
      },
    });
  }

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

  /**
   * Health check endpoint
   */
  async healthCheck(): Promise<AxiosResponse<Record<string, any>>> {
    return apiClient.get(ApiConfig.Endpoints.HEALTH_CHECK);
  }
}

// Export singleton instance
export default new ApiService();