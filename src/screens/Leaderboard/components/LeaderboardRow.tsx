import { styles } from './LeaderboardRow.styles';
/**
 * LeaderboardRow Component
 * Displays a single leaderboard entry for ranks 4 and beyond.
 * Current user's row is highlighted in light purple.
 */

import React from 'react';
import { View, Text, Image } from 'react-native';
import { LeaderboardEntry } from '../../../models/LeaderboardModels';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface LeaderboardRowProps {
  entry: LeaderboardEntry;
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const LeaderboardRow: React.FC<LeaderboardRowProps> = ({ entry }) => {
  const isCurrentUser = entry.is_current_user;

  return (
    <View
      style={[
        styles.container,
        isCurrentUser && styles.containerHighlighted,
      ]}
    >
      {/* Rank number */}
      <View style={styles.rankContainer}>
        <Text
          style={[
            styles.rank,
            isCurrentUser && styles.rankHighlighted,
          ]}
        >
          {entry.rank}
        </Text>
      </View>

      {/* Avatar */}
      <View
        style={[
          styles.avatar,
          isCurrentUser && styles.avatarHighlighted,
        ]}
      >
        {entry.photo_url ? (
          <Image
            source={{ uri: entry.photo_url }}
            style={styles.avatarImage}
            resizeMode="cover"
          />
        ) : (
          <Text
            style={[
              styles.avatarText,
              isCurrentUser && styles.avatarTextHighlighted,
            ]}
          >
            {entry.display_name.charAt(0).toUpperCase()}
          </Text>
        )}
      </View>

      {/* Name + level */}
      <View style={styles.nameContainer}>
        <Text
          style={[
            styles.name,
            isCurrentUser && styles.nameHighlighted,
          ]}
          numberOfLines={1}
        >
          {isCurrentUser ? 'You' : entry.display_name}
        </Text>
        <Text style={styles.levelName} numberOfLines={1}>
          {entry.level_name}
        </Text>
      </View>

      {/* Right side — XP + essays + avg score */}
      <View style={styles.rightContainer}>
        <View style={styles.xpBadge}>
          <Text
            style={[
              styles.xp,
              isCurrentUser && styles.xpHighlighted,
            ]}
          >
            ⚡ {entry.xp.toLocaleString()}
          </Text>
        </View>
        <Text style={styles.essays}>
          {entry.essay_count} {entry.essay_count === 1 ? 'essay' : 'essays'}
        </Text>
        <Text style={styles.scoreText}>
          Avg {entry.avg_score}%
        </Text>
      </View>
    </View>
  );
};

export default LeaderboardRow;
