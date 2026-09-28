import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  textColor: { color: colors.accent },
  viewHeight: { height: 20 },
  viewHeight2: { height: 60 },
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
    marginBottom: 20,
  },
  exitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surfaceRaised,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exitText: { fontSize: 16, color: '#FCA5A5' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  weeklyChip: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  weeklyText: { fontSize: 12, fontWeight: '700', color: '#FDE68A' },

  // Challenge card
  challengeCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  challengeTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 8,
  },
  challengeDesc: {
    fontSize: 13,
    color: '#CBD5E1',
    lineHeight: 19,
    marginBottom: 16,
  },
  challengeStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  challengeStat: { alignItems: 'center' },
  challengeStatValue: { fontSize: 22, fontWeight: '800', color: '#FCA5A5' },
  challengeStatLabel: { fontSize: 11, color: colors.muted, marginTop: 2 },
  challengeStatDivider: { width: 1, height: 36, backgroundColor: '#334155' },

  // Domain chips
  domainChipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  domainChip: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  domainChipText: { fontSize: 12, fontWeight: '600', color: '#FCA5A5' },

  // Essay input
  essayCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  essayLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#FCA5A5',
    marginBottom: 10,
    letterSpacing: 1,
  },
  essayInput: {
    fontSize: 15,
    color: colors.text,
    lineHeight: 24,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  wordCountSection: { marginTop: 12, gap: 6 },
  wordCountBar: {
    height: 6,
    backgroundColor: colors.surface,
    borderRadius: 3,
    overflow: 'hidden',
  },
  wordCountFill: { height: 6, borderRadius: 3 },
  wordCountText: { fontSize: 12, fontWeight: '600' },
  wordCountGood: { color: '#86EFAC' },
  wordCountLow: { color: colors.muted },
  underMinWarning: {
    fontSize: 12,
    color: '#FCA5A5',
    marginTop: 6,
    fontStyle: 'italic',
  },

  // Tips
  tipsCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F97316',
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FDBA74',
    marginBottom: 10,
  },
  tipItem: { fontSize: 13, color: '#FDBA74', lineHeight: 22 },

  // Submit
  submitButton: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
  },
  submitButtonDisabled: { backgroundColor: '#FCA5A5' },
  submitButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  submittingRow: { flexDirection: 'row', alignItems: 'center' },
  submittingNote: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.muted,
    marginTop: 10,
    fontStyle: 'italic',
  },

  // Result modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  resultScrollView: {
    ...layout.dialog,
    maxHeight: '95%',
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  resultCard: {
    padding: 24,
    gap: 16,
  },

  // Hero
  resultHero: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  resultHeroEmoji: { fontSize: 48 },
  resultHeroTitle: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  resultHeroScore: { fontSize: 48, fontWeight: '900', color: '#FFF' },
  improvementChip: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  improvementText: { fontSize: 14, fontWeight: '700', color: '#FFF' },

  // Comparison
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
  },
  comparisonBox: { alignItems: 'center' },
  comparisonLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.muted,
    letterSpacing: 1,
  },
  comparisonScore: { fontSize: 36, fontWeight: '900' },
  comparisonVs: { fontSize: 16, fontWeight: '800', color: '#CBD5E1' },

  // Domain breakdown
  domainsSection: { gap: 10 },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainEmoji: { fontSize: 16, width: 24 },
  domainLabel: { fontSize: 13, fontWeight: '600', color: colors.muted, width: 90 },
  domainBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  domainBarFill: { height: 8, borderRadius: 4 },
  domainScore: {
    fontSize: 13,
    fontWeight: '700',
    width: 28,
    textAlign: 'right',
  },

  // Feedback sections
  feedbackSection: { gap: 6 },
  feedbackBullet: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
    paddingLeft: 4,
  },

  // Personal feedback quote
  personalFeedbackCard: {
    backgroundColor: colors.overlay,
    borderRadius: 14,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#0EA5E9',
  },
  personalFeedbackText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 21,
    fontStyle: 'italic',
  },

  // XP
  xpSection: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    gap: 4,
  },
  xpEarnedLabel: { fontSize: 13, fontWeight: '600', color: '#FDE68A' },
  xpEarnedAmount: { fontSize: 36, fontWeight: '900', color: '#FCA5A5' },
  xpBonusNote: { fontSize: 12, color: '#FDE68A', fontStyle: 'italic' },

  // Level up / badge
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

  // Actions
  tryAgainButton: {
    backgroundColor: '#DC2626',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
  },
  tryAgainText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  exitResultButton: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingVertical: 12,
    alignItems: 'center',
  },
  exitResultText: { color: colors.muted, fontSize: 14, fontWeight: '600' },
});
