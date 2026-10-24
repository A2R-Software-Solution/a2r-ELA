/**
 * Notification Service
 *
 * - Push (FCM): permission, device token registration, foreground display,
 *   "announcements" topic. Streak-at-risk and essay-feedback pushes are sent
 *   by the backend.
 * - Local (notifee): the daily practice reminder.
 * - Everything received is mirrored into the in-app inbox (bell icon).
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import notifee, {
  AndroidImportance,
  AuthorizationStatus,
  Event,
  EventType,
  RepeatFrequency,
  TriggerType,
} from '@notifee/react-native';
import {
  FirebaseMessagingTypes,
  getInitialNotification,
  getMessaging,
  getToken,
  onMessage,
  onNotificationOpenedApp,
  onTokenRefresh,
  subscribeToTopic,
  unsubscribeFromTopic,
  deleteToken,
} from '@react-native-firebase/messaging';
import { apiService } from '../api/apiService';
import {
  NotificationSettings,
  NotificationType,
  addToInbox,
  getInbox,
  getSettings,
  saveSettings,
} from './notificationStore';

const CHANNEL_GENERAL = 'general'; // must match ANDROID_CHANNEL_ID in the backend
const CHANNEL_REMINDERS = 'reminders';
const DAILY_REMINDER_ID = 'daily-practice-reminder';
const TOPIC_ANNOUNCEMENTS = 'announcements';
const KEY_LAST_TRAY_IMPORT = '@elearning_app:notification_last_tray_import';

const KNOWN_TYPES: NotificationType[] = [
  'daily_reminder',
  'streak_at_risk',
  'essay_feedback',
  'announcement',
];

const toType = (raw?: unknown): NotificationType =>
  KNOWN_TYPES.includes(raw as NotificationType)
    ? (raw as NotificationType)
    : 'announcement';

class NotificationService {
  private started = false;
  private token: string | null = null;
  private unsubscribers: Array<() => void> = [];

  // --------------------------------------------------------------------------
  // PERMISSION
  // --------------------------------------------------------------------------

  async hasPermission(): Promise<boolean> {
    const s = await notifee.getNotificationSettings();
    return (
      s.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      s.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  /** Shows the system permission prompt (no-op if already decided). */
  async requestPermission(): Promise<boolean> {
    const s = await notifee.requestPermission();
    return (
      s.authorizationStatus === AuthorizationStatus.AUTHORIZED ||
      s.authorizationStatus === AuthorizationStatus.PROVISIONAL
    );
  }

  openSystemSettings(): Promise<void> {
    return notifee.openNotificationSettings();
  }

  // --------------------------------------------------------------------------
  // START / STOP
  // --------------------------------------------------------------------------

  /**
   * Call once the user is signed in (guests included). Safe to call repeatedly.
   */
  async start(): Promise<void> {
    if (this.started) return;
    this.started = true;

    try {
      await this.createChannels();

      const granted = await this.requestPermission();
      if (!granted) {
        this.started = false; // let the user retry after enabling in settings
        return;
      }

      const messaging = getMessaging();
      const settings = await getSettings();

      this.token = await getToken(messaging);
      await this.registerToken(settings);

      this.unsubscribers.push(
        onTokenRefresh(messaging, async token => {
          this.token = token;
          await this.registerToken(await getSettings());
        }),
        onMessage(messaging, remote => this.handleForegroundMessage(remote)),
        onNotificationOpenedApp(messaging, remote => this.addRemote(remote)),
        notifee.onForegroundEvent(this.handleNotifeeEvent),
      );

      // App launched by tapping a push while it was killed
      const initial = await getInitialNotification(messaging);
      if (initial) await this.addRemote(initial);

      await this.applySettings(settings);
      await this.importTrayNotifications();
    } catch (error) {
      // Notifications are a nice-to-have — never break the app over them
      console.error('NotificationService: start failed', error);
      this.started = false;
    }
  }

  /** Call when the user signs out or deletes their account. */
  async stop(): Promise<void> {
    this.unsubscribers.forEach(u => u());
    this.unsubscribers = [];
    this.started = false;

    try {
      if (this.token) {
        await apiService.unregisterDeviceToken(this.token);
        await deleteToken(getMessaging());
        this.token = null;
      }
    } catch (error) {
      console.error('NotificationService: stop failed', error);
    }
  }

  // --------------------------------------------------------------------------
  // SETTINGS
  // --------------------------------------------------------------------------

  /** Persists and applies settings: local reminder, topic, backend streak flag. */
  async applySettings(settings: NotificationSettings): Promise<void> {
    await saveSettings(settings);

    try {
      if (settings.dailyReminder) {
        await this.scheduleDailyReminder(settings.reminderHour, settings.reminderMinute);
      } else {
        await notifee.cancelTriggerNotification(DAILY_REMINDER_ID);
      }

      const messaging = getMessaging();
      if (settings.announcements) {
        await subscribeToTopic(messaging, TOPIC_ANNOUNCEMENTS);
      } else {
        await unsubscribeFromTopic(messaging, TOPIC_ANNOUNCEMENTS);
      }

      await this.registerToken(settings);
    } catch (error) {
      console.error('NotificationService: applySettings failed', error);
    }
  }

  private async registerToken(settings: NotificationSettings): Promise<void> {
    if (!this.token) return;
    try {
      await apiService.registerDeviceToken(
        this.token,
        Platform.OS === 'ios' ? 'ios' : 'android',
        settings.streakAlerts,
      );
    } catch (error) {
      console.error('NotificationService: token registration failed', error);
    }
  }

  // --------------------------------------------------------------------------
  // LOCAL DAILY REMINDER
  // --------------------------------------------------------------------------

  private async scheduleDailyReminder(hour: number, minute: number): Promise<void> {
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);

    // Same id replaces any previously scheduled reminder
    await notifee.createTriggerNotification(
      {
        id: DAILY_REMINDER_ID,
        title: 'Time to practice! 📚',
        body: 'A few minutes today keeps your skills sharp.',
        data: { type: 'daily_reminder' },
        android: { channelId: CHANNEL_REMINDERS, pressAction: { id: 'default' } },
      },
      {
        type: TriggerType.TIMESTAMP,
        timestamp: next.getTime(),
        repeatFrequency: RepeatFrequency.DAILY,
      },
    );
  }

  // --------------------------------------------------------------------------
  // RECEIVING
  // --------------------------------------------------------------------------

  private async createChannels(): Promise<void> {
    if (Platform.OS !== 'android') return;
    await notifee.createChannel({
      id: CHANNEL_GENERAL,
      name: 'General',
      importance: AndroidImportance.HIGH,
    });
    await notifee.createChannel({
      id: CHANNEL_REMINDERS,
      name: 'Practice reminders',
      importance: AndroidImportance.DEFAULT,
    });
  }

  /** FCM does not display pushes while the app is open — show them ourselves. */
  private async handleForegroundMessage(
    remote: FirebaseMessagingTypes.RemoteMessage,
  ): Promise<void> {
    const title = remote.notification?.title;
    const body = remote.notification?.body;
    if (!title && !body) return;

    await notifee.displayNotification({
      id: remote.messageId,
      title,
      body,
      data: remote.data as Record<string, string> | undefined,
      android: { channelId: CHANNEL_GENERAL, pressAction: { id: 'default' } },
    });
    await this.addRemote(remote);
  }

  private async addRemote(remote: FirebaseMessagingTypes.RemoteMessage): Promise<void> {
    const title = remote.notification?.title ?? '';
    const body = remote.notification?.body ?? '';
    if (!title && !body) return;

    await addToInbox({
      id: remote.messageId ?? `${title}|${body}|${remote.sentTime ?? Date.now()}`,
      title,
      body,
      type: toType(remote.data?.type),
      receivedAt: remote.sentTime,
      data: remote.data as Record<string, string> | undefined,
    });
  }

  private handleNotifeeEvent = async ({ type, detail }: Event): Promise<void> => {
    // A tap on a local/foreground notification just opens the app;
    // make sure it is in the inbox.
    if (type !== EventType.PRESS || !detail.notification) return;
    const n = detail.notification;
    await addToInbox({
      id: n.id ?? `${n.title}|${Date.now()}`,
      title: n.title ?? '',
      body: n.body ?? '',
      type: toType(n.data?.type),
      data: n.data as Record<string, string> | undefined,
    });
  };

  /**
   * Pushes that arrived while the app was closed are shown by the system and
   * never reach JS. Pull whatever is still in the tray into the inbox.
   * Call on app start and whenever the app returns to the foreground.
   */
  async importTrayNotifications(): Promise<void> {
    try {
      const last = Number((await AsyncStorage.getItem(KEY_LAST_TRAY_IMPORT)) ?? 0);
      const displayed = await notifee.getDisplayedNotifications();
      const known = new Set((await getInbox()).map(i => i.id));
      const now = Date.now();

      for (const { id, notification, date } of displayed) {
        const postedAt = Number(date ?? 0);
        if (postedAt && postedAt <= last) continue;
        if (!notification.title && !notification.body) continue;
        // Already added by the foreground handler
        if (id && known.has(id)) continue;

        await addToInbox({
          id: `${id ?? notification.title}:${postedAt || now}`,
          title: notification.title ?? '',
          body: notification.body ?? '',
          type: toType(notification.data?.type),
          receivedAt: postedAt || now,
          data: notification.data as Record<string, string> | undefined,
        });
      }

      await AsyncStorage.setItem(KEY_LAST_TRAY_IMPORT, String(now));
    } catch (error) {
      console.error('NotificationService: tray import failed', error);
    }
  }
}

export const notificationService = new NotificationService();
