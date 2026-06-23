/**
 * Essay UI State
 * State interface for Essay Editor screen
 */

import { EssayCategory, PSSARawScores, PSSAConvertedScores, GameSuggestion } from '../../../models/EssayModels';
import { RubricScores } from '../../../models/EssayModels';
import { FileInfo } from '../../../models/FileModels';
import { RewardsUpdate } from '../../../models/GamificationModels';

/**
 * Essay input mode - either typing or uploading files
 */
export enum EssayInputMode {
  TYPING = 'typing',
  UPLOADING = 'uploading',
}

export interface EssayUiState {
  // Existing fields - keep for compatibility
  essayText: string;
  aiResponse: string;
  isUploading: boolean;
  showInfoOverlay: boolean;
  uploadedFileName: string | null;

  // Category
  selectedCategory: EssayCategory;
  wordCount: number;

  // -------------------------------------------------------------------------
  // State & Grade — user preference
  // -------------------------------------------------------------------------
  selectedState: string;         // e.g. 'PA'
  selectedGrade: string;         // e.g. '7', 'k', 'prek'
  stateDisplay: string;          // e.g. 'Pennsylvania'
  gradeDisplay: string;          // e.g. 'Grade 7'
  isLoadingPreferences: boolean; // true while fetching from Firestore on mount
  showPreferencesSheet: boolean; // controls StateSelectorSheet visibility

  // Submission state
  isSubmitting: boolean;
  submissionSuccess: boolean;
  submissionError: string | null;

  // -------------------------------------------------------------------------
  // Evaluation results — PSSA aligned
  // -------------------------------------------------------------------------
  totalScore: number | null;
  grade: string | null;            // letter grade A-F

  // PSSA specific
  pssaTotal: number | null;        // raw total out of 20
  rawScores: PSSARawScores | null; // 1-4 per domain
  convertedScores: PSSAConvertedScores | null; // 5-20 per domain

  // Legacy alias — kept for backward compat with FeedbackDialog
  rubricScores: RubricScores | null;

  // Feedback
  personalizedFeedback: string | null;
  strengths: string[];
  areasForImprovement: string[];

  // Context shown in feedback dialog
  gradeBand: string | null;        // e.g. 'Grades 6-8'
  rubricType: string | null;       // e.g. 'PSSA Writing Domain'

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

  // Computed properties
  isEssayEmpty: boolean;
  isWordCountValid: boolean;
  canSubmit: boolean;
  wordCountProgress: number;
  wordCountText: string;
  streakText: string;

  // File upload state
  inputMode: EssayInputMode;
  uploadedFiles: FileInfo[];
  isFileExtracting: boolean;
  canUploadMoreFiles: boolean;
  fileUploadError: string | null;

  rewards:        RewardsUpdate | null;
  gameSuggestion: GameSuggestion | null;
}

export const initialEssayUiState: EssayUiState = {
  essayText: '',
  aiResponse: '',
  isUploading: false,
  showInfoOverlay: true,
  uploadedFileName: null,

  selectedCategory: EssayCategory.ESSAY_WRITING,
  wordCount: 0,

  // State & grade defaults — overwritten on mount from Firestore
  selectedState: 'PA',
  selectedGrade: '6',
  stateDisplay: 'Pennsylvania',
  gradeDisplay: 'Grade 6',
  isLoadingPreferences: true,
  showPreferencesSheet: false,

  isSubmitting: false,
  submissionSuccess: false,
  submissionError: null,

  // Evaluation results
  totalScore: null,
  grade: null,
  pssaTotal: null,
  rawScores: null,
  convertedScores: null,
  rubricScores: null,
  personalizedFeedback: null,
  strengths: [],
  areasForImprovement: [],
  gradeBand: null,
  rubricType: null,

  currentStreak: 0,
  maxStreak: 0,
  isLoadingStreak: false,

  minWords: 50,
  maxWords: 500,

  showFeedbackDialog: false,
  showErrorDialog: false,

  isEssayEmpty: true,
  isWordCountValid: false,
  canSubmit: false,
  wordCountProgress: 0,
  wordCountText: '0/500',
  streakText: '0/365',

  inputMode: EssayInputMode.TYPING,
  uploadedFiles: [],
  isFileExtracting: false,
  canUploadMoreFiles: true,
  fileUploadError: null,

  rewards: null,
  gameSuggestion: null,
};