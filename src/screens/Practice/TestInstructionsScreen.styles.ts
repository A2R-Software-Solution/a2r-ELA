import { layout } from '../../theme/layout';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

export const PRIMARY = colors.primary;
export const WHITE = '#FFFFFF';
export const BG = colors.background;
export const TEXT_DARK = colors.text;
export const TEXT_MID = colors.muted;
export const TEXT_GRAY = colors.subtle;
export const BORDER = colors.border;

export const statStyles = StyleSheet.create({
  box: {
    flex: 1,
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginHorizontal: 3,
  },
  icon: {
    fontSize: 18,
    marginBottom: 4,
  },
  value: {
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 2,
  },
  label: {
    fontSize: 11,
    color: colors.subtle,
  },
});

export const sectionStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceRaised,
  },
  iconBubble: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: { fontSize: 20 },
  info: { flex: 1 },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  countBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
  },
  count: {
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    fontSize: 12,
    color: colors.subtle,
  },
});

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.surfaceRaised,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backBtnText: {
    fontSize: 18,
    color: TEXT_DARK,
    fontWeight: '600',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  headerSpacer: { width: 36 },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: {
    ...layout.content,
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Hero card
  heroCard: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  heroEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 10,
  },
  difficultyBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  difficultyText: {
    fontSize: 14,
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 14,
  },

  // Stats grid
  statsGrid: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 14,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: BORDER,
    marginVertical: 12,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  metaIcon: { fontSize: 24 },
  metaValue: {
    fontSize: 15,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  metaLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  metaDivider: {
    width: 1,
    height: 40,
    backgroundColor: BORDER,
    marginHorizontal: 8,
  },

  // Rules
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceRaised,
  },
  ruleIcon: { fontSize: 16, marginTop: 1 },
  ruleText: {
    flex: 1,
    fontSize: 14,
    color: TEXT_MID,
    lineHeight: 20,
  },

  // Footer
  footer: {
    ...layout.content,
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  beginBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  beginBtnText: {
    color: WHITE,
    fontSize: 17,
    fontWeight: '800',
  },
});
