/**
 * BadgeCollection
 * Displays all 8 badges in a 3-column grid on the Profile screen.
 *
 * Unlocked badges  — full colour, name + description visible
 * Locked badges    — dimmed icon with 🔒, name greyed out
 * In-progress      — progress bar + x/y label shown beneath the badge
 *
 * Pure presentational — receives BadgeDefinition[] from useProfile via HomeScreen.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { BadgeDefinition } from '../../../models/GamificationModels';

// ============================================================================
// COLORS — matches existing design system (ProfileHeader, StreakCard)
// ============================================================================

const PURPLE        = '#7D55FF';
const LIGHT_PURPLE  = '#F0EBFF';
const DARK_TEXT     = '#111827';
const GRAY_TEXT     = '#6B7280';
const LIGHT_GRAY    = '#F3F4F6';
const BORDER_COLOR  = '#E5E7EB';
const WHITE         = '#FFFFFF';

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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginVertical: 12,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    overflow: 'hidden',
  },

  // ---------- Section header ----------
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: DARK_TEXT,
  },
  badgeCount: {
    fontSize: 13,
    fontWeight: '600',
    color: PURPLE,
  },

  // ---------- Grid ----------
  grid: {
    padding: 12,
    gap: 10,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  emptyCell: {
    flex: 1,
  },

  // ---------- Card ----------
  card: {
    flex: 1,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    minHeight: 120,
  },
  cardUnlocked: {
    backgroundColor: LIGHT_PURPLE,
    borderWidth: 1.5,
    borderColor: PURPLE,
  },
  cardLocked: {
    backgroundColor: LIGHT_GRAY,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
  },

  // ---------- Icon ----------
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  iconWrapperUnlocked: {
    backgroundColor: WHITE,
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapperLocked: {
    backgroundColor: BORDER_COLOR,
  },
  icon: {
    fontSize: 24,
  },
  iconDimmed: {
    opacity: 0.4,
  },
  lockBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: WHITE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockIcon: {
    fontSize: 10,
  },

  // ---------- Text ----------
  badgeName: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 4,
    lineHeight: 16,
  },
  badgeNameUnlocked: {
    color: PURPLE,
  },
  badgeNameLocked: {
    color: GRAY_TEXT,
  },
  badgeDescription: {
    fontSize: 10,
    color: GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 14,
  },
  lockedHint: {
    fontSize: 10,
    color: GRAY_TEXT,
    textAlign: 'center',
    lineHeight: 14,
    opacity: 0.8,
  },

  // ---------- Progress ----------
  progressWrapper: {
    width: '100%',
    marginTop: 6,
    alignItems: 'center',
    gap: 3,
  },
  progressTrack: {
    width: '100%',
    height: 4,
    backgroundColor: BORDER_COLOR,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: PURPLE,
    borderRadius: 2,
  },
  progressLabel: {
    fontSize: 10,
    color: GRAY_TEXT,
    fontWeight: '600',
  },
});

export default BadgeCollection;