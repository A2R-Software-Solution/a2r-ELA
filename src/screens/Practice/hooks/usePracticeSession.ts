/**
 * usePracticeSession
 * Fetches PSSA questions across domains (respecting 20-per-call backend cap),
 * tracks student answers, evaluates writing responses, computes final results.
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { apiService, PssaDomain, PssaDifficulty, PssaQuestion } from '../../../api/apiService';
import {
  PracticeSessionConfig,
  PracticeSessionUiState,
  RuntimeQuestion,
  AnswerState,
  DomainBatch,
  createInitialSessionState,
  isMcqQuestion,
  isShortAnswerQuestion,
} from '../types/PracticeSessionUiState';

const MAX_PER_CALL = 20;

// Domains used for "comprehension" count — rotated for variety
const COMPREHENSION_DOMAINS: PssaDomain[] = [
  'reading_fiction',
  'reading_informational',
  'poetry',
];

// Domains used for "mcq" count — standalone MCQ-style domains
const MCQ_DOMAINS: PssaDomain[] = [
  'vocabulary',
  'craft_and_structure',
];

/**
 * Split a total count across a list of domains, rotating until
 * each request is <= MAX_PER_CALL.
 */
function buildDomainRequests(
  totalCount: number,
  domains: PssaDomain[],
  category: 'mcq' | 'comprehension',
): { domain: PssaDomain; count: number; category: 'mcq' | 'comprehension' }[] {
  if (totalCount <= 0 || domains.length === 0) return [];

  const requests: { domain: PssaDomain; count: number; category: 'mcq' | 'comprehension' }[] = [];
  let remaining = totalCount;
  let domainIdx = 0;

  while (remaining > 0) {
    const domain = domains[domainIdx % domains.length];
    const chunk = Math.min(remaining, MAX_PER_CALL, Math.ceil(totalCount / domains.length) || remaining);
    requests.push({ domain, count: chunk, category });
    remaining -= chunk;
    domainIdx += 1;

    // Safety valve — never loop forever
    if (requests.length > 20) break;
  }

  return requests;
}

