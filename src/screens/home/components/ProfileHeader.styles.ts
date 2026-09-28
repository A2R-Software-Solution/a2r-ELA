import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_SECONDARY = 'rgba(245, 243, 255, 0.6)';
export const TEXT_MUTED = colors.muted;
export const GREEN = '#22C55E';
export const RED = '#EF4444';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    // ✅ paddingTop is now set dynamically via insets in JSX above
    paddingBottom: 24,
    paddingHorizontal: 20,
    backgroundColor: 'transparent', // ← was '#FFFFFF', now transparent so bg bloom layers show through
  },

  // Avatar
  avatarWrapper: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 16,
  },
  avatarImage: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 2,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  avatarInitials: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  initialsText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatarOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 48,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 0,
  },
  cameraBadgeIcon: { fontSize: 14 },

  // Name
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  displayName: {
    fontSize: 22,
    fontWeight: '700',
    color: TEXT_PRIMARY,
  },
  editIcon: { fontSize: 14 },

  // Inline editor
  inlineEditRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 8,
  },
  inlineInput: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: TEXT_PRIMARY,
    borderBottomWidth: 2,
    borderBottomColor: PURPLE,
    paddingVertical: 4,
    paddingHorizontal: 2,
    minWidth: 160,
  },
  inlineActions: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  inlineActionBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmBtn: { backgroundColor: GREEN },
  confirmBtnText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  cancelBtn: { backgroundColor: RED },
  cancelBtnText: { color: '#FFFFFF', fontSize: 12, fontWeight: '700' },

  // Email
  email: {
    fontSize: 14,
    color: TEXT_SECONDARY,
    marginBottom: 8,
  },

  // Birthdate
  birthdateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  birthdateIcon: { fontSize: 14 },
  birthdateText: { fontSize: 14, color: TEXT_SECONDARY },
  editIconSmall: { fontSize: 11 },
  addBirthdateRow: { marginBottom: 8 },
  addBirthdateText: { fontSize: 14, color: PURPLE, fontWeight: '500' },

  // Joined
  joinedDate: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 12,
  },

  // Pills
  pillRow: {
    flexDirection: 'row',
    gap: 8,
  },
  pill: {
    backgroundColor: PURPLE_SURFACE,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },
});
