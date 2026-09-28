import { colors } from '../../../theme/colors';
import { layout } from '../../../theme/layout';
import { StyleSheet } from 'react-native';

export const PRIMARY = colors.primary;
export const PRIMARY_LIGHT = colors.surfaceRaised;
export const GREEN = '#22C55E';
export const ORANGE = '#F97316';
export const GOLD = '#F59E0B';
export const GOLD_LIGHT = colors.warningSurface;
export const WHITE = '#FFFFFF';
export const TEXT_DARK = colors.text;
export const TEXT_MID = colors.muted;
export const TEXT_GRAY = colors.subtle;
export const BG = colors.background;
export const BORDER = colors.border;

export const styles = StyleSheet.create({
  viewHeight: { height: 16 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  dialog: {
    ...layout.dialog,
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '92%',
    overflow: 'hidden',
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  headerSub: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: BG,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeBtnText: {
    fontSize: 16,
    color: TEXT_MID,
    fontWeight: '600',
  },

  // Score hero
  scoreHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 12,
    backgroundColor: BG,
    marginHorizontal: 20,
    borderRadius: 16,
    marginBottom: 8,
  },
  gradeBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 3,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  gradeLetter: {
    fontSize: 24,
    fontWeight: '800',
  },
  scoreNumber: {
    fontSize: 48,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  scoreOutOf: {
    fontSize: 20,
    fontWeight: '600',
    color: TEXT_GRAY,
    alignSelf: 'flex-end',
    marginBottom: 8,
  },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { paddingHorizontal: 20 },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  sectionBadge: {
    fontSize: 12,
    color: TEXT_GRAY,
    fontWeight: '500',
  },

  // Domain row
  domainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  domainLabel: {
    fontSize: 14,
    color: TEXT_MID,
    fontWeight: '500',
    width: 90,
  },
  domainRight: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  domainBarBg: {
    flex: 1,
    height: 8,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 4,
    overflow: 'hidden',
  },
  domainBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  domainScore: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_DARK,
    width: 28,
    textAlign: 'right',
  },

  // Feedback card
  feedbackCard: {
    backgroundColor: colors.overlay,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  feedbackText: {
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 22,
  },

  // Strengths
  strengthRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  strengthDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: GREEN,
    marginTop: 6,
  },

  // Improve
  improveSub: {
    fontSize: 13,
    color: TEXT_GRAY,
    marginBottom: 10,
    marginTop: -6,
  },
  improveRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  improveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: ORANGE,
    marginTop: 6,
  },
  bulletText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 21,
  },

  // Suggestion card
  suggestionCard: {
    backgroundColor: PRIMARY_LIGHT,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  suggestionTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  domainPill: {
    backgroundColor: PRIMARY,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  domainPillText: {
    color: WHITE,
    fontSize: 12,
    fontWeight: '700',
  },
  suggestionXp: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  suggestionGame: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 6,
  },
  suggestionReason: {
    fontSize: 13,
    color: TEXT_MID,
    lineHeight: 19,
    marginBottom: 14,
  },
  playBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  playBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  // Footer
  footer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: BORDER,
  },
  footerSecondaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: PRIMARY,
  },
  footerSecondaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.accent,
  },
  footerPrimaryBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: PRIMARY,
  },
  footerPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: WHITE,
  },

  // Badge popup
  popupContainer: {
    position: 'absolute',
    alignSelf: 'center',
    top: '15%',
    zIndex: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 12,
  },
  popupCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    paddingVertical: 28,
    paddingHorizontal: 32,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: GOLD,
    minWidth: 240,
    maxWidth: 280,
  },
  popupIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: GOLD_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: GOLD,
  },
  popupIcon: { fontSize: 40 },
  popupEyebrow: {
    fontSize: 12,
    fontWeight: '700',
    color: GOLD,
    letterSpacing: 0.5,
    marginBottom: 6,
    textTransform: 'uppercase',
  },
  popupName: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    textAlign: 'center',
    marginBottom: 6,
  },
  popupDesc: {
    fontSize: 13,
    color: TEXT_GRAY,
    textAlign: 'center',
    lineHeight: 18,
  },
  dotRow: { flexDirection: 'row', gap: 6, marginTop: 14 },
  dot: { width: 7, height: 7, borderRadius: 4 },
  dotActive: { backgroundColor: GOLD },
  dotInactive: { backgroundColor: colors.surfaceRaised },
});
