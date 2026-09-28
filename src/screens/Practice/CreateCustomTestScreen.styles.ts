import { layout } from '../../theme/layout';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

export const PRIMARY = colors.primary;
export const BG = colors.background;
export const TEXT_DARK = colors.text;
export const TEXT_MID = colors.muted;
export const TEXT_GRAY = colors.subtle;
export const BORDER = colors.border;

export const styles = StyleSheet.create({
  viewHeight: { height: 140 },
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
    gap: 10,
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
  headerCenter: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: TEXT_DARK,
  },
  headerSub: {
    fontSize: 12,
    color: TEXT_GRAY,
    marginTop: 2,
  },
  xpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.warningSurface,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#FEF3C7',
    gap: 6,
  },
  xpPillIcon: {
    fontSize: 18,
  },
  xpPillLabel: {
    fontSize: 10,
    color: '#FCD34D',
  },
  xpPillValue: {
    fontSize: 13,
    fontWeight: '800',
    color: '#FBBF24',
  },

  // Scroll
  scroll: {
    flex: 1,
  },
  scrollContent: {
    ...layout.content,
    paddingHorizontal: 16,
    paddingTop: 20,
  },

  // Section headers
  sectionNumber: {
    fontSize: 11,
    fontWeight: '800',
    color: TEXT_GRAY,
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    marginTop: 20,
  },
  totalPill: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  totalPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.accent,
  },

  // Difficulty
  difficultyRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  difficultyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
    marginBottom: 20,
  },
  difficultyBannerIcon: {
    fontSize: 14,
    color: colors.accent,
  },
  difficultyBannerText: {
    flex: 1,
    fontSize: 13,
    color: TEXT_MID,
    lineHeight: 18,
  },

  // Sliders card
  slidersCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sliderDivider: {
    height: 1,
    backgroundColor: colors.surfaceRaised,
    marginVertical: 8,
  },

  // Presets grid
  presetsGrid: {
    gap: 10,
  },
  presetItem: {
    width: '100%',
  },
});
