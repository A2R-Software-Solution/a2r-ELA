/**
 * QuickPresetCard Component
 * Preset test configuration card
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
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
      <CountChip value={preset.mcq}           label="MCQ"           color="#6C4DFF" />
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

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius:    14,
    borderWidth:     1,
    borderColor:     '#E2E8F0',
    padding:         14,
    shadowColor:     '#000',
    shadowOffset:    { width: 0, height: 2 },
    shadowOpacity:   0.05,
    shadowRadius:    6,
    elevation:       2,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           10,
    marginBottom:  12,
  },
  emoji: {
    fontSize:  24,
    marginTop: 2,
  },
  titleWrap: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
    flexWrap:      'wrap',
    marginBottom:  3,
  },
  title: {
    fontSize:   14,
    fontWeight: '700',
    color:      '#0F172A',
  },
  description: {
    fontSize: 12,
    color:    '#94A3B8',
  },

  // Recommended badge
  recommendedBadge: {
    backgroundColor:   '#EDE9FF',
    paddingHorizontal: 8,
    paddingVertical:   2,
    borderRadius:      20,
  },
  recommendedText: {
    fontSize:   10,
    fontWeight: '700',
    color:      '#6C4DFF',
  },

  // Counts row
  countsRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  plus: {
    fontSize:   13,
    color:      '#CBD5E1',
    fontWeight: '600',
  },

  // Count chip
  chip: {
    alignItems: 'center',
    flex:       1,
  },
  chipValue: {
    fontSize:   16,
    fontWeight: '800',
  },
  chipLabel: {
    fontSize:  10,
    color:     '#94A3B8',
    marginTop: 2,
  },
});

export default QuickPresetCard;