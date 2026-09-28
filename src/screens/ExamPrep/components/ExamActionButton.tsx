import { styles, PURPLE, TEXT_WHITE } from './ExamActionButton.styles';
/**
 * ExamActionButton Component
 * Primary call-to-action button for the Exam Prep screen.
 * Supports a filled (primary) and outline (secondary) variant.
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';

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

export default ExamActionButton;
