import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.surface,
    borderRadius: 10,
    padding: 10,
    marginTop: 8,
    marginHorizontal: 16,
    gap: 8,
  },
  tipIcon: {
    fontSize: 14,
  },
  tipText: {
    flex: 1,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
});
