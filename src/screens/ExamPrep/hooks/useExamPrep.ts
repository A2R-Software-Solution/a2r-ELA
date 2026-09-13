/**
 * useExamPrep Hook
 * Manages all state and logic for the Exam Prep screen.
 * Grade + Domain selection now drive real backend question generation
 * via ExamRepository — mock progress data has been removed.
 */

import { useState, useCallback } from 'react';
import ExamRepository from '../../../repositories/ExamRepository';
import { Result } from '../../../models/Result';
import { PssaQuestionsResponse, PssaDifficulty } from '../../../api/apiService';
import {
  ExamPrepUiState,
  ExamTab,
  GradeOption,
  DomainOption,
} from '../types/ExamPrepUiState';

// --------------------------------------------------------------------------
// STATIC OPTIONS
// --------------------------------------------------------------------------

const TABS: ExamTab[] = [
  { id: 'pssa_ela',         label: 'PSSA ELA' },
  { id: 'placeholder_exam', label: 'Coming Soon' },
];

const EXAM_TITLES: Record<string, string> = {
  pssa_ela:         'PSSA ELA Writing Exam Prep',
  placeholder_exam: 'More exams coming soon',
};

// Grade 3 and 4 only — Grade 5+ content not seeded in Firestore yet (out of scope this sprint)
const GRADE_OPTIONS: GradeOption[] = [
  { code: '3', label: 'Grade 3' },
  { code: '4', label: 'Grade 4' },
];

const DOMAIN_OPTIONS: DomainOption[] = [
  { code: 'reading_fiction',        label: 'Reading Fiction' },
  { code: 'reading_informational',  label: 'Reading Informational' },
  { code: 'vocabulary',             label: 'Vocabulary' },
  { code: 'poetry',                 label: 'Poetry' },
  { code: 'craft_and_structure',    label: 'Craft & Structure' },
];

const DEFAULT_GRADE  = '4';
const DEFAULT_DOMAIN = 'reading_fiction' as const;

// Fixed session parameters — used both when calling the backend and when
// exposed via state so the navigator can build PreloadedSessionData with
// the exact same difficulty that was actually used to generate questions.
const DEFAULT_DIFFICULTY: PssaDifficulty = 'medium';
const DEFAULT_QUESTION_COUNT = 10;

// --------------------------------------------------------------------------
// HOOK RETURN TYPE
// --------------------------------------------------------------------------

interface UseExamPrepReturn {
  state:               ExamPrepUiState;
  onTabChange:         (tabId: string) => void;
  onRefresh:           () => void;
  onGradeChange:       (grade: string) => void;
  onDomainChange:      (domain: string) => void;
  onOpenGradeSheet:    () => void;
  onCloseGradeSheet:   () => void;
  onContinue:          () => Promise<Result<PssaQuestionsResponse>>;
}

// --------------------------------------------------------------------------
// HOOK
// --------------------------------------------------------------------------

export default function useExamPrep(): UseExamPrepReturn {
  const [activeTabId, setActiveTabId] = useState<string>('pssa_ela');
  const [isLoading,   setIsLoading]   = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Grade selector state
  const [selectedGrade, setSelectedGrade]             = useState<string>(DEFAULT_GRADE);
  const [isGradeSheetVisible, setIsGradeSheetVisible] = useState<boolean>(false);

  // Domain selector state
  const [selectedDomain, setSelectedDomain] = useState(DEFAULT_DOMAIN);

  // Question generation state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedQuestions, setGeneratedQuestions] =
    useState<PssaQuestionsResponse | null>(null);

  const examTitle = EXAM_TITLES[activeTabId] ?? '';

  // --------------------------------------------------------------------------
  // HANDLERS
  // --------------------------------------------------------------------------

  const onTabChange = useCallback((tabId: string) => {
    setActiveTabId(tabId);
  }, []);

  const onRefresh = useCallback(() => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  }, []);

  const onGradeChange = useCallback((grade: string) => {
    setSelectedGrade(grade);
  }, []);

  const onDomainChange = useCallback((domain: string) => {
    setSelectedDomain(domain as typeof DEFAULT_DOMAIN);
  }, []);

  const onOpenGradeSheet = useCallback(() => {
    setIsGradeSheetVisible(true);
  }, []);

  const onCloseGradeSheet = useCallback(() => {
    setIsGradeSheetVisible(false);
  }, []);

  const onContinue = useCallback(async (): Promise<Result<PssaQuestionsResponse>> => {
    if (activeTabId !== 'pssa_ela') {
      return Result.error(new Error('This exam is coming soon.'));
    }
    setIsGenerating(true);
    setErrorMessage(null);

    const result = await ExamRepository.generatePssaQuestions(
      selectedGrade,
      selectedDomain,
      DEFAULT_DIFFICULTY,
      DEFAULT_QUESTION_COUNT,
    );

    if (Result.isSuccess(result)) {
      setGeneratedQuestions(result.data);
    } else if (Result.isError(result)) {
      setErrorMessage(result.message);
    }

    setIsGenerating(false);
    return result;
  }, [activeTabId, selectedGrade, selectedDomain]);

  // --------------------------------------------------------------------------
  // STATE ASSEMBLY
  // --------------------------------------------------------------------------

  const state: ExamPrepUiState = {
    tabs:           TABS,
    activeTabId,
    examTitle,

    selectedGrade,
    gradeOptions:        GRADE_OPTIONS,
    isGradeSheetVisible,

    selectedDomain,
    domainOptions: DOMAIN_OPTIONS,

    difficulty: DEFAULT_DIFFICULTY,

    isGenerating,
    generatedQuestions,

    isLoading,
    errorMessage,
  };

  return {
    state,
    onTabChange,
    onRefresh,
    onGradeChange,
    onDomainChange,
    onOpenGradeSheet,
    onCloseGradeSheet,
    onContinue,
  };
}
