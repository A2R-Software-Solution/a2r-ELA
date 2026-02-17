/**
 * FileUploadButton Component
 * Button to trigger file picker for PDF uploads
 */

import React from 'react';
import {
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
} from 'react-native';
import DocumentPicker, {
  DocumentPickerResponse,
  types,
} from 'react-native-document-picker';

interface FileUploadButtonProps {
  onFileSelected: (file: DocumentPickerResponse) => void;
  disabled?: boolean;
  isLoading?: boolean;
  color?: string;
  size?: number;
}

export const FileUploadButton: React.FC<FileUploadButtonProps> = ({
  onFileSelected,
  disabled = false,
  isLoading = false,
  color = '#007AFF',
  size = 24,
}) => {
  const handlePress = async () => {
    try {
      const result = await DocumentPicker.pick({
        type: [types.pdf],
        allowMultiSelection: false,
        copyTo: 'cachesDirectory', // Copy to cache for processing
      });

      if (result && result.length > 0) {
        onFileSelected(result[0]);
      }
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker
        console.log('User cancelled file picker');
      } else {
        console.error('Error picking document:', err);
      }
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={handlePress}
      disabled={disabled || isLoading}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator size="small" color={color} />
      ) : (
        <Text
          style={[
            styles.icon,
            { color: disabled ? '#CCCCCC' : color, fontSize: size },
          ]}
        >
          📎
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  icon: {
    fontWeight: '400',
  },
});
