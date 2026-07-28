/**
 * ExamPrep UI State Types
 * All TypeScript interfaces and types for the Exam Prep screen.
 */

import { PssaDomain, PssaDifficulty, PssaQuestionsResponse } from '../../../api/apiService';

// --------------------------------------------------------------------------
// EXAM TAB
// --------------------------------------------------------------------------

/**
 * Tab options at the top of the screen.
 * Each tab corresponds to a different exam type.
 */
export interface ExamTab {
  id:    string; // e.g. "pssa_ela"
  label: string; // e.g. "PSSA ELA"
}

// --------------------------------------------------------------------------
// GRADE OPTION
// --------------------------------------------------------------------------

/**
 * A single selectable grade — used by the grade selector sheet
 * (reuses StateSelectorSheet's grade grid, state portion unused).
 */
export interface GradeOption {
  code:  string; // e.g. "3", "4"
  label: string; // e.g. "Grade 3"
}

// --------------------------------------------------------------------------
// DOMAIN OPTION
// --------------------------------------------------------------------------

/**
 * A single selectable PSSA domain — rendered as an inline chip.
 */
export interface DomainOption {
  code:  PssaDomain;
  label: string; // e.g. "Reading Fiction"
}

// --------------------------------------------------------------------------
// EXAM PREP UI STATE
// --------------------------------------------------------------------------

/**
 * Full UI state for the Exam Prep screen.
 * Drives all rendering — no component holds its own state.
 */
export interface ExamPrepUiState {
  // Tabs
  tabs:          ExamTab[];   // All available exam tabs
  activeTabId:   string;      // Currently selected tab id

  // Header info
  examTitle:     string;      // e.g. "PSSA ELA Writing Exam Prep"

  // Grade selector
  selectedGrade:       string;        // e.g. "4" — currently selected grade
  gradeOptions:         GradeOption[]; // Selectable grades (Grade 3 / Grade 4 for now)
  isGradeSheetVisible:  boolean;       // Controls the grade selector sheet

  // Domain selector
  selectedDomain: PssaDomain;    // Currently selected domain
  domainOptions:  DomainOption[]; // Selectable domains (inline chips)

  // Difficulty used for question generation (fixed for now, exposed for navigation)
  difficulty:     PssaDifficulty;

  // Question generation
  isGenerating:       boolean;                    // True while generatePssaQuestions() is in flight
  generatedQuestions: PssaQuestionsResponse | null; // Last successful generation result

  // Async state
  isLoading:     boolean;      // Pull-to-refresh loading state
  errorMessage:  string | null;
}