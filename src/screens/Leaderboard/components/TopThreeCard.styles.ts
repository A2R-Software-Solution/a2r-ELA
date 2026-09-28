import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingTop: 24,
    paddingBottom: 0,
    paddingHorizontal: 8,
    gap: 8,
  },

  // Podium item
  podiumItem: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20,
  },
  podiumItemCenter: {
    marginTop: 0,
  },

  // Crown
  crown: {
    fontSize: 28,
    marginBottom: 2,
  },

  // Avatar
  avatar: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    marginBottom: 4,
  },
  avatarFallback: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontWeight: '700',
  },

  // Medal
  medal: {
    fontSize: 18,
    marginBottom: 4,
  },

  // Name
  name: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 2,
    maxWidth: 90,
  },
  nameFirst: {
    fontSize: 14,
  },

  // XP
  xpBadge: {
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 10,
  },
  xp: {
    fontSize: 11,
    color: colors.accent,
    fontWeight: '600',
  },

  // Platform block
  platform: {
    width: '100%',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  platformRank: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
    paddingVertical: 6,
  },

  // Empty slot placeholder
  emptySlot: {
    flex: 1,
  },
});
