import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: PURPLE_SURFACE, // ← was '#FFFFFF'
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)', // ← was '#F0EBFF'
    // Shadow — iOS
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 0,
  },

  // ---------- Card ----------
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_MUTED, // ← was '#9CA3AF'
    textAlign: 'center',
  },

  // ---------- Divider ----------
  divider: {
    width: 1,
    backgroundColor: PURPLE_BORDER, // ← was '#F0EBFF'
    marginVertical: 16,
  },
});
