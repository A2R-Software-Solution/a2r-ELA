/**
 * App Navigator
 * Main navigation configuration with Stack and Tab navigators
 *
 * ✅ FIXED: Removed useAuth() call that was triggering Firebase too early
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList, Routes } from './types';

// Screens
import SplashScreen from '../screens/Splash/SplashScreen';
import IntroScreen from '../screens/Intro/IntroScreen';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import HomeScreen from '../screens/home/HomeScreen';
import EssayEditorScreen from '../screens/Essay/EssayEditorScreen';

// Direct import for signOut only when needed
import firebaseAuthRepository from '../auth/FirebaseAuthRepository';

const Stack = createNativeStackNavigator<RootStackParamList>();

// ============================================================================
// ROOT STACK NAVIGATOR
// ============================================================================

const AppNavigator = () => {
  // ✅ FIX: Don't call useAuth() here - it triggers Firebase too early
  // Instead, call signOut directly from firebaseAuthRepository when needed

  return (
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
        <Stack.Screen name={Routes.MAIN}>
          {({ navigation }) => (
            <HomeScreen
              onLogoutClick={async () => {
                // ✅ Call signOut directly when needed (Firebase is ready by now)
                await firebaseAuthRepository.signOut();
                navigation.replace(Routes.SIGN_IN);
              }}
              onCourseClick={course => {
                console.log('Course clicked:', course.title);
                // TODO: Navigate to course details
              }}
              onFeatureClick={feature => {
                console.log('Feature clicked:', feature.title);
              }}
              onCategoryClick={category => {
                console.log('Category clicked:', category.title);
              }}
              onSeeAllCategories={() => {
                console.log('See all categories clicked');
                // TODO: Navigate to categories screen
              }}
              onNotificationClick={() => {
                console.log('Notification clicked');
                // TODO: Navigate to notifications
              }}
              onProfileClick={() => {
                console.log('Profile clicked');
                // TODO: Navigate to profile details
              }}
              onEssayWritingClick={() => {
                // Navigate to Essay Editor
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
  );
};

export default AppNavigator;
