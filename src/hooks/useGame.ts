/**
 * useGame Hook
 * Handles submitting game results to the backend and tracking rewards.
 * Supports: Bug Catcher, Jumbled Story, Stay on Topic, Word Swap,
 *           Detail Detective, Boss Battle
 *
 * ✅ FIX: Replaced `catch (err: any)` with `catch (e)` + manual cast
 *         because Hermes JS engine (React Native) throws
 *         "ReferenceError: Property 'err' doesn't exist" on typed catch params.
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
  isSubmitting:         boolean;
  rewards:              GameRewards | null;
  error:                string | null;
  showRewardDialog:     boolean;

  detailEvaluation:     DetailDetectiveEvaluation | null;
  showDetailFeedback:   boolean;

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

  // ─── Submit game result (Bug Catcher, Jumbled Story, Stay on Topic, Word Swap)

  const submitGameResult = useCallback(
    async (result: GameResult): Promise<GameRewards | null> => {
      setState(prev => ({ ...prev, isSubmitting: true, error: null }));

      try {
        const response = await apiClient.post<ApiResponse<GameSubmissionResponse>>(
          ApiConfig.Endpoints.SUBMIT_GAME_RESULT,
          {
            game_id:         result.gameId,
            score:           result.score,
            time_taken:      result.timeTaken,
            lives_remaining: result.livesRemaining,
          },
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
            error: apiResponse?.error ?? 'Failed to submit game result',
          }));
          return null;
        }

      } catch (e) {
        // ✅ FIX: Hermes crashes on `catch (err: any)` typed syntax.
        //         Cast manually instead.
        const errMsg = (e as any)?.message ?? 'Failed to submit game result';
        setState(prev => ({ ...prev, isSubmitting: false, error: errMsg }));
        return null;
      }
    },
    [],
  );

  // ─── Submit Detail Detective sentence evaluation ──────────────────────────

  const submitDetailDetective = useCallback(
    async (
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
          },
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
            showRewardDialog:
              rewards.level_up || rewards.newly_unlocked_badges.length > 0,
          }));
          return apiResponse.data;
        } else {
          setState(prev => ({
            ...prev,
            isSubmitting: false,
            error: apiResponse?.error ?? 'Failed to evaluate sentence',
          }));
          return null;
        }

      } catch (e) {
        const errMsg = (e as any)?.message ?? 'Failed to evaluate sentence';
        setState(prev => ({ ...prev, isSubmitting: false, error: errMsg }));
        return null;
      }
    },
    [],
  );

  // ─── Submit Boss Battle essay ─────────────────────────────────────────────

  const submitBossBattle = useCallback(
    async (
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
          },
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
            error: apiResponse?.error ?? 'Failed to submit Boss Battle',
          }));
          return null;
        }

      } catch (e) {
        const errMsg = (e as any)?.message ?? 'Failed to submit Boss Battle';
        setState(prev => ({ ...prev, isSubmitting: false, error: errMsg }));
        return null;
      }
    },
    [],
  );

  // ─── Dismiss helpers ──────────────────────────────────────────────────────

  const dismissRewardDialog = useCallback(() => {
    setState(prev => ({ ...prev, showRewardDialog: false, rewards: null }));
  }, []);

  const dismissDetailFeedback = useCallback(() => {
    setState(prev => ({
      ...prev,
      showDetailFeedback: false,
      detailEvaluation:   null,
      showRewardDialog:   false,
      rewards:            null,
    }));
  }, []);

  const dismissBossRewardDialog = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBossRewardDialog: false,
      bossBattleResult:     null,
      rewards:              null,
    }));
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  return {
    isSubmitting:         state.isSubmitting,
    rewards:              state.rewards,
    error:                state.error,

    showRewardDialog:     state.showRewardDialog,
    submitGameResult,
    dismissRewardDialog,

    detailEvaluation:     state.detailEvaluation,
    showDetailFeedback:   state.showDetailFeedback,
    submitDetailDetective,
    dismissDetailFeedback,

    bossBattleResult:     state.bossBattleResult,
    showBossRewardDialog: state.showBossRewardDialog,
    submitBossBattle,
    dismissBossRewardDialog,

    clearError,
  };
};

export default useGame;