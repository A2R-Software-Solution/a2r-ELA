import { StyleSheet } from 'react-native';
import { colors } from './colors';

export const glass = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.30)',
    borderRadius: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
  },
});
