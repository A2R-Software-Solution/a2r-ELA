import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  outerGlow: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 22,
    // Glow shadow
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 18,
    elevation: 0,
  },
  card: {
    borderRadius: 22,
    padding: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },

  // Decorative glow
  glowBlob: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Skeleton
  skeleton: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 22,
    height: 110,
    backgroundColor: colors.surface,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crown: {
    fontSize: 20,
    marginRight: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dot: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.35)',
  },
  levelName: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.85)',
  },

  // XP Pill
  xpPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.20)',
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Progress bar
  progressBg: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 6,
    overflow: 'visible',
    position: 'relative',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius: 6,
  },
  progressTip: {
    position: 'absolute',
    right: -2,
    top: -2,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#FBBF24',
    shadowColor: '#FBBF24',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 0,
  },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.70)',
    flex: 1,
    marginRight: 8,
    lineHeight: 17,
  },
  percentPill: {
    backgroundColor: 'rgba(251,191,36,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(251,191,36,0.35)',
  },
  percent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FBBF24',
  },
});
