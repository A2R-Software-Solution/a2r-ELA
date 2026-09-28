import { colors } from '../../theme/colors';
import { layout } from '../../theme/layout';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    flex: 1,
  },

  scrollView: {
    flex: 1,
  },

  scrollContent: {
    ...layout.content,
    backgroundColor: 'transparent', // ← was '#12102A', now transparent so bg layers show through
    paddingBottom: 100,
    flexGrow: 1,
  },

  profileScrollContent: {
    ...layout.content,
    backgroundColor: 'transparent', // ← was '#12102A'
    paddingBottom: 100,
    flexGrow: 1,
  },

  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent', // ← was '#12102A'
  },

  placeholderText: {
    fontSize: 18,
    color: colors.accent,
  },

  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: 'transparent', // ← was '#12102A'
  },

  errorText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.55)',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },

  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },

  retryText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
