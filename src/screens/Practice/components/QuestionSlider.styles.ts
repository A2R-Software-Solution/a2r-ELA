import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  stepBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepBtnDisabled: {
    backgroundColor: colors.surface,
  },
  stepBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.muted,
    lineHeight: 22,
  },
  stepBtnTextDisabled: {
    color: colors.border,
  },
  countBox: {
    width: 44,
    height: 32,
    borderRadius: 8,
    borderWidth: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.surface,
  },
  countText: {
    fontSize: 15,
    fontWeight: '800',
  },

  // Slider
  slider: {
    width: '100%',
    height: 36,
  },

  // Range row
  rangeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -4,
  },
  rangeText: {
    fontSize: 11,
    color: colors.subtle,
  },
  rangeTextMid: {
    fontSize: 11,
    color: colors.subtle,
    fontWeight: '500',
  },
});
