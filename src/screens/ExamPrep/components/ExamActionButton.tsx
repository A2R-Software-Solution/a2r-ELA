/**
 * ExamActionButton Component
 * Primary call-to-action button for the Exam Prep screen.
 * Supports a filled (primary) and outline (secondary) variant.
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';

// --------------------------------------------------------------------------
// PROPS
// --------------------------------------------------------------------------

interface ExamActionButtonProps {
  label:      string;
  onPress:    () => void;
  variant?:   'primary' | 'secondary'; // default: primary
  icon?:      string;                  // optional emoji/icon prefix
  isLoading?: boolean;
  disabled?:  boolean;
}

// --------------------------------------------------------------------------
// CONSTANTS
// --------------------------------------------------------------------------

const PURPLE        = '#6C4DFF';
const PURPLE_LIGHT  = '#EDE9FF';
const PURPLE_DARK   = '#5438E8';
const TEXT_WHITE    = '#FFFFFF';
const TEXT_PURPLE   = '#6C4DFF';
const DISABLED_BG   = '#E2E8F0';
const DISABLED_TEXT = '#94A3B8';

// --------------------------------------------------------------------------
// COMPONENT
// --------------------------------------------------------------------------

const ExamActionButton: React.FC<ExamActionButtonProps> = ({
  label,
  onPress,
  variant   = 'primary',
  icon,
  isLoading = false,
  disabled  = false,
}) => {
  const isPrimary   = variant === 'primary';
  const isDisabled  = disabled || isLoading;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        isPrimary  ? styles.primaryButton  : styles.secondaryButton,
        isDisabled && styles.disabledButton,
      ]}
      onPress={onPress}
      activeOpacity={0.8}
      disabled={isDisabled}
    >
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={isPrimary ? TEXT_WHITE : PURPLE}
        />
      ) : (
        <View style={styles.content}>
          {icon ? (
            <Text style={styles.icon}>{icon}</Text>
          ) : null}
          <Text
            style={[
              styles.label,
              isPrimary  ? styles.primaryLabel  : styles.secondaryLabel,
              isDisabled && styles.disabledLabel,
            ]}
          >
            {label}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

// --------------------------------------------------------------------------
// STYLES
// --------------------------------------------------------------------------

const styles = StyleSheet.create({
  button: {
    flex:              1,
    height:            48,
    borderRadius:      12,
    justifyContent:    'center',
    alignItems:        'center',
    paddingHorizontal: 20,
  },

  // Variants
  primaryButton: {
    backgroundColor: PURPLE,
  },
  secondaryButton: {
    backgroundColor: PURPLE_LIGHT,
    borderWidth:     1.5,
    borderColor:     PURPLE,
  },
  disabledButton: {
    backgroundColor: DISABLED_BG,
    borderColor:     DISABLED_BG,
  },

  // Content row
  content: {
    flexDirection: 'row',
    alignItems:    'center',
    gap:           6,
  },
  icon: {
    fontSize: 16,
  },

  // Labels
  label: {
    fontSize:   15,
    fontWeight: '700',
  },
  primaryLabel: {
    color: TEXT_WHITE,
  },
  secondaryLabel: {
    color: TEXT_PURPLE,
  },
  disabledLabel: {
    color: DISABLED_TEXT,
  },
});

export default ExamActionButton;