/**
 * Streak Card — REDESIGNED
 * Deep purple/indigo gradient, glow shadow, glassmorphism XP pill
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  getXpProgressPercent,
  getLevelUpMessage,
  getPrestigeBadge,
} from '../../../models/GamificationModels';

interface StreakCardProps {
  xp: number;
  level: number;
  levelName: string;
  isLoadingXp?: boolean;
}

const StreakCard: React.FC<StreakCardProps> = ({
  xp,
  level,
  levelName,
  isLoadingXp = false,
}) => {
  const progressPercent = getXpProgressPercent(xp, level);
  const message = getLevelUpMessage(level);
  const prestigeBadge = getPrestigeBadge(level);

  if (isLoadingXp) {
    return <View style={styles.skeleton} />;
  }

  return (
    <View style={styles.outerGlow}>
      <LinearGradient
        colors={['#3B28CC', '#5B3FE8', '#7C5CFC']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Decorative glow blob top-right */}
        <View style={styles.glowBlob} />

        {/* Top row */}
        <View style={styles.topRow}>
          <View style={styles.levelRow}>
            <Text style={styles.crown}>{prestigeBadge ?? '👑'}</Text>
            <Text style={styles.levelText}>Level {level}</Text>
            <Text style={styles.dot}> · </Text>
            <Text style={styles.levelName}>{levelName}</Text>
          </View>

          {/* XP pill */}
          <View style={styles.xpPill}>
            <Text style={styles.xpPillText}>⭐ {xp.toLocaleString()} XP</Text>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View style={[styles.progressFill, { width: `${progressPercent}%` as any }]}>
            <View style={styles.progressShine} />
            {/* Glow tip */}
            <View style={styles.progressTip} />
          </View>
        </View>

        {/* Bottom row */}
        <View style={styles.bottomRow}>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.percentPill}>
            <Text style={styles.percent}>{progressPercent}%</Text>
          </View>
        </View>

      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  outerGlow: {
    marginHorizontal: 16,
    marginVertical:   10,
    borderRadius:     22,
    // Glow shadow
    shadowColor:   '#7C5CFC',
    shadowOffset:  { width: 0, height: 8 },
    shadowOpacity: 0.55,
    shadowRadius:  18,
    elevation:     14,
  },
  card: {
    borderRadius: 22,
    padding:      20,
    overflow:     'hidden',
    borderWidth:  1,
    borderColor:  'rgba(255,255,255,0.12)',
  },

  // Decorative glow
  glowBlob: {
    position:        'absolute',
    top:             -30,
    right:           -30,
    width:           120,
    height:          120,
    borderRadius:    60,
    backgroundColor: 'rgba(255,255,255,0.06)',
  },

  // Skeleton
  skeleton: {
    marginHorizontal: 16,
    marginVertical:   10,
    borderRadius:     22,
    height:           110,
    backgroundColor:  '#1E1B3A',
  },

  // Top row
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   16,
  },
  levelRow: {
    flexDirection: 'row',
    alignItems:    'center',
  },
  crown: {
    fontSize:    20,
    marginRight: 6,
  },
  levelText: {
    fontSize:   16,
    fontWeight: '700',
    color:      '#FFFFFF',
  },
  dot: {
    fontSize: 16,
    color:    'rgba(255,255,255,0.35)',
  },
  levelName: {
    fontSize:   15,
    fontWeight: '600',
    color:      'rgba(255,255,255,0.85)',
  },

  // XP Pill
  xpPill: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical:   5,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       'rgba(255,255,255,0.20)',
  },
  xpPillText: {
    fontSize:   12,
    fontWeight: '700',
    color:      '#FFFFFF',
  },

  // Progress bar
  progressBg: {
    width:           '100%',
    height:          10,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius:    6,
    overflow:        'hidden',
    marginBottom:    10,
  },
  progressFill: {
    height:          '100%',
    backgroundColor: '#FBBF24',
    borderRadius:    6,
    overflow:        'visible',
    position:        'relative',
  },
  progressShine: {
    position:        'absolute',
    top:             0,
    left:            0,
    right:           0,
    height:          '50%',
    backgroundColor: 'rgba(255,255,255,0.35)',
    borderRadius:    6,
  },
  progressTip: {
    position:        'absolute',
    right:           -2,
    top:             -2,
    width:           14,
    height:          14,
    borderRadius:    7,
    backgroundColor: '#FBBF24',
    shadowColor:     '#FBBF24',
    shadowOffset:    { width: 0, height: 0 },
    shadowOpacity:   0.9,
    shadowRadius:    6,
    elevation:       4,
  },

  // Bottom row
  bottomRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
  },
  message: {
    fontSize:   12,
    color:      'rgba(255,255,255,0.70)',
    flex:       1,
    marginRight: 8,
    lineHeight: 17,
  },
  percentPill: {
    backgroundColor: 'rgba(251,191,36,0.18)',
    paddingHorizontal: 8,
    paddingVertical:   3,
    borderRadius:      10,
    borderWidth:       1,
    borderColor:       'rgba(251,191,36,0.35)',
  },
  percent: {
    fontSize:   12,
    fontWeight: '700',
    color:      '#FBBF24',
  },
});

export default StreakCard;