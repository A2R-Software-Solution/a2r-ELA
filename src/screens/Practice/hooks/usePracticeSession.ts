/**
 * usePracticeSession — Lazy Loading Version
 *
 * Instead of fetching all questions upfront, questions are fetched ONE AT A TIME
 * when the user presses Next. This:
 *   1. Eliminates the long initial loading spinner
 *   2. Spreads TPM usage over time → no more LLM failures
 *   3. Allows higher total question counts reliably
 *
 * Flow:
 *   Mount        → build question plan → fetch Q1 → show Q1
 *   User → Next  → fetch Q2 in background → navigate to Q2
 *   User → Next  → fetch Q3 in background → navigate to Q3
 *   ...
 *   Last Q → Finish → results screen
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, PssaDomain, PssaDifficulty } from '../../../api/apiService';
import {
  PracticeSessionConfig,
  PracticeSessionParams,
  PreloadedSessionData,
  PracticeSessionUiState,
  RuntimeQuestion,
  AnswerState,
  SessionCategory,
  createInitialSessionState,
  isMcqQuestion,
  isShortAnswerQuestion,
} from '../types/PracticeSessionUiState';

// ============================================================================
// QUESTION PLAN
// A flat ordered list of { domain, category } slots built from config.
// Each slot = one API call = one question fetched lazily.
// ============================================================================

interface QuestionSlot {
  domain:   PssaDomain;
  category: SessionCategory;
}

const COMPREHENSION_DOMAINS: PssaDomain[] = [
  'reading_fiction',
  'reading_informational',
  'poetry',
];
const MCQ_DOMAINS: PssaDomain[] = [
  'vocabulary',
  'craft_and_structure',
];
const WRITING_DOMAIN: PssaDomain = 'reading_informational';

// Fallback when PracticeSessionConfig.grade isn't provided (CreateCustomTest
// flow doesn't collect grade yet) — keeps behavior working until that's added.
const FALLBACK_GRADE = '4';

/**
 * Build a flat ordered list of question slots from config.
 * Order: MCQ → Comprehension → Writing
 */
function buildQuestionPlan(config: PracticeSessionConfig): QuestionSlot[] {
  const slots: QuestionSlot[] = [];

  for (let i = 0; i < config.mcq; i++) {
    slots.push({ domain: MCQ_DOMAINS[i % MCQ_DOMAINS.length], category: 'mcq' });
  }
  for (let i = 0; i < config.comprehension; i++) {
    slots.push({ domain: COMPREHENSION_DOMAINS[i % COMPREHENSION_DOMAINS.length], category: 'comprehension' });
  }
  for (let i = 0; i < config.writing; i++) {
    slots.push({ domain: WRITING_DOMAIN, category: 'writing' });
  }

  return slots;
}

// ============================================================================
// BUILD PRELOADED QUESTIONS — ExamPrep flow, data already fetched upstream
// (single generatePssaQuestions call in useExamPrep.onContinue). No further
// API calls are made here — this just flattens the response into
// RuntimeQuestion[] the screen already knows how to render.
// ============================================================================

function buildPreloadedQuestions(data: PreloadedSessionData): RuntimeQuestion[] {
  const { response, domain } = data;
  const { passage, questions } = response;

  if (!passage || !questions || questions.length === 0) return [];

  return questions.map((q, index) => ({
    uid:          `${domain}_${q.id ?? index}_${index}`,
    category:     (isMcqQuestion(q) ? 'mcq' : 'comprehension') as SessionCategory,
    domain,
    passageTitle: passage.title,
    passageText:  passage.text,
    question:     q,
  }));
}

// ============================================================================
// FETCH ONE QUESTION
// ============================================================================

