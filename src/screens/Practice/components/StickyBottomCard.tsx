import { styles } from './StickyBottomCard.styles';

/**
 * StickyBottomCard Component
 * Fixed bottom card showing test summary + Start Test button
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// ============================================================================
// PROPS
// ============================================================================

interface StickyBottomCardProps {
  totalQuestions:   number;
  estimatedTime:    string;
  xpReward:         number;
  onStartTest:      () => void;
  disabled?:        boolean;
}

// ============================================================================
// COMPONENT
// ============================================================================

const StickyBottomCard: React.FC<StickyBottomCardProps> = ({
  totalQuestions,
  estimatedTime,
  xpReward,
  onStartTest,
  disabled = false,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[
      styles.container,
      { paddingBottom: Math.max(insets.bottom, 16) },
    ]}>

      {/* Stats row */}
      <View style={styles.statsRow}>

        {/* Total Questions */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{totalQuestions}</Text>
          <Text style={styles.statLabel}>Questions</Text>
        </View>

        <View style={styles.statDivider} />

        {/* Estimated Time */}
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{estimatedTime}</Text>
          <Text style={styles.statLabel}>Est. Time</Text>
        </View>

        <View style={styles.statDivider} />

        {/* XP Reward */}
        <View style={styles.statItem}>
          <Text style={[styles.statValue, styles.xpValue]}>+{xpReward}</Text>
          <Text style={styles.statLabel}>XP Reward</Text>
        </View>

      </View>

      {/* Start Test Button */}
      <TouchableOpacity
        style={[
          styles.startBtn,
          disabled && styles.startBtnDisabled,
        ]}
        onPress={onStartTest}
        activeOpacity={0.85}
        disabled={disabled}
      >
        <Text style={styles.startBtnText}>
          Start Test 🚀
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default StickyBottomCard;
