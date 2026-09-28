import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;
export const PURPLE_SOFT = colors.accent;
export const BASE_BG = colors.background;

export const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: 'transparent',
  },

  header: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: 'transparent',
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
  backIcon: {
    fontSize: 18,
    color: PURPLE_SOFT,
    fontWeight: '700',
  },
  headerTitleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    marginTop: 1,
  },
  trophyIcon: {
    fontSize: 28,
  },

  heroCard: {
    marginHorizontal: 16,
    marginTop: 8,
    padding: 18,
    borderRadius: 20,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: 'rgba(167,139,250,0.3)',
  },
  heroHeader: {
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    marginTop: 4,
  },
  heroStatsRow: {
    flexDirection: 'row',
  },
  heroStat: {
    flex: 1,
    alignItems: 'center',
  },
  heroValue: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    marginTop: 4,
  },
  heroDivider: {
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  podiumContainer: {
    marginTop: 20,
    marginBottom: 12,
  },

  listDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
  },
  listContainer: {
    paddingTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 8,
  },

  scrollContent: {
    ...layout.content,
    backgroundColor: 'transparent',
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingTop: 60,
    backgroundColor: 'transparent',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
  },
  errorEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  errorText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 20,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },

  bottomPadding: {
    height: 32,
  },
});
