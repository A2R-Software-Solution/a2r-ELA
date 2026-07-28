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
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { ProfileStatsUiModel } from '../../../models/ui/ProfileUiModel';

// ============================================================================
// COLORS — C palette (dark theme)
// ============================================================================

const PURPLE = '#7D55FF';
const PURPLE_SURFACE = 'rgba(125, 85, 255, 0.10)';
const PURPLE_BORDER = 'rgba(125, 85, 255, 0.28)';
const TEXT_PRIMARY = '#F5F3FF';
const TEXT_MUTED = 'rgba(245, 243, 255, 0.45)';

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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: PURPLE_SURFACE, // ← was '#FFFFFF'
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PURPLE_BORDER, // ← was '#F0EBFF'
    // Shadow — iOS
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
  },

  // ---------- Card ----------
  card: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 8,
  },
  cardIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#1A1A2E'
    marginBottom: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: TEXT_MUTED, // ← was '#9CA3AF'
    textAlign: 'center',
  },

  // ---------- Divider ----------
  divider: {
    width: 1,
    backgroundColor: PURPLE_BORDER, // ← was '#F0EBFF'
    marginVertical: 16,
  },
});

export default StatsRow;