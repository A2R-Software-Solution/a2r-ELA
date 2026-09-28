import { styles } from './StatsRow.styles';
/**
 * StatsRow
 * A horizontal row of 3 stat cards shown on the profile screen.
 *
 * Renders:
 *   - Card 1: Total essays submitted
 *   - Card 2: Current day streak
 *   - Card 3: Overall average score
 *
 * Pure presentational component — no logic, no API calls.
 * All data comes from props.
 *
 * References:
 *   - StreakCard.tsx         (card styling approach, shadow/border pattern)
 *   - ProfileUiModel.ts      (ProfileStatsUiModel type)
 */

import React from 'react';
import { View, Text } from 'react-native';
import { ProfileStatsUiModel } from '../../../models/ui/ProfileUiModel';

// ============================================================================
// COLORS — C palette (dark theme)
// ============================================================================

// ============================================================================
// PROPS
// ============================================================================

interface StatsRowProps {
  stats: ProfileStatsUiModel;
}

// ============================================================================
// COMPONENT
// ============================================================================

const StatsRow: React.FC<StatsRowProps> = ({ stats }) => {
  return (
    <View style={styles.container}>
      <StatCard
        icon="📝"
        value={stats.totalEssays}
        label="Essays"
      />

      <Divider />

      <StatCard
        icon="🔥"
        value={stats.currentStreak}
        label="Day Streak"
      />

      <Divider />

      <StatCard
        icon="⭐"
        value={stats.avgScore}
        label="Avg Score"
      />
    </View>
  );
};

// ============================================================================
// STAT CARD SUB-COMPONENT
// One individual stat — icon, big number, label below.
// ============================================================================

interface StatCardProps {
  icon: string;
  value: number;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, value, label }) => (
  <View style={styles.card}>
    <Text style={styles.cardIcon}>{icon}</Text>
    <Text style={styles.cardValue}>{value}</Text>
    <Text style={styles.cardLabel}>{label}</Text>
  </View>
);

// ============================================================================
// DIVIDER SUB-COMPONENT
// Thin vertical line between cards.
// ============================================================================

const Divider: React.FC = () => <View style={styles.divider} />;

export default StatsRow;
