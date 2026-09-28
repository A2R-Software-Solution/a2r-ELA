import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SURFACE = colors.surface;
export const PURPLE_BORDER = colors.border;
export const ROW_BORDER = 'rgba(255, 255, 255, 0.06)';
export const TEXT_PRIMARY = '#F5F3FF';
export const TEXT_MUTED = colors.muted;

export const styles = StyleSheet.create({
  container: {
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
    overflow: 'hidden',
  },

  // ---------- Header ----------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },

  // ---------- List ----------
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // ---------- Row ----------
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ROW_BORDER, // ← was '#F9F7FF'
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
    marginBottom: 3,
  },
  submittedAt: {
    fontSize: 12,
    color: TEXT_MUTED, // ← was '#9CA3AF'
  },

  // ---------- Score Chip ----------
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  chipScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipGrade: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ---------- Empty State ----------
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: TEXT_MUTED, // ← was '#9CA3AF'
    textAlign: 'center',
    lineHeight: 18,
  },
});
