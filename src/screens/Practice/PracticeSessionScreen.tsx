import { styles, PRIMARY, WHITE, TEXT_GRAY, GREEN, RED } from './PracticeSessionScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';
import { colors } from '../../theme/colors';
/**
 * PracticeSessionScreen
 * The actual exam-taking experience — MCQ, short answer, and writing questions
 * generated fresh per session via PSSA backend.
 */

import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import usePracticeSession from './hooks/usePracticeSession';
import {
  PracticeSessionParams,
  isMcqQuestion,
  isShortAnswerQuestion,
} from './types/PracticeSessionUiState';

// ============================================================================
// PROPS
// ============================================================================

interface PracticeSessionScreenProps {
  params:        PracticeSessionParams;
  onBackClick:   () => void;
  onFinish:      () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const BLUE       = '#3B82F6';

const CATEGORY_LABEL: Record<string, string> = {
  mcq:           'Multiple Choice',
  comprehension: 'Reading Comprehension',
  writing:       'Writing Response',
};

const CATEGORY_COLOR: Record<string, string> = {
  mcq:           PRIMARY,
  comprehension: BLUE,
  writing:       GREEN,
};

// ============================================================================
// SCREEN
// ============================================================================

const PracticeSessionScreen: React.FC<PracticeSessionScreenProps> = ({
  params,
  onBackClick,
  onFinish,
}) => {
  const insets = useSafeAreaInsets();
  const {
    state,
    currentQuestion,
    currentAnswer,
    isLastQuestion,
    isNextLoading,
    selectMcqOption,
    updateShortAnswerText,
    submitShortAnswer,
    goToNext,
    goToPrevious,
    finishSession,
    retryFetch,
  } = usePracticeSession(params);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (state.phase === 'loading') {
    return (
      <View style={styles.centered}>
        <ScreenBackground />
        <ActivityIndicator size="large" color={PRIMARY} />
        <Text style={styles.loadingTitle}>Preparing your practice test...</Text>
        <Text style={styles.loadingSub}>Generating fresh questions just for you</Text>
      </View>
    );
  }

  // ── Error ─────────────────────────────────────────────────────────────────
  if (state.phase === 'error') {
    return (
      <View style={styles.centered}>
        <ScreenBackground />
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{state.errorMessage}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={retryFetch} activeOpacity={0.85}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBackClick} style={styles.touchableOpacityMarginTop}>
          <Text style={styles.backLink}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Results ───────────────────────────────────────────────────────────────
  if (state.phase === 'results') {
    return (
      <ResultsView
        totalCorrectMcq={state.totalCorrectMcq}
        totalMcq={state.totalMcq}
        totalXpEarned={state.totalXpEarned}
        overallScorePct={state.overallScorePct}
        onDone={onFinish}
        insetsBottom={insets.bottom}
      />
    );
  }

  // ── In Progress ───────────────────────────────────────────────────────────
  if (!currentQuestion || !currentAnswer) return null;

  const progressPct = ((state.currentIndex + 1) / state.questions.length) * 100;
  const categoryColor = CATEGORY_COLOR[currentQuestion.category] ?? PRIMARY;

  const handleNext = () => {
    if (isLastQuestion) {
      finishSession();
    } else {
      goToNext();
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.wrapper}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScreenBackground />
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={onBackClick} activeOpacity={0.7}>
          <Text style={styles.backBtnText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>
            Question {state.currentIndex + 1} of {state.questions.length}
          </Text>
          <View style={styles.progressBarTrack}>
            <View style={[styles.progressBarFill, { width: `${progressPct}%` }]} />
          </View>
        </View>

        <View style={[styles.categoryPill, { backgroundColor: `${categoryColor}18` }]}>
          <Text style={[styles.categoryPillText, { color: categoryColor }]}>
            {CATEGORY_LABEL[currentQuestion.category]}
          </Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Passage ────────────────────────────────────────────────────── */}
        <View style={styles.passageCard}>
          <Text style={styles.passageType}>{currentQuestion.passageTitle}</Text>
          <Text style={styles.passageText}>{currentQuestion.passageText}</Text>
        </View>

        {/* ── Question ───────────────────────────────────────────────────── */}
        {isMcqQuestion(currentQuestion.question) && currentAnswer.type === 'mcq' && (
          <MCQQuestionView
            question={currentQuestion.question}
            answer={currentAnswer}
            onSelect={(opt) => selectMcqOption(currentQuestion.uid, opt)}
          />
        )}

        {isShortAnswerQuestion(currentQuestion.question) && currentAnswer.type === 'short_answer' && (
          <ShortAnswerQuestionView
            question={currentQuestion.question}
            answer={currentAnswer}
            categoryColor={categoryColor}
            onChangeText={(text) => updateShortAnswerText(currentQuestion.uid, text)}
            onSubmit={() => submitShortAnswer(currentQuestion.uid)}
          />
        )}

        <View style={styles.viewHeight} />
      </ScrollView>

      {/* ── Footer Nav ─────────────────────────────────────────────────── */}
      <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, 16) }]}>
        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnSecondary, state.currentIndex === 0 && styles.navBtnDisabled]}
          onPress={goToPrevious}
          disabled={state.currentIndex === 0}
          activeOpacity={0.7}
        >
          <Text style={styles.navBtnSecondaryText}>Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navBtn, styles.navBtnPrimary, isNextLoading && styles.navBtnDisabled]}
          onPress={handleNext}
          disabled={isNextLoading}
          activeOpacity={0.85}
        >
          {isNextLoading
            ? <ActivityIndicator size="small" color={WHITE} />
            : <Text style={styles.navBtnPrimaryText}>
                {isLastQuestion ? 'Finish Test 🏁' : 'Next →'}
              </Text>
          }
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

