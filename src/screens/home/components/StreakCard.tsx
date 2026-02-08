/**
 * Streak Card Component
 * Displays user's learning streak progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StreakCardProps {
  currentStreak: number;
  totalDays?: number;
}

const StreakCard: React.FC<StreakCardProps> = ({
  currentStreak,
  totalDays = 365,
}) => {
  const progress = currentStreak / totalDays;

  return (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.streakText}>
          {currentStreak}/{totalDays}
        </Text>
        <Text style={styles.label}>Day Streak</Text>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBarContainer}>
        <View style={styles.progressBarBackground}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${progress * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Message */}
      <Text style={styles.message}>
        Keep learning to maintain your streak!
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  streakText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#7D55FF',
  },
  label: {
    fontSize: 14,
    color: '#666666',
  },
  progressBarContainer: {
    marginBottom: 8,
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7D55FF',
    borderRadius: 4,
  },
  message: {
    fontSize: 12,
    color: '#666666',
  },
});

export default StreakCard;