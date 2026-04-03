/**
 * TopThreeCard Component
 * Displays the top 3 users in a podium layout.
 * Rank 1 is centered and elevated, ranks 2 and 3 are on the sides.
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import { LeaderboardEntry } from '../../../models/LeaderboardModels';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface TopThreeCardProps {
  entries: LeaderboardEntry[]; // Should have at least 1, up to 3 entries
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE       = '#6C63FF';
const GOLD         = '#FFD700';
const SILVER       = '#C0C0C0';
const BRONZE       = '#CD7F32';
const MEDAL_COLORS = [GOLD, SILVER, BRONZE];
const MEDAL_EMOJIS = ['🥇', '🥈', '🥉'];
const CROWN        = '👑';

// --------------------------------------------------------------------------
// SINGLE PODIUM ITEM
// --------------------------------------------------------------------------

interface PodiumItemProps {
  entry:     LeaderboardEntry;
  position:  0 | 1 | 2; // 0 = rank1 (center), 1 = rank2 (left), 2 = rank3 (right)
}

const PodiumItem: React.FC<PodiumItemProps> = ({ entry, position }) => {
  const isFirst      = position === 0;
  const avatarSize   = isFirst ? 68 : 54;
  const medalColor   = MEDAL_COLORS[position];
  const platformH    = isFirst ? 64 : position === 1 ? 48 : 40;

  return (
    <View style={[styles.podiumItem, isFirst && styles.podiumItemCenter]}>

      {/* Crown for rank 1 */}
      {isFirst && <Text style={styles.crown}>{CROWN}</Text>}

      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          {
            width:           avatarSize,
            height:          avatarSize,
            borderRadius:    avatarSize / 2,
            borderColor:     medalColor,
            backgroundColor: entry.is_current_user ? PURPLE : '#EDE9FF',
          },
        ]}
      >
        <Text
          style={[
            styles.avatarText,
            {
              fontSize: isFirst ? 26 : 20,
              color:    entry.is_current_user ? '#FFFFFF' : PURPLE,
            },
          ]}
        >
          {entry.display_name.charAt(0).toUpperCase()}
        </Text>
      </View>

      {/* Medal emoji */}
      <Text style={styles.medal}>{MEDAL_EMOJIS[position]}</Text>

      {/* Name */}
      <Text
        style={[styles.name, isFirst && styles.nameFirst]}
        numberOfLines={1}
      >
        {entry.is_current_user ? 'You' : entry.display_name}
      </Text>

      {/* XP */}
      <Text style={styles.xp}>⚡ {entry.xp.toLocaleString()} XP</Text>

      {/* Podium platform */}
      <View
        style={[
          styles.platform,
          {
            height:          platformH,
            backgroundColor: medalColor,
          },
        ]}
      >
        <Text style={styles.platformRank}>#{entry.rank}</Text>
      </View>

    </View>
  );
};

// --------------------------------------------------------------------------
// TOP THREE CARD
// --------------------------------------------------------------------------

const TopThreeCard: React.FC<TopThreeCardProps> = ({ entries }) => {
  // We need rank1, rank2, rank3 — layout order is: rank2 (left), rank1 (center), rank3 (right)
  const rank1 = entries.find(e => e.rank === 1);
  const rank2 = entries.find(e => e.rank === 2);
  const rank3 = entries.find(e => e.rank === 3);

  if (!rank1) return null;

  return (
    <View style={styles.container}>
      {/* Rank 2 — left */}
      {rank2 ? (
        <PodiumItem entry={rank2} position={1} />
      ) : (
        <View style={styles.emptySlot} />
      )}

      {/* Rank 1 — center, elevated */}
      <PodiumItem entry={rank1} position={0} />

      {/* Rank 3 — right */}
      {rank3 ? (
        <PodiumItem entry={rank3} position={2} />
      ) : (
        <View style={styles.emptySlot} />
      )}
    </View>
  );
};

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection:   'row',
    alignItems:      'flex-end',
    justifyContent:  'center',
    paddingTop:      24,
    paddingBottom:   0,
    paddingHorizontal: 8,
    gap:             8,
  },

  // Podium item
  podiumItem: {
    flex:         1,
    alignItems:   'center',
    marginTop:    20,
  },
  podiumItemCenter: {
    marginTop: 0,
  },

  // Crown
  crown: {
    fontSize:     22,
    marginBottom: 2,
  },

  // Avatar
  avatar: {
    justifyContent: 'center',
    alignItems:     'center',
    borderWidth:    3,
    marginBottom:   4,
  },
  avatarText: {
    fontWeight: '700',
  },

  // Medal
  medal: {
    fontSize:     18,
    marginBottom: 4,
  },

  // Name
  name: {
    fontSize:     12,
    fontWeight:   '600',
    color:        '#333333',
    textAlign:    'center',
    marginBottom: 2,
    maxWidth:     90,
  },
  nameFirst: {
    fontSize: 14,
  },

  // XP
  xp: {
    fontSize:     11,
    color:        '#6C63FF',
    fontWeight:   '600',
    marginBottom: 8,
  },

  // Platform block
  platform: {
    width:          '100%',
    borderTopLeftRadius:  8,
    borderTopRightRadius: 8,
    justifyContent: 'center',
    alignItems:     'center',
  },
  platformRank: {
    color:      '#FFFFFF',
    fontWeight: '800',
    fontSize:   16,
    paddingVertical: 6,
  },

  // Empty slot placeholder
  emptySlot: {
    flex: 1,
  },
});

export default TopThreeCard;