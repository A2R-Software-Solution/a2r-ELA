/**
 * Essay Models - TypeScript interfaces for API requests and responses
 * Updated to support PSSA Writing Domain rubric and state/grade preferences
 */

import { RewardsUpdate } from './GamificationModels';

// ============================================================================
// REQUEST MODELS
// ============================================================================

export interface EssaySubmissionRequest {
  essay_text: string;
  category: string;
  state: string;   // e.g. 'PA'
  grade: string;   // e.g. '7', 'k', 'prek'
}

export interface SaveUserPreferencesRequest {
  state: string;
  grade: string;
}

// ============================================================================
// PSSA SCORING MODELS
// ============================================================================

/**
 * Raw PSSA domain scores from the LLM (1-4 per domain)
 * Stored in Firestore for teacher reports and analytics
 */
export interface PSSARawScores {
  focus: number;          // 1-4
  content: number;        // 1-4
  organization: number;   // 1-4
  style: number;          // 1-4
  conventions: number;    // 1-4
}

/**
 * Converted domain scores (raw × 5 = 5-20 per domain)
 */
export interface PSSAConvertedScores {
  focus: number;          // 5-20
  content: number;        // 5-20
  organization: number;   // 5-20
  style: number;          // 5-20
  conventions: number;    // 5-20
}

/**
 * Domain justifications from LLM
 */
export interface RubricJustifications {
  focus: string;
  content: string;
  organization: string;
  style: string;
  conventions: string;
}

/**
 * Legacy rubric scores alias — kept for backward compatibility
 * Points to converted scores (5-20 per domain)
 * @deprecated Use PSSAConvertedScores instead
 */
export interface RubricScores {
  focus: number;
  content: number;
  organization: number;
  style: number;
  conventions: number;
}

// ============================================================================
// GAME SUGGESTION  ← new in Phase 3
// ============================================================================

/**
 * Suggested game to play based on the student's weakest PSSA domain.
 * Included in EssaySubmissionResponse when any domain scores <= 2.
 * null when all domains score >= 3 — no suggestion needed.
 */
export interface GameSuggestion {
  /** PSSA domain key e.g. "focus" */
  domain: string;

  /** Human-readable domain label e.g. "Focus" */
  domain_label: string;

  /** Raw score the student received e.g. 2 */
  score: number;

  /** Name of the suggested game e.g. "Focus Quest" */
  game_name: string;

  /** Why this game was suggested e.g. "Practising Focus will help you stay on topic" */
  reason: string;
}

// ============================================================================
// RESPONSE MODELS
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  message?: string | null;
  data?: T | null;
  error?: string | null;
}

export interface EssaySubmissionResponse {
  submission_id: string;

  // 100-point scale (main display score)
  total_score: number;
  converted_score: number;
  grade: string;             // letter grade A-F

  // PSSA-specific
  pssa_total: number;        // raw total out of 20
  raw_scores: PSSARawScores;
  converted_scores: PSSAConvertedScores;
  rubric_scores: RubricScores; // alias for converted_scores

  // Context
  state: string;             // e.g. 'PA'
  student_grade: string;     // e.g. '7'
  grade_band: string;        // e.g. 'Grades 6-8'
  rubric_type: string;       // e.g. 'PSSA Writing Domain'

  // Feedback
  rubric_justifications: RubricJustifications;
  personalized_feedback: string;
  strengths: string[];
  areas_for_improvement: string[];

  // Meta
  word_count: number;
  category: string;
  submitted_at: string;
  progress?: ProgressUpdate | null;

  // Gamification rewards earned from this submission (if any)
  rewards?: RewardsUpdate | null;

  // Practice suggestion — null when all domains >= 3
  game_suggestion?: GameSuggestion | null;   // ← new in Phase 3
}

export interface ProgressUpdate {
  current_streak: number;
  max_streak: number;
  total_essays: number;
  streak_updated: boolean;
}

export interface StreakInfo {
  current_streak: number;
  max_streak: number;
  days_until_year: number;
  streak_active: boolean;
  last_submission_date?: string | null;
}

export interface ProgressStats {
  total_essays_submitted: number;
  current_streak: number;
  max_streak: number;
  progress_percentage: number;
  category_stats: CategoryStats;
}

export interface CategoryStats {
  essay_writing: CategoryStat;
  ela: CategoryStat;
  math: CategoryStat;
  science: CategoryStat;
}

export interface CategoryStat {
  count: number;
  avg_score: number;
}

// ============================================================================
// USER PREFERENCES MODELS
// ============================================================================

