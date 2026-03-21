/**
 * useSignUp Hook
 * Sign Up logic (ViewModel equivalent)
 */

import { useState, useCallback } from 'react';
import { SignUpUiState, initialSignUpUiState } from '../types/SignUpUiState';
import firebaseAuthRepository from '../../../auth/FirebaseAuthRepository';

export const useSignUp = () => {
  const [uiState, setUiState] = useState<SignUpUiState>(initialSignUpUiState);

  const onEmailChange = useCallback((value: string) => {
    setUiState((prev) => ({
      ...prev,
      email: value,
      emailError: validateEmail(value),
    }));
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    setUiState((prev) => ({
      ...prev,
      password: value,
      passwordError: validatePassword(value),
    }));
  }, []);

  const onConfirmPasswordChange = useCallback((value: string) => {
    setUiState((prev) => ({
      ...prev,
      confirmPassword: value,
      confirmPasswordError: validateConfirmPassword(prev.password, value),
    }));
  }, []);

  const onSignUpClick = useCallback(async () => {
    // Prevent double click
    if (uiState.isLoading) return;

    const emailError = validateEmail(uiState.email);
    const passwordError = validatePassword(uiState.password);
    const confirmPasswordError = validateConfirmPassword(
      uiState.password,
      uiState.confirmPassword
    );

    setUiState((prev) => ({
      ...prev,
      emailError,
      passwordError,
      confirmPasswordError,
    }));

    if (emailError || passwordError || confirmPasswordError) return;

    setUiState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: null,
    }));

    try {
      const result = await firebaseAuthRepository.signUp(
        uiState.email,
        uiState.password
      );

      if (result.success) {
        setUiState((prev) => ({
          ...prev,
          isLoading: false,
          isSignUpSuccessful: true,
        }));
      } else {
        setUiState((prev) => ({
          ...prev,
          isLoading: false,
          errorMessage: result.error.message,
        }));
      }
    } catch (error: any) {
      setUiState((prev) => ({
        ...prev,
        isLoading: false,
        errorMessage: error.message || 'An error occurred',
      }));
    }
  }, [uiState.email, uiState.password, uiState.confirmPassword, uiState.isLoading]);

  return {
    uiState,
    onEmailChange,
    onPasswordChange,
    onConfirmPasswordChange,
    onSignUpClick,
  };
};

// Validation functions
const validateEmail = (value: string): string | null => {
  if (!value.trim()) return 'Email is required';
  
  if (!value.includes('@')) {
    return 'Please enter your email address';
  }
  
  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Invalid email format';
  }
  
  return null;
};

const validatePassword = (value: string): string | null => {
  if (!value.trim()) return 'Password is required';
  if (value.length < 6) return 'Password must be at least 6 characters';
  
  // Optional: Add stronger validation (commented out as in Kotlin)
  // if (!/[A-Z]/.test(value)) return 'Must contain an uppercase letter';
  // if (!/[a-z]/.test(value)) return 'Must contain a lowercase letter';
  // if (!/[0-9]/.test(value)) return 'Must contain a number';
  
  return null;
};

const validateConfirmPassword = (password: string, confirmPassword: string): string | null => {
  if (!confirmPassword.trim()) return 'Please confirm your password';
  if (password !== confirmPassword) return 'Passwords do not match';
  return null;
};