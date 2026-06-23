/**
 * useEssayEditor Hook
 * Essay editor logic with backend integration + file upload support
 */

import { useState, useEffect, useCallback } from 'react';
import { DocumentPickerResponse } from 'react-native-document-picker';
import {
  EssayUiState,
  initialEssayUiState,
} from 'src/screens/Essay/types/EssayUiState';
import { EssayCategory } from 'src/models/EssayModels';
import essayRepository from 'src/repositories/EssayRepository';
import { FileRepository } from 'src/repositories/FileRepository';
import { Result } from 'src/models/Result';
import { FileUploadStatus, FILE_UPLOAD_CONFIG } from 'src/models/FileModels';

export const useEssayEditor = () => {
  const [uiState, setUiState] = useState<EssayUiState>(initialEssayUiState);

  // Load streak on mount
  useEffect(() => {
    loadStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Update essay text and calculate word count
   */
  const updateEssayText = useCallback((text: string) => {
    const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;

    setUiState((prev: EssayUiState) => {
      const isEssayEmpty = text.trim() === '';
      const isWordCountValid =
        wordCount >= prev.minWords && wordCount <= prev.maxWords;
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

    setUiState((prev: EssayUiState) => ({
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
    setUiState((prev: EssayUiState) => ({
      ...prev,
      showInfoOverlay: !prev.showInfoOverlay,
    }));
  }, []);

  /**
   * Hide info overlay
   */
  const hideInfoOverlay = useCallback(() => {
    setUiState((prev: EssayUiState) => ({
      ...prev,
      showInfoOverlay: false,
    }));
  }, []);

  /**
   * NEW: Handle file selection from document picker
   */
  const handleFileSelected = useCallback(
    async (file: DocumentPickerResponse) => {
      // Validate file
      const validation = FileRepository.validateFile(
        {
          name: file.name || 'unknown.pdf',
          size: file.size || 0,
          type: file.type || 'application/pdf',
        },
        uiState.uploadedFiles.length,
      );

      if (!validation.isValid) {
        setUiState((prev: EssayUiState) => ({
          ...prev,
          fileUploadError: validation.error || 'Invalid file',
        }));
        return;
      }

      // Create file info
      const fileId = `file_${Date.now()}`;
      const fileInfo = FileRepository.createFileInfo(fileId, {
        name: file.name || 'unknown.pdf',
        size: file.size || 0,
        type: file.type || 'application/pdf',
        uri: file.fileCopyUri || file.uri,
      });

      // Add file to state with UPLOADING status
      setUiState((prev: EssayUiState) => ({
        ...prev,
        uploadedFiles: [...prev.uploadedFiles, fileInfo],
        isFileExtracting: true,
        fileUploadError: null,
      }));

      // Extract text from PDF
      try {
        const result = await FileRepository.uploadAndExtractPdf(
          file.fileCopyUri || file.uri,
          file.name || 'unknown.pdf',
        );

        if (Result.isSuccess(result) && result.data) {
          // Update file with extracted text
          const updatedFile = FileRepository.updateFileStatus(
            fileInfo,
            FileUploadStatus.SUCCESS,
            undefined,
            result.data.text,
          );
          setUiState((prev: EssayUiState) => {
            const updatedFiles = prev.uploadedFiles.map(f =>
              f.id === fileId ? updatedFile : f,
            );

            // Combine all extracted text
            const combinedText =
              FileRepository.combineExtractedText(updatedFiles);
            const wordCount = FileRepository.getTotalWordCount(updatedFiles);

            return {
              ...prev,
              uploadedFiles: updatedFiles,
              isFileExtracting: false,
              essayText: combinedText,
              wordCount,
              canUploadMoreFiles:
                updatedFiles.length < FILE_UPLOAD_CONFIG.MAX_FILES_COUNT,
              isEssayEmpty: combinedText.trim().length === 0,
              isWordCountValid:
                wordCount >= prev.minWords && wordCount <= prev.maxWords,
              canSubmit:
                wordCount >= prev.minWords && wordCount <= prev.maxWords,
              wordCountText: `${wordCount}/${prev.maxWords}`,
              wordCountProgress: Math.min(wordCount / prev.maxWords, 1),
            };
          });
        } else {
          // Extraction failed
          const errorMessage = Result.isError(result)
            ? result.message
            : 'Failed to extract text';
          const failedFile = FileRepository.updateFileStatus(
            fileInfo,
            FileUploadStatus.FAILED,
            errorMessage,
          );

          setUiState((prev: EssayUiState) => ({
            ...prev,
            uploadedFiles: prev.uploadedFiles.map(f =>
              f.id === fileId ? failedFile : f,
            ),
            isFileExtracting: false,
            fileUploadError: Result.isError(result)
              ? result.message
              : 'Failed to extract text from PDF',
          }));
        }
      } catch (error) {
        console.error('Error processing file:', error);

        const failedFile = FileRepository.updateFileStatus(
          fileInfo,
          FileUploadStatus.FAILED,
          'An error occurred while processing the file',
        );

        setUiState((prev: EssayUiState) => ({
          ...prev,
          uploadedFiles: prev.uploadedFiles.map(f =>
            f.id === fileId ? failedFile : f,
          ),
          isFileExtracting: false,
          fileUploadError: 'An error occurred while processing the file',
        }));
      }
    },
    [uiState.uploadedFiles],
  );

  /**
   * NEW: Remove an uploaded file
   */
  const handleRemoveFile = useCallback((fileId: string) => {
    setUiState((prev: EssayUiState) => {
      const updatedFiles = prev.uploadedFiles.filter(f => f.id !== fileId);

      // Recalculate combined text and word count
      const combinedText = FileRepository.combineExtractedText(updatedFiles);
      const wordCount = FileRepository.getTotalWordCount(updatedFiles);

      return {
        ...prev,
        uploadedFiles: updatedFiles,
        essayText: combinedText,
        wordCount,
        canUploadMoreFiles:
          updatedFiles.length < FILE_UPLOAD_CONFIG.MAX_FILES_COUNT,
        isEssayEmpty: combinedText.trim().length === 0,
        isWordCountValid:
          wordCount >= prev.minWords && wordCount <= prev.maxWords,
        canSubmit: wordCount >= prev.minWords && wordCount <= prev.maxWords,
        wordCountText: `${wordCount}/${prev.maxWords}`,
        wordCountProgress: Math.min(wordCount / prev.maxWords, 1),
        fileUploadError: null,
      };
    });
  }, []);

  /**
   * NEW: Dismiss file upload error
   */
  const dismissFileError = useCallback(() => {
    setUiState(prev => ({ ...prev, fileUploadError: null }));
  }, []);

  /**
   * Submit essay to backend for AI evaluation
   */
  const submitEssay = useCallback(async () => {
    const currentState = uiState;

    // Validate before submitting
    if (!currentState.canSubmit) {
      setUiState((prev: EssayUiState) => ({
        ...prev,
        submissionError: `Please write between ${currentState.minWords} and ${currentState.maxWords} words`,
        showErrorDialog: true,
      }));
      return;
    }

    // Set loading state
    setUiState((prev: EssayUiState) => ({
      ...prev,
      isSubmitting: true,
      submissionError: null,
      submissionSuccess: false,
    }));

    try {
      // Call backend API
      const result = await essayRepository.submitEssay(
        currentState.essayText,
        currentState.selectedCategory,
      );

      if (Result.isSuccess(result)) {
        const data = result.data;

        // Build backward-compatible AI response text
        const aiResponse = `Essay Evaluated Successfully! 🎉\n\nScore: ${data.total_score}/100\nGrade: ${data.grade}\n\nFeedback:\n${data.personalized_feedback}`;

        // Update UI with results and CLEAR essay + files
        setUiState(prev => ({
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
          streakText: `${
            data.progress?.current_streak ?? prev.currentStreak
          }/365`,
          // CLEAR essay and files after successful submission
          essayText: '',
          wordCount: 0,
          uploadedFiles: [],
          canUploadMoreFiles: true,
          isEssayEmpty: true,
          isWordCountValid: false,
          canSubmit: false,
          wordCountText: '0/500',
          wordCountProgress: 0,
        }));
      } else if (Result.isError(result)) {
        setUiState(prev => ({
          ...prev,
          isSubmitting: false,
          submissionSuccess: false,
          submissionError: result.message,
          showErrorDialog: true,
        }));
      }
    } catch (error: any) {
      setUiState(prev => ({
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
    setUiState(prev => ({ ...prev, isLoadingStreak: true }));

    try {
      const result = await essayRepository.getStreak();

      if (Result.isSuccess(result)) {
        setUiState(prev => ({
          ...prev,
          currentStreak: result.data.current_streak,
          maxStreak: result.data.max_streak,
          isLoadingStreak: false,
          streakText: `${result.data.current_streak}/365`,
        }));
      } else {
        // Silently fail for streak loading
        setUiState(prev => ({ ...prev, isLoadingStreak: false }));
      }
    } catch {
      setUiState(prev => ({ ...prev, isLoadingStreak: false }));
    }
  }, []);

  /**
   * Dismiss feedback dialog
   */
  const dismissFeedbackDialog = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      showFeedbackDialog: false,
    }));
  }, []);

  /**
   * Dismiss error dialog
   */
  const dismissErrorDialog = useCallback(() => {
    setUiState(prev => ({
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
   * Upload document (legacy - kept for backward compatibility)
   */
  const uploadDocument = useCallback((fileName: string) => {
    setUiState(prev => ({
      ...prev,
      uploadedFileName: fileName,
      isUploading: false,
    }));
  }, []);

  /**
   * Start uploading (legacy - kept for backward compatibility)
   */
  const startUploading = useCallback(() => {
    setUiState(prev => ({
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
    // NEW: File upload functions
    handleFileSelected,
    handleRemoveFile,
    dismissFileError,
  };
};