export interface GradeOption {
  code: string;    // e.g. 'prek', 'k', '7'
  label: string;   // e.g. 'Pre-K', 'Kindergarten', 'Grade 7'
}

export interface StateOption {
  code: string;    // e.g. 'PA'
  label: string;   // e.g. 'Pennsylvania'
}

export interface UserPreferences {
  state: string;          // e.g. 'PA'
  grade: string;          // e.g. '7'
  state_display: string;  // e.g. 'Pennsylvania'
  grade_display: string;  // e.g. 'Grade 7'
  supported_states: StateOption[];
  supported_grades: GradeOption[];
}

// ============================================================================
// ENUMS
// ============================================================================

export enum EssayCategory {
  ESSAY_WRITING = 'essay_writing',
  ELA = 'ela',
  MATH = 'math',
  SCIENCE = 'science',
}

export enum SupportedState {
  PA = 'PA',
}

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Convert string to EssayCategory
 */
export const stringToEssayCategory = (value: string): EssayCategory => {
  const found = Object.values(EssayCategory).find((cat) => cat === value);
  return found || EssayCategory.ESSAY_WRITING;
};

/**
 * Get display name for essay category
 */
export const getEssayCategoryDisplayName = (category: EssayCategory): string => {
  switch (category) {
    case EssayCategory.ESSAY_WRITING: return 'Essay Writing';
    case EssayCategory.ELA:           return 'ELA';
    case EssayCategory.MATH:          return 'Math';
    case EssayCategory.SCIENCE:       return 'Science';
    default:                           return 'Essay Writing';
  }
};

/**
 * Get display label for a grade code
 */
export const getGradeDisplayLabel = (grade: string): string => {
  const map: Record<string, string> = {
    prek: 'Pre-K',
    k:    'Kindergarten',
    '1':  'Grade 1',  '2':  'Grade 2',  '3':  'Grade 3',
    '4':  'Grade 4',  '5':  'Grade 5',  '6':  'Grade 6',
    '7':  'Grade 7',  '8':  'Grade 8',  '9':  'Grade 9',
    '10': 'Grade 10', '11': 'Grade 11', '12': 'Grade 12',
  };
  return map[grade.toLowerCase()] ?? `Grade ${grade}`;
};

/**
 * Get display label for a state code
 */
export const getStateDisplayLabel = (state: string): string => {
  const map: Record<string, string> = {
    PA: 'Pennsylvania',
  };
  return map[state.toUpperCase()] ?? state;
};

/**
 * Convert raw PSSA score (1-4) to percentage for display
 */
export const pssaRawToPercent = (raw: number): number =>
  Math.round((raw / 4) * 100);

/**
 * Get all PSSA domain keys in order
 */
export const PSSA_DOMAIN_KEYS: (keyof PSSARawScores)[] = [
  'focus',
  'content',
  'organization',
  'style',
  'conventions',
];

/**
 * Get human-readable label for a PSSA domain key
 */
export const getPSSADomainLabel = (domain: keyof PSSARawScores): string => {
  const map: Record<keyof PSSARawScores, string> = {
    focus:        'Focus',
    content:      'Content',
    organization: 'Organization',
    style:        'Style',
    conventions:  'Conventions',
  };
  return map[domain];
};

// ============================================================================
// USER PROFILE MODELS
// ============================================================================

/**
 * User profile data stored in Firestore users/{uid} collection.
 * Returned by GET /get_user_profile
 */
export interface UserProfile {
  /** Display name stored in Firestore — synced with Firebase Auth displayName */
  display_name: string | null;

  /**
   * Birthdate in MM/DD/YY format (e.g. '02/18/12')
   * Stored only in Firestore — Firebase Auth has no birthdate field
   */
  birthdate: string | null;

  /**
   * Base64 compressed avatar image.
   * Format: 'data:image/jpeg;base64,...'
   * Stored in Firestore — kept under 800KB after compression.
   * null if user has never set a photo.
   */
  photo_url: string | null;

  /** ISO timestamp string — when profile doc was first created */
  created_at: string | null;

  /** ISO timestamp string — when profile doc was last updated */
  updated_at: string | null;
}

/**
 * Request body for POST /update_user_profile
 * All fields are optional — only provided fields are updated in Firestore.
 *
 * To remove photo: pass photo_url: null
 */
export interface UpdateUserProfileRequest {
  /** New display name (1–50 characters) */
  display_name?: string;

  /** Birthdate in MM/DD/YY format */
  birthdate?: string;

  /**
   * Base64 data URI for compressed avatar.
   * Pass null to remove the photo.
   */
  photo_url?: string | null;
}