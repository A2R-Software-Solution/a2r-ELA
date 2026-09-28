import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  card: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardUnselected: {
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },

  // Checkmark
  checkmark: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmarkText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },

  // Radio
  radioCircle: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },

  // Content
  emoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.muted,
    marginBottom: 4,
  },
  labelSelected: {
    color: colors.text,
  },
  subtitle: {
    fontSize: 12,
    color: colors.subtle,
  },
});
