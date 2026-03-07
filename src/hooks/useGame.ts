/**
 * useGame Hook
 * Handles submitting game results to the backend and tracking rewards.
 */

import { useState, useCallback } from 'react';
import {
  GameResult,
  GameRewards,
  GameSubmissionResponse,
  ApiResponse,
} from '../models/GameModels';
import { apiClient } from '../api/apiClient';
import { ApiConfig } from '../api/apiConfig';

// ─── State ────────────────────────────────────────────────────────────────────

interface UseGameState {
  isSubmitting:     boolean;
  rewards:          GameRewards | null;
  error:            string | null;
  showRewardDialog: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGame = () => {
  const [state, setState] = useState<UseGameState>({
    isSubmitting:     false,
    rewards:          null,
    error:            null,
    showRewardDialog: false,
  });

  // ── Submit game result to backend ─────────────────────────────────────────
  const submitGameResult = useCallback(async (result: GameResult): Promise<GameRewards | null> => {
    setState(prev => ({ ...prev, isSubmitting: true, error: null }));

    try {
      const response = await apiClient.post<ApiResponse<GameSubmissionResponse>>(
        ApiConfig.Endpoints.SUBMIT_GAME_RESULT,
        {
          game_id:         result.gameId,
          score:           result.score,
          time_taken:      result.timeTaken,
          lives_remaining: result.livesRemaining,
        }
      );

      const apiResponse = response.data;

      if (apiResponse?.success) {
        const rewards = apiResponse.data.rewards;
        setState(prev => ({
          ...prev,
          isSubmitting:     false,
          rewards,
          showRewardDialog: true,
        }));
        return rewards;
      } else {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          error:        apiResponse?.error || 'Failed to submit game result',
        }));
        return null;
      }

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error:        err.message || 'Failed to submit game result',
      }));
      return null;
    }
  }, []);

  //  Dismiss reward dialog 
  const dismissRewardDialog = useCallback(() => {
    setState(prev => ({ ...prev, showRewardDialog: false, rewards: null }));
  }, []);

  //  Clear error 
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    isSubmitting:     state.isSubmitting,
    rewards:          state.rewards,
    error:            state.error,
    showRewardDialog: state.showRewardDialog,
    submitGameResult,
    dismissRewardDialog,
    clearError,
  };
};

export default useGame;