export function usePracticeSession(config: PracticeSessionConfig) {
  const [state, setState] = useState<PracticeSessionUiState>(
    createInitialSessionState(config),
  );

  const hasFetchedRef = useRef(false);

  // --------------------------------------------------------------------------
  // FETCH ALL QUESTIONS ON MOUNT
  // --------------------------------------------------------------------------

  const fetchSession = useCallback(async () => {
    setState(prev => ({ ...prev, phase: 'loading', errorMessage: null }));

    try {
      const difficulty = config.difficulty as PssaDifficulty;

      const comprehensionReqs = buildDomainRequests(
        config.comprehension,
        COMPREHENSION_DOMAINS,
        'comprehension',
      );
      const mcqReqs = buildDomainRequests(config.mcq, MCQ_DOMAINS, 'mcq');

      const allReqs = [...comprehensionReqs, ...mcqReqs];

      // Fire all domain calls in parallel
      const responses: { req: typeof allReqs[0]; res: any }[] = [];
        for (const req of allReqs) {
          const res = await apiService.generatePssaQuestions({
            domain:     req.domain,
            difficulty,
            count:      req.count,
          });
          responses.push({ req, res });
          // Small delay between calls to stay under TPM limit
          if (allReqs.indexOf(req) < allReqs.length - 1) {
            await new Promise<void>(resolve => setTimeout(resolve, 1500));
          }
        }

      const runtimeQuestions: RuntimeQuestion[] = [];

      for (const { req, res } of responses) {
        if (!res.data.success || !res.data.data) continue;

        const { passage, questions } = res.data.data;

        for (const q of questions) {
          runtimeQuestions.push({
            uid:          `${req.domain}_${q.id}`,
            category:     req.category,
            domain:       req.domain,
            passageTitle: passage.title,
            passageText:  passage.text,
            question:     q,
          });
        }
      }

      // Writing questions: reuse short_answer questions already fetched
      // as the "writing" category — tag the last N short_answer questions as writing
      let writingNeeded = config.writing;
      for (let i = runtimeQuestions.length - 1; i >= 0 && writingNeeded > 0; i--) {
        if (isShortAnswerQuestion(runtimeQuestions[i].question)) {
          runtimeQuestions[i] = { ...runtimeQuestions[i], category: 'writing' };
          writingNeeded -= 1;
        }
      }

      if (runtimeQuestions.length === 0) {
        setState(prev => ({
          ...prev,
          phase: 'error',
          errorMessage: 'Could not generate any questions. Please try again.',
        }));
        return;
      }

      // Build initial answer state map
      const answers: Record<string, AnswerState> = {};
      for (const rq of runtimeQuestions) {
        if (isMcqQuestion(rq.question)) {
          answers[rq.uid] = {
            type:           'mcq',
            selectedOption: null,
            isCorrect:      null,
            isAnswered:     false,
          };
        } else {
          answers[rq.uid] = {
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
      }

      setState(prev => ({
        ...prev,
        phase:        'in_progress',
        questions:    runtimeQuestions,
        answers,
        currentIndex: 0,
      }));
    } catch (err: any) {
      console.error('usePracticeSession fetch error:', err);
      const message = (err && typeof err === 'object' && err.message)
        ? String(err.message)
        : 'Something went wrong while loading your practice session.';
      setState(prev => ({
        ...prev,
        phase: 'error',
        errorMessage: message,
      }));
    }
  }, [config]);

  useEffect(() => {
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;
    fetchSession();
  }, [fetchSession]);

  // --------------------------------------------------------------------------
  // MCQ ANSWER
  // --------------------------------------------------------------------------

  const selectMcqOption = useCallback((uid: string, option: 'A' | 'B' | 'C' | 'D') => {
    setState(prev => {
      const current = prev.answers[uid];
      if (!current || current.type !== 'mcq' || current.isAnswered) return prev;

      const rq = prev.questions.find(q => q.uid === uid);
      if (!rq || !isMcqQuestion(rq.question)) return prev;

      const isCorrect = option === rq.question.correct_answer;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [uid]: {
            type:           'mcq',
            selectedOption: option,
            isCorrect,
            isAnswered:     true,
          },
        },
      };
    });
  }, []);

  // --------------------------------------------------------------------------
  // SHORT ANSWER / WRITING — text input
  // --------------------------------------------------------------------------

  const updateShortAnswerText = useCallback((uid: string, text: string) => {
    setState(prev => {
      const current = prev.answers[uid];
      if (!current || current.type !== 'short_answer') return prev;

      return {
        ...prev,
        answers: {
          ...prev.answers,
          [uid]: { ...current, studentAnswer: text },
        },
      };
    });
  }, []);

  const submitShortAnswer = useCallback(async (uid: string) => {
    const rq = state.questions.find(q => q.uid === uid);
    const answer = state.answers[uid];

    if (!rq || !answer || answer.type !== 'short_answer' || !isShortAnswerQuestion(rq.question)) {
      return;
    }

    if (!answer.studentAnswer.trim()) return;

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
      });

      if (res.data.success && res.data.data) {
        const evalData = res.data.data;

        setState(prev => ({
          ...prev,
          answers: {
            ...prev.answers,
            [uid]: {
              type:             'short_answer',
              studentAnswer:    answer.studentAnswer,
              isAnswered:       true,
              isEvaluating:     false,
              score:            evalData.score,
              maxScore:         evalData.max_score,
              feedback:         evalData.feedback,
              whatTheyDidWell:  evalData.what_they_did_well,
              howToImprove:     evalData.how_to_improve,
              xpEarned:         evalData.xp_earned,
              evaluationFailed: false,
            },
          },
        }));
      } else {
        throw new Error('Evaluation failed');
      }
    } catch (err) {
      console.error('submitShortAnswer error:', err);
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
  }, [state.questions, state.answers, state.config.difficulty]);

  // --------------------------------------------------------------------------
  // NAVIGATION BETWEEN QUESTIONS
  // --------------------------------------------------------------------------

  const goToNext = useCallback(() => {
    setState(prev => {
      const nextIndex = prev.currentIndex + 1;
      if (nextIndex >= prev.questions.length) {
        return prev; // caller should call finishSession instead
      }
      return { ...prev, currentIndex: nextIndex };
    });
  }, []);

  const goToPrevious = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentIndex: Math.max(0, prev.currentIndex - 1),
    }));
  }, []);

  // --------------------------------------------------------------------------
  // FINISH SESSION — compute results
  // --------------------------------------------------------------------------

  const finishSession = useCallback(() => {
    setState(prev => {
      let totalCorrectMcq = 0;
      let totalMcq = 0;
      let totalXpEarned = 0;

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

  const currentQuestion = state.questions[state.currentIndex] ?? null;
  const currentAnswer = currentQuestion ? state.answers[currentQuestion.uid] : null;
  const isLastQuestion = state.currentIndex === state.questions.length - 1;
  const answeredCount = Object.values(state.answers).filter(a => a.isAnswered).length;

  return {
    state,
    currentQuestion,
    currentAnswer,
    isLastQuestion,
    answeredCount,
    selectMcqOption,
    updateShortAnswerText,
    submitShortAnswer,
    goToNext,
    goToPrevious,
    finishSession,
    retryFetch: fetchSession,
  };
}

export default usePracticeSession;