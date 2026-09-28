import { glass } from '../../theme/glass';
import { layout } from '../../theme/layout';
import { colors } from '../../theme/colors';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  formCard: {
    ...glass.card,
    padding: 20,
    marginTop: 16,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    ...layout.form,
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    // ✅ paddingTop set dynamically via insets in JSX
  },
  backArrow: {
    fontSize: 35,
    color: colors.text,
  },
  // ✅ Real image styles
  illustrationContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  illustrationImage: {
    width: '100%',
    height: 160,
  },
  welcomeContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.text,
  },
  welcomeSubtitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: colors.muted,
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderTopColor: 'rgba(255, 255, 255, 0.28)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.text,
  },
  inputError: {
    borderColor: '#FF8A9A',
  },
  errorText: {
    color: '#FF8A9A',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  globalError: {
    color: '#FF8A9A',
    fontSize: 12,
    marginBottom: 8,
  },
  signInButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    height: 48,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signInButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  orText: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
    marginVertical: 20,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    color: colors.text,
    fontSize: 14,
  },
  signUpLink: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: '500',
  },
});
