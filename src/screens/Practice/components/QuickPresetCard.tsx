import { styles } from './QuickPresetCard.styles';
import { colors } from '../../../theme/colors';
/**
 * QuickPresetCard Component
 * Preset test configuration card
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { QuickPreset } from '../types/CreateTestUiState';

// ============================================================================
// PROPS
// ============================================================================

interface QuickPresetCardProps {
  preset:   QuickPreset;
  onPress:  (preset: QuickPreset) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const QuickPresetCard: React.FC<QuickPresetCardProps> = ({
  preset,
  onPress,
}) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(preset)}
    activeOpacity={0.7}
  >

    {/* Top row — emoji + title + recommended badge */}
    <View style={styles.topRow}>
      <Text style={styles.emoji}>{preset.emoji}</Text>
      <View style={styles.titleWrap}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{preset.title}</Text>
          {preset.isRecommended && (
            <View style={styles.recommendedBadge}>
              <Text style={styles.recommendedText}>Recommended</Text>
            </View>
          )}
        </View>
        <Text style={styles.description}>{preset.description}</Text>
      </View>
    </View>

    {/* Question counts row */}
    <View style={styles.countsRow}>
      <CountChip value={preset.mcq}           label="MCQ"           color={colors.primary} />
      <Text style={styles.plus}>+</Text>
      <CountChip value={preset.comprehension} label="Comprehension" color="#3B82F6" />
      <Text style={styles.plus}>+</Text>
      <CountChip value={preset.writing}       label="Writing"       color="#22C55E" />
    </View>

  </TouchableOpacity>
);

// ============================================================================
// COUNT CHIP
// ============================================================================

interface CountChipProps {
  value: number;
  label: string;
  color: string;
}

const CountChip: React.FC<CountChipProps> = ({ value, label, color }) => (
  <View style={styles.chip}>
    <Text style={[styles.chipValue, { color }]}>{value}</Text>
    <Text style={styles.chipLabel}>{label}</Text>
  </View>
);

export default QuickPresetCard;
