/**
 * Sign In Screen
 * User authentication screen with email/password
 */

import React, { useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useSignIn } from './hooks/useSignIn';

interface SignInScreenProps {
  onSignUpClick: () => void;
  onLoginSuccess: () => void;
  onBackClick?: () => void;
}

/* -------------------------------- Social Button -------------------------------- */

interface SocialButtonProps {
  text: string;
  onPress?: () => void;
}

const SocialButton: React.FC<SocialButtonProps> = ({ text, onPress }) => {
  return (
    <TouchableOpacity style={styles.socialButton} onPress={onPress}>
      <Text style={styles.socialButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

/* -------------------------------- Sign In Screen -------------------------------- */

const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignUpClick,
  onLoginSuccess,
  onBackClick,
}) => {
  const {
    uiState,
    onUsernameChange,
    onPasswordChange,
    onSignInClick,
  } = useSignIn();

  // Navigate once login succeeds
  useEffect(() => {
    if (uiState.isLoginSuccessful) {
      onLoginSuccess();
    }
  }, [uiState.isLoginSuccessful, onLoginSuccess]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Back Arrow */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onBackClick}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Illustration Placeholder */}
        <View style={styles.illustrationContainer}>
          <Text style={styles.illustrationText}>Illustration</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeContainer}>
          <Text style={styles.welcomeTitle}>Welcome,</Text>
          <Text style={styles.welcomeSubtitle}>Sign in to get started!</Text>
        </View>

        {/* Username / Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
                styles.input,
                uiState.usernameError ? styles.inputError : undefined,
                ]}

            placeholder="Username or Email"
            placeholderTextColor="#999"
            value={uiState.username}
            onChangeText={onUsernameChange}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          {uiState.usernameError && (
            <Text style={styles.errorText}>{uiState.usernameError}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
                styles.input,
                uiState.passwordError ? styles.inputError : undefined,
                ]}

            placeholder="Password"
            placeholderTextColor="#999"
            value={uiState.password}
            onChangeText={onPasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {uiState.passwordError && (
            <Text style={styles.errorText}>{uiState.passwordError}</Text>
          )}
        </View>

        {/* Global Error */}
        {uiState.errorMessage && (
          <Text style={styles.globalError}>{uiState.errorMessage}</Text>
        )}

        {/* Sign In Button */}
        <TouchableOpacity
          style={[
            styles.signInButton,
            uiState.isLoading && styles.buttonDisabled,
          ]}
          onPress={onSignInClick}
          disabled={uiState.isLoading}
        >
          {uiState.isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signInButtonText}>Sign In</Text>
          )}
        </TouchableOpacity>

        {/* OR */}
        <Text style={styles.orText}>OR</Text>

        {/* Social Login */}
        <SocialButton text="Continue with Google" />
        <SocialButton text="Continue with iOS" />
        <SocialButton text="Continue with Facebook" />

        {/* Sign Up */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Not a member? </Text>
          <TouchableOpacity onPress={onSignUpClick}>
            <Text style={styles.signUpLink}>Create an account</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;

/* -------------------------------- Styles -------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
  },
  backArrow: {
    fontSize: 35,
    color: '#000000',
  },
  illustrationContainer: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  illustrationText: {
    color: '#999999',
    fontSize: 16,
  },
  welcomeContainer: {
    marginTop: 24,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  welcomeSubtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#999999',
  },
  inputContainer: {
    marginBottom: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
  },
  inputError: {
    borderColor: '#FF0000',
  },
  errorText: {
    color: '#FF0000',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  globalError: {
    color: '#FF0000',
    fontSize: 12,
    marginBottom: 8,
  },
  signInButton: {
    backgroundColor: '#7D55FF',
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
    color: '#999999',
    fontSize: 12,
    marginVertical: 20,
  },
  socialButton: {
    borderWidth: 1,
    borderColor: '#DDDDDD',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    height: 48,
    marginBottom: 8,
  },
  socialButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signUpText: {
    fontSize: 14,
  },
  signUpLink: {
    color: '#7D55FF',
    fontSize: 14,
    fontWeight: '500',
  },
});
