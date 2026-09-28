import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE_BORDER = colors.border;
export const PURPLE_BRIGHT = colors.accent;
export const PURPLE_BADGE_BG = colors.surfaceRaised;
export const TEXT_PRIMARY = '#FFFFFF';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1.5,
    overflow: 'hidden',
    shadowColor: PURPLE_BORDER,
    shadowOffset: { width: 0, height: 0 },
  },
  topHighlight: {
    position: 'absolute',
    top: 0,
    left: 24,
    right: 24,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 999,
  },
  leftContent: {
    flex: 1,
    paddingRight: 16,
  },
  badge: {
    alignSelf: 'flex-start',
    backgroundColor: PURPLE_BADGE_BG,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.30)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: PURPLE_BRIGHT,
    letterSpacing: 0.4,
  },
  examTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY,
    lineHeight: 22,
    marginBottom: 8,
  },
  percentLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
    letterSpacing: 0.2,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
