/**
 * Essay UI State
 * State interface for Essay Editor screen
 */

import { EssayCategory } from '../../../models/EssayModels';
import { RubricScores } from '../../../models/EssayModels';
import { FileInfo } from '../../../models/FileModels';

/**
 * Essay input mode - either typing or uploading files
 */
export enum EssayInputMode {
  TYPING = 'typing', // User is typing text manually
  UPLOADING = 'uploading', // User is uploading PDF files
}

export interface EssayUiState {
  // Existing fields - keep for compatibility
  essayText: string;
  aiResponse: string;
  isUploading: boolean;
  showInfoOverlay: boolean;
  uploadedFileName: string | null;

  // New fields for backend integration
  selectedCategory: EssayCategory;
  wordCount: number;

  // Submission state
  isSubmitting: boolean;
  submissionSuccess: boolean;
  submissionError: string | null;

  // Evaluation results
  totalScore: number | null;
  grade: string | null;
  rubricScores: RubricScores | null;
  personalizedFeedback: string | null;
  strengths: string[];
  areasForImprovement: string[];

  // Streak information
  currentStreak: number;
  maxStreak: number;
  isLoadingStreak: boolean;

  // Word limits based on category
  minWords: number;
  maxWords: number;

  // UI dialogs
  showFeedbackDialog: boolean;
  showErrorDialog: boolean;

  // Computed properties (will be calculated in hook)
  isEssayEmpty: boolean;
  isWordCountValid: boolean;
  canSubmit: boolean;
  wordCountProgress: number;
  wordCountText: string;
  streakText: string;

  // NEW: File upload state
  inputMode: EssayInputMode; // Track if user is typing or uploading
  uploadedFiles: FileInfo[]; // Array of uploaded PDF files (max 2)
  isFileExtracting: boolean; // True when extracting text from PDF
  canUploadMoreFiles: boolean; // True if user can upload more files (< 2)
  fileUploadError: string | null; // Error message for file operations
}

export const initialEssayUiState: EssayUiState = {
  essayText: '',
  aiResponse: '',
  isUploading: false,
  showInfoOverlay: true,
  uploadedFileName: null,

  selectedCategory: EssayCategory.ESSAY_WRITING,
  wordCount: 0,

  isSubmitting: false,
  submissionSuccess: false,
  submissionError: null,

  totalScore: null,
  grade: null,
  rubricScores: null,
  personalizedFeedback: null,
  strengths: [],
  areasForImprovement: [],

  currentStreak: 0,
  maxStreak: 0,
  isLoadingStreak: false,

  minWords: 50,
  maxWords: 500,

  showFeedbackDialog: false,
  showErrorDialog: false,

  // Computed properties
  isEssayEmpty: true,
  isWordCountValid: false,
  canSubmit: false,
  wordCountProgress: 0,
  wordCountText: '0/500',
  streakText: '0/365',

  // NEW: File upload initial state
  inputMode: EssayInputMode.TYPING,
  uploadedFiles: [],
  isFileExtracting: false,
  canUploadMoreFiles: true,
  fileUploadError: null,
};
