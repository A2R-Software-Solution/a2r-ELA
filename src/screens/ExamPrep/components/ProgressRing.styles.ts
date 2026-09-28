import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const TEXT_PRIMARY = '#c8f610';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Absolutely centered label on top of SVG
  labelContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentText: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_PRIMARY,
    lineHeight: 28,
  },
  completeText: {
    fontSize: 11,
    fontWeight: '500',
    color: TEXT_MUTED,
    marginTop: 2,
  },
});
