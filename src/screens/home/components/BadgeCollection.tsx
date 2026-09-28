import { styles } from './BadgeCollection.styles';
/**
 * BadgeCollection
 * Displays all 8 badges in a 3-column grid on the Profile screen.
 *
 * Unlocked badges  — full colour, name + description visible
 * Locked badges    — dimmed icon with 🔒, name greyed out
 * In-progress      — progress bar + x/y label shown beneath the badge
 *
 * Pure presentational — receives BadgeDefinition[] from useProfile via HomeScreen.
 *
 * ✅ UPDATED: Dark C-palette theme (glassy purple surfaces, light-on-dark text)
 */

import React from 'react';
import { View, Text } from 'react-native';
import { BadgeDefinition } from '../../../models/GamificationModels';

// ============================================================================
// COLORS — C palette (dark theme)
// ============================================================================

// ============================================================================
// PROPS
// ============================================================================

interface BadgeCollectionProps {
  badges: BadgeDefinition[];
}

// ============================================================================
// COMPONENT
// ============================================================================

const BadgeCollection: React.FC<BadgeCollectionProps> = ({ badges }) => {
  // Split badges into rows of 3 for the grid layout
  const rows: BadgeDefinition[][] = [];
  for (let i = 0; i < badges.length; i += 3) {
    rows.push(badges.slice(i, i + 3));
  }

  return (
    <View style={styles.container}>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🏅 My Badges</Text>
        <Text style={styles.badgeCount}>
          {badges.filter(b => b.unlocked).length}/{badges.length} earned
        </Text>
      </View>

      {/* Badge grid */}
      <View style={styles.grid}>
        {rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.row}>
            {row.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
            {/* Fill empty cells in the last row so alignment stays correct */}
            {row.length < 3 && Array.from({ length: 3 - row.length }).map((_, i) => (
              <View key={`empty-${i}`} style={styles.emptyCell} />
            ))}
          </View>
        ))}
      </View>

    </View>
  );
};

// ============================================================================
// BADGE CARD
// ============================================================================

interface BadgeCardProps {
  badge: BadgeDefinition;
}

const BadgeCard: React.FC<BadgeCardProps> = ({ badge }) => {
  const { unlocked, progress, total } = badge;

  // Show progress bar only when in-progress (not locked at 0, not fully done)
  const showProgress = !unlocked && progress > 0 && total > 1;

  // Progress percentage clamped 0–100
  const progressPct  = total > 0 ? Math.min(100, Math.round((progress / total) * 100)) : 0;

  return (
    <View style={[styles.card, unlocked ? styles.cardUnlocked : styles.cardLocked]}>

      {/* Badge icon */}
      <View style={[styles.iconWrapper, unlocked ? styles.iconWrapperUnlocked : styles.iconWrapperLocked]}>
        <Text style={[styles.icon, !unlocked && styles.iconDimmed]}>
          {badge.icon}
        </Text>
        {/* Lock overlay for locked badges */}
        {!unlocked && (
          <View style={styles.lockBadge}>
            <Text style={styles.lockIcon}>🔒</Text>
          </View>
        )}
      </View>

      {/* Badge name */}
      <Text
        style={[styles.badgeName, unlocked ? styles.badgeNameUnlocked : styles.badgeNameLocked]}
        numberOfLines={2}
      >
        {badge.name}
      </Text>

      {/* Description — only visible when unlocked */}
      {unlocked && (
        <Text style={styles.badgeDescription} numberOfLines={2}>
          {badge.description}
        </Text>
      )}

      {/* Progress bar — only for in-progress badges */}
      {showProgress && (
        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` }]} />
          </View>
          <Text style={styles.progressLabel}>{progress}/{total}</Text>
        </View>
      )}

      {/* Locked with no progress — show target hint */}
      {!unlocked && !showProgress && (
        <Text style={styles.lockedHint} numberOfLines={1}>
          {badge.description}
        </Text>
      )}

    </View>
  );
};

export default BadgeCollection;
