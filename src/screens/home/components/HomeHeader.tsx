/**
 * Home Header Component
 * Displays user greeting and action buttons
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface HomeHeaderProps {
  username: string;
  onProfileClick?: () => void;
  onNotificationClick?: () => void;
}

const HomeHeader: React.FC<HomeHeaderProps> = ({
  username,
  onProfileClick = () => {},
  onNotificationClick = () => {},
}) => {
  return (
    <View style={styles.container}>
      {/* Profile Icon */}
      {/* <TouchableOpacity onPress={onProfileClick} style={styles.iconButton}>
        <Text style={styles.icon}>👤</Text>
      </TouchableOpacity> */}

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
    paddingVertical: 12,
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
    marginLeft: 12,
  },
});

export default HomeHeader;