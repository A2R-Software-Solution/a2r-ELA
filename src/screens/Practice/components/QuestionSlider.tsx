import { colors } from '../../../theme/colors';
/**
 * QuestionSlider Component
 * Slider with +/- stepper buttons for question count selection
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Slider from '@react-native-community/slider';

// ============================================================================
// PROPS
// ============================================================================

interface QuestionSliderProps {
  label:      string;
  emoji:      string;
  value:      number;
  color:      string;
  max?:       number;
  onChange:   (value: number) => void;
}

// ============================================================================
// COMPONENT
// ============================================================================

const QuestionSlider: React.FC<QuestionSliderProps> = ({
  label,
  emoji,
  value,
  color,
  max   = 30,
  onChange,
}) => {
  const handleDecrement = () => {
    if (value > 0) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < max) onChange(value + 1);
  };

  return (
    <View style={styles.container}>

      {/* Top row — icon + label + count box */}
      <View style={styles.topRow}>
        <View style={styles.labelRow}>
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>

        {/* Stepper + count */}
        <View style={styles.stepper}>
          <TouchableOpacity
            style={[styles.stepBtn, value <= 0 && styles.stepBtnDisabled]}
            onPress={handleDecrement}
            activeOpacity={0.7}
            disabled={value <= 0}
          >
            <Text style={[styles.stepBtnText, value <= 0 && styles.stepBtnTextDisabled]}>
              −
            </Text>
          </TouchableOpacity>

          <View style={[styles.countBox, { borderColor: color }]}>
            <Text style={[styles.countText, { color }]}>{value}</Text>
          </View>

          <TouchableOpacity
            style={[styles.stepBtn, value >= max && styles.stepBtnDisabled]}
            onPress={handleIncrement}
            activeOpacity={0.7}
            disabled={value >= max}
          >
            <Text style={[styles.stepBtnText, value >= max && styles.stepBtnTextDisabled]}>
              +
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Slider */}
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={max}
        step={1}
        value={value}
        onValueChange={onChange}
        minimumTrackTintColor={color}
        maximumTrackTintColor={colors.border}
        thumbTintColor={color}
      />

      {/* Min / max labels */}
      <View style={styles.rangeRow}>
        <Text style={styles.rangeText}>0</Text>
        <Text style={styles.rangeTextMid}>
          {value} / {max}
        </Text>
        <Text style={styles.rangeText}>{max}</Text>
      </View>

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  // Top row
  topRow: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   4,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           8,
  },
  emoji: {
    fontSize: 18,
  },
  label: {
    fontSize:   15,
    fontWeight: '700',
    color:      colors.text,
  },

  // Stepper
  stepper: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  stepBtn: {
    width:           28,
    height:          28,
    borderRadius:    8,
    backgroundColor: colors.surfaceRaised,
    justifyContent:  'center',
    alignItems:      'center',
  },
  stepBtnDisabled: {
    backgroundColor: colors.surface,
  },
  stepBtnText: {
    fontSize:   18,
    fontWeight: '600',
    color:      colors.muted,
    lineHeight: 22,
  },
  stepBtnTextDisabled: {
    color: colors.border,
  },
  countBox: {
    width:          44,
    height:         32,
    borderRadius:   8,
    borderWidth:    1.5,
    justifyContent: 'center',
    alignItems:     'center',
    backgroundColor: colors.surface,
  },
  countText: {
    fontSize:   15,
    fontWeight: '800',
  },

  // Slider
  slider: {
    width:  '100%',
    height: 36,
  },

  // Range row
  rangeRow: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginTop:      -4,
  },
  rangeText: {
    fontSize: 11,
    color:    colors.subtle,
  },
  rangeTextMid: {
    fontSize:   11,
    color:      colors.subtle,
    fontWeight: '500',
  },
});

export default QuestionSlider;