/**
 * Sign Up Screen
 * User registration screen with email/password
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
import { useSignUp } from './hooks/useSignUp';

interface SignUpScreenProps {
  onSignInClick: () => void;
  onSignUpSuccess: () => void;
}

const SignUpScreen: React.FC<SignUpScreenProps> = ({
  onSignInClick,
  onSignUpSuccess,
}) => {
  const {
    uiState,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSignUpClick,
  } = useSignUp();

  // Handle one-time navigation on successful sign up
  useEffect(() => {
    if (uiState.isSignUpSuccessful) {
      onSignUpSuccess();
    }
  }, [uiState.isSignUpSuccessful, onSignUpSuccess]);

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
          <TouchableOpacity onPress={onSignInClick}>
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
        </View>

        {/* Title */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        {/* Email Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
                styles.input,
                uiState.emailError ? styles.inputError : undefined,
                ]}
            placeholder="email"
            placeholderTextColor="#999"
            value={uiState.email}
            onChangeText={onEmailChange}
            autoCapitalize="none"
            keyboardType="email-address"
            autoCorrect={false}
          />
          {uiState.emailError && (
            <Text style={styles.errorText}>{uiState.emailError}</Text>
          )}
        </View>

        {/* Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
                styles.input,
                uiState.passwordError ? styles.inputError : undefined,
                ]}
            placeholder="password"
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

        {/* Confirm Password Input */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
                styles.input,
                uiState.confirmPasswordError ? styles.inputError : undefined,
                ]}
            placeholder="confirm password"
            placeholderTextColor="#999"
            value={uiState.confirmPassword}
            onChangeText={onConfirmPasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />
          {uiState.confirmPasswordError && (
            <Text style={styles.errorText}>{uiState.confirmPasswordError}</Text>
          )}
        </View>

        {/* Global Error Message */}
        {uiState.errorMessage && (
          <Text style={styles.globalError}>{uiState.errorMessage}</Text>
        )}

        {/* Sign Up Button */}
        <TouchableOpacity
          style={[
            styles.signUpButton,
            uiState.isLoading && styles.buttonDisabled,
          ]}
          onPress={onSignUpClick}
          disabled={uiState.isLoading}
        >
          {uiState.isLoading ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={styles.signUpButtonText}>Sign Up</Text>
          )}
        </TouchableOpacity>

        {/* OR Divider */}
        <Text style={styles.orText}>OR</Text>

        {/* Social Buttons */}
        <SocialAuthButton text="Continue With Google" />
        <SocialAuthButton text="Continue With IOS" />
        <SocialAuthButton text="Continue With Facebook" />

        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignInClick}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

interface SocialAuthButtonProps {
  text: string;
}

const SocialAuthButton: React.FC<SocialAuthButtonProps> = ({ text }) => {
  return (
    <TouchableOpacity style={styles.socialButton}>
      <Text style={styles.socialButtonText}>{text}</Text>
    </TouchableOpacity>
  );
};

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
    justifyContent: 'flex-start',
  },
  backArrow: {
    fontSize: 35,
    color: '#000000',
  },
  titleContainer: {
    marginTop: 16,
    marginBottom: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000000',
  },
  subtitle: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#999999',
    marginTop: 4,
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
    backgroundColor: '#FFFFFF',
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
    fontSize: 14,
    marginVertical: 8,
  },
  signUpButton: {
    backgroundColor: '#7D55FF',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    marginTop: 20,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
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
    backgroundColor: '#FFFFFF',
  },
  socialButtonText: {
    color: '#000000',
    fontSize: 14,
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#000000',
    fontSize: 14,
  },
  signInLink: {
    color: '#7D55FF',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default SignUpScreen;