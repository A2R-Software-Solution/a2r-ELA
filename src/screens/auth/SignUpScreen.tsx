import { styles } from './SignUpScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';

/**
 * Sign Up Screen
 * User registration screen with email/password
 *
 * ✅ FIXED: Removed back button
 * ✅ FIXED: Font sizes match SignInScreen
 * ✅ FIXED: Image from assets folder
 * ✅ FIXED: Safe area insets for dynamic island
 */

import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
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

  const insets = useSafeAreaInsets();

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
      <ScreenBackground />
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + 16 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={require('../../assets/images/signup-transparent.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formCard}>
        {/* Title — matches SignIn font sizes */}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started!</Text>
        </View>

        {/* Email */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              uiState.emailError ? styles.inputError : undefined,
            ]}
            placeholder="Email"
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

        {/* Confirm Password */}
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              uiState.confirmPasswordError ? styles.inputError : undefined,
            ]}
            placeholder="Confirm Password"
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

        {/* Global Error */}
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
        {/* Sign In Link */}
        <View style={styles.signInContainer}>
          <Text style={styles.signInText}>Already have an account? </Text>
          <TouchableOpacity onPress={onSignInClick}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};


export default SignUpScreen;
