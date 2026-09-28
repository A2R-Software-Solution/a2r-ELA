import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const LOCKED_SURFACE = 'rgba(255, 255, 255, 0.04)';
export const LOCKED_BORDER = 'rgba(255, 255, 255, 0.08)';
export const CONTAINER_BORDER = 'rgba(255, 255, 255, 0.08)';
export const ICON_WRAPPER_BG = colors.surfaceRaised;
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: PURPLE_SURFACE, // ← was WHITE
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CONTAINER_BORDER, // ← was BORDER_COLOR
    overflow: 'hidden',
  },

  // ---------- Section header ----------
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: CONTAINER_BORDER, // ← was BORDER_COLOR
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was DARK_TEXT
  },
  badgeCount: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },

  // ---------- Grid ----------
  grid: {
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyCell: {
    flex: 1,
  },

  // ---------- Card ----------
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minHeight: 120,
  },
  cardUnlocked: {
    backgroundColor: PURPLE_SURFACE, // ← was LIGHT_PURPLE
    borderWidth: 1.5,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)', // ← was PURPLE (solid)
  },
  cardLocked: {
    backgroundColor: LOCKED_SURFACE, // ← was LIGHT_GRAY
    borderWidth: 1,
    borderColor: LOCKED_BORDER, // ← was BORDER_COLOR
  },

  // ---------- Icon ----------
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  iconWrapperUnlocked: {
    backgroundColor: ICON_WRAPPER_BG, // ← was WHITE
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 0,
  },
  iconWrapperLocked: {
    backgroundColor: LOCKED_BORDER, // ← was BORDER_COLOR
  },
  icon: {
    fontSize: 24,
  },
  iconDimmed: {
    opacity: 0.4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },

  // ---------- Text ----------
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  badgeNameUnlocked: {
    color: PURPLE,
  },
  badgeNameLocked: {
    color: TEXT_MUTED, // ← was GRAY_TEXT
  },
  badgeDescription: {
    fontSize: 10,
    color: TEXT_MUTED, // ← was GRAY_TEXT
    textAlign: 'center',
    lineHeight: 14,
  },
  lockedHint: {
    fontSize: 10,
    color: TEXT_MUTED, // ← was GRAY_TEXT
    textAlign: 'center',
    lineHeight: 14,
    opacity: 0.8,
  },

  // ---------- Progress ----------
  progressWrapper: {
    width: '100%',
    marginTop: 6,
    alignItems: 'center',
    gap: 3,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: LOCKED_BORDER, // ← was BORDER_COLOR
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: TEXT_MUTED, // ← was GRAY_TEXT
    fontWeight: '600',
  },
});
