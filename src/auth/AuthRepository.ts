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
}

/**
 * Simple Result type for auth operations
 */
export type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: Error };