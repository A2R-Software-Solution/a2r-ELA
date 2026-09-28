import { styles } from './RecentActivity.styles';
/**
 * Recent Activity Component
 * Shows recent essay submissions on the HOME tab
 * (separate from RecentEssaysList which is on the Profile tab)
 *
 * ✅ UPDATED: Dark C-palette theme (glassy purple surface, light-on-dark text)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { RecentEssayUiItem } from '../../../models/ui/ProfileUiModel';

interface RecentActivityProps {
  essays: RecentEssayUiItem[];
  onSeeAllClick?: () => void;
  onEssayClick?: (essay: RecentEssayUiItem) => void;
}

const RecentActivity: React.FC<RecentActivityProps> = ({
  essays,
  onSeeAllClick = () => {},
  onEssayClick = () => {},
}) => {
  return (
    <View style={styles.container}>

      {/* Section Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Activity</Text>
        {essays.length > 0 && (
          <TouchableOpacity onPress={onSeeAllClick} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List or empty state */}
      {essays.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.list}>
          {essays.slice(0, 3).map((essay, index) => (
            <ActivityRow
              key={essay.submissionId}
              essay={essay}
              isLast={index === Math.min(essays.length, 3) - 1}
              onPress={() => onEssayClick(essay)}
            />
          ))}
        </View>
      )}

    </View>
  );
};

// ── Activity Row ──────────────────────────────────────────────────────────────

interface ActivityRowProps {
  essay: RecentEssayUiItem;
  isLast: boolean;
  onPress: () => void;
}

const ActivityRow: React.FC<ActivityRowProps> = ({ essay, isLast, onPress }) => (
  <TouchableOpacity
    style={[styles.row, !isLast && styles.rowBorder]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    {/* Left — icon + text */}
    <View style={styles.iconBubble}>
      <Text style={styles.rowIcon}>📝</Text>
    </View>

    <View style={styles.rowMid}>
      <Text style={styles.rowTitle} numberOfLines={1}>
        {essay.categoryLabel}
      </Text>
      <Text style={styles.rowTime}>{essay.submittedAt}</Text>
    </View>

    {/* Right — score + label */}
    <ScoreChip
      score={essay.score}
      letterGrade={essay.letterGrade}
      color={essay.scoreColor}
    />
  </TouchableOpacity>
);

// ── Score Chip ────────────────────────────────────────────────────────────────

interface ScoreChipProps {
  score: number;
  letterGrade: string;
  color: string;
}

const ScoreChip: React.FC<ScoreChipProps> = ({ score, color }) => {
  const isGood = score >= 70;
  return (
    <View style={styles.chipWrap}>
      <View style={[styles.chip, { backgroundColor: `${color}26` }]}>
        <Text style={[styles.chipScore, { color }]}>{score}</Text>
      </View>
      {isGood && (
        <Text style={styles.chipLabel}>Great Job!</Text>
      )}
    </View>
  );
};

// ── Empty State ───────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>📝</Text>
    <Text style={styles.emptyTitle}>No activity yet</Text>
    <Text style={styles.emptySubtitle}>
      Write your first essay to see your activity here
    </Text>
  </View>
);

 // ← brightened for visibility on dark bg

export default RecentActivity;
