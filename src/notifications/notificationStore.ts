/**
 * Notification Store
 * Local inbox (AsyncStorage) behind the bell icon + notification settings.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const KEY_INBOX = '@elearning_app:notification_inbox';
const KEY_SETTINGS = '@elearning_app:notification_settings';
const MAX_ITEMS = 50;

export type NotificationType =
  | 'daily_reminder'
  | 'streak_at_risk'
  | 'essay_feedback'
  | 'announcement'
  | 'other';

export interface InboxItem {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  receivedAt: number;
  read: boolean;
  data?: Record<string, string>;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  /** 24h clock, local time */
  reminderHour: number;
  reminderMinute: number;
  streakAlerts: boolean;
  announcements: boolean;
}

export const DEFAULT_SETTINGS: NotificationSettings = {
  dailyReminder: true,
  reminderHour: 18,
  reminderMinute: 0,
  streakAlerts: true,
  announcements: true,
};

type Listener = () => void;
const listeners = new Set<Listener>();
const notify = () => listeners.forEach(l => l());

/** Subscribe to inbox changes. Returns an unsubscribe function. */
export const onInboxChanged = (listener: Listener): (() => void) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const getInbox = async (): Promise<InboxItem[]> => {
  try {
    const raw = await AsyncStorage.getItem(KEY_INBOX);
    return raw ? (JSON.parse(raw) as InboxItem[]) : [];
  } catch (error) {
    console.error('notificationStore: failed to read inbox', error);
    return [];
  }
};

const saveInbox = async (items: InboxItem[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY_INBOX, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch (error) {
    console.error('notificationStore: failed to save inbox', error);
  }
  notify();
};

/** Adds a notification (newest first). Items with an id already stored are ignored. */
export const addToInbox = async (
  item: Omit<InboxItem, 'read' | 'receivedAt'> & { receivedAt?: number },
): Promise<void> => {
  const items = await getInbox();
  if (items.some(i => i.id === item.id)) return;
  await saveInbox([
    { ...item, receivedAt: item.receivedAt ?? Date.now(), read: false },
    ...items,
  ]);
};

export const markAllRead = async (): Promise<void> => {
  const items = await getInbox();
  if (items.every(i => i.read)) return;
  await saveInbox(items.map(i => ({ ...i, read: true })));
};

export const markRead = async (id: string): Promise<void> => {
  const items = await getInbox();
  await saveInbox(items.map(i => (i.id === id ? { ...i, read: true } : i)));
};

export const clearInbox = async (): Promise<void> => saveInbox([]);

export const getSettings = async (): Promise<NotificationSettings> => {
  try {
    const raw = await AsyncStorage.getItem(KEY_SETTINGS);
    return { ...DEFAULT_SETTINGS, ...(raw ? JSON.parse(raw) : {}) };
  } catch (error) {
    console.error('notificationStore: failed to read settings', error);
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = async (settings: NotificationSettings): Promise<void> => {
  try {
    await AsyncStorage.setItem(KEY_SETTINGS, JSON.stringify(settings));
  } catch (error) {
    console.error('notificationStore: failed to save settings', error);
  }
};