async function fetchOneQuestion(
  slot: QuestionSlot,
  difficulty: PssaDifficulty,
  grade: string,
  index: number,
): Promise<RuntimeQuestion | null> {
  try {
    const res = await apiService.generatePssaQuestions({
      grade,
      domain:     slot.domain,
      difficulty,
      count:      1,
    });

    if (!res.data.success || !res.data.data) return null;

    const { passage, questions } = res.data.data;
    if (!questions || questions.length === 0) return null;

    const matchingQuestion = questions.find(q => {
      if (slot.category === 'mcq')           return isMcqQuestion(q);
      if (slot.category === 'comprehension') return isShortAnswerQuestion(q);
      if (slot.category === 'writing')       return isShortAnswerQuestion(q);
      return false;
    });

    if (!matchingQuestion) return null;

    return {
      uid:          `${slot.domain}_${slot.category}_${index}_${Math.random().toString(36).slice(2, 6)}`,
      category:     slot.category,
      domain:       slot.domain,
      passageTitle: passage.title,
      passageText:  passage.text,
      question:     matchingQuestion,
    };
  } catch (err) {
    console.error(`fetchOneQuestion error (slot ${index}):`, err);
    return null;
  }
}

// ============================================================================
// INITIAL ANSWER STATE
// ============================================================================

function buildAnswerState(rq: RuntimeQuestion): AnswerState {
  if (isMcqQuestion(rq.question)) {
    return {
      type:           'mcq',
      selectedOption: null,
      isCorrect:      null,
      isAnswered:     false,
    };
  }
  return {
    type:             'short_answer',
    studentAnswer:    '',
    isAnswered:       false,
    isEvaluating:     false,
    score:            null,
    maxScore:         null,
    feedback:         null,
    whatTheyDidWell:  null,
    howToImprove:     null,
    xpEarned:         null,
    evaluationFailed: false,
  };
}

// ============================================================================
// EXTENDED STATE — adds isNextLoading flag
// ============================================================================

interface ExtendedSessionState extends PracticeSessionUiState {
  isNextLoading: boolean;
}

// ============================================================================
// HOOK
// ============================================================================

