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
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { BadgeDefinition } from '../../../models/GamificationModels';

// ============================================================================
// COLORS — C palette (dark theme)
// ============================================================================

const PURPLE              = '#7D55FF';
const PURPLE_SURFACE      = 'rgba(125, 85, 255, 0.14)';
const PURPLE_BORDER       = 'rgba(125, 85, 255, 0.4)';
const LOCKED_SURFACE      = 'rgba(255, 255, 255, 0.04)';
const LOCKED_BORDER       = 'rgba(255, 255, 255, 0.08)';
const CONTAINER_BORDER    = 'rgba(255, 255, 255, 0.08)';
const ICON_WRAPPER_BG     = 'rgba(125, 85, 255, 0.18)';
const TEXT_PRIMARY        = '#F5F3FF';
const TEXT_MUTED          = 'rgba(245, 243, 255, 0.45)';

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
    backgroundColor: PURPLE_SURFACE, // ← was WHITE
    borderRadius: 16,
    borderWidth: 1,
    borderColor: CONTAINER_BORDER, // ← was BORDER_COLOR
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
    borderBottomColor: CONTAINER_BORDER, // ← was BORDER_COLOR
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: TEXT_PRIMARY, // ← was DARK_TEXT
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
    backgroundColor: PURPLE_SURFACE, // ← was LIGHT_PURPLE
    borderWidth: 1.5,
    borderColor: PURPLE_BORDER, // ← was PURPLE (solid)
  },
  cardLocked: {
    backgroundColor: LOCKED_SURFACE, // ← was LIGHT_GRAY
    borderWidth: 1,
    borderColor: LOCKED_BORDER, // ← was BORDER_COLOR
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
    backgroundColor: ICON_WRAPPER_BG, // ← was WHITE
    shadowColor: PURPLE,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconWrapperLocked: {
    backgroundColor: LOCKED_BORDER, // ← was BORDER_COLOR
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
    backgroundColor: '#1A1626', // ← was WHITE — dark surface for badge contrast
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
    color: TEXT_MUTED, // ← was GRAY_TEXT
  },
  badgeDescription: {
    fontSize: 10,
    color: TEXT_MUTED, // ← was GRAY_TEXT
    textAlign: 'center',
    lineHeight: 14,
  },
  lockedHint: {
    fontSize: 10,
    color: TEXT_MUTED, // ← was GRAY_TEXT
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
    backgroundColor: LOCKED_BORDER, // ← was BORDER_COLOR
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
    color: TEXT_MUTED, // ← was GRAY_TEXT
    fontWeight: '600',
  },
});

export default BadgeCollection;