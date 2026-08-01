import React, { useEffect, useState } from 'react';
import { StatusBar, View, ActivityIndicator, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import firebaseApp from '@react-native-firebase/app';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const initializeFirebase = async () => {
      try {
        const apps = firebaseApp.apps;
        if (apps.length === 0) {
          console.log('Firebase apps not found, waiting for auto-initialization...');
        } else {
          console.log('Firebase initialized successfully:', apps[0].name);
        }
        setIsFirebaseReady(true);
      } catch (error) {
        console.error('Firebase initialization error:', error);
        setIsFirebaseReady(true);
      }
    };
    initializeFirebase();
  }, []);

  if (!isFirebaseReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#7D55FF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar barStyle="light-content" backgroundColor="#7D55FF" />
      <AppNavigator />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
});

export default App;