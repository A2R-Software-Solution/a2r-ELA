/**
 * Practice Session UI State
 * State for the PracticeSessionScreen — the actual exam-taking experience
 */

import {
  PssaDomain,
  PssaDifficulty,
  PssaQuestion,
  PssaPassage,
  PssaMcqQuestion,
  PssaShortAnswerQuestion,
} from '../../../api/apiService';

// ============================================================================
// SESSION CONFIG (passed in via navigation params)
// ============================================================================

export interface PracticeSessionConfig {
  difficulty:    string;
  mcq:           number;
  comprehension: number;
  writing:       number;
  total:         number;
  estimatedTime: string;
  xpReward:      number;
}

// ============================================================================
// DOMAIN BATCH — one passage + its questions, tagged with category
// ============================================================================

export type SessionCategory = 'mcq' | 'comprehension' | 'writing';

export interface DomainBatch {
  domain:   PssaDomain;
  category: SessionCategory;
  passage:  PssaPassage;
  questions: PssaQuestion[];
}

// ============================================================================
// FLATTENED RUNTIME QUESTION — one entry per question in the session
// ============================================================================

export interface RuntimeQuestion {
  uid:           string;          // unique within session (domain + question.id)
  category:      SessionCategory;
  domain:        PssaDomain;
  passageTitle:  string;
  passageText:   string;
  question:      PssaQuestion;
}

// ============================================================================
// ANSWER STATE — per question
// ============================================================================

export interface McqAnswerState {
  type:           'mcq';
  selectedOption: 'A' | 'B' | 'C' | 'D' | null;
  isCorrect:      boolean | null;
  isAnswered:     boolean;
}

export interface ShortAnswerAnswerState {
  type:               'short_answer';
  studentAnswer:      string;
  isAnswered:         boolean;
  isEvaluating:       boolean;
  score:              number | null;
  maxScore:           number | null;
  feedback:           string | null;
  whatTheyDidWell:    string | null;
  howToImprove:       string | null;
  xpEarned:           number | null;
  evaluationFailed:   boolean;
}

export type AnswerState = McqAnswerState | ShortAnswerAnswerState;

// ============================================================================
// SCREEN STATE
// ============================================================================

export type SessionPhase = 'loading' | 'in_progress' | 'submitting' | 'results' | 'error';

export interface PracticeSessionUiState {
  phase:             SessionPhase;
  errorMessage:      string | null;

  config:            PracticeSessionConfig;

  questions:         RuntimeQuestion[];
  answers:           Record<string, AnswerState>; // keyed by RuntimeQuestion.uid

  currentIndex:      number;

  // Results (computed when phase === 'results')
  totalCorrectMcq:   number;
  totalMcq:          number;
  totalXpEarned:     number;
  overallScorePct:   number;
}

// ============================================================================
// HELPERS
// ============================================================================

export const isMcqQuestion = (q: PssaQuestion): q is PssaMcqQuestion =>
  q.type === 'mcq';

export const isShortAnswerQuestion = (q: PssaQuestion): q is PssaShortAnswerQuestion =>
  q.type === 'short_answer';

// ============================================================================
// INITIAL STATE
// ============================================================================

export const createInitialSessionState = (
  config: PracticeSessionConfig,
): PracticeSessionUiState => ({
  phase:           'loading',
  errorMessage:    null,
  config,
  questions:       [],
  answers:         {},
  currentIndex:    0,
  totalCorrectMcq: 0,
  totalMcq:        0,
  totalXpEarned:   0,
  overallScorePct: 0,
});