// ============================================================================
// MCQ QUESTION VIEW
// ============================================================================

interface MCQQuestionViewProps {
  question: any;
  answer:   any;
  onSelect: (opt: 'A' | 'B' | 'C' | 'D') => void;
}

const MCQQuestionView: React.FC<MCQQuestionViewProps> = ({ question, answer, onSelect }) => {
  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question}</Text>

      {options.map(opt => {
        const isSelected   = answer.selectedOption === opt;
        const isCorrectOpt = answer.isAnswered && opt === question.correct_answer;
        const isWrongPick  = answer.isAnswered && isSelected && !answer.isCorrect;

        let optionStyle = styles.optionRow;
        let optionTextStyle = styles.optionText;
        let badgeStyle = styles.optionBadge;
        let badgeTextStyle = styles.optionBadgeText;

        if (answer.isAnswered) {
          if (isCorrectOpt) {
            optionStyle = { ...optionStyle, ...styles.optionRowCorrect };
            badgeStyle = { ...badgeStyle, ...styles.optionBadgeCorrect };
            badgeTextStyle = { ...badgeTextStyle, ...styles.optionBadgeTextActive };
          } else if (isWrongPick) {
            optionStyle = { ...optionStyle, ...styles.optionRowWrong };
            badgeStyle = { ...badgeStyle, ...styles.optionBadgeWrong };
            badgeTextStyle = { ...badgeTextStyle, ...styles.optionBadgeTextActive };
          }
        } else if (isSelected) {
          optionStyle = { ...optionStyle, ...styles.optionRowSelected };
          badgeStyle = { ...badgeStyle, ...styles.optionBadgeSelected };
          badgeTextStyle = { ...badgeTextStyle, ...styles.optionBadgeTextActive };
        }

        return (
          <TouchableOpacity
            key={opt}
            style={optionStyle}
            onPress={() => onSelect(opt)}
            disabled={answer.isAnswered}
            activeOpacity={0.7}
          >
            <View style={badgeStyle}>
              <Text style={badgeTextStyle}>{opt}</Text>
            </View>
            <Text style={optionTextStyle}>{question.options[opt]}</Text>
          </TouchableOpacity>
        );
      })}

      {answer.isAnswered && (
        <View style={[
          styles.explanationBox,
          { backgroundColor: answer.isCorrect ? colors.successSurface : colors.errorSurface },
        ]}>
          <Text style={[
            styles.explanationLabel,
            { color: answer.isCorrect ? GREEN : RED },
          ]}>
            {answer.isCorrect ? '✓ Correct!' : '✗ Not quite'}
          </Text>
          <Text style={styles.explanationText}>{question.explanation}</Text>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// SHORT ANSWER / WRITING QUESTION VIEW
// ============================================================================

interface ShortAnswerQuestionViewProps {
  question:      any;
  answer:        any;
  categoryColor: string;
  onChangeText:  (text: string) => void;
  onSubmit:      () => void;
}

const ShortAnswerQuestionView: React.FC<ShortAnswerQuestionViewProps> = ({
  question,
  answer,
  categoryColor,
  onChangeText,
  onSubmit,
}) => {
  return (
    <View style={styles.questionCard}>
      <Text style={styles.questionText}>{question.question}</Text>

      <TextInput
        style={[styles.answerInput, answer.isAnswered && styles.answerInputDisabled]}
        multiline
        placeholder="Write your answer here..."
        placeholderTextColor={TEXT_GRAY}
        value={answer.studentAnswer}
        onChangeText={onChangeText}
        editable={!answer.isAnswered && !answer.isEvaluating}
      />

      {!answer.isAnswered && (
        <TouchableOpacity
          style={[
            styles.submitAnswerBtn,
            { backgroundColor: categoryColor },
            (!answer.studentAnswer.trim() || answer.isEvaluating) && styles.navBtnDisabled,
          ]}
          onPress={onSubmit}
          disabled={!answer.studentAnswer.trim() || answer.isEvaluating}
          activeOpacity={0.85}
        >
          {answer.isEvaluating ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={styles.submitAnswerBtnText}>Submit Answer</Text>
          )}
        </TouchableOpacity>
      )}

      {answer.isAnswered && !answer.evaluationFailed && (
        <View style={styles.feedbackCard}>
          <View style={styles.feedbackScoreRow}>
            <Text style={styles.feedbackScoreLabel}>Score</Text>
            <Text style={[styles.feedbackScoreValue, { color: categoryColor }]}>
              {answer.score} / {answer.maxScore}
            </Text>
          </View>
          <Text style={styles.feedbackText}>{answer.feedback}</Text>
          <View style={styles.feedbackDivider} />
          <Text style={styles.feedbackSubLabel}>✓ What you did well</Text>
          <Text style={styles.feedbackSubText}>{answer.whatTheyDidWell}</Text>
          <Text style={[styles.feedbackSubLabel, styles.textMarginTop]}>→ How to improve</Text>
          <Text style={styles.feedbackSubText}>{answer.howToImprove}</Text>
          {answer.xpEarned ? (
            <View style={styles.xpEarnedPill}>
              <Text style={styles.xpEarnedText}>+{answer.xpEarned} XP earned</Text>
            </View>
          ) : null}
        </View>
      )}

      {answer.isAnswered && answer.evaluationFailed && (
        <View style={[styles.feedbackCard, { backgroundColor: colors.errorSurface }]}>
          <Text style={[styles.feedbackText, { color: RED }]}>
            We couldn't evaluate this answer right now, but it's been saved. Keep going!
          </Text>
        </View>
      )}
    </View>
  );
};

// ============================================================================
// RESULTS VIEW
// ============================================================================

interface ResultsViewProps {
  totalCorrectMcq:  number;
  totalMcq:         number;
  totalXpEarned:    number;
  overallScorePct:  number;
  onDone:           () => void;
  insetsBottom:     number;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  totalCorrectMcq,
  totalMcq,
  totalXpEarned,
  overallScorePct,
  onDone,
  insetsBottom,
}) => {
  const scoreColor = overallScorePct >= 80 ? GREEN : overallScorePct >= 60 ? '#F59E0B' : RED;

  return (
    <View style={styles.resultsWrapper}>
      <ScreenBackground />
      <ScrollView contentContainerStyle={styles.resultsScroll}>
        <Text style={styles.resultsEmoji}>🎉</Text>
        <Text style={styles.resultsTitle}>Practice Complete!</Text>
        <Text style={styles.resultsSub}>Here's how you did</Text>

        <View style={styles.resultsScoreCard}>
          <Text style={[styles.resultsScoreValue, { color: scoreColor }]}>
            {overallScorePct}%
          </Text>
          <Text style={styles.resultsScoreLabel}>MCQ Accuracy</Text>
        </View>

        <View style={styles.resultsStatsRow}>
          <View style={styles.resultsStatBox}>
            <Text style={styles.resultsStatValue}>{totalCorrectMcq}/{totalMcq}</Text>
            <Text style={styles.resultsStatLabel}>Correct MCQs</Text>
          </View>
          <View style={styles.resultsStatBox}>
            <Text style={[styles.resultsStatValue, { color: PRIMARY }]}>+{totalXpEarned}</Text>
            <Text style={styles.resultsStatLabel}>XP Earned</Text>
          </View>
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(insetsBottom, 16) }]}>
        <TouchableOpacity style={styles.doneBtn} onPress={onDone} activeOpacity={0.85}>
          <Text style={styles.doneBtnText}>Done</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PracticeSessionScreen;
