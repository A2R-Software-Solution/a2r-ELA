/**
 * Essay Editor Screen
 * ✅ Redesigned with new UI matching design system
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Modal,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useEssayEditor } from './hooks/useEssayEditor';
import EssayWritingPad from './components/EssayWritingPad';
import FeedbackDialog from './components/FeedbackDialog';
import { FilePreviewChip } from './components/FilePreviewChip';
import { InputToolbar } from './components/InputToolbar';
import { StateSelectorSheet } from './components/StateSelectorSheet';
import { FileInfo } from '../../models/FileModels';
import { GradeOption, StateOption } from '../../models/EssayModels';

// ============================================================================
// PROPS
// ============================================================================

interface EssayEditorScreenProps {
  onBackClick: () => void;
  onPlayNow?: () => void;
}

// ============================================================================
// CONSTANTS
// ============================================================================

const PRIMARY   = '#6C4DFF';
const BG        = '#F8FAFC';
const WHITE     = '#FFFFFF';
const BORDER    = '#E2E8F0';
const TEXT_DARK = '#0F172A';
const TEXT_MID  = '#475569';
const TEXT_GRAY = '#94A3B8';
const GREEN     = '#22C55E';

// ============================================================================
// SCREEN
// ============================================================================

const EssayEditorScreen: React.FC<EssayEditorScreenProps> = ({
  onBackClick,
  onPlayNow,
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
    handleFileSelected,
    handleRemoveFile,
    dismissFileError,
    savePreferences,
    openPreferencesSheet,
    closePreferencesSheet,
    onPlayNow: hookPlayNow,
  } = useEssayEditor();

  const insets = useSafeAreaInsets();

  const [stateOptions] = React.useState<StateOption[]>([
    { code: 'PA', label: 'Pennsylvania' },
  ]);

  const [gradeOptions] = React.useState<GradeOption[]>([
    { code: 'prek', label: 'Pre-K' },
    { code: 'k',    label: 'Kindergarten' },
    { code: '1',    label: 'Grade 1' },
    { code: '2',    label: 'Grade 2' },
    { code: '3',    label: 'Grade 3' },
    { code: '4',    label: 'Grade 4' },
    { code: '5',    label: 'Grade 5' },
    { code: '6',    label: 'Grade 6' },
    { code: '7',    label: 'Grade 7' },
    { code: '8',    label: 'Grade 8' },
    { code: '9',    label: 'Grade 9' },
    { code: '10',   label: 'Grade 10' },
    { code: '11',   label: 'Grade 11' },
    { code: '12',   label: 'Grade 12' },
  ]);

  useEffect(() => {
    if (uiState.fileUploadError) {
      Alert.alert('Upload Error', uiState.fileUploadError, [
        { text: 'OK', onPress: dismissFileError },
      ]);
    }
  }, [uiState.fileUploadError, dismissFileError]);

  const handlePlayNow = () => {
    hookPlayNow();
    onPlayNow?.();
  };

  // word count color
  const wordCountColor = uiState.wordCount === 0
    ? TEXT_GRAY
    : uiState.isWordCountValid
      ? GREEN
      : '#EF4444';

  return (
    <View style={styles.container}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>

        {/* Back */}
        <TouchableOpacity
          onPress={onBackClick}
          style={styles.headerBtn}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.headerBtnIcon}>←</Text>
        </TouchableOpacity>

        {/* Title */}
        <Text style={styles.headerTitle}>New Essay</Text>

        {/* Help */}
        <TouchableOpacity
          onPress={toggleInfoOverlay}
          style={styles.headerBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.helpText}>Help</Text>
        </TouchableOpacity>

      </View>

      {/* ── Category + Word Count Row ───────────────────────────────────────── */}
      <View style={styles.metaRow}>

        {/* Category pill — tappable */}
        <TouchableOpacity
          style={styles.categoryPill}
          onPress={openPreferencesSheet}
          activeOpacity={0.7}
        >
          <Text style={styles.categoryText}>
            {uiState.stateDisplay} • {uiState.gradeDisplay}
          </Text>
          <Text style={styles.categoryChevron}>▼</Text>
        </TouchableOpacity>

        {/* Word count */}
        <View style={styles.wordCountWrap}>
          <Text style={styles.wordCountLabel}>Word Count</Text>
          <Text style={[styles.wordCountValue, { color: wordCountColor }]}>
            {uiState.wordCount} / {uiState.maxWords}
          </Text>
        </View>

      </View>

      {/* ── File Previews ───────────────────────────────────────────────────── */}
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

      {/* ── Writing Pad ─────────────────────────────────────────────────────── */}
      <View style={styles.writingPadWrap}>
        <EssayWritingPad
          text={uiState.essayText}
          onTextChange={updateEssayText}
          minWords={uiState.minWords}
          maxWords={uiState.maxWords}
          wordCount={uiState.wordCount}
        />
      </View>

      {/* ── Word limit warning ──────────────────────────────────────────────── */}
      {!uiState.isWordCountValid && uiState.wordCount > 0 && (
        <View style={styles.warningRow}>
          <Text style={styles.warningText}>
            {uiState.wordCount < uiState.minWords
              ? `Need ${uiState.minWords - uiState.wordCount} more words`
              : `${uiState.wordCount - uiState.maxWords} words over limit`}
          </Text>
        </View>
      )}

      {/* ── Bottom Toolbar ──────────────────────────────────────────────────── */}
      <View style={[styles.toolbar, { paddingBottom: Math.max(insets.bottom, 12) }]}>

        {/* Attach */}
        <TouchableOpacity
          style={styles.toolbarAttachBtn}
          disabled={!uiState.canUploadMoreFiles || uiState.isFileExtracting}
          activeOpacity={0.7}
        >
          {uiState.isFileExtracting ? (
            <ActivityIndicator size="small" color={PRIMARY} />
          ) : (
            <InputToolbar
              onFileSelected={handleFileSelected}
              canUploadFiles={uiState.canUploadMoreFiles && !uiState.isFileExtracting}
              isFileExtracting={uiState.isFileExtracting || false}
              onSend={submitEssay}
              canSend={uiState.canSubmit && !uiState.isSubmitting}
              isSending={uiState.isSubmitting}
            />
          )}
        </TouchableOpacity>

        {/* Submit Essay */}
        <TouchableOpacity
          style={[
            styles.submitBtn,
            (!uiState.canSubmit || uiState.isSubmitting) && styles.submitBtnDisabled,
          ]}
          onPress={submitEssay}
          disabled={!uiState.canSubmit || uiState.isSubmitting}
          activeOpacity={0.8}
        >
          {uiState.isSubmitting ? (
            <ActivityIndicator size="small" color={WHITE} />
          ) : (
            <Text style={styles.submitBtnText}>Submit Essay</Text>
          )}
        </TouchableOpacity>

      </View>

      {/* ── State & Grade Selector ──────────────────────────────────────────── */}
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

      {/* ── Info Modal ──────────────────────────────────────────────────────── */}
      {uiState.showInfoOverlay && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={hideInfoOverlay}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.infoCard}>

              <Text style={styles.infoTitle}>Essay Writing</Text>
              <Text style={styles.infoDesc}>
                Write your essay or upload a PDF to get AI-powered feedback
                based on {uiState.stateDisplay} PSSA standards for{' '}
                {uiState.gradeDisplay}.
              </Text>

              <View style={styles.rubricList}>
                <Text style={styles.rubricHeader}>📝 PSSA Writing Domains:</Text>
                {['Focus', 'Content', 'Organization', 'Style', 'Conventions'].map(r => (
                  <Text key={r} style={styles.rubricItem}>• {r}</Text>
                ))}
              </View>

              <Text style={styles.wordLimitText}>
                Word limit: {uiState.minWords} – {uiState.maxWords} words
              </Text>
              <Text style={styles.infoDesc}>
                📎 You can upload up to 2 PDF files (max 100KB each)
              </Text>

              <TouchableOpacity
                style={styles.startBtn}
                onPress={hideInfoOverlay}
              >
                <Text style={styles.startBtnText}>Start Writing</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Modal>
      )}

      {/* ── Feedback Dialog ─────────────────────────────────────────────────── */}
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
            newBadges={uiState.rewards?.newly_unlocked_badges ?? []}
            gameSuggestion={uiState.gameSuggestion ?? null}
            onPlayNow={handlePlayNow}
            onDismiss={dismissFeedbackDialog}
          />
        )}

      {/* ── Error Dialog ────────────────────────────────────────────────────── */}
      {uiState.showErrorDialog && uiState.submissionError && (
        <Modal
          visible
          transparent
          animationType="fade"
          onRequestClose={dismissErrorDialog}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.errorCard}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorTitle}>Submission Error</Text>
              <Text style={styles.errorMessage}>{uiState.submissionError}</Text>
              <View style={styles.errorBtns}>
                <TouchableOpacity style={styles.retryBtn} onPress={retrySubmission}>
                  <Text style={styles.retryBtnText}>Retry</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelBtn} onPress={dismissErrorDialog}>
                  <Text style={styles.cancelBtnText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}

    </View>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  headerBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerBtnIcon: {
    fontSize: 22,
    color: TEXT_DARK,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: TEXT_DARK,
  },
  helpText: {
    fontSize: 14,
    fontWeight: '600',
    color: PRIMARY,
  },

  // Meta row
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: WHITE,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EDE9FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: PRIMARY,
  },
  categoryChevron: {
    fontSize: 10,
    color: PRIMARY,
  },
  wordCountWrap: {
    alignItems: 'flex-end',
  },
  wordCountLabel: {
    fontSize: 11,
    color: TEXT_GRAY,
    fontWeight: '500',
  },
  wordCountValue: {
    fontSize: 14,
    fontWeight: '700',
  },

  // File preview
  filePreviewContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: WHITE,
    gap: 4,
  },

  // Writing pad
  writingPadWrap: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: WHITE,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },

  // Warning
  warningRow: {
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  warningText: {
    fontSize: 12,
    color: '#EF4444',
    fontWeight: '500',
  },

  // Toolbar
  toolbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: WHITE,
    borderTopWidth: 1,
    borderTopColor: BORDER,
    gap: 10,
  },
  toolbarAttachBtn: {
    flex: 0,
  },
  submitBtn: {
    flex: 1,
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: PRIMARY,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitBtnDisabled: {
    backgroundColor: '#C4B5FD',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitBtnText: {
    color: WHITE,
    fontSize: 15,
    fontWeight: '700',
  },

  // Info modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCard: {
    width: '90%',
    backgroundColor: WHITE,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  infoTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 12,
  },
  infoDesc: {
    fontSize: 14,
    textAlign: 'center',
    color: TEXT_MID,
    lineHeight: 20,
    marginBottom: 12,
  },
  rubricList: {
    alignSelf: 'stretch',
    marginVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  rubricHeader: {
    fontSize: 14,
    fontWeight: '700',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  rubricItem: {
    fontSize: 13,
    color: TEXT_MID,
    marginVertical: 3,
  },
  wordLimitText: {
    fontSize: 13,
    color: PRIMARY,
    fontWeight: '700',
    marginVertical: 8,
  },
  startBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 14,
    width: '100%',
    alignItems: 'center',
    marginTop: 8,
  },
  startBtnText: {
    color: WHITE,
    fontSize: 16,
    fontWeight: '700',
  },

  // Error modal
  errorCard: {
    width: '80%',
    backgroundColor: WHITE,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
  },
  errorIcon: { fontSize: 48, marginBottom: 16 },
  errorTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: TEXT_DARK,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    textAlign: 'center',
    color: TEXT_MID,
    marginBottom: 24,
    lineHeight: 20,
  },
  errorBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  retryBtn: {
    backgroundColor: PRIMARY,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  retryBtnText: {
    color: WHITE,
    fontSize: 14,
    fontWeight: '600',
  },
  cancelBtn: {
    backgroundColor: '#F1F5F9',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  cancelBtnText: {
    color: TEXT_MID,
    fontSize: 14,
    fontWeight: '600',
  },
});

export default EssayEditorScreen;