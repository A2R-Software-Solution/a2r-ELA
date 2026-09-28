import { styles } from './RecentEssaysList.styles';
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
 * ✅ UPDATED: Dark C-palette theme (glassy purple surface, light-on-dark text)
 *
 * References:
 *   - RecentCourses.tsx      (list row styling pattern)
 *   - EssayModels.ts         (EssayCategory display names)
 *   - ProfileUiModel.ts      (RecentEssayUiItem type)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
  <View style={[styles.chip, { backgroundColor: `${color}26` }]}>
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

export default RecentEssaysList;
