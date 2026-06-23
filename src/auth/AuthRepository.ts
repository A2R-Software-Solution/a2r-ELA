/**
 * Auth Repository Interface
 * Defines authentication methods
 */

export interface AuthRepository {
  /**
   * Sign in with username (email) and password
   */
  signIn(username: string, password: string): Promise<Result<void>>;

  /**
   * Sign up with username (email) and password
   */
  signUp(username: string, password: string): Promise<Result<void>>;

  /**
   * Check if user is currently logged in
   */
  isUserLoggedIn(): boolean;

  /**
   * Sign out current user
   */
  signOut(): Promise<void>;

  /**
   * Permanently delete the current user's account and all associated data.
   * Calls DELETE /delete_account on the backend which removes all Firestore
   * data, then deletes the Firebase Auth user.
   */
  deleteAccount(): Promise<Result<void>>; // ← NEW
}

/**
 * Simple Result type for auth operations
 */
export type Result<T> =
  | { success: true; data: T }
  | { success: false; error: Error };