/**
 * @format
 */

import { AppRegistry } from 'react-native';
import notifee from '@notifee/react-native';
import { getMessaging, setBackgroundMessageHandler } from '@react-native-firebase/messaging';
import App from './App';
import { name as appName } from './app.json';

// Required so the OS can deliver events while the app is in the background.
// Pushes themselves are displayed by the system; the inbox imports them when
// the app next opens (see NotificationService.importTrayNotifications).
setBackgroundMessageHandler(getMessaging(), async () => {});
notifee.onBackgroundEvent(async () => {});

AppRegistry.registerComponent(appName, () => App);
