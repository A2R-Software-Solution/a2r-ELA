import { styles } from './StreakCard.styles';
/**
 * Streak Card — REDESIGNED
 * Deep purple/indigo gradient, glow shadow, glassmorphism XP pill
 */

import React from 'react';
import { View, Text } from 'react-native';
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
        colors={['rgba(255,255,255,0.17)', 'rgba(175,222,230,0.08)', 'rgba(255,255,255,0.04)']}
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

export default StreakCard;
