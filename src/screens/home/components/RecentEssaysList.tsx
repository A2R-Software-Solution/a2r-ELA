/**
 * RecentEssaysList
 * Shows the user's last 5 essay submissions on the profile screen.
 *
 * Renders:
 *   - Section header "Recent Essays" with optional "See All" link
 *   - One row per essay: category label + date on left, score chip on right
 *   - Empty state when no essays submitted yet
 *
 * Pure presentational component — no logic, no API calls.
 * All data comes from props.
 *
 * References:
 *   - RecentCourses.tsx      (list row styling pattern)
 *   - EssayModels.ts         (EssayCategory display names)
 *   - ProfileUiModel.ts      (RecentEssayUiItem type)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { RecentEssayUiItem } from '../../../models/ui/ProfileUiModel';

// ============================================================================
// PROPS
// ============================================================================

interface RecentEssaysListProps {
  essays: RecentEssayUiItem[];

  /** Called when user taps "See All" — parent handles navigation */
  onSeeAllClick: () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const RecentEssaysList: React.FC<RecentEssaysListProps> = ({
  essays,
  onSeeAllClick,
}) => {
  return (
    <View style={styles.container}>

      {/* Section header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Essays</Text>
        {essays.length > 0 && (
          <TouchableOpacity onPress={onSeeAllClick} activeOpacity={0.7}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* List or empty state */}
      {essays.length === 0 ? (
        <EmptyState />
      ) : (
        <View style={styles.list}>
          {essays.map((essay, index) => (
            <EssayRow
              key={essay.submissionId}
              essay={essay}
              isLast={index === essays.length - 1}
            />
          ))}
        </View>
      )}

    </View>
  );
};

// ============================================================================
// ESSAY ROW SUB-COMPONENT
// One submission row — category + date on left, score chip on right.
// ============================================================================

interface EssayRowProps {
  essay: RecentEssayUiItem;
  isLast: boolean;
}

const EssayRow: React.FC<EssayRowProps> = ({ essay, isLast }) => (
  <View style={[styles.row, !isLast && styles.rowBorder]}>

    {/* Left — category and date */}
    <View style={styles.rowLeft}>
      <Text style={styles.categoryLabel}>{essay.categoryLabel}</Text>
      <Text style={styles.submittedAt}>{essay.submittedAt}</Text>
    </View>

    {/* Right — score chip */}
    <ScoreChip
      score={essay.score}
      letterGrade={essay.letterGrade}
      color={essay.scoreColor}
    />

  </View>
);

// ============================================================================
// SCORE CHIP SUB-COMPONENT
// Colored badge showing numeric score and letter grade.
// Color is pre-computed in ProfileUiModel (gradeToScoreColor).
// ============================================================================

interface ScoreChipProps {
  score: number;
  letterGrade: string;
  color: string;
}

const ScoreChip: React.FC<ScoreChipProps> = ({ score, letterGrade, color }) => (
  <View style={[styles.chip, { backgroundColor: `${color}18` }]}>
    <Text style={[styles.chipScore, { color }]}>{score}</Text>
    <Text style={[styles.chipGrade, { color }]}>{letterGrade}</Text>
  </View>
);

// ============================================================================
// EMPTY STATE SUB-COMPONENT
// Shown when the user has not submitted any essays yet.
// ============================================================================

const EmptyState: React.FC = () => (
  <View style={styles.emptyContainer}>
    <Text style={styles.emptyIcon}>📝</Text>
    <Text style={styles.emptyTitle}>No essays yet</Text>
    <Text style={styles.emptySubtitle}>
      Start writing to track your progress here
    </Text>
  </View>
);

// ============================================================================
// STYLES
// ============================================================================

const PURPLE = '#7D55FF';

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F0EBFF',
    // Shadow — iOS
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    // Shadow — Android
    elevation: 3,
    overflow: 'hidden',
  },

  // ---------- Header ----------
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A2E',
  },
  seeAll: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },

  // ---------- List ----------
  list: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },

  // ---------- Row ----------
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  rowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F9F7FF',
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 3,
  },
  submittedAt: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // ---------- Score Chip ----------
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  chipScore: {
    fontSize: 14,
    fontWeight: '700',
  },
  chipGrade: {
    fontSize: 12,
    fontWeight: '600',
  },

  // ---------- Empty State ----------
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1A1A2E',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#9CA3AF',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default RecentEssaysList;