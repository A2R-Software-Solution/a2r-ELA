/**
 * Navigation Types
 * Route names and parameter types for navigation
 */

// Root Stack Navigator (Auth Flow)
export type RootStackParamList = {
  Splash:      undefined;
  Intro:       undefined;
  SignIn:      undefined;
  SignUp:      undefined;
  Main:        undefined;
  Essay:       undefined;
  Leaderboard: undefined; // ← Added Leaderboard route
  ExamPrep:    undefined;  // ← ADD
  Progress:    undefined;
  CreateCustomTest:     undefined;           // ← ADD
  TestInstructions:     {                    // ← ADD
    difficulty:    string;
    mcq:           number;
    comprehension: number;
    writing:       number;
    total:         number;
    estimatedTime: string;
    xpReward:      number;
  };
  PracticeSession: {                          // ← ADD
    difficulty:    string;
    mcq:           number;
    comprehension: number;
    writing:       number;
    total:         number;
    estimatedTime: string;
    xpReward:      number;
  };
};

// Main Tab Navigator (Authenticated User) - For future use
export type MainTabParamList = {
  Home:    undefined;
  Essay:   undefined;
  Profile: undefined;
};

// Screen names as constants
export const Routes = {
  // Auth Flow
  SPLASH:  'Splash' as const,
  INTRO:   'Intro'  as const,
  SIGN_IN: 'SignIn' as const,
  SIGN_UP: 'SignUp' as const,
  MAIN:    'Main'   as const,
  EXAM_PREP:   'ExamPrep'    as const,
  PROGRESS:    'Progress'    as const,
  CREATE_CUSTOM_TEST: 'CreateCustomTest' as const,
  TEST_INSTRUCTIONS:  'TestInstructions' as const,
  PRACTICE_SESSION:   'PracticeSession'  as const,   // ← ADD

  // Main Screens
  ESSAY:       'Essay'       as const,
  HOME:        'Home'        as const,
  PROFILE:     'Profile'     as const,
  LEADERBOARD: 'Leaderboard' as const, // ← Added Leaderboard route
};