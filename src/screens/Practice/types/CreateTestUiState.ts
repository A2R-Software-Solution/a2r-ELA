import { colors } from '../../../theme/colors';
/**
 * CreateTest UI State
 * State for the Create Custom Test screen
 */

// ============================================================================
// TYPES
// ============================================================================

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface QuickPreset {
  id:             string;
  title:          string;
  description:    string;
  emoji:          string;
  mcq:            number;
  comprehension:  number;
  writing:        number;
  isRecommended?: boolean;
}

// ============================================================================
// STATE
// ============================================================================

export interface CreateTestUiState {
  // Difficulty
  selectedDifficulty: Difficulty;

  // Question counts
  mcqCount:           number;
  comprehensionCount: number;
  writingCount:       number;

  // Computed
  totalQuestions:     number;
  estimatedMinutes:   number;
  xpReward:           number;

  // UI
  showConfirmSheet:   boolean;
}

// ============================================================================
// HELPERS
// ============================================================================

export const DIFFICULTY_CONFIG: Record<Difficulty, {
  label:       string;
  subtitle:    string;
  emoji:       string;
  color:       string;
  bgColor:     string;
  description: string;
}> = {
  easy: {
    label:       'Easy',
    subtitle:    'Beginner',
    emoji:       '😊',
    color:       '#22C55E',
    bgColor:     colors.successSurface,
    description: 'Recommended for building confidence.',
  },
  medium: {
    label:       'Medium',
    subtitle:    'Balanced',
    emoji:       '😐',
    color:       '#F59E0B',
    bgColor:     colors.warningSurface,
    description: 'Balanced difficulty suitable for steady progress and skill improvement.',
  },
  hard: {
    label:       'Hard',
    subtitle:    'Challenge',
    emoji:       '😤',
    color:       '#EF4444',
    bgColor:     colors.errorSurface,
    description: 'Challenge yourself with advanced questions.',
  },
};

// FIX: All presets capped at max 5 per section to stay within LLM reliability limit
export const QUICK_PRESETS: QuickPreset[] = [
  {
    id:            'balanced',
    title:         'Balanced Mix',
    description:   'Covers all 3 skill areas evenly.',
    emoji:         '📋',
    mcq:           2,
    comprehension: 2,
    writing:       1,
    isRecommended: true,
  },
  {
    id:            'reading_focus',
    title:         'Reading Focus',
    description:   'Strengthen your reading skills.',
    emoji:         '🎯',
    mcq:           1,
    comprehension: 3,
    writing:       1,
  },
  {
    id:            'writing_focus',
    title:         'Writing Focus',
    description:   'Improve your writing abilities.',
    emoji:         '✏️',
    mcq:           1,
    comprehension: 1,
    writing:       3,
  },
  {
    id:            'mcq_blitz',
    title:         'MCQ Blitz',
    description:   'Quick multiple choice practice.',
    emoji:         '⚡',
    mcq:           3,
    comprehension: 1,
    writing:       1,
  },
];

// ============================================================================
// CONSTANTS
// ============================================================================

// FIX: Capped at 5 per section — LLM reliably generates up to 5 questions per call.
// Previous limit of 10 caused generation failures.
export const MAX_QUESTIONS = 5;

export const MIN_QUESTIONS = 0;

// XP per question type
export const XP_PER_MCQ          = 1;
export const XP_PER_COMPREHENSION = 2;
export const XP_PER_WRITING       = 5;

// Minutes per question type
export const MINS_PER_MCQ          = 1;
export const MINS_PER_COMPREHENSION = 2;
export const MINS_PER_WRITING       = 5;

// ============================================================================
// INITIAL STATE
// ============================================================================

// FIX: Default to a sensible small config within the new 5-question cap
export const initialCreateTestState: CreateTestUiState = {
  selectedDifficulty: 'medium',
  mcqCount:           1,
  comprehensionCount: 2,
  writingCount:       1,
  totalQuestions:     4,
  estimatedMinutes:   10,
  xpReward:           10,
  showConfirmSheet:   false,
};