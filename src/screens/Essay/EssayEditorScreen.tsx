/**
 * Essay Editor Screen
 * Main screen for writing and submitting essays with AI feedback
 * ✅ UPDATED: Added PSSA state/grade preference selection + file upload support
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useEssayEditor } from './hooks/useEssayEditor';
import EssayWritingPad from './components/EssayWritingPad';
import FeedbackDialog from './components/FeedbackDialog';
import { FilePreviewChip } from './components/FilePreviewChip';
import { InputToolbar } from './components/InputToolbar';
import { StateSelectorSheet } from './components/StateSelectorSheet';
import { FileInfo } from '../../models/FileModels';
import { GradeOption, StateOption } from '../../models/EssayModels';

interface EssayEditorScreenProps {
  onBackClick: () => void;
}

const EssayEditorScreen: React.FC<EssayEditorScreenProps> = ({
  onBackClick,
}) => {
  const {
    uiState,
    updateEssayText,
    toggleInfoOverlay,
    hideInfoOverlay,
    submitEssay,
    dismissFeedbackDialog,
    dismissErrorDialog,
    retrySubmission,
    // File upload
    handleFileSelected,
    handleRemoveFile,
    dismissFileError,
    // Preferences
    savePreferences,
    openPreferencesSheet,
    closePreferencesSheet,
  } = useEssayEditor();

  const [isWritingExpanded, setIsWritingExpanded] = useState(false);

  // State/grade options — normally these come from backend via getUserPreferences
  // For now hardcoded as fallback — will be replaced with real data from API
  const [stateOptions] = useState<StateOption[]>([
    { code: 'PA', label: 'Pennsylvania' },
  ]);

  const [gradeOptions] = useState<GradeOption[]>([
    { code: 'prek', label: 'Pre-K' },
    { code: 'k', label: 'Kindergarten' },
    { code: '1', label: 'Grade 1' },
    { code: '2', label: 'Grade 2' },
    { code: '3', label: 'Grade 3' },
    { code: '4', label: 'Grade 4' },
    { code: '5', label: 'Grade 5' },
    { code: '6', label: 'Grade 6' },
    { code: '7', label: 'Grade 7' },
    { code: '8', label: 'Grade 8' },
    { code: '9', label: 'Grade 9' },
    { code: '10', label: 'Grade 10' },
    { code: '11', label: 'Grade 11' },
    { code: '12', label: 'Grade 12' },
  ]);

  const handleBackPress = () => {
    console.log('Back button pressed in EssayEditorScreen');
    try {
      onBackClick();
      console.log('onBackClick executed successfully');
    } catch (error) {
      console.error('Error in onBackClick:', error);
    }
  };

  // Show file upload error alert
  useEffect(() => {
    if (uiState.fileUploadError) {
      Alert.alert('Upload Error', uiState.fileUploadError, [
        { text: 'OK', onPress: dismissFileError },
      ]);
    }
  }, [uiState.fileUploadError, dismissFileError]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleBackPress}
          style={styles.headerButton}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerIcon}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Essay Writing</Text>
          {/* NEW: State & Grade Display */}
          <TouchableOpacity
            onPress={openPreferencesSheet}
            style={styles.gradeChip}
            activeOpacity={0.7}
          >
            <Text style={styles.gradeChipText}>
              {uiState.stateDisplay} • {uiState.gradeDisplay}
            </Text>
            <Text style={styles.gradeChipIcon}>▼</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={toggleInfoOverlay}
          style={styles.headerButton}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerIcon}>ℹ️</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* AI Feedback Section */}
        <View
          style={[
            styles.feedbackSection,
            isWritingExpanded
              ? styles.feedbackCollapsed
              : styles.feedbackExpanded,
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>AI Feedback</Text>
            {uiState.totalScore !== null && uiState.grade !== null && (
              <View style={styles.scoreChip}>
                <Text style={styles.scoreText}>{uiState.totalScore}/100</Text>
                <Text style={styles.gradeText}>Grade: {uiState.grade}</Text>
              </View>
            )}
          </View>

          {/* NEW: Show rubric type and grade band if available */}
          {uiState.rubricType && uiState.gradeBand && (
            <Text style={styles.rubricBadge}>
              {uiState.rubricType} • {uiState.gradeBand}
            </Text>
          )}

          <View style={styles.divider} />

          <ScrollView
            style={styles.feedbackContent}
            showsVerticalScrollIndicator={false}
          >
            {uiState.isSubmitting ? (
              <View style={styles.centerContent}>
                <ActivityIndicator size="large" color="#7D55FF" />
                <Text style={styles.loadingText}>
                  Analyzing your essay with AI...
                </Text>
              </View>
            ) : uiState.personalizedFeedback ? (
              <View>
                <Text style={styles.feedbackText}>
                  {uiState.personalizedFeedback}
                </Text>

                {uiState.strengths.length > 0 && (
                  <>
                    <Text style={styles.sectionLabel}>✨ Strengths:</Text>
                    {uiState.strengths.map((strength: string, index: number) => (
                      <Text key={index} style={styles.listItem}>
                        • {strength}
                      </Text>
                    ))}
                  </>
                )}

                {uiState.areasForImprovement.length > 0 && (
                  <>
                    <Text
                      style={[
                        styles.sectionLabel,
                        { color: '#FF6B6B', marginTop: 12 },
                      ]}
                    >
                      💡 Areas for Improvement:
                    </Text>
                    {uiState.areasForImprovement.map((area: string, index: number) => (
                      <Text key={index} style={styles.listItem}>
                        • {area}
                      </Text>
                    ))}
                  </>
                )}

                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => {
                    /* Show detailed feedback - handled by FeedbackDialog */
                  }}
                >
                  <Text style={styles.detailButtonText}>
                    View Detailed Scores
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centerContent}>
                <Text style={styles.emptyText}>
                  Submit your essay to receive AI-powered feedback.
                </Text>
              </View>
            )}
          </ScrollView>
        </View>

        {/* Toggle Button */}
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => setIsWritingExpanded(!isWritingExpanded)}
        >
          <Text style={styles.toggleIcon}>{isWritingExpanded ? '▼' : '▲'}</Text>
          <Text style={styles.toggleText}>
            {isWritingExpanded ? 'Minimize editor' : 'Expand editor'}
          </Text>
        </TouchableOpacity>

        {/* Writing Section with File Upload */}
        <View
          style={[
            styles.writingSection,
            isWritingExpanded ? styles.writingExpanded : styles.writingCollapsed,
          ]}
        >
          <View style={styles.writingHeader}>
            <Text style={styles.writingTitle}>Your Essay</Text>
            <Text
              style={[
                styles.wordCountBadge,
                { color: uiState.isWordCountValid ? '#7D55FF' : '#FF0000' },
              ]}
            >
              {uiState.wordCountText}
            </Text>
          </View>

          {!uiState.isWordCountValid && uiState.wordCount > 0 && (
            <Text style={styles.warningText}>
              {uiState.wordCount < uiState.minWords
                ? `Need ${uiState.minWords - uiState.wordCount} more words`
                : `${uiState.wordCount - uiState.maxWords} words over limit`}
            </Text>
          )}

          {/* File Preview Section */}
          {uiState.uploadedFiles && uiState.uploadedFiles.length > 0 && (
            <View style={styles.filePreviewContainer}>
              {uiState.uploadedFiles.map((file: FileInfo) => (
                <FilePreviewChip
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </View>
          )}

          <EssayWritingPad
            text={uiState.essayText}
            onTextChange={updateEssayText}
            minWords={uiState.minWords}
            maxWords={uiState.maxWords}
            wordCount={uiState.wordCount}
          />

          {/* Input Toolbar with Upload & Send buttons */}
          <InputToolbar
            onFileSelected={handleFileSelected}
            canUploadFiles={uiState.canUploadMoreFiles && !uiState.isFileExtracting}
            isFileExtracting={uiState.isFileExtracting || false}
            onSend={submitEssay}
            canSend={uiState.canSubmit && !uiState.isSubmitting}
            isSending={uiState.isSubmitting}
          />
        </View>
      </View>

      {/* NEW: State & Grade Selector Bottom Sheet */}
      <StateSelectorSheet
        isVisible={uiState.showPreferencesSheet}
        onClose={closePreferencesSheet}
        onSave={savePreferences}
        currentState={uiState.selectedState}
        currentGrade={uiState.selectedGrade}
        stateOptions={stateOptions}
        gradeOptions={gradeOptions}
        isLoading={uiState.isLoadingPreferences}
      />

      {/* Info Overlay */}
      {uiState.showInfoOverlay && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={hideInfoOverlay}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Essay Writing</Text>
              <Text style={styles.infoDescription}>
                Write your essay or upload a PDF to get AI-powered feedback
                based on {uiState.stateDisplay} PSSA standards for{' '}
                {uiState.gradeDisplay}.
              </Text>

              <View style={styles.rubricList}>
                <Text style={styles.rubricHeader}>
                  📝 PSSA Writing Domains:
                </Text>
                {['• Focus', '• Content', '• Organization', '• Style', '• Conventions'].map(
                  (rubric, index) => (
                    <Text key={index} style={styles.rubricItem}>
                      {rubric}
                    </Text>
                  ),
                )}
              </View>

              <Text style={styles.wordLimitText}>
                Word limit: {uiState.minWords} - {uiState.maxWords} words
              </Text>

              <Text style={styles.infoDescription}>
                📎 You can upload up to 2 PDF files (max 100KB each)
              </Text>

              <TouchableOpacity style={styles.startButton} onPress={hideInfoOverlay}>
                <Text style={styles.startButtonText}>Start Writing Your Essay</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Feedback Dialog */}
      {uiState.showFeedbackDialog &&
        uiState.totalScore !== null &&
        uiState.grade !== null && (
          <FeedbackDialog
            visible={uiState.showFeedbackDialog}
            totalScore={uiState.totalScore}
            grade={uiState.grade}
            rubricScores={uiState.rubricScores}
            personalizedFeedback={uiState.personalizedFeedback || ''}
            strengths={uiState.strengths}
            areasForImprovement={uiState.areasForImprovement}
            onDismiss={dismissFeedbackDialog}
          />
        )}

      {/* Error Dialog */}
      {uiState.showErrorDialog && uiState.submissionError && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={dismissErrorDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Submission Error</Text>
              <Text style={styles.errorMessage}>{uiState.submissionError}</Text>

              <View style={styles.errorButtons}>
                <TouchableOpacity style={styles.retryButton} onPress={retrySubmission}>
                  <Text style={styles.retryButtonText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={dismissErrorDialog}>
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF',
    zIndex: 1000,
    elevation: 5,
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001,
  },
  headerIcon: {
    fontSize: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  // NEW: Grade chip in header
  gradeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginTop: 4,
    gap: 4,
  },
  gradeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4F46E5',
  },
  gradeChipIcon: {
    fontSize: 10,
    color: '#4F46E5',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  feedbackSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
  },
  feedbackExpanded: {
    flex: 1.4,
  },
  feedbackCollapsed: {
    flex: 0.6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scoreChip: {
    flexDirection: 'row',
    backgroundColor: '#E8D5FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 8,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#7D55FF',
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  // NEW: Rubric type badge
  rubricBadge: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 12,
  },
  feedbackContent: {
    flex: 1,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666666',
  },
  feedbackText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7D55FF',
    marginTop: 12,
    marginBottom: 8,
  },
  listItem: {
    fontSize: 12,
    lineHeight: 18,
    marginLeft: 8,
    marginBottom: 4,
  },
  detailButton: {
    backgroundColor: '#7D55FF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: 'center',
    marginTop: 16,
  },
  detailButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999999',
  },
  toggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingVertical: 8,
    gap: 4,
  },
  toggleIcon: {
    fontSize: 14,
  },
  toggleText: {
    fontSize: 14,
    color: '#7D55FF',
  },
  writingSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    padding: 16,
    marginTop: 8,
  },
  writingExpanded: {
    flex: 1.2,
  },
  writingCollapsed: {
    flex: 0.6,
  },
  writingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  writingTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  wordCountBadge: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  warningText: {
    fontSize: 12,
    color: '#FF0000',
    marginBottom: 4,
  },
  filePreviewContainer: {
    marginBottom: 12,
    gap: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    width: '90%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  infoDescription: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 12,
    color: '#666666',
  },
  rubricList: {
    alignSelf: 'stretch',
    marginVertical: 12,
  },
  rubricHeader: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  rubricItem: {
    fontSize: 12,
    color: '#666666',
    marginVertical: 2,
  },
  wordLimitText: {
    fontSize: 12,
    color: '#7D55FF',
    fontWeight: 'bold',
    marginVertical: 16,
  },
  startButton: {
    backgroundColor: '#7D55FF',
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    width: '100%',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  errorCard: {
    width: '80%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: '#666666',
    marginBottom: 24,
  },
  errorButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  retryButton: {
    backgroundColor: '#7D55FF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cancelButtonText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EssayEditorScreen;