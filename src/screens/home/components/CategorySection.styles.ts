import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  seeAllText: {
    fontSize: 14,
    color: colors.accent,
    fontWeight: '500',
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  chipSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  chipText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  chipTextSelected: {
    color: '#FFFFFF',
  },
});
