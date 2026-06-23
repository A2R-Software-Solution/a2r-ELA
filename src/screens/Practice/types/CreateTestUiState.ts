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
    bgColor:     '#F0FDF4',
    description: 'Recommended for building confidence.',
  },
  medium: {
    label:       'Medium',
    subtitle:    'Balanced',
    emoji:       '😐',
    color:       '#F59E0B',
    bgColor:     '#FFFBEB',
    description: 'Balanced difficulty suitable for steady progress and skill improvement.',
  },
  hard: {
    label:       'Hard',
    subtitle:    'Challenge',
    emoji:       '😤',
    color:       '#EF4444',
    bgColor:     '#FEF2F2',
    description: 'Challenge yourself with advanced questions.',
  },
};

// Replace the entire QUICK_PRESETS array:
export const QUICK_PRESETS: QuickPreset[] = [
  {
    id:            'full_mock',
    title:         'Full Mock Exam',
    description:   'Balanced test covering all skills.',
    emoji:         '📋',
    mcq:           10,
    comprehension: 10,
    writing:       5,
    isRecommended: true,
  },
  {
    id:            'reading_focus',
    title:         'Reading Focus',
    description:   'Strengthen your reading skills.',
    emoji:         '🎯',
    mcq:           5,
    comprehension: 10,
    writing:       5,
  },
  {
    id:            'writing_focus',
    title:         'Writing Focus',
    description:   'Improve your writing abilities.',
    emoji:         '✏️',
    mcq:           5,
    comprehension: 5,
    writing:       10,
  },
  {
    id:            'quick_practice',
    title:         'Quick Practice',
    description:   'Short test for quick practice.',
    emoji:         '⚡',
    mcq:           5,
    comprehension: 5,
    writing:       5,
  },
];

// ============================================================================
// CONSTANTS
// ============================================================================

export const MAX_QUESTIONS = 10;

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

export const initialCreateTestState: CreateTestUiState = {
  selectedDifficulty: 'medium',
  mcqCount:           5,
  comprehensionCount: 5,
  writingCount:       5,
  totalQuestions:     15,
  estimatedMinutes:   25,
  xpReward:           45,
  showConfirmSheet:   false,
};
