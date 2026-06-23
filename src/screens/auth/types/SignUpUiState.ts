/**
 * Sign Up UI State
 * State interface for Sign Up screen
 */

export interface SignUpUiState {
  email: string;
  password: string;
  confirmPassword: string;
  
  emailError: string | null;
  passwordError: string | null;
  confirmPasswordError: string | null;
  
  isLoading: boolean;
  isSignUpSuccessful: boolean;
  errorMessage: string | null;
}

export const initialSignUpUiState: SignUpUiState = {
  email: '',
  password: '',
  confirmPassword: '',
  emailError: null,
  passwordError: null,
  confirmPasswordError: null,
  isLoading: false,
  isSignUpSuccessful: false,
  errorMessage: null,
};