import { styles } from './HomeHeader.styles';
/**
 * Home Header Component — REDESIGNED
 * Dark theme, glassmorphism avatar, dynamic gradient glow
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
          colors={['rgba(255,255,255,0.45)', 'rgba(165,230,235,0.20)', 'rgba(255,255,255,0.08)']}
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
          colors={['rgba(255,255,255,0.12)', 'rgba(255,255,255,0.04)']}
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

export default HomeHeader;
