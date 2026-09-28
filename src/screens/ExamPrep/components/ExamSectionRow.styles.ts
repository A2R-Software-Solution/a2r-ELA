import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const ROW_BG = colors.surface;
export const ROW_BORDER = 'rgba(108, 77, 255, 0.18)';
export const PROGRESS_TRACK = 'rgba(255,255,255,0.08)';
export const TEXT_PRIMARY = '#F1F5F9';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: ROW_BG,
    marginHorizontal: 16,
    marginVertical: 5,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: ROW_BORDER,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },

  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  icon: {
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 22,
  },

  middleContent: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    marginRight: 8,
  },
  count: {
    fontSize: 13,
    fontWeight: '600',
    color: TEXT_MUTED,
  },

  progressTrack: {
    height: 6,
    backgroundColor: PROGRESS_TRACK,
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 6,
    borderRadius: 999,
  },
});
