/**
 * useCreateTest Hook
 * Manages all state and logic for CreateCustomTestScreen
 */

import { useState, useCallback, useMemo } from 'react';
import {
  CreateTestUiState,
  initialCreateTestState,
  Difficulty,
  QuickPreset,
  XP_PER_MCQ,
  XP_PER_COMPREHENSION,
  XP_PER_WRITING,
  MINS_PER_MCQ,
  MINS_PER_COMPREHENSION,
  MINS_PER_WRITING,
  MAX_QUESTIONS,
  MIN_QUESTIONS,
} from '../types/CreateTestUiState';

// ============================================================================
// HELPERS
// ============================================================================

const computeTotals = (
  mcq:           number,
  comprehension: number,
  writing:       number,
) => ({
  totalQuestions:   mcq + comprehension + writing,
  estimatedMinutes: mcq * MINS_PER_MCQ + comprehension * MINS_PER_COMPREHENSION + writing * MINS_PER_WRITING,
  xpReward:         mcq * XP_PER_MCQ   + comprehension * XP_PER_COMPREHENSION   + writing * XP_PER_WRITING,
});

const formatTime = (minutes: number): string => {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
};

// ============================================================================
// HOOK RETURN TYPE
// ============================================================================

export interface UseCreateTestReturn {
  uiState:            CreateTestUiState;
  estimatedTimeLabel: string;

  // Actions
  onDifficultyChange:   (difficulty: Difficulty) => void;
  onMcqChange:          (count: number) => void;
  onComprehensionChange:(count: number) => void;
  onWritingChange:      (count: number) => void;
  onPresetSelect:       (preset: QuickPreset) => void;
  onStartTestPress:     () => void;
  onConfirmSheetClose:  () => void;
  onConfirmStart:       () => void;
}

// ============================================================================
// HOOK
// ============================================================================

export const useCreateTest = (
  onNavigateToInstructions: (config: {
    difficulty:    string;
    mcq:           number;
    comprehension: number;
    writing:       number;
    total:         number;
    estimatedTime: string;
    xpReward:      number;
  }) => void,
): UseCreateTestReturn => {

  const [uiState, setUiState] = useState<CreateTestUiState>(initialCreateTestState);

  // ── Difficulty ────────────────────────────────────────────────────────────

  const onDifficultyChange = useCallback((difficulty: Difficulty) => {
    setUiState(prev => ({ ...prev, selectedDifficulty: difficulty }));
  }, []);

  // ── Sliders ───────────────────────────────────────────────────────────────

  const updateCounts = useCallback((
    mcq:           number,
    comprehension: number,
    writing:       number,
  ) => {
    const clamped = {
      mcq:           Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, mcq)),
      comprehension: Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, comprehension)),
      writing:       Math.min(MAX_QUESTIONS, Math.max(MIN_QUESTIONS, writing)),
    };
    const totals = computeTotals(clamped.mcq, clamped.comprehension, clamped.writing);
    setUiState(prev => ({
      ...prev,
      mcqCount:           clamped.mcq,
      comprehensionCount: clamped.comprehension,
      writingCount:       clamped.writing,
      ...totals,
    }));
  }, []);

  const onMcqChange = useCallback((count: number) => {
    setUiState(prev => {
      const totals = computeTotals(count, prev.comprehensionCount, prev.writingCount);
      return { ...prev, mcqCount: count, ...totals };
    });
  }, []);

  const onComprehensionChange = useCallback((count: number) => {
    setUiState(prev => {
      const totals = computeTotals(prev.mcqCount, count, prev.writingCount);
      return { ...prev, comprehensionCount: count, ...totals };
    });
  }, []);

  const onWritingChange = useCallback((count: number) => {
    setUiState(prev => {
      const totals = computeTotals(prev.mcqCount, prev.comprehensionCount, count);
      return { ...prev, writingCount: count, ...totals };
    });
  }, []);

  // ── Presets ───────────────────────────────────────────────────────────────

  const onPresetSelect = useCallback((preset: QuickPreset) => {
    updateCounts(preset.mcq, preset.comprehension, preset.writing);
  }, [updateCounts]);

  // ── Confirm Sheet ─────────────────────────────────────────────────────────

  const onStartTestPress = useCallback(() => {
    if (uiState.totalQuestions === 0) return;
    setUiState(prev => ({ ...prev, showConfirmSheet: true }));
  }, [uiState.totalQuestions]);

  const onConfirmSheetClose = useCallback(() => {
    setUiState(prev => ({ ...prev, showConfirmSheet: false }));
  }, []);

  const onConfirmStart = useCallback(() => {
    setUiState(prev => ({ ...prev, showConfirmSheet: false }));
    onNavigateToInstructions({
      difficulty:    uiState.selectedDifficulty,
      mcq:           uiState.mcqCount,
      comprehension: uiState.comprehensionCount,
      writing:       uiState.writingCount,
      total:         uiState.totalQuestions,
      estimatedTime: formatTime(uiState.estimatedMinutes),
      xpReward:      uiState.xpReward,
    });
  }, [uiState, onNavigateToInstructions]);

  // ── Computed ──────────────────────────────────────────────────────────────

  const estimatedTimeLabel = useMemo(
    () => formatTime(uiState.estimatedMinutes),
    [uiState.estimatedMinutes],
  );

  return {
    uiState,
    estimatedTimeLabel,
    onDifficultyChange,
    onMcqChange,
    onComprehensionChange,
    onWritingChange,
    onPresetSelect,
    onStartTestPress,
    onConfirmSheetClose,
    onConfirmStart,
  };
};