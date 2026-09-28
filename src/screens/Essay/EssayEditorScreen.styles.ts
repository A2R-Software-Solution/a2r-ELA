import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';
import { layout } from '../../theme/layout';

export const getWritingPadLayout = (width: number) => ({
  width: Math.min(Math.max(0, width - 32), 928),
  alignSelf: 'center' as const,
});

export const PRIMARY = colors.primary;
export const BG = colors.background;
export const WHITE = '#FFFFFF';
export const BORDER = colors.border;
export const TEXT_DARK = colors.text;
export const TEXT_MID = colors.muted;
export const TEXT_GRAY = colors.subtle;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG,
  },

  // Header
  header: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    backgroundColor: colors.surface,
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
    color: colors.accent,
  },

  // Meta row
  metaRow: {
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.accent,
  },
  categoryChevron: {
    fontSize: 10,
    color: colors.accent,
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
    ...layout.content,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: colors.surface,
    gap: 4,
  },

  // Writing pad
  writingPadWrap: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: BORDER,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
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
    ...layout.content,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    backgroundColor: colors.surface,
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
    backgroundColor: colors.primary,
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
    maxWidth: 640,
    width: '90%',
    backgroundColor: colors.overlay,
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
    backgroundColor: colors.surface,
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
    color: colors.accent,
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
    maxWidth: 640,
    width: '80%',
    backgroundColor: colors.overlay,
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
    backgroundColor: colors.surface,
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
