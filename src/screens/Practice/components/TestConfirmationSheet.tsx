import { styles } from './TestConfirmationSheet.styles';
import { colors } from '../../../theme/colors';
/**
 * TestConfirmationSheet Component
 * Bottom sheet modal shown before starting the test
 */

import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
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
      <ScrollView style={styles.sheetViewport} contentContainerStyle={[
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
            <Text style={[styles.summaryValue, styles.textColor]}>
              {comprehension}
            </Text>
          </View>

          {/* Writing row */}
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Prompt Writing</Text>
            <Text style={[styles.summaryValue, styles.textColor2]}>
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

      </ScrollView>
    </Modal>
  );
};

export default TestConfirmationSheet;
