import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const BASE_BG = colors.background;
export const PRIMARY = colors.primary;
export const WHITE = '#FFFFFF';
export const TEXT_LIGHT = '#FFFFFF';
export const TEXT_MUTED = colors.muted;
export const CARD_BG = colors.surface;
export const CARD_BORDER = colors.border;

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: BASE_BG,
  },

  header: {
    ...layout.content,
    backgroundColor: 'rgba(7, 5, 14, 0.75)', // dark tinted, lets bg show slightly
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 8,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 16,
    color: WHITE,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: WHITE,
  },
  headerSpacer: {
    width: 32,
  },

  tabRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 16,
    gap: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    maxWidth: 200,
  },
  tabActive: {
    borderBottomColor: PRIMARY,
  },
  tabText: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  tabTextActive: {
    color: WHITE,
    fontWeight: '800',
    fontSize: 16,
  },

  scroll: {
    flex: 1,
  },
  scrollContent: {
    ...layout.content,
    paddingTop: 8,
    paddingBottom: 20,
  },

  screenIntro: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_LIGHT,
    marginHorizontal: 16,
    marginTop: 20,
    marginBottom: 16,
  },

  selectorCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 16,
    backgroundColor: CARD_BG,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  selectorLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: TEXT_MUTED,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  gradeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: PRIMARY,
  },
  gradeButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: WHITE,
  },
  gradeButtonChevron: {
    fontSize: 14,
    color: TEXT_MUTED,
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  chipActive: {
    backgroundColor: PRIMARY,
    borderColor: PRIMARY,
  },
  chipText: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },
  chipTextActive: {
    color: WHITE,
    fontWeight: '700',
  },

  errorInline: {
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 13,
    color: '#FF6B6B',
  },

  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 8,
  },

  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: TEXT_MUTED,
  },
});
