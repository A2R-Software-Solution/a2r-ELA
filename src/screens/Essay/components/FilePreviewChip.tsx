/**
 * FilePreviewChip Component
 * Displays uploaded file as a chip with name and remove button
 */

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { FileInfo, FileUploadStatus } from '../../../models/FileModels';

interface FilePreviewChipProps {
  file: FileInfo;
  onRemove: (fileId: string) => void;
}

export const FilePreviewChip: React.FC<FilePreviewChipProps> = ({
  file,
  onRemove,
}) => {
  const getStatusColor = () => {
    switch (file.uploadStatus) {
      case FileUploadStatus.SUCCESS:
        return '#4CAF50';
      case FileUploadStatus.FAILED:
        return '#F44336';
      case FileUploadStatus.EXTRACTING:
      case FileUploadStatus.UPLOADING:
        return '#FF9800';
      default:
        return '#757575';
    }
  };

  const getStatusIcon = () => {
    switch (file.uploadStatus) {
      case FileUploadStatus.SUCCESS:
        return '✓';
      case FileUploadStatus.FAILED:
        return '✕';
      default:
        return '';
    }
  };

  const isProcessing =
    file.uploadStatus === FileUploadStatus.UPLOADING ||
    file.uploadStatus === FileUploadStatus.EXTRACTING;

  const truncateFileName = (name: string, maxLength: number = 25) => {
    if (name.length <= maxLength) return name;
    const extension = name.split('.').pop();
    const nameWithoutExt = name.substring(0, name.lastIndexOf('.'));
    const truncated = nameWithoutExt.substring(
      0,
      maxLength - 4 - (extension?.length || 0),
    );
    return `${truncated}...${extension}`;
  };

  return (
    <View style={[styles.container, { borderColor: getStatusColor() }]}>
      {/* File Icon */}
      <View
        style={[styles.iconContainer, { backgroundColor: getStatusColor() }]}
      >
        {isProcessing ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.iconText}>
            {file.uploadStatus === FileUploadStatus.SUCCESS
              ? '📄'
              : getStatusIcon()}
          </Text>
        )}
      </View>

      {/* File Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.fileName} numberOfLines={1}>
          {truncateFileName(file.name)}
        </Text>
        <View style={styles.metaContainer}>
          <Text style={styles.fileSize}>
            {(file.size / 1024).toFixed(1)} KB
          </Text>
          {file.uploadStatus === FileUploadStatus.EXTRACTING && (
            <Text style={styles.statusText}>Extracting text...</Text>
          )}
          {file.uploadStatus === FileUploadStatus.UPLOADING && (
            <Text style={styles.statusText}>Uploading...</Text>
          )}
          {file.uploadStatus === FileUploadStatus.FAILED && (
            <Text style={[styles.statusText, styles.errorText]}>
              {file.errorMessage || 'Failed'}
            </Text>
          )}
        </View>
      </View>

      {/* Remove Button */}
      {!isProcessing && (
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => onRemove(file.id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.removeIcon}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    padding: 8,
    marginVertical: 4,
    marginHorizontal: 8,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  iconText: {
    fontSize: 18,
  },
  infoContainer: {
    flex: 1,
    marginRight: 8,
  },
  fileName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 2,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  fileSize: {
    fontSize: 12,
    color: '#757575',
  },
  statusText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 8,
    fontStyle: 'italic',
  },
  errorText: {
    color: '#F44336',
  },
  removeButton: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeIcon: {
    fontSize: 18,
    color: '#757575',
    fontWeight: '600',
  },
});
