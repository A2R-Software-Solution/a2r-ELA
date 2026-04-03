/**
 * useLeaderboard Hook
 * Manages all state and data fetching for the Leaderboard screen.
 *
 * - Fetches grade leaderboard on mount
 * - Re-fetches when user switches tabs
 * - Exposes tab switch handler and refresh handler
 */

import { useState, useEffect, useCallback } from 'react';
import LeaderboardRepository from '../../../repositories/LeaderboardRepository';
import { LeaderboardTab } from '../../../models/LeaderboardModels';
import { Result } from '../../../models/Result';
import {
  LeaderboardUiState,
  initialLeaderboardUiState,
} from '../types/LeaderboardUiState';

const useLeaderboard = () => {
  const [state, setState] = useState<LeaderboardUiState>(initialLeaderboardUiState);

  // --------------------------------------------------------------------------
  // FETCH
  // --------------------------------------------------------------------------

  const fetchLeaderboard = useCallback(async (tab: LeaderboardTab) => {
    // Set loading, clear previous error
    setState(prev => ({
      ...prev,
      isLoading:    true,
      errorMessage: null,
    }));

    try {
      const result =
        tab === 'grade'
          ? await LeaderboardRepository.getGradeLeaderboard()
          : await LeaderboardRepository.getStateLeaderboard();

      console.log('Leaderboard result:', JSON.stringify(result));

      // ✅ FIXED: use Result.isSuccess() type guard instead of result.isSuccess
      if (Result.isSuccess(result)) {
        setState(prev => ({
          ...prev,
          isLoading:       false,
          entries:         result.data.entries,
          currentUserRank: result.data.current_user_rank,
          filterLabel:     result.data.filter_label,
          totalUsers:      result.data.total_users,
          errorMessage:    null,
        }));
      } else if (Result.isError(result)) {
        // ✅ FIXED: use Result.isError() type guard and result.message
        console.log('Leaderboard error:', result.message);
        setState(prev => ({
          ...prev,
          isLoading:    false,
          errorMessage: result.message || 'Failed to load leaderboard',
          entries:      [],
        }));
      }
    } catch (error: any) {
      console.log('Leaderboard exception:', error.message);
      setState(prev => ({
        ...prev,
        isLoading:    false,
        errorMessage: error.message || 'Something went wrong',
        entries:      [],
      }));
    }
  }, []);

  // --------------------------------------------------------------------------
  // ON MOUNT — fetch grade leaderboard by default
  // --------------------------------------------------------------------------

  useEffect(() => {
    fetchLeaderboard('grade');
  }, [fetchLeaderboard]);

  // --------------------------------------------------------------------------
  // TAB SWITCH
  // --------------------------------------------------------------------------

  const onTabChange = useCallback((tab: LeaderboardTab) => {
    setState(prev => ({ ...prev, activeTab: tab }));
    fetchLeaderboard(tab);
  }, [fetchLeaderboard]);

  // --------------------------------------------------------------------------
  // REFRESH
  // --------------------------------------------------------------------------

  const onRefresh = useCallback(() => {
    fetchLeaderboard(state.activeTab);
  }, [fetchLeaderboard, state.activeTab]);

  // --------------------------------------------------------------------------
  // RETURN
  // --------------------------------------------------------------------------

  return {
    ...state,
    onTabChange,
    onRefresh,
  };
};

export default useLeaderboard;