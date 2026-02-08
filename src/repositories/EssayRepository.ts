/**
 * Essay Repository
 * Handles all essay-related API calls and data operations
 */

import apiService from '../api/apiService';
import { Result } from '../models/Result';
import {
  EssaySubmissionResponse,
  EssayCategory,
  StreakInfo,
  ProgressStats,
  CategoryStats,
} from '../models/EssayModels';

class EssayRepository {
  /**
   * Submit an essay for evaluation
   */
  async submitEssay(
    essayText: string,
    category: EssayCategory
  ): Promise<Result<EssaySubmissionResponse>> {
    try {
      const request = {
        essay_text: essayText,
        category: category,
      };

      const response = await apiService.submitEssay(request);

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to submit essay'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(
        error,
        error.message || 'Network error occurred'
      );
    }
  }

  /**
   * Get user's current streak information
   */
  async getStreak(): Promise<Result<StreakInfo>> {
    try {
      const response = await apiService.getStreak();

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to get streak'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(
        error,
        error.message || 'Network error occurred'
      );
    }
  }

  /**
   * Get user's overall progress statistics
   */
  async getProgressStats(): Promise<Result<ProgressStats>> {
    try {
      const response = await apiService.getProgressStats();

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to get progress stats'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(
        error,
        error.message || 'Network error occurred'
      );
    }
  }

  /**
   * Get category-wise statistics
   */
  async getCategoryStats(): Promise<Result<CategoryStats>> {
    try {
      const response = await apiService.getCategoryStats();

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to get category stats'),
            body.error || 'Unknown error'
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}: ${response.statusText}`),
          `Server error: ${response.statusText}`
        );
      }
    } catch (error: any) {
      return Result.error(
        error,
        error.message || 'Network error occurred'
      );
    }
  }

  /**
   * Health check to verify backend connectivity
   */
  async healthCheck(): Promise<Result<boolean>> {
    try {
      const response = await apiService.healthCheck();
      if (response.status >= 200 && response.status < 300) {
        return Result.success(true);
      } else {
        return Result.error(
          new Error('Backend not reachable'),
          'Health check failed'
        );
      }
    } catch (error: any) {
      return Result.error(error, 'Cannot connect to backend');
    }
  }
}

// Export singleton instance
export default new EssayRepository();