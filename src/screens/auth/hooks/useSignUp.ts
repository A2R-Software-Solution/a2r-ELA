import { validateEmail, validateNewPassword as validatePassword, validateConfirmPassword } from '../../../utils/validation';
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
      confirmPasswordError: prev.confirmPassword ? validateConfirmPassword(value, prev.confirmPassword) : prev.confirmPasswordError,
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
        uiState.email.trim(),
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

