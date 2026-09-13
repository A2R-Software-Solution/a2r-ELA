import { colors } from '../../../theme/colors';
/**
 * StickyBottomCard Component
 * Fixed bottom card showing test summary + Start Test button
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderTopWidth:  1,
    borderTopColor:  colors.border,
    paddingTop:      14,
    paddingHorizontal: 16,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: -3 },
    shadowOpacity:   0.08,
    shadowRadius:    8,
    elevation:       8,
  },

  // Stats row
  statsRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   14,
  },
  statItem: {
    flex:       1,
    alignItems: 'center',
  },
  statValue: {
    fontSize:   16,
    fontWeight: '800',
    color:      colors.text,
  },
  xpValue: {
    color: colors.primary,
  },
  statLabel: {
    fontSize:  11,
    color:     colors.subtle,
    marginTop: 2,
  },
  statDivider: {
    width:           1,
    height:          32,
    backgroundColor: colors.border,
  },

  // Start button
  startBtn: {
    backgroundColor: colors.primary,
    borderRadius:    16,
    paddingVertical: 16,
    alignItems:      'center',
    shadowColor:     colors.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    8,
    elevation:       4,
  },
  startBtnDisabled: {
    backgroundColor: colors.surfaceRaised,
    shadowOpacity:   0,
    elevation:       0,
  },
  startBtnText: {
    color:      '#FFFFFF',
    fontSize:   17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});

export default StickyBottomCard;