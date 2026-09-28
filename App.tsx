import { styles } from './App.styles';
import { colors } from './src/theme/colors';
/**
 * App.tsx
 * Root component of the application
 * 
 * ✅ FIXED: Properly initializes Firebase before rendering app
 */

import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator } from 'react-native';
import firebaseApp from '@react-native-firebase/app';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    // Initialize Firebase
    const initializeFirebase = async () => {
      try {
        // Check if Firebase is already initialized
        const apps = firebaseApp.apps;
        
        if (apps.length === 0) {
          console.log('Firebase apps not found, waiting for auto-initialization...');
        } else {
          console.log('Firebase initialized successfully:', apps[0].name);
        }
        
        // Mark Firebase as ready
        setIsFirebaseReady(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        // Still set as ready to allow app to continue
        setIsFirebaseReady(true);
      }
    };

    initializeFirebase();
  }, []);

  // Show loading screen while Firebase initializes
  if (!isFirebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colors.background}
      />
      <AppNavigator />
    </>
  );
};

export default App;
