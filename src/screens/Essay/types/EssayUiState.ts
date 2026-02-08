/**
 * Essay UI State
 * State interface for Essay Editor screen
 */

import { EssayCategory } from '../../../models/EssayModels';
import { RubricScores } from '../../../models/EssayModels';

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
};