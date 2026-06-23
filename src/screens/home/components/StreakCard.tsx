/**
 * Streak Card / Level XP Card
 * Purple gradient card showing level, title, XP progress bar
 * and a motivational message
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  getXpProgressPercent,
  getLevelUpMessage,
  getPrestigeBadge,
} from '../../../models/GamificationModels';

interface StreakCardProps {
  xp: number;
  level: number;
  levelName: string;
  isLoadingXp?: boolean;
}

const StreakCard: React.FC<StreakCardProps> = ({
  xp,
  level,
  levelName,
  isLoadingXp = false,
}) => {
  const progressPercent = getXpProgressPercent(xp, level);
  const message = getLevelUpMessage(level);
  const prestigeBadge = getPrestigeBadge(level);

  if (isLoadingXp) {
    return <View style={styles.skeleton} />;
  }

  return (
    <View style={styles.card}>

      {/* Top row — badge + level + title */}
      <View style={styles.topRow}>
        <View style={styles.levelRow}>
          <Text style={styles.crown}>
            {prestigeBadge ?? '👑'}
          </Text>
          <Text style={styles.levelText}>Level {level}</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.levelName}>{levelName}</Text>
        </View>

        {/* XP pill */}
        <View style={styles.xpPill}>
          <Text style={styles.xpPillText}>⭐ {xp} XP</Text>
        </View>
      </View>

      {/* Progress Bar */}
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]}>
          {/* Shine effect */}
          <View style={styles.progressShine} />
        </View>
      </View>

      {/* Bottom row — message + percent */}
      <View style={styles.bottomRow}>
        <Text style={styles.message}>{message}</Text>
        <Text style={styles.percent}>{progressPercent}%</Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    padding: 18,
    // Purple gradient simulation with a solid + overlay trick
    backgroundColor: '#6C4DFF',
    // Shadow
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
    overflow: 'hidden',
  },

  // Skeleton loader
  skeleton: {
    marginHorizontal: 16,
    marginVertical: 10,
    borderRadius: 20,
    height: 100,
    backgroundColor: '#E2E8F0',
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  crown: {
    fontSize: 18,
    marginRight: 6,
  },
  levelText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  dot: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.5)',
  },
  levelName: {
    fontSize: 16,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.9)',
  },

  // XP Pill
  xpPill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  xpPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  // Progress bar
  progressBg: {
    width: '100%',
    height: 10,
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#F59E0B',  // gold/amber
    borderRadius: 5,
    overflow: 'hidden',
  },
  progressShine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 5,
  },

  // Bottom row
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  message: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    flex: 1,
    marginRight: 8,
  },
  percent: {
    fontSize: 12,
    fontWeight: '700',
    color: '#F59E0B',
  },
});

export default StreakCard;