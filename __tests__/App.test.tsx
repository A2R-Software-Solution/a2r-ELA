/**
 * @format
 */

import React from 'react';
import ReactTestRenderer from 'react-test-renderer';
import App from '../App';

jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: { apps: [{ name: '[DEFAULT]' }] },
}));
jest.mock('../src/navigation/AppNavigator', () => {
  const { Text } = require('react-native');
  return () => <Text testID="app-navigator">App ready</Text>;
});

test('renders correctly', async () => {
  let renderer: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
  expect(renderer!.root.findByProps({ testID: 'app-navigator' })).toBeTruthy();
  await ReactTestRenderer.act(async () => renderer!.unmount());
});
