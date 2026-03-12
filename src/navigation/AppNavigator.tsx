/**
 * App Navigator
 * Main navigation configuration with Stack and Tab navigators
 *
 * ✅ FIXED: Removed useAuth() call that was triggering Firebase too early
 * ✅ FIXED: Wrapped with SafeAreaProvider so useSafeAreaInsets() works in all screens
 * ✅ FIXED: onLogoutClick now only handles navigation — signOut() is owned by useProfile
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootStackParamList, Routes } from './types';

// Screens
import SplashScreen from '../screens/Splash/SplashScreen';
import IntroScreen from '../screens/Intro/IntroScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/home/HomeScreen';
import EssayEditorScreen from '../screens/Essay/EssayEditorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ============================================================================
// ROOT STACK NAVIGATOR
// ============================================================================

const AppNavigator = () => {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            headerShown: false,
            animation: 'slide_from_right',
          }}
        >
          {/* Splash Screen */}
          <Stack.Screen name={Routes.SPLASH}>
            {({ navigation }) => (
              <SplashScreen
                onNavigateToHome={() => navigation.replace(Routes.MAIN)}
                onNavigateToSignIn={() => navigation.replace(Routes.SIGN_IN)}
                onNavigateToIntro={() => navigation.replace(Routes.INTRO)}
              />
            )}
          </Stack.Screen>

          {/* Intro Screen */}
          <Stack.Screen name={Routes.INTRO}>
            {({ navigation }) => (
              <IntroScreen
                onGetStarted={() => navigation.replace(Routes.SIGN_IN)}
              />
            )}
          </Stack.Screen>

          {/* Sign In Screen */}
          <Stack.Screen name={Routes.SIGN_IN}>
            {({ navigation }) => (
              <SignInScreen
                onSignUpClick={() => navigation.navigate(Routes.SIGN_UP)}
                onLoginSuccess={() => navigation.replace(Routes.MAIN)}
              />
            )}
          </Stack.Screen>

          {/* Sign Up Screen */}
          <Stack.Screen name={Routes.SIGN_UP}>
            {({ navigation }) => (
              <SignUpScreen
                onSignInClick={() => navigation.goBack()}
                onSignUpSuccess={() => navigation.replace(Routes.MAIN)}
              />
            )}
          </Stack.Screen>

          {/* Main Home Screen */}
          {/* ✅ FIX: onLogoutClick only navigates — signOut() is handled inside useProfile.
                      Passing an async function here was causing the double-signOut and
                      hooks order violation in HomeScreen. */}
          <Stack.Screen name={Routes.MAIN}>
            {({ navigation }) => (
              <HomeScreen
                onLogoutClick={() => navigation.replace(Routes.SIGN_IN)}
                onCourseClick={course => {
                  console.log('Course clicked:', course.title);
                }}
                onFeatureClick={feature => {
                  console.log('Feature clicked:', feature.title);
                }}
                onCategoryClick={category => {
                  console.log('Category clicked:', category.title);
                }}
                onSeeAllCategories={() => {
                  console.log('See all categories clicked');
                }}
                onNotificationClick={() => {
                  console.log('Notification clicked');
                }}
                onEssayWritingClick={() => {
                  navigation.navigate(Routes.ESSAY);
                }}
              />
            )}
          </Stack.Screen>

          {/* Essay Editor Screen */}
          <Stack.Screen name={Routes.ESSAY}>
            {({ navigation }) => (
              <EssayEditorScreen
                onBackClick={() => navigation.goBack()}
                onPlayNow={() => navigation.goBack()}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default AppNavigator;
