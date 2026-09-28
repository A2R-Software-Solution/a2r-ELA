import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const BASE_BG = colors.background;
export const PRIMARY = colors.primary;
export const WHITE = '#FFFFFF';
export const TEXT_LIGHT = '#FFFFFF';
export const TEXT_MUTED = colors.muted;
export const TEXT_SUBTLE = colors.subtle;
export const CARD_BG = colors.surface;
export const CARD_BORDER = colors.border;
export const ORANGE = '#F97316';

export const styles = StyleSheet.create({
  viewHeight: { height: 20 },

  wrapper: {
    flex: 1,
    backgroundColor: BASE_BG,
  },

  header: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: 'rgba(7, 5, 14, 0.75)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: TEXT_LIGHT,
  },
  headerSub: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginTop: 2,
  },
  streakBadge: {
    backgroundColor: 'rgba(249,115,22,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(249,115,22,0.35)',
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
    color: ORANGE,
  },

  scrollContent: {
    ...layout.content,
    paddingTop: 16,
  },

  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: TEXT_LIGHT,
    marginBottom: 4,
  },
  sectionSub: {
    fontSize: 13,
    color: TEXT_MUTED,
    marginBottom: 12,
  },

  recommendedCard: {
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  recommendedLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  recommendedEmoji: {
    fontSize: 40,
  },
  recommendedInfo: {
    flex: 1,
  },
  recommendedTitle: {
    fontSize: 17,
    fontWeight: '800',
    marginBottom: 2,
  },
  recommendedDomain: {
    fontSize: 12,
    color: TEXT_MUTED,
    marginBottom: 6,
  },
  starRow: {
    flexDirection: 'row',
    gap: 2,
  },
  star: {
    fontSize: 12,
  },
  recommendedRight: {
    alignItems: 'flex-end',
    gap: 8,
  },
  recommendedXp: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  playNowBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
  },
  playNowBtnText: {
    color: WHITE,
    fontSize: 13,
    fontWeight: '700',
  },

  gameList: {
    backgroundColor: CARD_BG,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    overflow: 'hidden',
  },
  gameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    gap: 12,
  },
  gameRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },

  gameIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameEmoji: {
    fontSize: 24,
  },

  gameInfo: {
    flex: 1,
  },
  gameInfoTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  gameTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: TEXT_LIGHT,
  },
  gameTagRow: {
    flexDirection: 'row',
    gap: 4,
  },
  aiTag: {
    backgroundColor: 'rgba(14,165,233,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#38BDF8',
  },
  weeklyTag: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  weeklyTagText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FCD34D',
  },
  gameDomain: {
    fontSize: 12,
    fontWeight: '600',
  },

  gameRight: {
    alignItems: 'flex-end',
    gap: 4,
  },
  gameBestXp: {
    fontSize: 12,
    fontWeight: '600',
    color: TEXT_SUBTLE,
  },
  gameChevron: {
    fontSize: 20,
    color: TEXT_MUTED,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardCard: {
    width: '85%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    gap: 8,
    borderWidth: 1,
    borderColor: CARD_BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  rewardEmoji: { fontSize: 48 },
  rewardXp: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.accent,
  },
  rewardTotal: {
    fontSize: 14,
    color: TEXT_MUTED,
  },
  levelUpBadge: {
    backgroundColor: 'rgba(245,158,11,0.15)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
    borderWidth: 1,
    borderColor: 'rgba(245,158,11,0.3)',
  },
  levelUpText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FCD34D',
  },
  badgesSection: {
    alignSelf: 'stretch',
    marginTop: 8,
    gap: 8,
  },
  badgesTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_LIGHT,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 10,
    gap: 10,
  },
  badgeIcon: { fontSize: 28 },
  badgeName: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_LIGHT,
  },
  badgeDesc: {
    fontSize: 12,
    color: TEXT_MUTED,
  },
  rewardCloseBtn: {
    backgroundColor: PRIMARY,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 48,
    marginTop: 8,
  },
  rewardCloseBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },
});
