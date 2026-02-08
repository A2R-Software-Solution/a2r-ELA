/**
 * useAuth Hook
 * Custom hook for authentication operations
 */

import { useState, useEffect, useCallback } from 'react';
import firebaseAuthRepository from '../auth/FirebaseAuthRepository';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface UseAuthReturn {
  user: FirebaseAuthTypes.User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (email: string, password: string) => Promise<boolean>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuth = (): UseAuthReturn => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  /**
   * Sign in user
   */
  const signIn = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await firebaseAuthRepository.signIn(email, password);

      if (result.success) {
        return true;
      } else {
        setError(result.error.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign in');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign up user
   */
  const signUp = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await firebaseAuthRepository.signUp(email, password);

      if (result.success) {
        return true;
      } else {
        setError(result.error.message);
        return false;
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Sign out user
   */
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setIsLoading(true);
      setError(null);
      await firebaseAuthRepository.signOut();
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign out');
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Clear error message
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
    error,
    signIn,
    signUp,
    signOut,
    clearError,
  };
};