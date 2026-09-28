import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const PURPLE = colors.accent;

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginVertical: 4,
    backgroundColor: colors.surface,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
    elevation: 1,
  },
  containerHighlighted: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: PURPLE,
    shadowColor: PURPLE,
    shadowOpacity: 0.15,
    elevation: 3,
  },

  // Rank
  rankContainer: {
    width: 32,
    alignItems: 'center',
    marginRight: 8,
  },
  rank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#BDBDBD',
  },
  rankHighlighted: {
    color: PURPLE,
  },

  // Avatar
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarHighlighted: {
    backgroundColor: colors.primary,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 24,
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: PURPLE,
  },
  avatarTextHighlighted: {
    color: '#FFFFFF',
  },

  // Name + level
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  nameHighlighted: {
    color: PURPLE,
  },
  levelName: {
    fontSize: 12,
    color: '#9E9E9E',
    marginTop: 2,
  },

  // Right side
  rightContainer: {
    alignItems: 'flex-end',
  },
  xpBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 999,
  },
  xp: {
    fontSize: 13,
    fontWeight: '700',
    color: '#424242',
  },
  xpHighlighted: {
    color: PURPLE,
  },
  essays: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 2,
  },
  scoreText: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 2,
  },
});
