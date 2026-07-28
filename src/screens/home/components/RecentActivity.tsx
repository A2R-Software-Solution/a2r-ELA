/**
 * Recent Activity Component
 * Shows recent essay submissions on the HOME tab
 * (separate from RecentEssaysList which is on the Profile tab)
 *
 * ✅ UPDATED: Dark C-palette theme (glassy purple surface, light-on-dark text)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

const ScoreChip: React.FC<ScoreChipProps> = ({ score, letterGrade, color }) => {
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

// ── Styles ────────────────────────────────────────────────────────────────────

const PURPLE         = '#7D55FF';
const PURPLE_SURFACE = 'rgba(125, 85, 255, 0.10)';
const PURPLE_BORDER  = 'rgba(125, 85, 255, 0.28)';
const ICON_BUBBLE_BG = 'rgba(125, 85, 255, 0.18)';
const ROW_BORDER     = 'rgba(255, 255, 255, 0.06)';
const TEXT_PRIMARY   = '#F5F3FF';
const TEXT_MUTED     = 'rgba(245, 243, 255, 0.45)';
const GREEN          = '#4ADE80'; // ← brightened for visibility on dark bg

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 8,
    backgroundColor: PURPLE_SURFACE, // ← was '#FFFFFF'
    borderRadius: 16,
    borderWidth: 1,
    borderColor: PURPLE_BORDER, // ← was '#E2E8F0'
    overflow: 'hidden',
    // Shadow
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was '#0F172A'
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE, // ← was '#6C4DFF'
  },

  // List
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // Row
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: ROW_BORDER, // ← was '#F1F5F9'
  },

  // Icon bubble
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: ICON_BUBBLE_BG, // ← was '#EDE9FF'
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  rowIcon: {
    fontSize: 18,
  },

  // Mid text
  rowMid: {
    flex: 1,
    marginRight: 8,
  },
  rowTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#0F172A'
    marginBottom: 3,
  },
  rowTime: {
    fontSize: 12,
    color: TEXT_MUTED, // ← was '#94A3B8'
  },

  // Score chip
  chipWrap: {
    alignItems: 'flex-end',
    gap: 4,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  chipScore: {
    fontSize: 13,
    fontWeight: '700',
  },
  chipLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: GREEN, // ← was '#22C55E'
  },

  // Empty state
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: TEXT_PRIMARY, // ← was '#0F172A'
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: TEXT_MUTED, // ← was '#94A3B8'
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RecentActivity;