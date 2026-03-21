/**
 * Splash Screen
 * Initial loading screen that determines navigation route
 *
 * ✅ FIXED: Waits for Firebase Auth to be ready before checking login state
 */
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import PreferencesManager from '../../utils/PreferencesManager';
import firebaseAuthRepository from '../../auth/FirebaseAuthRepository';

interface SplashScreenProps {
  onNavigateToHome: () => void;
  onNavigateToSignIn: () => void;
  onNavigateToIntro: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({
  onNavigateToHome,
  onNavigateToSignIn,
  onNavigateToIntro,
}) => {
  useEffect(() => {
    const checkAuthAndNavigate = async () => {
      try {
        // ✅ Wait for Firebase to be ready FIRST
        const unsubscribe = firebaseAuthRepository.onAuthStateReady(
          async isLoggedIn => {
            unsubscribe();

            await new Promise<void>(resolve => setTimeout(resolve, 1500));
            const hasSeenIntro = await PreferencesManager.hasSeenIntro();

            if (isLoggedIn) {
              onNavigateToHome();
            } else if (hasSeenIntro) {
              onNavigateToSignIn();
            } else {
              onNavigateToIntro();
            }
          },
        );
      } catch (error) {
        console.error('Error in splash screen:', error);
        onNavigateToIntro();
      }
    };

    checkAuthAndNavigate();
  }, [onNavigateToHome, onNavigateToSignIn, onNavigateToIntro]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>A2R Presents</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7D55FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default SplashScreen;
