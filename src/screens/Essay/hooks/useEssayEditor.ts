/**
 * useEssayEditor Hook
 * Essay editor logic with backend integration, file upload support,
 * and PSSA state/grade preference management.
 */

import { useState, useEffect, useCallback } from 'react';
import { pick } from '@react-native-documents/picker';
import { EssayUiState, initialEssayUiState } from '../types/EssayUiState';
import { EssayCategory, getGradeDisplayLabel, getStateDisplayLabel } from '../../../models/EssayModels';
import essayRepository from '../../../repositories/EssayRepository';
import { FileRepository } from '../../../repositories/FileRepository';
import { Result } from '../../../models/Result';
import {
  FileUploadStatus,
  FILE_UPLOAD_CONFIG,
} from '../../../models/FileModels';
import preferencesManager from '../../../utils/PreferencesManager';

// Infer the picked file type from the pick function's return type
type PickedFile = Awaited<ReturnType<typeof pick>>[0];

/**
 * Safely get the URI from a picked file, preferring copyUri when available.
 * Handles the union type between DocumentPickerResponse and DocumentPickerResponseOpenLongTerm.
 */
const getFileUri = (file: PickedFile): string => {
  if ('copyUri' in file && file.copyUri) {
    return file.copyUri as string;
  }
  return (file.uri as string) ?? '';
};

