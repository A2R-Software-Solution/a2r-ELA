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
import { tabEvents } from '../../../utils/tabEvents';    // ← new

// Infer the picked file type from the pick function's return type
type PickedFile = Awaited<ReturnType<typeof pick>>[0];

const getFileUri = (file: PickedFile): string => {
  if ('copyUri' in file && file.copyUri) {
    return file.copyUri as string;
  }
  return (file.uri as string) ?? '';
};

// ============================================================================
// HOOK RETURN TYPE
// ============================================================================

export interface UseEssayEditorReturn {
  uiState: EssayUiState;
  loadPreferences: () => Promise<void>;
  savePreferences: (state: string, grade: string) => Promise<void>;
  openPreferencesSheet: () => void;
  closePreferencesSheet: () => void;
  updateEssayText: (text: string) => void;
  updateCategory: (category: EssayCategory) => void;
  submitEssay: () => Promise<void>;
  loadStreak: () => Promise<void>;
  toggleInfoOverlay: () => void;
  hideInfoOverlay: () => void;
  dismissFeedbackDialog: () => void;
  dismissErrorDialog: () => void;
  retrySubmission: () => void;
  handleFileSelected: (file: PickedFile) => Promise<void>;
  handleRemoveFile: (fileId: string) => void;
  dismissFileError: () => void;
  onPlayNow: () => void;      // ← new: navigates back + switches to Playground
  uploadDocument: (fileName: string) => void;
  startUploading: () => void;
}

export const useEssayEditor = (): UseEssayEditorReturn => {
  const [uiState, setUiState] = useState<EssayUiState>(initialEssayUiState);

  useEffect(() => {
    loadStreak();
    loadPreferences();
  }, []);

  // --------------------------------------------------------------------------
  // PREFERENCES
  // --------------------------------------------------------------------------

  const loadPreferences = useCallback(async () => {
    setUiState(prev => ({ ...prev, isLoadingPreferences: true }));

    try {
      const cached = await preferencesManager.getCachedPreferences();
      if (cached.state && cached.grade) {
        setUiState(prev => ({
          ...prev,
          selectedState:        cached.state!,
          selectedGrade:        cached.grade!,
          stateDisplay:         getStateDisplayLabel(cached.state!),
          gradeDisplay:         getGradeDisplayLabel(cached.grade!),
          isLoadingPreferences: false,
        }));
      }

      const result = await essayRepository.getUserPreferences();

      if (Result.isSuccess(result) && result.data) {
        const prefs = result.data;
        setUiState(prev => ({
          ...prev,
          selectedState:        prefs.state,
          selectedGrade:        prefs.grade,
          stateDisplay:         prefs.state_display,
          gradeDisplay:         prefs.grade_display,
          isLoadingPreferences: false,
        }));
        await preferencesManager.cacheUserPreferences(prefs.state, prefs.grade);
      } else {
        setUiState(prev => ({ ...prev, isLoadingPreferences: false }));
      }
    } catch {
      setUiState(prev => ({ ...prev, isLoadingPreferences: false }));
    }
  }, []);

  const savePreferences = useCallback(async (state: string, grade: string) => {
    setUiState(prev => ({
      ...prev,
      selectedState:        state,
      selectedGrade:        grade,
      stateDisplay:         getStateDisplayLabel(state),
      gradeDisplay:         getGradeDisplayLabel(grade),
      showPreferencesSheet: false,
    }));

    try {
      const result = await essayRepository.saveUserPreferences(state, grade);
      if (Result.isSuccess(result)) {
        await preferencesManager.cacheUserPreferences(state, grade);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  }, []);

  const openPreferencesSheet = useCallback(() => {
    setUiState(prev => ({ ...prev, showPreferencesSheet: true }));
  }, []);

  const closePreferencesSheet = useCallback(() => {
    setUiState(prev => ({ ...prev, showPreferencesSheet: false }));
  }, []);

  // --------------------------------------------------------------------------
  // ESSAY TEXT
  // --------------------------------------------------------------------------

  const updateEssayText = useCallback((text: string) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    setUiState(prev => {
      const isEssayEmpty     = text.trim() === '';
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
      isSubmitting:      true,
      submissionError:   null,
      submissionSuccess: false,
    }));

    try {
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
          isSubmitting:      false,
          submissionSuccess: true,

          // Scores
          totalScore:      data.total_score,
          grade:           data.grade,
          pssaTotal:       data.pssa_total,
          rawScores:       data.raw_scores,
          convertedScores: data.converted_scores,
          rubricScores:    data.rubric_scores,

          // Feedback
          personalizedFeedback: data.personalized_feedback,
          strengths:            data.strengths,
          areasForImprovement:  data.areas_for_improvement,

          // PSSA context
          gradeBand:  data.grade_band  ?? null,
          rubricType: data.rubric_type ?? null,

          // Streak
          currentStreak: data.progress?.current_streak ?? prev.currentStreak,
          maxStreak:     data.progress?.max_streak     ?? prev.maxStreak,
          streakText:    `${data.progress?.current_streak ?? prev.currentStreak}/365`,

          // ── Gamification (Phase 2 + 3) ──────────────────────────────────
          rewards:        data.rewards        ?? null,   // ← new: XP + badges
          gameSuggestion: data.game_suggestion ?? null,  // ← new: practice tip

          showFeedbackDialog: true,
          aiResponse,

          // Reset essay
          essayText:          '',
          wordCount:          0,
          uploadedFiles:      [],
          canUploadMoreFiles: true,
          isEssayEmpty:       true,
          isWordCountValid:   false,
          canSubmit:          false,
          wordCountText:      '0/500',
          wordCountProgress:  0,
        }));

      } else if (Result.isError(result)) {
        setUiState(prev => ({
          ...prev,
          isSubmitting:    false,
          submissionError: result.message,
          showErrorDialog: true,
        }));
      }
    } catch (error: any) {
      setUiState(prev => ({
        ...prev,
        isSubmitting:    false,
        submissionError: error.message || 'An error occurred',
        showErrorDialog: true,
      }));
    }
  }, [uiState]);

  // --------------------------------------------------------------------------
  // PLAY NOW  ← new
  // Navigation bridge: close essay screen then switch HomeScreen to Playground.
  // EssayEditorScreen passes this to FeedbackDialog which passes it to
  // the [Play Now] button. The actual navigation.goBack() is called from
  // EssayEditorScreen's onPlayNow prop (wired in AppNavigator).
  // tabEvents.emit fires first so HomeScreen is ready before goBack animates.
  // --------------------------------------------------------------------------

  const onPlayNow = useCallback(() => {
    tabEvents.emit('switchTab', 'PLAYGROUND');
  }, []);

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
            const updatedFiles  = prev.uploadedFiles.map(f =>
              f.id === fileId ? updatedFile : f
            );
            const combinedText  = FileRepository.combineExtractedText(updatedFiles);
            const wordCount     = FileRepository.getTotalWordCount(updatedFiles);

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
    loadPreferences,
    savePreferences,
    openPreferencesSheet,
    closePreferencesSheet,
    updateEssayText,
    updateCategory,
    submitEssay,
    loadStreak,
    toggleInfoOverlay,
    hideInfoOverlay,
    dismissFeedbackDialog,
    dismissErrorDialog,
    retrySubmission,
    handleFileSelected,
    handleRemoveFile,
    dismissFileError,
    onPlayNow,          // ← new
    uploadDocument,
    startUploading,
  };
};