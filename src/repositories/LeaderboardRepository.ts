/**
 * Leaderboard Repository
 * Handles all leaderboard-related API calls.
 * Mirrors the same pattern as EssayRepository.
 */

import apiService from '../api/apiService';
import { Result } from '../models/Result';
import { LeaderboardResponse } from '../models/LeaderboardModels';

class LeaderboardRepository {

  // --------------------------------------------------------------------------
  // GRADE LEADERBOARD
  // --------------------------------------------------------------------------

  /**
   * Fetch top 10 users in the same grade as the current user, ranked by XP.
   * Grade is read from user's saved preferences on the backend.
   *
   * @param gradeOverride  Optional grade string to override saved preference
   */
  async getGradeLeaderboard(
    gradeOverride?: string,
  ): Promise<Result<LeaderboardResponse>> {
    try {
      const response = await apiService.getGradeLeaderboard(gradeOverride);

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to fetch grade leaderboard'),
            body.error || 'Unknown error',
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}`),
          'Server error occurred',
        );
      }
    } catch (error: any) {
      return Result.error(error, error.message || 'Network error occurred');
    }
  }

  // --------------------------------------------------------------------------
  // STATE LEADERBOARD
  // --------------------------------------------------------------------------

  /**
   * Fetch top 10 users in the same state as the current user, ranked by XP.
   * State is read from user's saved preferences on the backend.
   *
   * @param stateOverride  Optional state code to override saved preference e.g. "PA"
   */
  async getStateLeaderboard(
    stateOverride?: string,
  ): Promise<Result<LeaderboardResponse>> {
    try {
      const response = await apiService.getStateLeaderboard(stateOverride);

      if (response.status >= 200 && response.status < 300) {
        const body = response.data;
        if (body.success && body.data) {
          return Result.success(body.data);
        } else {
          return Result.error(
            new Error(body.error || 'Failed to fetch state leaderboard'),
            body.error || 'Unknown error',
          );
        }
      } else {
        return Result.error(
          new Error(`HTTP ${response.status}`),
          'Server error occurred',
        );
      }
    } catch (error: any) {
      return Result.error(error, error.message || 'Network error occurred');
    }
  }
}

// Export singleton instance — same pattern as EssayRepository
export default new LeaderboardRepository();