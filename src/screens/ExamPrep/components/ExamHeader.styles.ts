import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_LIGHT = '#EDE9FF';
export const TEXT_PRIMARY = '#0F172A';
export const TEXT_MUTED = colors.muted;
export const BG_WHITE = '#FFFFFF';
export const BORDER = colors.border;

export const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: BG_WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
    paddingBottom: 0,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: PURPLE_LIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: PURPLE,
    fontWeight: '700',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  spacer: {
    width: 36, // mirrors back button width to keep title centered
  },

  // Tab row
  tabRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 0,
    gap: 8,
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 0,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
    marginBottom: 0,
  },
  tabActive: {
    borderBottomColor: PURPLE,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_MUTED,
  },
  tabTextActive: {
    color: PURPLE,
    fontWeight: '700',
  },
});
