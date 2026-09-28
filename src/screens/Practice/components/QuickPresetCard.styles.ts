import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    padding: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 12,
  },
  emoji: {
    fontSize: 24,
    marginTop: 2,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  description: {
    fontSize: 12,
    color: colors.subtle,
  },

  // Recommended badge
  recommendedBadge: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  recommendedText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.accent,
  },

  // Counts row
  countsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  plus: {
    fontSize: 13,
    color: colors.border,
    fontWeight: '600',
  },

  // Count chip
  chip: {
    alignItems: 'center',
    flex: 1,
  },
  chipValue: {
    fontSize: 16,
    fontWeight: '800',
  },
  chipLabel: {
    fontSize: 10,
    color: colors.subtle,
    marginTop: 2,
  },
});
