import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  root: { flex: 1 },
  safeArea: { flex: 1, backgroundColor: 'transparent' },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  backIcon: { fontSize: 18, color: colors.accent, fontWeight: '700' },
  headerTitle: { flex: 1, fontSize: 20, fontWeight: '700', color: colors.text },
  headerAction: { fontSize: 13, fontWeight: '600', color: colors.accent },

  content: { padding: 16, paddingBottom: 40 },
  clearButton: { alignSelf: 'flex-end', marginTop: 8 },

  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.subtle,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },

  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },

  // Permission banner
  banner: {
    backgroundColor: colors.warningSurface,
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  bannerText: { flex: 1, color: colors.text, fontSize: 13, marginRight: 12 },
  bannerButton: { color: colors.accent, fontWeight: '700', fontSize: 13 },

  // Inbox rows
  item: {
    flexDirection: 'row',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  itemIcon: { fontSize: 22, marginRight: 12 },
  itemBody: { flex: 1 },
  itemTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  itemText: { color: colors.muted, fontSize: 13, marginTop: 2 },
  itemTime: { color: colors.subtle, fontSize: 11, marginTop: 6 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    marginTop: 6,
    marginLeft: 8,
  },

  empty: { alignItems: 'center', paddingVertical: 36 },
  emptyEmoji: { fontSize: 36, marginBottom: 8 },
  emptyText: { color: colors.muted, fontSize: 14 },

  // Settings rows
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  settingInfo: { flex: 1, marginRight: 12 },
  settingTitle: { color: colors.text, fontSize: 15, fontWeight: '600' },
  settingSub: { color: colors.muted, fontSize: 12, marginTop: 2 },

  timeRow: { flexDirection: 'row', flexWrap: 'wrap', padding: 12, paddingTop: 0 },
  timeChip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginTop: 8,
  },
  timeChipActive: { backgroundColor: colors.primary, borderColor: colors.accent },
  timeChipText: { color: colors.muted, fontSize: 12, fontWeight: '600' },
  timeChipTextActive: { color: colors.text },
});
