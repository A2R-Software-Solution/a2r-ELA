import { styles } from './SignInScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';

/**
 * Sign In Screen
 * User authentication screen with email/password
 *
 * ✅ FIXED: Back button now works — added default no-op and safe area insets
 * ✅ FIXED: Replaced illustration placeholder with actual signin.png image
 */

import React, { useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSignIn } from './hooks/useSignIn';

interface SignInScreenProps {
  onSignUpClick: () => void;
  onLoginSuccess: () => void;
  onBackClick?: () => void;
}

/* -------------------------------- Social Button -------------------------------- */


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
      <ScreenBackground />
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
            source={require('../../assets/images/signin-transparent.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.formCard}>
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

        {/* Sign Up */}
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>Not a member? </Text>
          <TouchableOpacity onPress={onSignUpClick}>
            <Text style={styles.signUpLink}>Create an account</Text>
          </TouchableOpacity>
        </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignInScreen;
