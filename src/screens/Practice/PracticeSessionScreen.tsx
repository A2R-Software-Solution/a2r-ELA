/**
 * PracticeSessionScreen
 * The actual exam-taking experience — MCQ, short answer, and writing questions
 * generated fresh per session via PSSA backend.
 */

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import usePracticeSession from './hooks/usePracticeSession';
import {
  PracticeSessionConfig,
  isMcqQuestion,
  isShortAnswerQuestion,
} from './types/PracticeSessionUiState';

// ============================================================================
// PROPS
// ============================================================================

interface PracticeSessionScreenProps {
  config:        PracticeSessionConfig;
  onBackClick:   () => void;
  onFinish:      () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY    = '#6C4DFF';
const WHITE      = '#FFFFFF';
const BG         = '#F8FAFC';
const TEXT_DARK  = '#0F172A';
const TEXT_MID   = '#475569';
const TEXT_GRAY  = '#94A3B8';
const BORDER     = '#E2E8F0';
const GREEN      = '#22C55E';
const RED        = '#EF4444';
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
  config,
  onBackClick,
  onFinish,
}) => {
  const insets = useSafeAreaInsets();
  const {
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
    retryFetch,
  } = usePracticeSession(config);

  // ── Loading ───────────────────────────────────────────────────────────────
  if (state.phase === 'loading') {
    return (
      <View style={styles.centered}>
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
        <Text style={styles.errorEmoji}>😕</Text>
        <Text style={styles.errorText}>{state.errorMessage}</Text>
        <TouchableOpacity style={styles.retryBtn} onPress={retryFetch} activeOpacity={0.85}>
          <Text style={styles.retryBtnText}>Try Again</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onBackClick} style={{ marginTop: 12 }}>
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

        <View style={{ height: 100 }} />
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
          style={[styles.navBtn, styles.navBtnPrimary]}
          onPress={handleNext}
          activeOpacity={0.85}
        >
          <Text style={styles.navBtnPrimaryText}>
            {isLastQuestion ? 'Finish Test 🏁' : 'Next →'}
          </Text>
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
          { backgroundColor: answer.isCorrect ? '#F0FDF4' : '#FEF2F2' },
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
          <Text style={[styles.feedbackSubLabel, { marginTop: 10 }]}>→ How to improve</Text>
          <Text style={styles.feedbackSubText}>{answer.howToImprove}</Text>
          {answer.xpEarned ? (
            <View style={styles.xpEarnedPill}>
              <Text style={styles.xpEarnedText}>+{answer.xpEarned} XP earned</Text>
            </View>
          ) : null}
        </View>
      )}

      {answer.isAnswered && answer.evaluationFailed && (
        <View style={[styles.feedbackCard, { backgroundColor: '#FEF2F2' }]}>
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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  wrapper: { flex: 1, backgroundColor: BG },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: BG,
  },
  loadingTitle: { marginTop: 16, fontSize: 16, fontWeight: '700', color: TEXT_DARK },
  loadingSub: { marginTop: 6, fontSize: 13, color: TEXT_GRAY },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: { fontSize: 14, color: TEXT_MID, textAlign: 'center', marginBottom: 20 },
  retryBtn: { backgroundColor: PRIMARY, paddingHorizontal: 32, paddingVertical: 12, borderRadius: 12 },
  retryBtnText: { color: WHITE, fontSize: 15, fontWeight: '700' },
  backLink: { color: TEXT_GRAY, fontSize: 14, fontWeight: '600' },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  backBtnText: { fontSize: 18, color: TEXT_DARK, fontWeight: '600' },
  headerCenter: { flex: 1 },
  headerTitle: { fontSize: 13, fontWeight: '700', color: TEXT_DARK, marginBottom: 6 },
  progressBarTrack: { height: 6, backgroundColor: '#F1F5F9', borderRadius: 3, overflow: 'hidden' },
  progressBarFill: { height: 6, backgroundColor: PRIMARY, borderRadius: 3 },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  categoryPillText: { fontSize: 11, fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 16 },

  // Passage card
  passageCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
  },
  passageType: { fontSize: 12, fontWeight: '700', color: TEXT_GRAY, marginBottom: 8, textTransform: 'uppercase' },
  passageText: { fontSize: 15, lineHeight: 23, color: TEXT_DARK, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },

  // Question card
  questionCard: {
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
  },
  questionText: { fontSize: 16, fontWeight: '700', color: TEXT_DARK, marginBottom: 16, lineHeight: 22 },

  // MCQ options
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    marginBottom: 10,
    gap: 12,
  },
  optionRowSelected: { borderColor: PRIMARY, backgroundColor: '#EDE9FF' },
  optionRowCorrect: { borderColor: GREEN, backgroundColor: '#F0FDF4' },
  optionRowWrong: { borderColor: RED, backgroundColor: '#FEF2F2' },
  optionBadge: {
    width: 28, height: 28, borderRadius: 8,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center', alignItems: 'center',
  },
  optionBadgeSelected: { backgroundColor: PRIMARY },
  optionBadgeCorrect: { backgroundColor: GREEN },
  optionBadgeWrong: { backgroundColor: RED },
  optionBadgeText: { fontSize: 13, fontWeight: '800', color: TEXT_MID },
  optionBadgeTextActive: { color: WHITE },
  optionText: { flex: 1, fontSize: 14, color: TEXT_DARK, lineHeight: 20 },

  explanationBox: { borderRadius: 12, padding: 12, marginTop: 6 },
  explanationLabel: { fontSize: 13, fontWeight: '800', marginBottom: 4 },
  explanationText: { fontSize: 13, color: TEXT_MID, lineHeight: 19 },

  // Short answer input
  answerInput: {
    borderWidth: 1.5,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  answerInputDisabled: { backgroundColor: '#F8FAFC', color: TEXT_MID },
  submitAnswerBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitAnswerBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  navBtnDisabled: { opacity: 0.4 },

  // Feedback card
  feedbackCard: { backgroundColor: '#F8FAFC', borderRadius: 12, padding: 14, marginTop: 4 },
  feedbackScoreRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  feedbackScoreLabel: { fontSize: 13, color: TEXT_MID, fontWeight: '600' },
  feedbackScoreValue: { fontSize: 16, fontWeight: '800' },
  feedbackText: { fontSize: 13, color: TEXT_DARK, lineHeight: 19, marginBottom: 8 },
  feedbackDivider: { height: 1, backgroundColor: BORDER, marginVertical: 8 },
  feedbackSubLabel: { fontSize: 12, fontWeight: '700', color: TEXT_DARK, marginBottom: 3 },
  feedbackSubText: { fontSize: 13, color: TEXT_MID, lineHeight: 18 },
  xpEarnedPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#EDE9FF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },
  xpEarnedText: { fontSize: 12, fontWeight: '700', color: PRIMARY },

  // Footer nav
  footer: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  navBtn: { flex: 1, borderRadius: 14, paddingVertical: 15, alignItems: 'center' },
  navBtnPrimary: { backgroundColor: PRIMARY },
  navBtnPrimaryText: { color: WHITE, fontSize: 15, fontWeight: '800' },
  navBtnSecondary: { backgroundColor: '#F1F5F9' },
  navBtnSecondaryText: { color: TEXT_DARK, fontSize: 15, fontWeight: '700' },

  // Results
  resultsWrapper: { flex: 1, backgroundColor: BG },
  resultsScroll: { padding: 24, alignItems: 'center', paddingTop: 60 },
  resultsEmoji: { fontSize: 56, marginBottom: 16 },
  resultsTitle: { fontSize: 22, fontWeight: '800', color: TEXT_DARK, marginBottom: 6 },
  resultsSub: { fontSize: 14, color: TEXT_GRAY, marginBottom: 28 },
  resultsScoreCard: {
    backgroundColor: WHITE,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 20,
  },
  resultsScoreValue: { fontSize: 40, fontWeight: '900' },
  resultsScoreLabel: { fontSize: 13, color: TEXT_GRAY, marginTop: 6, fontWeight: '600' },
  resultsStatsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultsStatBox: {
    flex: 1,
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
  },
  resultsStatValue: { fontSize: 20, fontWeight: '800', color: TEXT_DARK },
  resultsStatLabel: { fontSize: 12, color: TEXT_GRAY, marginTop: 4 },
  doneBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    width: '100%',
  },
  doneBtnText: { color: WHITE, fontSize: 17, fontWeight: '800' },
});

export default PracticeSessionScreen;