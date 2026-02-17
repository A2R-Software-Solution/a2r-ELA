/**
 * InputToolbar Component
 * Bottom toolbar containing file upload and send buttons
 */

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { FileUploadButton } from './FileUploadButton';
import { CompactSendButton } from './CompactSendButton';
import { DocumentPickerResponse } from 'react-native-document-picker';

interface InputToolbarProps {
  // File upload props
  onFileSelected: (file: DocumentPickerResponse) => void;
  canUploadFiles: boolean;
  isFileExtracting: boolean;

  // Send props
  onSend: () => void;
  canSend: boolean;
  isSending: boolean;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  onFileSelected,
  canUploadFiles,
  isFileExtracting,
  onSend,
  canSend,
  isSending,
}) => {
  return (
    <View style={styles.container}>
      {/* Left side - File upload button */}
      <View style={styles.leftSection}>
        <FileUploadButton
          onFileSelected={onFileSelected}
          disabled={!canUploadFiles}
          isLoading={isFileExtracting}
          color="#007AFF"
          size={24}
        />
      </View>

      {/* Right side - Send button */}
      <View style={styles.rightSection}>
        <CompactSendButton
          onPress={onSend}
          disabled={!canSend}
          isLoading={isSending}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
