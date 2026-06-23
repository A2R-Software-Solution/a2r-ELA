/**
 * useExamPrep Hook
 * Manages all state and logic for the Exam Prep screen.
 * Currently uses mock data — backend integration comes later.
 */

import { useState, useCallback } from 'react';
import {
  ExamPrepUiState,
  ExamSection,
  ExamTab,
  SectionStatus,
} from '../types/ExamPrepUiState';

// --------------------------------------------------------------------------
// HELPERS
// --------------------------------------------------------------------------

/**
 * Derive section status from completed / total counts.
 */
function deriveStatus(completed: number, total: number): SectionStatus {
  if (completed === 0)           return 'not_started';
  if (completed >= total)        return 'complete';
  return 'in_progress';
}

/**
 * Calculate overall percent from all sections.
 * Sum of completed tasks / sum of total tasks * 100.
 */
function calcOverallPercent(sections: ExamSection[]): number {
  const totalTasks     = sections.reduce((acc, s) => acc + s.total, 0);
  const completedTasks = sections.reduce((acc, s) => acc + s.completed, 0);
  if (totalTasks === 0) return 0;
  return Math.round((completedTasks / totalTasks) * 100);
}

// --------------------------------------------------------------------------
// MOCK DATA
// --------------------------------------------------------------------------

const MOCK_TABS: ExamTab[] = [
  { id: 'pssa_ela',         label: 'PSSA ELA' },
  { id: 'placeholder_exam', label: 'Placeholder Exam!' },
];

const MOCK_SECTIONS_BY_TAB: Record<string, ExamSection[]> = {
  pssa_ela: [
    {
      id:        'understanding_exam',
      title:     'Understanding the Exam',
      completed: 5,
      total:     5,
      status:    deriveStatus(5, 5),
    },
    {
      id:        'writing_skills',
      title:     'Writing Skills',
      completed: 3,
      total:     5,
      status:    deriveStatus(3, 5),
    },
    {
      id:        'practice_essays',
      title:     'Practice Essays',
      completed: 4,
      total:     8,
      status:    deriveStatus(4, 8),
    },
    {
      id:        'timed_practice',
      title:     'Timed Practice',
      completed: 2,
      total:     5,
      status:    deriveStatus(2, 5),
    },
    {
      id:        'review_improve',
      title:     'Review & Improve',
      completed: 1,
      total:     5,
      status:    deriveStatus(1, 5),
    },
  ],
  placeholder_exam: [
    {
      id:        'intro',
      title:     'Introduction',
      completed: 0,
      total:     4,
      status:    deriveStatus(0, 4),
    },
    {
      id:        'core_concepts',
      title:     'Core Concepts',
      completed: 0,
      total:     6,
      status:    deriveStatus(0, 6),
    },
    {
      id:        'practice',
      title:     'Practice',
      completed: 0,
      total:     5,
      status:    deriveStatus(0, 5),
    },
  ],
};

const MOCK_EXAM_TITLES: Record<string, string> = {
  pssa_ela:         'PSSA ELA Writing Exam Prep',
  placeholder_exam: 'Placeholder Exam Prep',
};

// --------------------------------------------------------------------------
// HOOK RETURN TYPE
// --------------------------------------------------------------------------

interface UseExamPrepReturn {
  state:         ExamPrepUiState;
  onTabChange:   (tabId: string) => void;
  onRefresh:     () => void;
}

// --------------------------------------------------------------------------
// HOOK
// --------------------------------------------------------------------------

export default function useExamPrep(): UseExamPrepReturn {
  const [activeTabId, setActiveTabId] = useState<string>('pssa_ela');
  const [isLoading,   setIsLoading]   = useState<boolean>(false);

  // Derive data for active tab
  const sections      = MOCK_SECTIONS_BY_TAB[activeTabId] ?? [];
  const examTitle     = MOCK_EXAM_TITLES[activeTabId]     ?? '';
  const overallPercent = calcOverallPercent(sections);

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  const onTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const onRefresh = useCallback(() => {
    // Placeholder for future backend pull-to-refresh
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  // --------------------------------------------------------------------------
  // STATE ASSEMBLY
  // --------------------------------------------------------------------------

  const state: ExamPrepUiState = {
    tabs:           MOCK_TABS,
    activeTabId,
    examTitle,
    overallPercent,
    sections,
    isLoading,
    errorMessage:   null,
  };

  return {
    state,
    onTabChange,
    onRefresh,
  };
}