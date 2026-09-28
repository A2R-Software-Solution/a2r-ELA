import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const PILL_SURFACE = colors.surfaceRaised;
export const ROW_BORDER = 'rgba(255, 255, 255, 0.06)';
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_MUTED = colors.muted;
export const RED = '#F87171';
export const RED_SURFACE = 'rgba(248, 113, 113, 0.12)';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 32,
  },

  // ---------- Section title ----------
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
    marginBottom: 12,
  },

  // ---------- Settings card ----------
  card: {
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
    overflow: 'hidden',
    marginBottom: 20,
  },

  // ---------- Settings row ----------
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  rowLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
  },
  rowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  valuePill: {
    backgroundColor: PILL_SURFACE, // ← was PURPLE_LIGHT
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
  },
  valuePillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
  chevron: {
    fontSize: 20,
    color: TEXT_MUTED, // ← was '#9CA3AF'
    lineHeight: 22,
  },

  // ---------- Row divider ----------
  rowDivider: {
    height: 1,
    backgroundColor: ROW_BORDER, // ← was '#F9F7FF'
    marginHorizontal: 16,
  },

  // ---------- Logout button ----------
  logoutButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12, // ← spacing between logout and delete
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // ---------- Delete Account button ----------              ← NEW
  deleteButton: {
    backgroundColor: RED_SURFACE, // ← was RED_LIGHT (solid)
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: RED,
  },
  deleteText: {
    fontSize: 16,
    fontWeight: '600',
    color: RED,
  },
});
