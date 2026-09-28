import { colors } from '../../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 4,
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    padding: 16,
    shadowColor: '#6C4DFF',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 0,
  },
  header: {
    marginBottom: 12,
  },
  labelPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  labelText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.accent,
  },
  loadingWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  loadingText: {
    fontSize: 13,
    color: colors.muted,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    paddingVertical: 8,
  },
  vocabContent: {
    gap: 8,
  },
  wordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  word: {
    fontSize: 22,
    fontWeight: '800',
    color: colors.text,
  },
  posPill: {
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  posText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3B82F6',
  },
  meaning: {
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },
  exampleWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
    backgroundColor: colors.surfaceRaised,
    borderRadius: 10,
    padding: 10,
  },
  exampleLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.accent,
  },
  exampleText: {
    fontSize: 13,
    color: colors.muted,
    fontStyle: 'italic',
    flex: 1,
  },
});
