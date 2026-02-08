/**
 * useSignIn Hook
 * Sign In logic (ViewModel equivalent)
 */

import { useState, useCallback } from 'react';
import { SignInUiState, initialSignInUiState } from '../types/SignInUiState';
import firebaseAuthRepository from '../../../auth/FirebaseAuthRepository';

export const useSignIn = () => {
  const [uiState, setUiState] = useState<SignInUiState>(initialSignInUiState);

  const onUsernameChange = useCallback((value: string) => {
    setUiState((prev) => ({
      ...prev,
      username: value,
      usernameError: validateUsername(value),
    }));
  }, []);

  const onPasswordChange = useCallback((value: string) => {
    setUiState((prev) => ({
      ...prev,
      password: value,
      passwordError: validatePassword(value),
    }));
  }, []);

  const onSignInClick = useCallback(async () => {
    // Prevent double click
    if (uiState.isLoading) return;

    const usernameError = validateUsername(uiState.username);
    const passwordError = validatePassword(uiState.password);

    setUiState((prev) => ({
      ...prev,
      usernameError,
      passwordError,
    }));

    if (usernameError || passwordError) return;

    setUiState((prev) => ({
      ...prev,
      isLoading: true,
      errorMessage: null,
    }));

    try {
      const result = await firebaseAuthRepository.signIn(
        uiState.username,
        uiState.password
      );

      if (result.success) {
        setUiState((prev) => ({
          ...prev,
          isLoading: false,
          isLoginSuccessful: true,
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
  }, [uiState.username, uiState.password, uiState.isLoading]);

  return {
    uiState,
    onUsernameChange,
    onPasswordChange,
    onSignInClick,
  };
};

// Validation functions
const validateUsername = (value: string): string | null => {
  if (!value.trim()) return 'Email is required';
  if (!value.includes('@')) return 'Please enter your email address';
  
  // Simple email regex validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) {
    return 'Invalid email format';
  }
  
  return null;
};

const validatePassword = (value: string): string | null => {
  if (!value.trim()) return 'Password is required';
  // Commented out for now (as in Kotlin code)
  // if (value.length < 8) return 'Password must be at least 8 characters';
  return null;
};