export function usePracticeSession(params: PracticeSessionParams) {
  const [state, setState] = useState<ExtendedSessionState>({
    ...createInitialSessionState(params),
    isNextLoading: false,
  });

  const planRef           = useRef<QuestionSlot[]>([]);
  const fetchingIndexRef  = useRef<number>(-1);
  const initialisedRef    = useRef(false);

  // --------------------------------------------------------------------------
  // FETCH QUESTION AT PLAN INDEX
  // --------------------------------------------------------------------------

  const fetchQuestionAtIndex = useCallback(async (index: number) => {
    const plan = planRef.current;
    if (index >= plan.length) return;
    if (fetchingIndexRef.current === index) return;

    fetchingIndexRef.current = index;

    // Full-screen loader for Q1, inline loader for subsequent
    if (index === 0) {
      setState(prev => ({ ...prev, phase: 'loading', errorMessage: null, isNextLoading: false }));
    } else {
      setState(prev => ({ ...prev, isNextLoading: true }));
    }

    const slot       = plan[index];
    const difficulty = (params.mode === 'lazy' ? params.config.difficulty : 'medium') as PssaDifficulty;
    const grade      = (params.mode === 'lazy' ? params.config.grade : undefined) ?? FALLBACK_GRADE;
    const rq         = await fetchOneQuestion(slot, difficulty, grade, index);

    if (!rq) {
      if (index === 0) {
        setState(prev => ({
          ...prev,
          phase:         'error',
          errorMessage:  'Could not generate the first question. Please try again.',
          isNextLoading: false,
        }));
      } else {
        // Non-fatal — skip this slot
        console.warn(`Skipping question slot ${index} — fetch returned null`);
        setState(prev => ({ ...prev, isNextLoading: false }));
      }
      fetchingIndexRef.current = -1;
      return;
    }

    const answerState = buildAnswerState(rq);

    setState(prev => ({
      ...prev,
      phase:         'in_progress',
      isNextLoading: false,
      questions:     [...prev.questions, rq],
      answers:       { ...prev.answers, [rq.uid]: answerState },
    }));

    fetchingIndexRef.current = -1;
  }, [params]);

  // --------------------------------------------------------------------------
  // INITIALISE ON MOUNT
  // Preloaded (ExamPrep) mode: flatten the already-fetched response into
  // RuntimeQuestion[] immediately — no API call, no loading spinner needed.
  // Lazy (CreateCustomTest) mode: unchanged — build a fetch plan and fetch Q1.
  // --------------------------------------------------------------------------

  useEffect(() => {
    if (initialisedRef.current) return;
    initialisedRef.current = true;

    if (params.mode === 'preloaded') {
      const runtimeQuestions = buildPreloadedQuestions(params.data);

      if (runtimeQuestions.length === 0) {
        setState(prev => ({
          ...prev,
          phase:        'error',
          errorMessage: 'No questions were generated. Please try again.',
        }));
        return;
      }

      const answers: Record<string, AnswerState> = {};
      for (const rq of runtimeQuestions) {
        answers[rq.uid] = buildAnswerState(rq);
      }

      setState(prev => ({
        ...prev,
        phase:     'in_progress',
        questions: runtimeQuestions,
        answers,
      }));
      return;
    }

    planRef.current = buildQuestionPlan(params.config);
    fetchQuestionAtIndex(0);
  }, [params, fetchQuestionAtIndex]);

  // --------------------------------------------------------------------------
  // RETRY
  // --------------------------------------------------------------------------

  const retryFetch = useCallback(() => {
    initialisedRef.current  = false;
    fetchingIndexRef.current = -1;
    setState({ ...createInitialSessionState(params), isNextLoading: false });

    if (params.mode === 'lazy') {
      initialisedRef.current = true;
      planRef.current = buildQuestionPlan(params.config);
      fetchQuestionAtIndex(0);
    }
    // Preloaded mode: initialisedRef reset to false lets the mount effect
    // above re-run and rebuild from params.data again.
  }, [params, fetchQuestionAtIndex]);

  // --------------------------------------------------------------------------
  // MCQ ANSWER
  // --------------------------------------------------------------------------

  const selectMcqOption = useCallback((uid: string, option: 'A' | 'B' | 'C' | 'D') => {
    setState(prev => {
      const current = prev.answers[uid];
      if (!current || current.type !== 'mcq' || current.isAnswered) return prev;

      const rq = prev.questions.find(q => q.uid === uid);
      if (!rq || !isMcqQuestion(rq.question)) return prev;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [uid]: {
            type:           'mcq',
            selectedOption: option,
            isCorrect:      option === rq.question.correct_answer,
            isAnswered:     true,
          },
        },
      };
    });
  }, []);

  // --------------------------------------------------------------------------
  // SHORT ANSWER / WRITING
  // --------------------------------------------------------------------------

  const updateShortAnswerText = useCallback((uid: string, text: string) => {
    setState(prev => {
      const current = prev.answers[uid];
      if (!current || current.type !== 'short_answer') return prev;
      return {
        ...prev,
        answers: { ...prev.answers, [uid]: { ...current, studentAnswer: text } },
      };
    });
  }, []);

  const submitShortAnswer = useCallback(async (uid: string) => {
    const rq     = state.questions.find(q => q.uid === uid);
    const answer = state.answers[uid];

    if (
      !rq ||
      !answer ||
      answer.type !== 'short_answer' ||
      !isShortAnswerQuestion(rq.question) ||
      !answer.studentAnswer.trim()
    ) return;

    setState(prev => ({
      ...prev,
      answers: {
        ...prev.answers,
        [uid]: { ...(prev.answers[uid] as any), isEvaluating: true },
      },
    }));

    try {
      const res = await apiService.evaluatePssaWriting({
        question:       rq.question.question,
        student_answer: answer.studentAnswer,
        difficulty:     state.config.difficulty as PssaDifficulty,
        grade:          state.config.grade ?? FALLBACK_GRADE,
      });

      if (res.data.success && res.data.data) {
        const d = res.data.data;
        setState(prev => ({
          ...prev,
          answers: {
            ...prev.answers,
            [uid]: {
              type:             'short_answer',
              studentAnswer:    answer.studentAnswer,
              isAnswered:       true,
              isEvaluating:     false,
              score:            d.score,
              maxScore:         d.max_score,
              feedback:         d.feedback,
              whatTheyDidWell:  d.what_they_did_well,
              howToImprove:     d.how_to_improve,
              xpEarned:         d.xp_earned,
              evaluationFailed: false,
            },
          },
        }));
      } else {
        throw new Error('Evaluation failed');
      }
    } catch {
      setState(prev => ({
        ...prev,
        answers: {
          ...prev.answers,
          [uid]: {
            type:             'short_answer',
            studentAnswer:    answer.studentAnswer,
            isAnswered:       true,
            isEvaluating:     false,
            score:            null,
            maxScore:         null,
            feedback:         null,
            whatTheyDidWell:  null,
            howToImprove:     null,
            xpEarned:         null,
            evaluationFailed: true,
          },
        },
      }));
    }
  }, [state.questions, state.answers, state.config.difficulty, state.config.grade]);

  // --------------------------------------------------------------------------
  // NAVIGATION — Next triggers lazy fetch of the following question
  // --------------------------------------------------------------------------

  const goToNext = useCallback(() => {
    setState(prev => {
      const nextIndex     = prev.currentIndex + 1;
      const nextSlotIndex = prev.questions.length; // next un-fetched slot index

      // Trigger fetch for the next slot if not yet fetched
      if (nextSlotIndex < planRef.current.length) {
        // Use setTimeout to let state update first, then fetch
        setTimeout(() => fetchQuestionAtIndex(nextSlotIndex), 0);
      }

      return { ...prev, currentIndex: nextIndex };
    });
  }, [fetchQuestionAtIndex]);

  const goToPrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  // --------------------------------------------------------------------------
  // FINISH SESSION
  // --------------------------------------------------------------------------

  const finishSession = useCallback(() => {
    setState(prev => {
      let totalCorrectMcq = 0;
      let totalMcq        = 0;
      let totalXpEarned   = 0;

      for (const rq of prev.questions) {
        const answer = prev.answers[rq.uid];
        if (!answer) continue;

        if (answer.type === 'mcq') {
          totalMcq += 1;
          if (answer.isCorrect) totalCorrectMcq += 1;
        } else if (answer.type === 'short_answer' && answer.xpEarned) {
          totalXpEarned += answer.xpEarned;
        }
      }

      const mcqPct = totalMcq > 0 ? (totalCorrectMcq / totalMcq) * 100 : 100;

      return {
        ...prev,
        phase:           'results',
        totalCorrectMcq,
        totalMcq,
        totalXpEarned,
        overallScorePct: Math.round(mcqPct),
      };
    });
  }, []);

  // --------------------------------------------------------------------------
  // DERIVED
  // --------------------------------------------------------------------------

  const totalPlanned    = planRef.current.length || state.config.total;
  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const currentAnswer   = currentQuestion ? state.answers[currentQuestion.uid] : null;
  const isLastQuestion  = state.currentIndex === totalPlanned - 1;
  const answeredCount   = Object.values(state.answers).filter(a => a.isAnswered).length;

  return {
    state,
    currentQuestion,
    currentAnswer,
    isLastQuestion,
    isNextLoading:  state.isNextLoading,
    answeredCount,
    totalPlanned,
    selectMcqOption,
    updateShortAnswerText,
    submitShortAnswer,
    goToNext,
    goToPrevious,
    finishSession,
    retryFetch,
  };
}

export default usePracticeSession;