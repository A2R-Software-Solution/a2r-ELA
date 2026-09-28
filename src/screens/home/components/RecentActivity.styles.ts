import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const ICON_BUBBLE_BG = colors.surfaceRaised;
export const ROW_BORDER = 'rgba(255, 255, 255, 0.06)';
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_MUTED = colors.muted;
export const GREEN = '#4ADE80';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: PURPLE_SURFACE, // ← was '#FFFFFF'
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PURPLE_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)', // ← was '#E2E8F0'
    overflow: 'hidden',
    // Shadow
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 0,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#0F172A'
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE, // ← was '#6C4DFF'
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ROW_BORDER, // ← was '#F1F5F9'
  },

  // Icon bubble
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ICON_BUBBLE_BG, // ← was '#EDE9FF'
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowIcon: {
    fontSize: 18,
  },

  // Mid text
  rowMid: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#0F172A'
    marginBottom: 3,
  },
  rowTime: {
    fontSize: 12,
    color: TEXT_MUTED, // ← was '#94A3B8'
  },

  // Score chip
  chipWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  chipScore: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: GREEN, // ← was '#22C55E'
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#0F172A'
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: TEXT_MUTED, // ← was '#94A3B8'
    textAlign: 'center',
    lineHeight: 18,
  },
});
