/**
 * Home Header Component
 * - Avatar (emoji placeholder)
 * - "Good morning, Name! 👋" greeting
 * - Notification bell with badge count
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

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
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>

      {/* Avatar */}
      <View style={styles.avatar}>
        <Text style={styles.avatarEmoji}>🧑‍🎓</Text>
      </View>

      {/* Greeting text */}
      <View style={styles.greetingWrap}>
        <Text style={styles.greeting}>
          {getGreeting()},
        </Text>
        <Text style={styles.username}>{username}! 👋</Text>
      </View>

      {/* Notification Bell */}
      <TouchableOpacity
        style={styles.bellWrap}
        onPress={onNotificationClick}
        activeOpacity={0.7}
      >
        <Text style={styles.bellIcon}>🔔</Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },

  // Avatar
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#EDE9FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
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
    color: '#475569',
    fontWeight: '400',
  },
  username: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },

  // Bell
  bellWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bellIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#F97316',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default HomeHeader;