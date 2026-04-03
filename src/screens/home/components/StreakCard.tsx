/**
 * XP Level Card Component
 * Replaces the old StreakCard — shows XP progress and current level
 * Raw XP numbers are never shown to the student, only the progress bar
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import {
  getXpProgressPercent,
  getLevelUpMessage,
  getPrestigeBadge,
  LEVEL_CONFIG,
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
  const message        = getLevelUpMessage(level);
  const prestigeBadge  = getPrestigeBadge(level);

  // Get next level name for the message
  const nextLevelInfo = LEVEL_CONFIG.find(l => l.level === level + 1);

  if (isLoadingXp) {
    return (
      <View style={styles.card}>
        <View style={styles.loadingBar} />
      </View>
    );
  }

  return (
    <View style={styles.card}>

      {/* Level + Badge Row */}
      <View style={styles.header}>
        <View style={styles.levelRow}>
          {prestigeBadge && (
            <Text style={styles.badge}>{prestigeBadge}</Text>
          )}
          <Text style={styles.levelNumber}>Level {level}</Text>
          <Text style={styles.dot}> · </Text>
          <Text style={styles.levelName}>{levelName}</Text>
        </View>
      </View>

      {/* Progress Bar — no raw numbers shown */}
      <View style={styles.progressBarBackground}>
        <View
          style={[
            styles.progressBarFill,
            { width: `${progressPercent}%` },
          ]}
        />
      </View>

      {/* Motivating Message */}
      <Text style={styles.message}>{message}</Text>

    </View>
  );
};

// ─── Connect to HomeScreen ────────────────────────────────────────────────────
// HomeScreen passes xp/level/levelName from uiState which is populated
// by useHome → loadGamification → apiService.getGamification()
// Usage in HomeScreen:
//   <StreakCard
//     xp={uiState.xp}
//     level={uiState.level}
//     levelName={uiState.levelName}
//     isLoadingXp={uiState.isLoadingXp}
//   />
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
  },
  header: {
    marginBottom: 12,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    fontSize: 20,
    marginRight: 6,
  },
  levelNumber: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7D55FF',
  },
  dot: {
    fontSize: 22,
    color: '#AAAAAA',
  },
  levelName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#7D55FF',
  },
  progressBarBackground: {
    width: '100%',
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
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
  loadingBar: {
    width: '100%',
    height: 60,
    backgroundColor: '#EEEEEE',
    borderRadius: 8,
  },
});

export default StreakCard;