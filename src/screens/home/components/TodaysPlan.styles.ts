import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 20,
    marginBottom: 4,
  },

  // Section header
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 8,
  },
  sectionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F5F0FF',
    letterSpacing: 0.2,
  },

  // ── Vocab Card ──────────────────────────────────────────────────
  vocabCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)', // ← purple border matching top bg
    padding: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 0,
  },
  cardAccentBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: colors.primary,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  vocabLabelRow: {
    marginBottom: 12,
    marginTop: 6,
  },
  vocabPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  vocabPillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  loadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 6,
  },
  loadingText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.45)',
  },
  errorText: {
    fontSize: 13,
    color: '#F87171',
    paddingVertical: 6,
  },
  vocabContent: {
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  wordText: {
    fontSize: 24,
    fontWeight: '800',
    color: '#F5F0FF',
    letterSpacing: -0.3,
  },
  posPill: {
    backgroundColor: 'rgba(217,58,0,0.18)', // ← orange tint pill, ties to bottom-left bg
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(217,58,0,0.35)',
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FCA97A', // ← warm orange text on pill
  },
  meaningText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.72)',
    lineHeight: 21,
  },
  exampleBox: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 12,
    marginTop: 4,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  exampleText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.65)',
    fontStyle: 'italic',
    flex: 1,
  },

  // ── Game Card ───────────────────────────────────────────────────
  gameCard: {
    backgroundColor: colors.surface, // ← tinted with bg emerald, not plain white
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border, // ← emerald border matching bottom-right bg
    padding: 16,
    marginBottom: 10,
    shadowColor: '#005C25',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 0,
  },
  gameCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  gameIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    shadowColor: '#00A845',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 0,
  },
  gameIcon: {
    fontSize: 22,
  },
  gameCardText: {
    flex: 1,
  },
  gameCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#F0FFF4', // ← very light green-white title
    marginBottom: 3,
  },
  gameCardSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.50)',
    lineHeight: 17,
  },
  playBtnWrap: {
    borderRadius: 13,
    overflow: 'hidden',
    shadowColor: '#00A845',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 0,
  },
  playBtn: {
    paddingVertical: 12,
    borderRadius: 13,
    alignItems: 'center',
  },
  playBtnText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
});
