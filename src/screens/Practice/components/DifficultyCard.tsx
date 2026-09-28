import { styles } from './DifficultyCard.styles';
import { colors } from '../../../theme/colors';
/**
 * DifficultyCard Component
 * Single difficulty option card (Easy / Medium / Hard)
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
        { backgroundColor: isSelected ? config.bgColor : colors.surface },
        isSelected && { borderColor: colors.primary, borderWidth: 2 },
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

export default DifficultyCard;
