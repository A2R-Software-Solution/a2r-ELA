/**
 * Essay Models - TypeScript interfaces for API requests and responses
 * Converted from Kotlin data classes
 */

// ============================================================================
// REQUEST MODELS
// ============================================================================

export interface EssaySubmissionRequest {
  essay_text: string;
  category: string;
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
  total_score: number;
  grade: string;
  rubric_scores: RubricScores;
  personalized_feedback: string;
  strengths: string[];
  areas_for_improvement: string[];
  word_count: number;
  category: string;
  submitted_at: string;
  progress?: ProgressUpdate | null;
}

export interface RubricScores {
  content_and_ideas: number;
  organization_and_structure: number;
  language_and_vocabulary: number;
  grammar_and_mechanics: number;
  coherence_and_clarity: number;
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
// ENUMS
// ============================================================================

export enum EssayCategory {
  ESSAY_WRITING = 'essay_writing',
  ELA = 'ela',
  MATH = 'math',
  SCIENCE = 'science',
}

/**
 * Helper function to convert string to EssayCategory
 */
export const stringToEssayCategory = (value: string): EssayCategory => {
  const categories = Object.values(EssayCategory);
  const found = categories.find((cat) => cat === value);
  return found || EssayCategory.ESSAY_WRITING;
};

/**
 * Get display name for essay category
 */
export const getEssayCategoryDisplayName = (category: EssayCategory): string => {
  switch (category) {
    case EssayCategory.ESSAY_WRITING:
      return 'Essay Writing';
    case EssayCategory.ELA:
      return 'ELA';
    case EssayCategory.MATH:
      return 'Math';
    case EssayCategory.SCIENCE:
      return 'Science';
    default:
      return 'Essay Writing';
  }
};