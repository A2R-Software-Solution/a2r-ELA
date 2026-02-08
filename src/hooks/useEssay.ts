/**
 * useEssay Hook
 * Custom hook for essay operations (submit, get streak, get stats)
 */

import { useState, useCallback } from 'react';
import essayRepository from '../repositories/EssayRepository';
import { Result } from '../models/Result';
import {
  EssaySubmissionResponse,
  EssayCategory,
  StreakInfo,
  ProgressStats,
  CategoryStats,
} from '../models/EssayModels';

interface UseEssayReturn {
  isLoading: boolean;
  error: string | null;
  submitEssay: (
    essayText: string,
    category: EssayCategory
  ) => Promise<EssaySubmissionResponse | null>;
  getStreak: () => Promise<StreakInfo | null>;
  getProgressStats: () => Promise<ProgressStats | null>;
  getCategoryStats: () => Promise<CategoryStats | null>;
  healthCheck: () => Promise<boolean>;
  clearError: () => void;
}

export const useEssay = (): UseEssayReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Submit an essay for evaluation
   */
  const submitEssay = useCallback(
    async (
      essayText: string,
      category: EssayCategory
    ): Promise<EssaySubmissionResponse | null> => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await essayRepository.submitEssay(essayText, category);

        if (Result.isSuccess(result)) {
          return result.data;
        } else if (Result.isError(result)) {
          setError(result.message);
          return null;
        }

        return null;
      } catch (err: any) {
        setError(err.message || 'Failed to submit essay');
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Get user's current streak
   */
  const getStreak = useCallback(async (): Promise<StreakInfo | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await essayRepository.getStreak();

      if (Result.isSuccess(result)) {
        return result.data;
      } else if (Result.isError(result)) {
        setError(result.message);
        return null;
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to get streak');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get user's progress statistics
   */
  const getProgressStats = useCallback(async (): Promise<ProgressStats | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await essayRepository.getProgressStats();

      if (Result.isSuccess(result)) {
        return result.data;
      } else if (Result.isError(result)) {
        setError(result.message);
        return null;
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to get progress stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get category-wise statistics
   */
  const getCategoryStats = useCallback(async (): Promise<CategoryStats | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await essayRepository.getCategoryStats();

      if (Result.isSuccess(result)) {
        return result.data;
      } else if (Result.isError(result)) {
        setError(result.message);
        return null;
      }

      return null;
    } catch (err: any) {
      setError(err.message || 'Failed to get category stats');
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Health check to verify backend connectivity
   */
  const healthCheck = useCallback(async (): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await essayRepository.healthCheck();

      if (Result.isSuccess(result)) {
        return result.data;
      } else if (Result.isError(result)) {
        setError(result.message);
        return false;
      }

      return false;
    } catch (err: any) {
      setError(err.message || 'Failed to check backend health');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    isLoading,
    error,
    submitEssay,
    getStreak,
    getProgressStats,
    getCategoryStats,
    healthCheck,
    clearError,
  };
};