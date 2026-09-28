import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const getSheetLayout = (width: number) => ({
  width: Math.min(width, 640),
  left: Math.max(0, (width - 640) / 2),
  right: undefined,
});

export const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '75%',
    backgroundColor: colors.overlay,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 20,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
  },
  handleIndicator: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  header: {
    marginBottom: 24,
    paddingTop: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: colors.muted,
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  optionButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    backgroundColor: colors.surface,
  },
  optionButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceRaised,
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.muted,
  },
  optionTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  gradeButton: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  gradeButtonSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceRaised,
  },
  gradeText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.muted,
  },
  gradeTextSelected: {
    color: colors.accent,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: colors.surfaceRaised,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
    marginBottom: 24,
  },
  infoText: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  infoBold: {
    fontWeight: '600',
    color: colors.text,
  },
  footer: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceRaised,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    backgroundColor: colors.surface,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.muted,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: colors.border,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
