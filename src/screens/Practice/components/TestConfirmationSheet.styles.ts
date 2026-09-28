import { layout } from '../../../theme/layout';
import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  sheetViewport: {
    ...layout.dialog,
    flexGrow: 0,
    maxHeight: '90%',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  textColor: { color: '#3B82F6' },
  textColor2: { color: '#22C55E' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    ...layout.dialog,
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 12,
  },

  // Handle
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },

  // Title
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: colors.subtle,
    textAlign: 'center',
    marginBottom: 20,
  },

  // Summary card
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: colors.muted,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },
  totalValue: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.text,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },

  // Difficulty pill
  difficultyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  difficultyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 13,
    fontWeight: '700',
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaIcon: {
    fontSize: 24,
  },
  metaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: colors.text,
  },
  metaLabel: {
    fontSize: 11,
    color: colors.subtle,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  editBtnText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.accent,
  },
  startBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    backgroundColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: '800',
    color: '#FFFFFF',
  },
});
