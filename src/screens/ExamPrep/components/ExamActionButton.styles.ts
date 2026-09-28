import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_LIGHT = '#EDE9FF';
export const TEXT_WHITE = '#FFFFFF';
export const TEXT_PURPLE = '#6C4DFF';
export const DISABLED_BG = '#E2E8F0';
export const DISABLED_TEXT = '#94A3B8';

export const styles = StyleSheet.create({
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  // Variants
  primaryButton: {
    backgroundColor: colors.primary,
  },
  secondaryButton: {
    backgroundColor: PURPLE_LIGHT,
    borderWidth: 1.5,
    borderColor: PURPLE,
  },
  disabledButton: {
    backgroundColor: DISABLED_BG,
    borderColor: DISABLED_BG,
  },

  // Content row
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 16,
  },

  // Labels
  label: {
    fontSize: 15,
    fontWeight: '700',
  },
  primaryLabel: {
    color: TEXT_WHITE,
  },
  secondaryLabel: {
    color: TEXT_PURPLE,
  },
  disabledLabel: {
    color: DISABLED_TEXT,
  },
});
