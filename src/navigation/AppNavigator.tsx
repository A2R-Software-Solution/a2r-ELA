/**
 * App Navigator
 * ✅ Added CreateCustomTest and TestInstructions routes
 * ✅ ExamPrep Continue → PracticeSession directly (preloaded mode — no double fetch)
 * ✅ CreateCustomTest → TestInstructions → PracticeSession (lazy mode — unchanged behavior)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList, Routes } from './types';

// Screens
import SplashScreen              from '../screens/Splash/SplashScreen';
import IntroScreen               from '../screens/Intro/IntroScreen';
import SignInScreen               from '../screens/auth/SignInScreen';
import SignUpScreen               from '../screens/auth/SignUpScreen';
import HomeScreen                from '../screens/home/HomeScreen';
import EssayEditorScreen         from '../screens/Essay/EssayEditorScreen';
import LeaderboardScreen         from '../screens/Leaderboard/LeaderboardScreen';
import ExamPrepScreen            from '../screens/ExamPrep/ExamPrepScreen';
import CreateCustomTestScreen    from '../screens/Practice/CreateCustomTestScreen';
import TestInstructionsScreen    from '../screens/Practice/TestInstructionsScreen';
import PracticeSessionScreen     from '../screens/Practice/PracticeSessionScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation:   'slide_from_right',
          }}
        >
          {/* Splash */}
          <Stack.Screen name={Routes.SPLASH}>
            {({ navigation }) => (
              <SplashScreen
                onNavigateToHome={()   => navigation.replace(Routes.MAIN)}
                onNavigateToSignIn={() => navigation.replace(Routes.SIGN_IN)}
                onNavigateToIntro={()  => navigation.replace(Routes.INTRO)}
              />
            )}
          </Stack.Screen>

          {/* Intro */}
          <Stack.Screen name={Routes.INTRO}>
            {({ navigation }) => (
              <IntroScreen
                onGetStarted={() => navigation.replace(Routes.SIGN_IN)}
              />
            )}
          </Stack.Screen>

          {/* Sign In */}
          <Stack.Screen name={Routes.SIGN_IN}>
            {({ navigation }) => (
              <SignInScreen
                onSignUpClick={()   => navigation.navigate(Routes.SIGN_UP)}
                onLoginSuccess={()  => navigation.replace(Routes.MAIN)}
              />
            )}
          </Stack.Screen>

          {/* Sign Up */}
          <Stack.Screen name={Routes.SIGN_UP}>
            {({ navigation }) => (
              <SignUpScreen
                onSignInClick={()   => navigation.goBack()}
                onSignUpSuccess={() => navigation.replace(Routes.MAIN)}
              />
            )}
          </Stack.Screen>

          {/* Main Home */}
          <Stack.Screen name={Routes.MAIN}>
            {({ navigation }) => (
              <HomeScreen
                onLogoutClick={()              => navigation.replace(Routes.SIGN_IN)}
                onDeleteAccountClick={()       => navigation.replace(Routes.SIGN_IN)}
                onFeatureClick={feature        => {
                  if (feature.id === 'rank') {
                    navigation.navigate(Routes.LEADERBOARD);
                  }
                }}
                onEssayWritingClick={()        => navigation.navigate(Routes.ESSAY)}
                onSeeAllEssaysClick={()        => navigation.navigate(Routes.LEADERBOARD)}
                onCreateCustomTestClick={()    => navigation.navigate(Routes.CREATE_CUSTOM_TEST)}
              />
            )}
          </Stack.Screen>

          {/* Essay Editor */}
          <Stack.Screen name={Routes.ESSAY}>
            {({ navigation }) => (
              <EssayEditorScreen
                onBackClick={() => navigation.goBack()}
                onPlayNow={()   => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          {/* Leaderboard */}
          <Stack.Screen name={Routes.LEADERBOARD}>
            {({ navigation }) => (
              <LeaderboardScreen
                onBackClick={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>

          {/* Exam Prep — Continue → PracticeSession directly (questions already generated) */}
          <Stack.Screen name={Routes.EXAM_PREP}>
            {({ navigation }) => (
              <ExamPrepScreen
                onBackClick={()     => navigation.goBack()}
                onStartPractice={(data) =>
                  navigation.navigate(Routes.PRACTICE_SESSION, { mode: 'preloaded', data })
                }
                onViewProgress={()  => navigation.navigate(Routes.PROGRESS)}
              />
            )}
          </Stack.Screen>

          {/* Create Custom Test */}
          <Stack.Screen name={Routes.CREATE_CUSTOM_TEST}>
            {({ navigation }) => (
              <CreateCustomTestScreen
                onBackClick={() => navigation.goBack()}
                onNavigateToInstructions={(config) =>
                  navigation.navigate(Routes.TEST_INSTRUCTIONS, config)
                }
              />
            )}
          </Stack.Screen>

          {/* Test Instructions */}
          <Stack.Screen name={Routes.TEST_INSTRUCTIONS}>
            {({ navigation, route }) => (
              <TestInstructionsScreen
                config={route.params}
                onBackClick={() => navigation.goBack()}
                onBeginTest={()  =>
                  navigation.navigate(Routes.PRACTICE_SESSION, { mode: 'lazy', config: route.params })
                }
              />
            )}
          </Stack.Screen>

          {/* Practice Session — the actual exam-taking experience.
              Accepts either { mode: 'preloaded', data } (from ExamPrep, already
              fetched — no further API calls) or { mode: 'lazy', config } (from
              CreateCustomTest — fetches questions one at a time, unchanged). */}
          <Stack.Screen name={Routes.PRACTICE_SESSION}>
            {({ navigation, route }) => (
              <PracticeSessionScreen
                params={route.params}
                onBackClick={() => navigation.goBack()}
                onFinish={()    => navigation.navigate(Routes.MAIN)}
              />
            )}
          </Stack.Screen>

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;