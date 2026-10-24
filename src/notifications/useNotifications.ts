/**
 * useNotifications
 * - useNotificationSetup(): starts push/local notifications once signed in
 * - useNotificationInbox(): inbox items + unread count for the bell icon
 */

import { useEffect, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { notificationService } from './NotificationService';
import { InboxItem, getInbox, onInboxChanged } from './notificationStore';

/** Mount once on the signed-in home screen. */
export const useNotificationSetup = (): void => {
  useEffect(() => {
    notificationService.start();

    // Pick up pushes the system showed while the app was closed
    const sub = AppState.addEventListener('change', state => {
      if (state === 'active') notificationService.importTrayNotifications();
    });
    return () => sub.remove();
  }, []);
};

export const useNotificationInbox = () => {
  const [items, setItems] = useState<InboxItem[]>([]);

  const refresh = useCallback(async () => setItems(await getInbox()), []);

  useEffect(() => {
    refresh();
    return onInboxChanged(refresh);
  }, [refresh]);

  return { items, unreadCount: items.filter(i => !i.read).length };
};
