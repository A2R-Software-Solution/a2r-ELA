import { colors } from '../../../theme/colors';
/**
 * TestConfirmationSheet Component
 * Bottom sheet modal shown before starting the test
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Difficulty, DIFFICULTY_CONFIG } from '../types/CreateTestUiState';

// ============================================================================
// PROPS
// ============================================================================

interface TestConfirmationSheetProps {
  visible:        boolean;
  difficulty:     Difficulty;
  mcq:            number;
  comprehension:  number;
  writing:        number;
  totalQuestions: number;
  estimatedTime:  string;
  xpReward:       number;
  onConfirm:      () => void;
  onEdit:         () => void;
  onClose:        () => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const TestConfirmationSheet: React.FC<TestConfirmationSheetProps> = ({
  visible,
  difficulty,
  mcq,
  comprehension,
  writing,
  totalQuestions,
  estimatedTime,
  xpReward,
  onConfirm,
  onEdit,
  onClose,
}) => {
  const insets = useSafeAreaInsets();
  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      {/* Overlay */}
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      />

      {/* Sheet */}
      <View style={[
        styles.sheet,
        { paddingBottom: Math.max(insets.bottom, 24) },
      ]}>

        {/* Handle */}
        <View style={styles.handle} />

        {/* Title */}
        <Text style={styles.title}>🎯 Your Test is Ready</Text>
        <Text style={styles.subtitle}>Review your test configuration</Text>

        {/* Summary card */}
        <View style={styles.summaryCard}>

          {/* Difficulty row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Difficulty</Text>
            <View style={styles.difficultyPill}>
              <View style={[
                styles.difficultyDot,
                { backgroundColor: config.color },
              ]} />
              <Text style={[styles.difficultyText, { color: config.color }]}>
                {config.label}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* MCQ row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>MCQ Questions</Text>
            <Text style={[styles.summaryValue, { color: colors.primary }]}>
              {mcq}
            </Text>
          </View>

          {/* Comprehension row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Reading Comprehension</Text>
            <Text style={[styles.summaryValue, { color: '#3B82F6' }]}>
              {comprehension}
            </Text>
          </View>

          {/* Writing row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Prompt Writing</Text>
            <Text style={[styles.summaryValue, { color: '#22C55E' }]}>
              {writing}
            </Text>
          </View>

          <View style={styles.divider} />

          {/* Total row */}
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Total Questions</Text>
            <Text style={styles.totalValue}>{totalQuestions}</Text>
          </View>

        </View>

        {/* Time + XP row */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⏱️</Text>
            <View>
              <Text style={styles.metaValue}>{estimatedTime}</Text>
              <Text style={styles.metaLabel}>Estimated Time</Text>
            </View>
          </View>

          <View style={styles.metaDivider} />

          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>⭐</Text>
            <View>
              <Text style={[styles.metaValue, { color: colors.primary }]}>
                +{xpReward} XP
              </Text>
              <Text style={styles.metaLabel}>Potential Reward</Text>
            </View>
          </View>
        </View>

        {/* Buttons */}
        <View style={styles.btnRow}>

          {/* Edit button */}
          <TouchableOpacity
            style={styles.editBtn}
            onPress={onEdit}
            activeOpacity={0.7}
          >
            <Text style={styles.editBtnText}>Edit Test</Text>
          </TouchableOpacity>

          {/* Start Now button */}
          <TouchableOpacity
            style={styles.startBtn}
            onPress={onConfirm}
            activeOpacity={0.85}
          >
            <Text style={styles.startBtnText}>Start Now 🚀</Text>
          </TouchableOpacity>

        </View>

      </View>
    </Modal>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  overlay: {
    flex:            1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius:24,
    paddingHorizontal:   20,
    paddingTop:          12,
  },

  // Handle
  handle: {
    width:           40,
    height:          4,
    borderRadius:    2,
    backgroundColor: colors.border,
    alignSelf:       'center',
    marginBottom:    16,
  },

  // Title
  title: {
    fontSize:     22,
    fontWeight:   '800',
    color:        colors.text,
    textAlign:    'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize:     13,
    color:        colors.subtle,
    textAlign:    'center',
    marginBottom: 20,
  },

  // Summary card
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius:    16,
    padding:         16,
    marginBottom:    14,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  summaryRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color:    colors.muted,
  },
  summaryValue: {
    fontSize:   15,
    fontWeight: '700',
  },
  totalLabel: {
    fontSize:   15,
    fontWeight: '700',
    color:      colors.text,
  },
  totalValue: {
    fontSize:   18,
    fontWeight: '800',
    color:      colors.text,
  },
  divider: {
    height:          1,
    backgroundColor: colors.border,
    marginVertical:  4,
  },

  // Difficulty pill
  difficultyPill: {
    flexDirection:     'row',
    alignItems:        'center',
    gap:               6,
    backgroundColor: colors.surface,
    paddingHorizontal: 10,
    paddingVertical:   4,
    borderRadius:      20,
    borderWidth:       1,
    borderColor:       colors.border,
  },
  difficultyDot: {
    width:        8,
    height:       8,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize:   13,
    fontWeight: '700',
  },

  // Meta row
  metaRow: {
    flexDirection:   'row',
    alignItems:      'center',
    backgroundColor: colors.surface,
    borderRadius:    14,
    padding:         14,
    marginBottom:    16,
    borderWidth:     1,
    borderColor:     colors.border,
  },
  metaItem: {
    flex:          1,
    flexDirection: 'row',
    alignItems:    'center',
    gap:           10,
  },
  metaIcon: {
    fontSize: 24,
  },
  metaValue: {
    fontSize:   15,
    fontWeight: '800',
    color:      colors.text,
  },
  metaLabel: {
    fontSize:  11,
    color:     colors.subtle,
    marginTop: 2,
  },
  metaDivider: {
    width:           1,
    height:          40,
    backgroundColor: colors.border,
    marginHorizontal: 8,
  },

  // Buttons
  btnRow: {
    flexDirection: 'row',
    gap:           10,
  },
  editBtn: {
    flex:            1,
    paddingVertical: 14,
    borderRadius:    14,
    alignItems:      'center',
    borderWidth:     1.5,
    borderColor:     colors.primary,
  },
  editBtnText: {
    fontSize:   15,
    fontWeight: '700',
    color:      colors.primary,
  },
  startBtn: {
    flex:            2,
    paddingVertical: 14,
    borderRadius:    14,
    alignItems:      'center',
    backgroundColor: colors.primary,
    shadowColor:     colors.primary,
    shadowOffset:    { width: 0, height: 4 },
    shadowOpacity:   0.3,
    shadowRadius:    8,
    elevation:       4,
  },
  startBtnText: {
    fontSize:   15,
    fontWeight: '800',
    color:      '#FFFFFF',
  },
});

export default TestConfirmationSheet;