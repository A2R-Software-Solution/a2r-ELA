import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 14,
    backgroundColor: 'transparent',
  },

  // Avatar
  avatarRing: {
    marginRight: 12,
  },
  avatarGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    padding: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarInner: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },

  // Greeting
  greetingWrap: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: colors.muted,
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  username: {
    fontSize: 17,
    fontWeight: '700',
    color: '#F1EDFF',
    letterSpacing: 0.1,
  },

  // Bell
  bellWrap: {
    position: 'relative',
  },
  bellGradient: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
  },
  bellIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 4,
    right: 4,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: '#12102A',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
