/**
 * ExamPrep UI State Types
 * All TypeScript interfaces and types for the Exam Prep screen.
 */

// --------------------------------------------------------------------------
// SECTION STATUS
// --------------------------------------------------------------------------

/**
 * Status of an individual exam section based on completion.
 * - complete:    all tasks done         (green)
 * - in_progress: some tasks done        (yellow/orange)
 * - not_started: zero tasks done        (grey)
 */
export type SectionStatus = 'complete' | 'in_progress' | 'not_started';

// --------------------------------------------------------------------------
// EXAM SECTION
// --------------------------------------------------------------------------

/**
 * A single topic/section row inside the exam prep checklist.
 */
export interface ExamSection {
  id:             string;        // Unique identifier e.g. "understanding_exam"
  title:          string;        // Display title e.g. "Understanding the Exam"
  completed:      number;        // Tasks completed e.g. 5
  total:          number;        // Total tasks e.g. 5
  status:         SectionStatus; // Derived from completed/total
}

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

  // Overall progress
  overallPercent: number;     // 0–100, drives the progress ring

  // Section checklist
  sections:      ExamSection[];

  // Async state
  isLoading:     boolean;
  errorMessage:  string | null;
}