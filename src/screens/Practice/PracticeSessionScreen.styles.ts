import { layout } from '../../theme/layout';
import { colors } from '../../theme/colors';
import { StyleSheet, Platform } from 'react-native';

export const PRIMARY = colors.primary;
export const WHITE = '#FFFFFF';
export const BG = colors.background;
export const TEXT_DARK = colors.text;
export const TEXT_MID = colors.muted;
export const TEXT_GRAY = colors.subtle;
export const BORDER = colors.border;
export const GREEN = '#22C55E';
export const RED = '#EF4444';

export const styles = StyleSheet.create({
  touchableOpacityMarginTop: { marginTop: 12 },
  viewHeight: { height: 100 },
  textMarginTop: { marginTop: 10 },
  wrapper: { flex: 1, backgroundColor: BG },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
    backgroundColor: BG,
  },
  loadingTitle: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  loadingSub: { marginTop: 6, fontSize: 13, color: TEXT_GRAY },
  errorEmoji: { fontSize: 48, marginBottom: 12 },
  errorText: {
    fontSize: 14,
    color: TEXT_MID,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryBtn: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryBtnText: { color: WHITE, fontSize: 15, fontWeight: '700' },
  backLink: { color: TEXT_GRAY, fontSize: 14, fontWeight: '600' },

  // Header
  header: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    gap: 10,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: { fontSize: 18, color: TEXT_DARK, fontWeight: '600' },
  headerCenter: { flex: 1 },
  headerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: { height: 6, backgroundColor: PRIMARY, borderRadius: 3 },
  categoryPill: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 10 },
  categoryPillText: { fontSize: 11, fontWeight: '700' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    ...layout.content,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Passage card
  passageCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  passageType: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_GRAY,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  passageText: {
    fontSize: 15,
    lineHeight: 23,
    color: TEXT_DARK,
    fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
  },

  // Question card
  questionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  questionText: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 16,
    lineHeight: 22,
  },

  // MCQ options
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    marginBottom: 10,
    gap: 12,
  },
  optionRowSelected: {
    borderColor: PRIMARY,
    backgroundColor: colors.surfaceRaised,
  },
  optionRowCorrect: {
    borderColor: GREEN,
    backgroundColor: colors.successSurface,
  },
  optionRowWrong: { borderColor: RED, backgroundColor: colors.errorSurface },
  optionBadge: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
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
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: TEXT_DARK,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 12,
  },
  answerInputDisabled: { backgroundColor: colors.surface, color: TEXT_MID },
  submitAnswerBtn: {
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  submitAnswerBtnText: { color: WHITE, fontSize: 14, fontWeight: '700' },
  navBtnDisabled: { opacity: 0.4 },

  // Feedback card
  feedbackCard: {
    backgroundColor: colors.overlay,
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
  },
  feedbackScoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  feedbackScoreLabel: { fontSize: 13, color: TEXT_MID, fontWeight: '600' },
  feedbackScoreValue: { fontSize: 16, fontWeight: '800' },
  feedbackText: {
    fontSize: 13,
    color: TEXT_DARK,
    lineHeight: 19,
    marginBottom: 8,
  },
  feedbackDivider: { height: 1, backgroundColor: BORDER, marginVertical: 8 },
  feedbackSubLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 3,
  },
  feedbackSubText: { fontSize: 13, color: TEXT_MID, lineHeight: 18 },
  xpEarnedPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    marginTop: 12,
  },
  xpEarnedText: { fontSize: 12, fontWeight: '700', color: colors.accent },

  // Footer nav
  footer: {
    ...layout.content,
    flexDirection: 'row',
    gap: 12,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  navBtn: {
    flex: 1,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
  },
  navBtnPrimary: { backgroundColor: PRIMARY },
  navBtnPrimaryText: { color: WHITE, fontSize: 15, fontWeight: '800' },
  navBtnSecondary: { backgroundColor: colors.surfaceRaised },
  navBtnSecondaryText: { color: TEXT_DARK, fontSize: 15, fontWeight: '700' },

  // Results
  resultsWrapper: { flex: 1, backgroundColor: BG },
  resultsScroll: { padding: 24, alignItems: 'center', paddingTop: 60 },
  resultsEmoji: { fontSize: 56, marginBottom: 16 },
  resultsTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  resultsSub: { fontSize: 14, color: TEXT_GRAY, marginBottom: 28 },
  resultsScoreCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    paddingVertical: 28,
    paddingHorizontal: 40,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    marginBottom: 20,
  },
  resultsScoreValue: { fontSize: 40, fontWeight: '900' },
  resultsScoreLabel: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 6,
    fontWeight: '600',
  },
  resultsStatsRow: { flexDirection: 'row', gap: 12, width: '100%' },
  resultsStatBox: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
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
