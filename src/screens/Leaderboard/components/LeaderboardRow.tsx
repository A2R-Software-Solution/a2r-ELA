/**
 * LeaderboardRow Component
 * Displays a single leaderboard entry for ranks 4 and beyond.
 * Current user's row is highlighted in light purple.
 */

import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
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

const PURPLE = '#6C63FF';

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

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    flexDirection:     'row',
    alignItems:        'center',
    paddingVertical:   14,
    paddingHorizontal: 16,
    marginHorizontal:  16,
    marginVertical:    4,
    backgroundColor:   '#FFFFFF',
    borderRadius:      12,
    shadowColor:       '#000',
    shadowOffset:      { width: 0, height: 1 },
    shadowOpacity:     0.06,
    shadowRadius:      3,
    elevation:         1,
  },
  containerHighlighted: {
    backgroundColor: '#F4F2FF',
    borderWidth:     1.5,
    borderColor:     PURPLE,
    shadowColor:     PURPLE,
    shadowOpacity:   0.15,
    elevation:       3,
  },

  // Rank
  rankContainer: {
    width:       32,
    alignItems:  'center',
    marginRight: 8,
  },
  rank: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#BDBDBD',
  },
  rankHighlighted: {
    color: PURPLE,
  },

  // Avatar
  avatar: {
    width:           48,
    height:          48,
    borderRadius:    24,
    backgroundColor: '#F4F3FF',
    justifyContent:  'center',
    alignItems:      'center',
    marginRight:     12,
  },
  avatarHighlighted: {
    backgroundColor: PURPLE,
  },
  avatarImage: {
    width:        '100%',
    height:       '100%',
    borderRadius: 24,
  },
  avatarText: {
    fontSize:   16,
    fontWeight: '700',
    color:      PURPLE,
  },
  avatarTextHighlighted: {
    color: '#FFFFFF',
  },

  // Name + level
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize:   14,
    fontWeight: '600',
    color:      '#212121',
  },
  nameHighlighted: {
    color: PURPLE,
  },
  levelName: {
    fontSize:  12,
    color:     '#9E9E9E',
    marginTop: 2,
  },

  // Right side
  rightContainer: {
    alignItems: 'flex-end',
  },
  xpBadge: {
    backgroundColor:   '#F4F3FF',
    paddingHorizontal: 8,
    paddingVertical:   4,
    borderRadius:      999,
  },
  xp: {
    fontSize:   13,
    fontWeight: '700',
    color:      '#424242',
  },
  xpHighlighted: {
    color: PURPLE,
  },
  essays: {
    fontSize:  11,
    color:     '#9E9E9E',
    marginTop: 2,
  },
  scoreText: {
    fontSize:  11,
    color:     '#9E9E9E',
    marginTop: 2,
  },
});

export default LeaderboardRow;