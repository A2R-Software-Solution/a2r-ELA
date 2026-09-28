import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  viewFlex: { flex: 1 },
  viewFlex2: { flex: 1 },
  viewHeight: { height: 40 },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    ...layout.content,
    paddingTop: 52,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: { fontSize: 16, color: '#0EA5E9' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  roundBadge: {
    backgroundColor: '#0EA5E9',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  roundText: { fontSize: 13, fontWeight: '700', color: '#FFF' },

  // Topic
  topicRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  topicChip: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  topicText: { fontSize: 14, fontWeight: '600', color: '#93C5FD' },
  domainLabel: { fontSize: 12, color: '#0EA5E9', fontWeight: '600' },

  // Instruction card
  instructionCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  instructionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0EA5E9',
    marginBottom: 6,
    letterSpacing: 1,
  },
  instructionText: { fontSize: 14, color: colors.text, lineHeight: 20 },
  instructionBold: { fontWeight: '700' },

  // Weak sentence
  weakSentenceCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    borderStyle: 'dashed',
  },
  weakSentenceLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FCA5A5',
    marginBottom: 8,
    letterSpacing: 1,
  },
  weakSentenceText: {
    fontSize: 18,
    color: colors.muted,
    fontStyle: 'italic',
    lineHeight: 26,
  },

  // Hint
  hintToggle: {
    alignSelf: 'flex-start',
    marginBottom: 8,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 20,
  },
  hintToggleText: { fontSize: 13, fontWeight: '600', color: '#FDE68A' },
  hintCard: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#EAB308',
  },
  hintText: { fontSize: 13, color: '#FDE68A', lineHeight: 19 },

  // Input
  inputCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0EA5E9',
    marginBottom: 10,
    letterSpacing: 1,
  },
  textInput: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 22,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  wordCountRow: { marginTop: 8, alignItems: 'flex-end' },
  wordCount: { fontSize: 12, fontWeight: '600' },
  wordCountGood: { color: '#86EFAC' },
  wordCountLow: { color: colors.muted },

  // Submit
  submitButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: colors.surfaceRaised },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  submittingRow: { flexDirection: 'row', alignItems: 'center' },

  // Feedback modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  feedbackCard: {
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 28,
    gap: 12,
    maxHeight: '90%',
  },
  scoreBadge: {
    alignSelf: 'center',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 30,
  },
  scoreBadgeText: { fontSize: 24, fontWeight: '800', color: '#FFF' },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 4,
  },
  star: { fontSize: 24 },
  feedbackMain: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    lineHeight: 22,
  },
  feedbackSection: {
    flexDirection: 'row',
    gap: 10,
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
  },
  feedbackSectionIcon: { fontSize: 18 },
  feedbackSectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 2,
  },
  feedbackSectionText: { fontSize: 13, color: colors.muted, lineHeight: 18 },
  xpEarnedRow: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  xpEarnedText: { fontSize: 18, fontWeight: '800', color: '#0EA5E9' },
  levelUpBanner: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  levelUpText: { fontSize: 14, fontWeight: '700', color: '#FDE68A' },
  badgeBanner: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    gap: 4,
  },
  badgeBannerText: { fontSize: 14, fontWeight: '700', color: '#86EFAC' },
  feedbackActions: { gap: 10, marginTop: 4 },
  nextButton: {
    backgroundColor: '#0EA5E9',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  exitFeedbackButton: {
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  exitFeedbackText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
});