export const useEssayEditor = () => {
  const [uiState, setUiState] = useState<EssayUiState>(initialEssayUiState);

  // Load streak and preferences on mount
  useEffect(() => {
    loadStreak();
    loadPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --------------------------------------------------------------------------
  // PREFERENCES — State & Grade
  // --------------------------------------------------------------------------

  /**
   * Load user's state and grade preferences.
   * Strategy: try local cache first (fast), then sync from Firestore (truth).
   */
  const loadPreferences = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoadingPreferences: true }));

    try {
      // Step 1: Load from local cache for instant UI update
      const cached = await preferencesManager.getCachedPreferences();
      if (cached.state && cached.grade) {
        setUiState(prev => ({
          ...prev,
          selectedState: cached.state!,
          selectedGrade: cached.grade!,
          stateDisplay: getStateDisplayLabel(cached.state!),
          gradeDisplay: getGradeDisplayLabel(cached.grade!),
          isLoadingPreferences: false,
        }));
      }

      // Step 2: Always sync from Firestore to stay in truth
      const result = await essayRepository.getUserPreferences();

      if (Result.isSuccess(result) && result.data) {
        const prefs = result.data;

        // Update state with Firestore values
        setUiState(prev => ({
          ...prev,
          selectedState: prefs.state,
          selectedGrade: prefs.grade,
          stateDisplay:  prefs.state_display,
          gradeDisplay:  prefs.grade_display,
          isLoadingPreferences: false,
        }));

        // Update local cache with Firestore values
        await preferencesManager.cacheUserPreferences(prefs.state, prefs.grade);
      } else {
        // Firestore failed — keep cached values or defaults
        setUiState(prev => ({ ...prev, isLoadingPreferences: false }));
      }
    } catch {
      setUiState(prev => ({ ...prev, isLoadingPreferences: false }));
    }
  }, []);

  /**
   * Save user's state and grade selection.
   * Saves to Firestore (source of truth) + caches locally.
   */
  const savePreferences = useCallback(async (state: string, grade: string) => {
    // Optimistic UI update immediately
    setUiState(prev => ({
      ...prev,
      selectedState:       state,
      selectedGrade:       grade,
      stateDisplay:        getStateDisplayLabel(state),
      gradeDisplay:        getGradeDisplayLabel(grade),
      showPreferencesSheet: false,
    }));

    try {
      // Save to Firestore
      const result = await essayRepository.saveUserPreferences(state, grade);

      if (Result.isSuccess(result)) {
        // Cache locally after confirmed save
        await preferencesManager.cacheUserPreferences(state, grade);
      } else {
        console.warn('Failed to save preferences to Firestore:', result);
        // Keep optimistic UI — user sees their choice even if save failed
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
      // Still keep optimistic UI
    }
  }, []);

  /**
   * Open the state/grade selector sheet
   */
  const openPreferencesSheet = useCallback(() => {
    setUiState(prev => ({ ...prev, showPreferencesSheet: true }));
  }, []);

  /**
   * Close the state/grade selector sheet without saving
   */
  const closePreferencesSheet = useCallback(() => {
    setUiState(prev => ({ ...prev, showPreferencesSheet: false }));
  }, []);

  // --------------------------------------------------------------------------
  // ESSAY TEXT
  // --------------------------------------------------------------------------

  /**
   * Update essay text and calculate word count
   */
  const updateEssayText = useCallback((text: string) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    setUiState(prev => {
      const isEssayEmpty    = text.trim() === '';
      const isWordCountValid = wordCount >= prev.minWords && wordCount <= prev.maxWords;
      const canSubmit        = !isEssayEmpty && isWordCountValid && !prev.isSubmitting;
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
      case EssayCategory.ESSAY_WRITING: minWords = 50;  maxWords = 500; break;
      case EssayCategory.ELA:           minWords = 50;  maxWords = 400; break;
      case EssayCategory.MATH:          minWords = 30;  maxWords = 300; break;
      case EssayCategory.SCIENCE:       minWords = 50;  maxWords = 450; break;
    }

    setUiState(prev => ({
      ...prev,
      selectedCategory: category,
      minWords,
      maxWords,
      wordCountText: `${prev.wordCount}/${maxWords}`,
    }));
  }, []);

  // --------------------------------------------------------------------------
  // SUBMISSION
  // --------------------------------------------------------------------------

  /**
   * Submit essay to backend for PSSA-aligned evaluation
   */
  const submitEssay = useCallback(async () => {
    const currentState = uiState;

    if (!currentState.canSubmit) {
      setUiState(prev => ({
        ...prev,
        submissionError: `Please write between ${currentState.minWords} and ${currentState.maxWords} words`,
        showErrorDialog: true,
      }));
      return;
    }

    setUiState(prev => ({
      ...prev,
      isSubmitting: true,
      submissionError: null,
      submissionSuccess: false,
    }));

    try {
      // Pass state and grade with every submission
      const result = await essayRepository.submitEssay(
        currentState.essayText,
        currentState.selectedCategory,
        currentState.selectedState,
        currentState.selectedGrade,
      );

      if (Result.isSuccess(result)) {
        const data = result.data;

        const aiResponse =
          `Essay Evaluated Successfully! 🎉\n\n` +
          `Score: ${data.total_score}/100\nGrade: ${data.grade}\n\n` +
          `Feedback:\n${data.personalized_feedback}`;

        setUiState(prev => ({
          ...prev,
          isSubmitting: false,
          submissionSuccess: true,

          // Scores
          totalScore:      data.total_score,
          grade:           data.grade,
          pssaTotal:       data.pssa_total,
          rawScores:       data.raw_scores,
          convertedScores: data.converted_scores,
          rubricScores:    data.rubric_scores,  // legacy alias

          // Feedback
          personalizedFeedback: data.personalized_feedback,
          strengths:            data.strengths,
          areasForImprovement:  data.areas_for_improvement,

          // PSSA context for feedback dialog
          gradeBand:   data.grade_band ?? null,
          rubricType:  data.rubric_type ?? null,

          // Streak
          currentStreak: data.progress?.current_streak ?? prev.currentStreak,
          maxStreak:     data.progress?.max_streak     ?? prev.maxStreak,
          streakText:    `${data.progress?.current_streak ?? prev.currentStreak}/365`,

          showFeedbackDialog: true,
          aiResponse,

          // Clear essay and files after submission
          essayText:        '',
          wordCount:        0,
          uploadedFiles:    [],
          canUploadMoreFiles: true,
          isEssayEmpty:     true,
          isWordCountValid: false,
          canSubmit:        false,
          wordCountText:    '0/500',
          wordCountProgress: 0,
        }));

      } else if (Result.isError(result)) {
        setUiState(prev => ({
          ...prev,
          isSubmitting:   false,
          submissionError: result.message,
          showErrorDialog: true,
        }));
      }
    } catch (error: any) {
      setUiState(prev => ({
        ...prev,
        isSubmitting:   false,
        submissionError: error.message || 'An error occurred',
        showErrorDialog: true,
      }));
    }
  }, [uiState]);

  // --------------------------------------------------------------------------
  // STREAK
  // --------------------------------------------------------------------------

  const loadStreak = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoadingStreak: true }));
    try {
      const result = await essayRepository.getStreak();
      if (Result.isSuccess(result)) {
        setUiState(prev => ({
          ...prev,
          currentStreak:   result.data.current_streak,
          maxStreak:       result.data.max_streak,
          isLoadingStreak: false,
          streakText:      `${result.data.current_streak}/365`,
        }));
      } else {
        setUiState(prev => ({ ...prev, isLoadingStreak: false }));
      }
    } catch {
      setUiState(prev => ({ ...prev, isLoadingStreak: false }));
    }
  }, []);

  // --------------------------------------------------------------------------
  // DIALOGS
  // --------------------------------------------------------------------------

  const toggleInfoOverlay = useCallback(() => {
    setUiState(prev => ({ ...prev, showInfoOverlay: !prev.showInfoOverlay }));
  }, []);

  const hideInfoOverlay = useCallback(() => {
    setUiState(prev => ({ ...prev, showInfoOverlay: false }));
  }, []);

  const dismissFeedbackDialog = useCallback(() => {
    setUiState(prev => ({ ...prev, showFeedbackDialog: false }));
  }, []);

  const dismissErrorDialog = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      showErrorDialog: false,
      submissionError: null,
    }));
  }, []);

  const retrySubmission = useCallback(() => {
    dismissErrorDialog();
    submitEssay();
  }, [dismissErrorDialog, submitEssay]);

  // --------------------------------------------------------------------------
  // FILE UPLOAD
  // --------------------------------------------------------------------------

  const handleFileSelected = useCallback(
    async (file: PickedFile) => {
      const validation = FileRepository.validateFile(
        {
          name: file.name || 'unknown.pdf',
          size: file.size || 0,
          type: file.type || 'application/pdf',
        },
        uiState.uploadedFiles.length,
      );

      if (!validation.isValid) {
        setUiState(prev => ({
          ...prev,
          fileUploadError: validation.error || 'Invalid file',
        }));
        return;
      }

      const fileId   = `file_${Date.now()}`;
      const fileUri  = getFileUri(file);
      const fileInfo = FileRepository.createFileInfo(fileId, {
        name: file.name || 'unknown.pdf',
        size: file.size || 0,
        type: file.type || 'application/pdf',
        uri:  fileUri,
      });

      setUiState(prev => ({
        ...prev,
        uploadedFiles:    [...prev.uploadedFiles, fileInfo],
        isFileExtracting: true,
        fileUploadError:  null,
      }));

      try {
        const result = await FileRepository.uploadAndExtractPdf(
          fileUri,
          file.name || 'unknown.pdf',
        );

        if (Result.isSuccess(result) && result.data) {
          const updatedFile = FileRepository.updateFileStatus(
            fileInfo,
            FileUploadStatus.SUCCESS,
            undefined,
            result.data.text,
          );

          setUiState(prev => {
            const updatedFiles   = prev.uploadedFiles.map(f =>
              f.id === fileId ? updatedFile : f
            );
            const combinedText   = FileRepository.combineExtractedText(updatedFiles);
            const wordCount      = FileRepository.getTotalWordCount(updatedFiles);

            return {
              ...prev,
              uploadedFiles:      updatedFiles,
              isFileExtracting:   false,
              essayText:          combinedText,
              wordCount,
              canUploadMoreFiles: updatedFiles.length < FILE_UPLOAD_CONFIG.MAX_FILES_COUNT,
              isEssayEmpty:       combinedText.trim().length === 0,
              isWordCountValid:   wordCount >= prev.minWords && wordCount <= prev.maxWords,
              canSubmit:          wordCount >= prev.minWords && wordCount <= prev.maxWords,
              wordCountText:      `${wordCount}/${prev.maxWords}`,
              wordCountProgress:  Math.min(wordCount / prev.maxWords, 1),
            };
          });
        } else {
          const errorMessage = Result.isError(result) ? result.message : 'Failed to extract text';
          const failedFile   = FileRepository.updateFileStatus(
            fileInfo, FileUploadStatus.FAILED, errorMessage,
          );
          setUiState(prev => ({
            ...prev,
            uploadedFiles:    prev.uploadedFiles.map(f => f.id === fileId ? failedFile : f),
            isFileExtracting: false,
            fileUploadError:  errorMessage,
          }));
        }
      } catch (error) {
        const failedFile = FileRepository.updateFileStatus(
          fileInfo, FileUploadStatus.FAILED, 'An error occurred while processing the file',
        );
        setUiState(prev => ({
          ...prev,
          uploadedFiles:    prev.uploadedFiles.map(f => f.id === fileId ? failedFile : f),
          isFileExtracting: false,
          fileUploadError:  'An error occurred while processing the file',
        }));
      }
    },
    [uiState.uploadedFiles],
  );

  const handleRemoveFile = useCallback((fileId: string) => {
    setUiState(prev => {
      const updatedFiles = prev.uploadedFiles.filter(f => f.id !== fileId);
      const combinedText = FileRepository.combineExtractedText(updatedFiles);
      const wordCount    = FileRepository.getTotalWordCount(updatedFiles);

      return {
        ...prev,
        uploadedFiles:      updatedFiles,
        essayText:          combinedText,
        wordCount,
        canUploadMoreFiles: updatedFiles.length < FILE_UPLOAD_CONFIG.MAX_FILES_COUNT,
        isEssayEmpty:       combinedText.trim().length === 0,
        isWordCountValid:   wordCount >= prev.minWords && wordCount <= prev.maxWords,
        canSubmit:          wordCount >= prev.minWords && wordCount <= prev.maxWords,
        wordCountText:      `${wordCount}/${prev.maxWords}`,
        wordCountProgress:  Math.min(wordCount / prev.maxWords, 1),
        fileUploadError:    null,
      };
    });
  }, []);

  const dismissFileError = useCallback(() => {
    setUiState(prev => ({ ...prev, fileUploadError: null }));
  }, []);

  // --------------------------------------------------------------------------
  // LEGACY
  // --------------------------------------------------------------------------

  const uploadDocument = useCallback((fileName: string) => {
    setUiState(prev => ({ ...prev, uploadedFileName: fileName, isUploading: false }));
  }, []);

  const startUploading = useCallback(() => {
    setUiState(prev => ({ ...prev, isUploading: true }));
  }, []);

  // --------------------------------------------------------------------------
  // RETURN
  // --------------------------------------------------------------------------

  return {
    uiState,

    // Preferences
    loadPreferences,
    savePreferences,
    openPreferencesSheet,
    closePreferencesSheet,

    // Essay
    updateEssayText,
    updateCategory,
    submitEssay,

    // Streak
    loadStreak,

    // Dialogs
    toggleInfoOverlay,
    hideInfoOverlay,
    dismissFeedbackDialog,
    dismissErrorDialog,
    retrySubmission,

    // Files
    handleFileSelected,
    handleRemoveFile,
    dismissFileError,

    // Legacy
    uploadDocument,
    startUploading,
  };
};