/**
 * Home Header Component — REDESIGNED
 * Dark theme, glassmorphism avatar, dynamic gradient glow
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';

interface HomeHeaderProps {
  username: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
}

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

const HomeHeader: React.FC<HomeHeaderProps> = ({
  username,
  notificationCount = 0,
  onNotificationClick = () => {},
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 10 }]}>

      {/* Avatar with gradient ring */}
      <View style={styles.avatarRing}>
        <LinearGradient
          colors={['#A78BFA', '#6C4DFF', '#4F46E5']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatarGradient}
        >
          <View style={styles.avatarInner}>
            <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
          </View>
        </LinearGradient>
      </View>

      {/* Greeting text */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greeting}>{getGreeting()},</Text>
        <Text style={styles.username}>{username}! 👋</Text>
      </View>

      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellWrap}
        onPress={onNotificationClick}
        activeOpacity={0.7}
      >
        <LinearGradient
          colors={['rgba(124,92,252,0.18)', 'rgba(79,70,229,0.10)']}
          style={styles.bellGradient}
        >
          <Text style={styles.bellIcon}>🔔</Text>
        </LinearGradient>
        {notificationCount > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>
              {notificationCount > 9 ? '9+' : notificationCount}
            </Text>
          </View>
        )}
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingHorizontal: 20,
    paddingBottom:     14,
    backgroundColor:   'transparent',
  },

  // Avatar
  avatarRing: {
    marginRight: 12,
  },
  avatarGradient: {
    width:        50,
    height:       50,
    borderRadius: 25,
    padding:      2,
    justifyContent: 'center',
    alignItems:     'center',
  },
  avatarInner: {
    width:           46,
    height:          46,
    borderRadius:    23,
    backgroundColor: '#1A1535',
    justifyContent:  'center',
    alignItems:      'center',
  },
  avatarEmoji: {
    fontSize: 22,
  },

  // Greeting
  greetingWrap: {
    flex: 1,
  },
  greeting: {
    fontSize:   13,
    color:      'rgba(167,139,250,0.75)',
    fontWeight: '400',
    letterSpacing: 0.2,
  },
  username: {
    fontSize:      17,
    fontWeight:    '700',
    color:         '#F1EDFF',
    letterSpacing: 0.1,
  },

  // Bell
  bellWrap: {
    position: 'relative',
  },
  bellGradient: {
    width:         42,
    height:        42,
    borderRadius:  21,
    justifyContent: 'center',
    alignItems:    'center',
    borderWidth:   1,
    borderColor:   'rgba(124,92,252,0.30)',
  },
  bellIcon: {
    fontSize: 18,
  },
  badge: {
    position:          'absolute',
    top:               4,
    right:             4,
    minWidth:          16,
    height:            16,
    borderRadius:      8,
    backgroundColor:   '#F97316',
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 3,
    borderWidth:       1.5,
    borderColor:       '#12102A',
  },
  badgeText: {
    fontSize:   9,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
});

export default HomeHeader;