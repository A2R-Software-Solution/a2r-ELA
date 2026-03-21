/**
 * Home Header Component
 * Displays user greeting and action buttons
 *
 * ✅ FIXED: Added useSafeAreaInsets() so header respects iPhone dynamic island / notch
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HomeHeaderProps {
  username: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  username,
  onNotificationClick = () => {},
}) => {
  // ✅ FIX: Get the top inset (dynamic island / notch height)
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 8 }]}>
      {/* Greeting */}
      <Text style={styles.greeting}>Hi, {username}</Text>

      {/* Notification Icon */}
      <TouchableOpacity onPress={onNotificationClick} style={styles.iconButton}>
        <Text style={styles.icon}>🔔</Text>
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  icon: {
    fontSize: 20,
  },
  greeting: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 4,
  },
});

export default HomeHeader;
