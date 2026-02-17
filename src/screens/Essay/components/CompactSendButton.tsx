/**
 * CompactSendButton Component
 * Compact send button with up arrow icon (like the screenshot)
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  View,
} from 'react-native';

interface CompactSendButtonProps {
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export const CompactSendButton: React.FC<CompactSendButtonProps> = ({
  onPress,
  disabled = false,
  isLoading = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>↑</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FF6B35', // Orange color like in screenshot
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 22,
    fontWeight: '600',
    color: '#FFFFFF',
    lineHeight: 22,
  },
});
