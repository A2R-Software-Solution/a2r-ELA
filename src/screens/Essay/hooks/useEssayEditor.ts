/**
 * useEssayEditor Hook
 * Essay editor logic with backend integration (ViewModel equivalent)
 */

import { useState, useEffect, useCallback } from 'react';
import { EssayUiState, initialEssayUiState } from '../types/EssayUiState';
import { EssayCategory } from '../../../models/EssayModels';
import essayRepository from '../../../repositories/EssayRepository';
import { Result } from '../../../models/Result';

export const useEssayEditor = () => {
  const [uiState, setUiState] = useState<EssayUiState>(initialEssayUiState);

  // Load streak on mount
  useEffect(() => {
    loadStreak();
  }, []);

  /**
   * Update essay text and calculate word count
   */
  const updateEssayText = useCallback((text: string) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
    
    setUiState((prev) => {
      const isEssayEmpty = text.trim() === '';
      const isWordCountValid = wordCount >= prev.minWords && wordCount <= prev.maxWords;
      const canSubmit = !isEssayEmpty && isWordCountValid && !prev.isSubmitting;
      const wordCountProgress = Math.min(wordCount / prev.maxWords, 1);
      
      return {
        ...prev,
        essayText: text,
        wordCount,
        isEssayEmpty,
        isWordCountValid,
        canSubmit,
        wordCountProgress,
        wordCountText: `${wordCount}/${prev.maxWords}`,
      };
    });
  }, []);

  /**
   * Update selected category and adjust word limits
   */
  const updateCategory = useCallback((category: EssayCategory) => {
    let minWords = 50;
    let maxWords = 500;

    switch (category) {
      case EssayCategory.ESSAY_WRITING:
        minWords = 50;
        maxWords = 500;
        break;
      case EssayCategory.ELA:
        minWords = 50;
        maxWords = 400;
        break;
      case EssayCategory.MATH:
        minWords = 30;
        maxWords = 300;
        break;
      case EssayCategory.SCIENCE:
        minWords = 50;
        maxWords = 450;
        break;
    }

    setUiState((prev) => ({
      ...prev,
      selectedCategory: category,
      minWords,
      maxWords,
      wordCountText: `${prev.wordCount}/${maxWords}`,
    }));
  }, []);

  /**
   * Toggle info overlay
   */
  const toggleInfoOverlay = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      showInfoOverlay: !prev.showInfoOverlay,
    }));
  }, []);

  /**
   * Hide info overlay
   */
  const hideInfoOverlay = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      showInfoOverlay: false,
    }));
  }, []);

  /**
   * Submit essay to backend for AI evaluation
   */
  const submitEssay = useCallback(async () => {
    const currentState = uiState;

    // Validate before submitting
    if (!currentState.canSubmit) {
      setUiState((prev) => ({
        ...prev,
        submissionError: `Please write between ${currentState.minWords} and ${currentState.maxWords} words`,
        showErrorDialog: true,
      }));
      return;
    }

    // Set loading state
    setUiState((prev) => ({
      ...prev,
      isSubmitting: true,
      submissionError: null,
      submissionSuccess: false,
    }));

    try {
      // Call backend API
      const result = await essayRepository.submitEssay(
        currentState.essayText,
        currentState.selectedCategory
      );

      if (Result.isSuccess(result)) {
        const data = result.data;

        // Build backward-compatible AI response text
        const aiResponse = `Essay Evaluated Successfully! 🎉\n\nScore: ${data.total_score}/100\nGrade: ${data.grade}\n\nFeedback:\n${data.personalized_feedback}`;

        // Update UI with results
        setUiState((prev) => ({
          ...prev,
          isSubmitting: false,
          submissionSuccess: true,
          totalScore: data.total_score,
          grade: data.grade,
          rubricScores: data.rubric_scores,
          personalizedFeedback: data.personalized_feedback,
          strengths: data.strengths,
          areasForImprovement: data.areas_for_improvement,
          showFeedbackDialog: true,
          currentStreak: data.progress?.current_streak ?? prev.currentStreak,
          maxStreak: data.progress?.max_streak ?? prev.maxStreak,
          aiResponse,
          streakText: `${data.progress?.current_streak ?? prev.currentStreak}/365`,
        }));
      } else if (Result.isError(result)) {
        setUiState((prev) => ({
          ...prev,
          isSubmitting: false,
          submissionSuccess: false,
          submissionError: result.message,
          showErrorDialog: true,
        }));
      }
    } catch (error: any) {
      setUiState((prev) => ({
        ...prev,
        isSubmitting: false,
        submissionSuccess: false,
        submissionError: error.message || 'An error occurred',
        showErrorDialog: true,
      }));
    }
  }, [uiState]);

  /**
   * Load user's current streak
   */
  const loadStreak = useCallback(async () => {
    setUiState((prev) => ({ ...prev, isLoadingStreak: true }));

    try {
      const result = await essayRepository.getStreak();

      if (Result.isSuccess(result)) {
        setUiState((prev) => ({
          ...prev,
          currentStreak: result.data.current_streak,
          maxStreak: result.data.max_streak,
          isLoadingStreak: false,
          streakText: `${result.data.current_streak}/365`,
        }));
      } else {
        // Silently fail for streak loading
        setUiState((prev) => ({ ...prev, isLoadingStreak: false }));
      }
    } catch (error) {
      setUiState((prev) => ({ ...prev, isLoadingStreak: false }));
    }
  }, []);

  /**
   * Dismiss feedback dialog
   */
  const dismissFeedbackDialog = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      showFeedbackDialog: false,
    }));
  }, []);

  /**
   * Dismiss error dialog
   */
  const dismissErrorDialog = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      showErrorDialog: false,
      submissionError: null,
    }));
  }, []);

  /**
   * Retry submission after error
   */
  const retrySubmission = useCallback(() => {
    dismissErrorDialog();
    submitEssay();
  }, [dismissErrorDialog, submitEssay]);

  /**
   * Upload document
   */
  const uploadDocument = useCallback((fileName: string) => {
    setUiState((prev) => ({
      ...prev,
      uploadedFileName: fileName,
      isUploading: false,
    }));
  }, []);

  /**
   * Start uploading
   */
  const startUploading = useCallback(() => {
    setUiState((prev) => ({
      ...prev,
      isUploading: true,
    }));
  }, []);

  return {
    uiState,
    updateEssayText,
    updateCategory,
    toggleInfoOverlay,
    hideInfoOverlay,
    submitEssay,
    loadStreak,
    dismissFeedbackDialog,
    dismissErrorDialog,
    retrySubmission,
    uploadDocument,
    startUploading,
  };
};