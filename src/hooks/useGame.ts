/**
 * useGame Hook
 * Handles submitting game results to the backend and tracking rewards.
 * Supports: Bug Catcher, Jumbled Story, Detail Detective, Boss Battle
 */

import { useState, useCallback } from 'react';
import {
  GameResult,
  GameRewards,
  GameSubmissionResponse,
  ApiResponse,
  DetailDetectiveEvaluation,
  DetailDetectiveResponse,
  BossBattleResponse,
  BossBattleResult,
} from '../models/GameModels';
import { apiClient } from '../api/apiClient';
import { ApiConfig } from '../api/apiConfig';

// ─── State ────────────────────────────────────────────────────────────────────

interface UseGameState {
  isSubmitting:     boolean;
  rewards:          GameRewards | null;
  error:            string | null;
  showRewardDialog: boolean;

  // Detail Detective specific
  detailEvaluation:     DetailDetectiveEvaluation | null;
  showDetailFeedback:   boolean;

  // Boss Battle specific
  bossBattleResult:     BossBattleResult | null;
  showBossRewardDialog: boolean;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useGame = () => {
  const [state, setState] = useState<UseGameState>({
    isSubmitting:         false,
    rewards:              null,
    error:                null,
    showRewardDialog:     false,
    detailEvaluation:     null,
    showDetailFeedback:   false,
    bossBattleResult:     null,
    showBossRewardDialog: false,
  });

  // ── Submit game result (Bug Catcher, Jumbled Story, Stay on Topic, Word Swap)
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

  // ── Submit Detail Detective sentence evaluation (uses Groq via backend) ────
  const submitDetailDetective = useCallback(async (
    originalSentence: string,
    improvedSentence: string,
  ): Promise<DetailDetectiveResponse | null> => {
    setState(prev => ({
      ...prev,
      isSubmitting:       true,
      error:              null,
      detailEvaluation:   null,
      showDetailFeedback: false,
    }));

    try {
      const response = await apiClient.post<ApiResponse<DetailDetectiveResponse>>(
        ApiConfig.Endpoints.DETAIL_DETECTIVE_EVALUATE,
        {
          original_sentence: originalSentence,
          improved_sentence: improvedSentence,
        }
      );

      const apiResponse = response.data;

      if (apiResponse?.success) {
        const { evaluation, rewards } = apiResponse.data;
        setState(prev => ({
          ...prev,
          isSubmitting:       false,
          detailEvaluation:   evaluation,
          showDetailFeedback: true,
          rewards,
          // Show the main reward dialog only on level up or badge unlock
          showRewardDialog:
            rewards.level_up || rewards.newly_unlocked_badges.length > 0,
        }));
        return apiResponse.data;
      } else {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          error:        apiResponse?.error || 'Failed to evaluate sentence',
        }));
        return null;
      }

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error:        err.message || 'Failed to evaluate sentence',
      }));
      return null;
    }
  }, []);

  // ── Submit Boss Battle essay (reuses essay evaluator on backend) ───────────
  const submitBossBattle = useCallback(async (
    essayText: string,
    state_code: string = 'PA',
    grade: string = '6',
  ): Promise<BossBattleResponse | null> => {
    setState(prev => ({
      ...prev,
      isSubmitting:     true,
      error:            null,
      bossBattleResult: null,
    }));

    try {
      const response = await apiClient.post<ApiResponse<BossBattleResponse>>(
        ApiConfig.Endpoints.BOSS_BATTLE_SUBMIT,
        {
          essay_text: essayText,
          state:      state_code,
          grade,
        }
      );

      const apiResponse = response.data;

      if (apiResponse?.success) {
        const { boss_battle, rewards } = apiResponse.data;
        setState(prev => ({
          ...prev,
          isSubmitting:         false,
          bossBattleResult:     boss_battle,
          rewards,
          showBossRewardDialog: true,
        }));
        return apiResponse.data;
      } else {
        setState(prev => ({
          ...prev,
          isSubmitting: false,
          error:        apiResponse?.error || 'Failed to submit Boss Battle',
        }));
        return null;
      }

    } catch (err: any) {
      setState(prev => ({
        ...prev,
        isSubmitting: false,
        error:        err.message || 'Failed to submit Boss Battle',
      }));
      return null;
    }
  }, []);

  // ── Dismiss reward dialog (no-AI games) ───────────────────────────────────
  const dismissRewardDialog = useCallback(() => {
    setState(prev => ({ ...prev, showRewardDialog: false, rewards: null }));
  }, []);

  // ── Dismiss Detail Detective feedback ─────────────────────────────────────
  const dismissDetailFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      showDetailFeedback: false,
      detailEvaluation:   null,
      showRewardDialog:   false,
      rewards:            null,
    }));
  }, []);

  // ── Dismiss Boss Battle reward dialog ─────────────────────────────────────
  const dismissBossRewardDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBossRewardDialog: false,
      bossBattleResult:     null,
      rewards:              null,
    }));
  }, []);

  // ── Clear error ───────────────────────────────────────────────────────────
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    // Shared
    isSubmitting:         state.isSubmitting,
    rewards:              state.rewards,
    error:                state.error,

    // No-AI games
    showRewardDialog:     state.showRewardDialog,
    submitGameResult,
    dismissRewardDialog,

    // Detail Detective
    detailEvaluation:     state.detailEvaluation,
    showDetailFeedback:   state.showDetailFeedback,
    submitDetailDetective,
    dismissDetailFeedback,

    // Boss Battle
    bossBattleResult:     state.bossBattleResult,
    showBossRewardDialog: state.showBossRewardDialog,
    submitBossBattle,
    dismissBossRewardDialog,

    // Utils
    clearError,
  };
};

export default useGame;