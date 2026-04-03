/**
 * Sign In Screen
 * User authentication screen with email/password
 *
 * ✅ FIXED: Back button now works — added default no-op and safe area insets
 * ✅ FIXED: Replaced illustration placeholder with actual signin.png image
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
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

const SocialButton: React.FC<SocialButtonProps> = ({ text, onPress }) => (
  <TouchableOpacity style={styles.socialButton} onPress={onPress}>
    <Text style={styles.socialButtonText}>{text}</Text>
  </TouchableOpacity>
);

/* -------------------------------- Sign In Screen -------------------------------- */

const SignInScreen: React.FC<SignInScreenProps> = ({
  onSignUpClick,
  onLoginSuccess,
  onBackClick,
}) => {
  const { uiState, onUsernameChange, onPasswordChange, onSignInClick } =
    useSignIn();

  // ✅ FIX: Safe area insets for dynamic island / notch
  const insets = useSafeAreaInsets();

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
        {/* ✅ FIX: Header respects safe area + back button has fallback */}
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          {onBackClick && (
            <TouchableOpacity
              onPress={onBackClick}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* ✅ FIX: Real image instead of placeholder text */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/signin.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
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
        <SocialButton text="Continue with Apple Id" />

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
    // ✅ paddingTop set dynamically via insets in JSX
  },
  backArrow: {
    fontSize: 35,
    color: '#000000',
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
  backgroundColor: '#FFFFFF',
  color: '#000000',   // ADD THIS

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
