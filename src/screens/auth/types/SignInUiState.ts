/**
 * Sign In UI State
 * State interface for Sign In screen
 */

export interface SignInUiState {
  username: string;
  password: string;
  
  usernameError: string | null;
  passwordError: string | null;
  
  isLoading: boolean;
  errorMessage: string | null;
  
  isLoginSuccessful: boolean;
}

export const initialSignInUiState: SignInUiState = {
  username: '',
  password: '',
  usernameError: null,
  passwordError: null,
  isLoading: false,
  errorMessage: null,
  isLoginSuccessful: false,
};