/**
 * Navigation Types
 * Route names and parameter types for navigation
 */

// Root Stack Navigator (Auth Flow)
export type RootStackParamList = {
  Splash: undefined;
  Intro: undefined;
  SignIn: undefined;
  SignUp: undefined;
  Main: undefined;
  Essay: undefined; // ← Added Essay route
};

// Main Tab Navigator (Authenticated User) - For future use
export type MainTabParamList = {
  Home: undefined;
  Essay: undefined;
  Profile: undefined;
};

// Screen names as constants
export const Routes = {
  // Auth Flow
  SPLASH: 'Splash' as const,
  INTRO: 'Intro' as const,
  SIGN_IN: 'SignIn' as const,
  SIGN_UP: 'SignUp' as const,
  MAIN: 'Main' as const,

  // Main Screens
  ESSAY: 'Essay' as const, // ← Added Essay route
  HOME: 'Home' as const,
  PROFILE: 'Profile' as const,
};
