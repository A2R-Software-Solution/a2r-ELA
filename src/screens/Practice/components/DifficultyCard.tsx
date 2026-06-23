/**
 * DifficultyCard Component
 * Single difficulty option card (Easy / Medium / Hard)
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Difficulty, DIFFICULTY_CONFIG } from '../types/CreateTestUiState';

// ============================================================================
// PROPS
// ============================================================================

interface DifficultyCardProps {
  difficulty:  Difficulty;
  isSelected:  boolean;
  onPress:     (difficulty: Difficulty) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const DifficultyCard: React.FC<DifficultyCardProps> = ({
  difficulty,
  isSelected,
  onPress,
}) => {
  const config = DIFFICULTY_CONFIG[difficulty];

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { backgroundColor: isSelected ? config.bgColor : '#FFFFFF' },
        isSelected && { borderColor: '#6C4DFF', borderWidth: 2 },
        !isSelected && styles.cardUnselected,
      ]}
      onPress={() => onPress(difficulty)}
      activeOpacity={0.7}
    >
      {/* Checkmark — only when selected */}
      {isSelected && (
        <View style={styles.checkmark}>
          <Text style={styles.checkmarkText}>✓</Text>
        </View>
      )}

      {/* Radio circle — only when not selected */}
      {!isSelected && (
        <View style={styles.radioCircle} />
      )}

      {/* Emoji */}
      <Text style={styles.emoji}>{config.emoji}</Text>

      {/* Label */}
      <Text style={[
        styles.label,
        isSelected && styles.labelSelected,
      ]}>
        {config.label}
      </Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>{config.subtitle}</Text>

    </TouchableOpacity>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    flex:           1,
    alignItems:     'center',
    borderRadius:   16,
    paddingVertical: 16,
    paddingHorizontal: 8,
    position:       'relative',
    shadowColor:    '#000',
    shadowOffset:   { width: 0, height: 2 },
    shadowOpacity:  0.06,
    shadowRadius:   6,
    elevation:      2,
  },
  cardUnselected: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },

  // Checkmark
  checkmark: {
    position:        'absolute',
    top:             8,
    right:           8,
    width:           22,
    height:          22,
    borderRadius:    11,
    backgroundColor: '#6C4DFF',
    justifyContent:  'center',
    alignItems:      'center',
  },
  checkmarkText: {
    color:      '#FFFFFF',
    fontSize:   12,
    fontWeight: '700',
  },

  // Radio
  radioCircle: {
    position:     'absolute',
    top:          8,
    right:        8,
    width:        22,
    height:       22,
    borderRadius: 11,
    borderWidth:  2,
    borderColor:  '#E2E8F0',
  },

  // Content
  emoji: {
    fontSize:     32,
    marginBottom: 8,
  },
  label: {
    fontSize:     15,
    fontWeight:   '700',
    color:        '#475569',
    marginBottom: 4,
  },
  labelSelected: {
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color:    '#94A3B8',
  },
});

export default DifficultyCard;