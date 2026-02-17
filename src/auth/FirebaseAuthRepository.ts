/**
 * Firebase Auth Repository
 * Handles authentication using Firebase Auth
 *
 * Compatible with RNFirebase v22+
 */

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from '@react-native-firebase/auth';
import { getApps } from '@react-native-firebase/app';
import { AuthRepository, Result } from './AuthRepository';

class FirebaseAuthRepository implements AuthRepository {
  /**
   * Resolve auth lazily and safely (important for iOS)
   */
  private get auth() {
    const apps = getApps();
    if (!apps.length) {
      throw new Error('Firebase not initialized yet');
    }
    return getAuth(apps[0]);
  }

  /**
   * Wait until Firebase Auth is ready and emit login state
   * Used by Splash screen to avoid iOS race condition
   */
  onAuthStateReady(callback: (isLoggedIn: boolean) => void) {
    const auth = this.auth;

    const unsubscribe = onAuthStateChanged(auth, user => {
      callback(!!user);
    });

    return unsubscribe;
  }

  /**
   * Sign in with email and password
   */
  async signIn(username: string, password: string): Promise<Result<void>> {
    try {
      await signInWithEmailAndPassword(this.auth, username, password);
      return { success: true, data: undefined };
    } catch (error: any) {
      const errorMessage = this.getErrorMessage(error.code);
      return { success: false, error: new Error(errorMessage) };
    }
  }

  /**
   * Sign up with email and password
   */
  async signUp(username: string, password: string): Promise<Result<void>> {
    try {
      await createUserWithEmailAndPassword(this.auth, username, password);
      return { success: true, data: undefined };
    } catch (error: any) {
      const errorMessage = this.getSignUpErrorMessage(error.code);
      return { success: false, error: new Error(errorMessage) };
    }
  }

  /**
   * Check if user is logged in
   * (Safe to call AFTER auth state is ready)
   */
  isUserLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }

  /**
   * Sign out current user
   */
  async signOut(): Promise<void> {
    await firebaseSignOut(this.auth);
  }

  /**
   * Get current user
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }

  /**
   * Get ID token for current user
   */
  async getIdToken(): Promise<string | null> {
    try {
      const user = this.auth.currentUser;
      if (user) {
        return await user.getIdToken();
      }
      return null;
    } catch (error) {
      console.error('Error getting ID token:', error);
      return null;
    }
  }

  /**
   * Map Firebase error codes to user-friendly messages (Sign In)
   */
  private getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email format';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/user-not-found':
        return 'No account found with this email';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection';
      case 'auth/invalid-credential':
        return 'Invalid credentials. Please check your email and password';
      default:
        return 'Sign in failed. Please try again';
    }
  }

  /**
   * Map Firebase error codes to user-friendly messages (Sign Up)
   */
  private getSignUpErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/invalid-email':
        return 'Invalid email format';
      case 'auth/email-already-in-use':
        return 'This email is already registered';
      case 'auth/weak-password':
        return 'Password is too weak';
      case 'auth/network-request-failed':
        return 'Network error. Check your connection';
      case 'auth/operation-not-allowed':
        return 'Email/password accounts are not enabled';
      default:
        return 'Sign up failed. Please try again';
    }
  }
}

export default new FirebaseAuthRepository();
