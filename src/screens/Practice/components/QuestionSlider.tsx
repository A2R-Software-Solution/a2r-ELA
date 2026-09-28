import { styles } from './QuestionSlider.styles';
import { colors } from '../../../theme/colors';
/**
 * QuestionSlider Component
 * Slider with +/- stepper buttons for question count selection
 */

import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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

export default QuestionSlider;
