/**
 * App.tsx
 * Root component of the application
 */

import React from 'react';
import { StatusBar } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';


const App = () => {
  return (
    <>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#7D55FF"
      />
      <AppNavigator />
    </>
  );
};

export default App;