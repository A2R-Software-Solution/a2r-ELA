/**
 * InputToolbar Component
 * Bottom toolbar containing the file upload button
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { FileUploadButton } from './FileUploadButton';
import { DocumentPickerResponse } from '@react-native-documents/picker';

interface InputToolbarProps {
  // File upload props
  onFileSelected: (file: DocumentPickerResponse) => void;
  canUploadFiles: boolean;
  isFileExtracting: boolean;
}

export const InputToolbar: React.FC<InputToolbarProps> = ({
  onFileSelected,
  canUploadFiles,
  isFileExtracting,
}) => {
  return (
    <View style={styles.container}>
      <FileUploadButton
        onFileSelected={onFileSelected}
        disabled={!canUploadFiles}
        isLoading={isFileExtracting}
        color="#007AFF"
        size={24}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});