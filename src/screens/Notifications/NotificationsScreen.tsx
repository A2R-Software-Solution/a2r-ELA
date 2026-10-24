import { styles } from './NotificationsScreen.styles';
import ScreenBackground from '../../components/ScreenBackground';
import { colors } from '../../theme/colors';
/**
 * Notifications Screen (bell icon)
 * Inbox of received notifications + notification settings.
 */

import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  SafeAreaView,
  StatusBar,
  AppState,
} from 'react-native';
import { notificationService } from '../../notifications/NotificationService';
import { useNotificationInbox } from '../../notifications/useNotifications';
import {
  DEFAULT_SETTINGS,
  InboxItem,
  NotificationSettings,
  NotificationType,
  clearInbox,
  getSettings,
  markAllRead,
  markRead,
} from '../../notifications/notificationStore';

interface NotificationsScreenProps {
  onBackClick: () => void;
}

const TYPE_EMOJI: Record<NotificationType, string> = {
  daily_reminder: '📚',
  streak_at_risk: '🔥',
  essay_feedback: '✍️',
  announcement: '📣',
  other: '🔔',
};

const REMINDER_TIMES: Array<{ label: string; hour: number }> = [
  { label: '8 AM', hour: 8 },
  { label: '4 PM', hour: 16 },
  { label: '6 PM', hour: 18 },
  { label: '8 PM', hour: 20 },
];

const timeAgo = (ts: number): string => {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
};

const NotificationsScreen: React.FC<NotificationsScreenProps> = ({ onBackClick }) => {
  const { items, unreadCount } = useNotificationInbox();
  const [settings, setSettings] = useState<NotificationSettings>(DEFAULT_SETTINGS);
  const [permitted, setPermitted] = useState(true);

  const checkPermission = useCallback(
    async () => setPermitted(await notificationService.hasPermission()),
    [],
  );

  useEffect(() => {
    getSettings().then(setSettings);
    checkPermission();
    // The user may come back from system settings
    const sub = AppState.addEventListener('change', s => {
      if (s === 'active') checkPermission();
    });
    return () => sub.remove();
  }, [checkPermission]);

  const update = (patch: Partial<NotificationSettings>) => {
    const next = { ...settings, ...patch };
    setSettings(next);
    notificationService.applySettings(next);
  };

  const onEnablePress = async () => {
    // If the OS already denied us, the prompt won't show again — open settings
    const granted = await notificationService.requestPermission();
    if (granted) {
      notificationService.start();
      setPermitted(true);
    } else {
      notificationService.openSystemSettings();
    }
  };

  const renderItem = (item: InboxItem) => (
    <TouchableOpacity
      key={item.id}
      style={styles.item}
      activeOpacity={0.7}
      onPress={() => markRead(item.id)}
    >
      <Text style={styles.itemIcon}>{TYPE_EMOJI[item.type] ?? '🔔'}</Text>
      <View style={styles.itemBody}>
        <Text style={styles.itemTitle}>{item.title}</Text>
        {!!item.body && <Text style={styles.itemText}>{item.body}</Text>}
        <Text style={styles.itemTime}>{timeAgo(item.receivedAt)}</Text>
      </View>
      {!item.read && <View style={styles.unreadDot} />}
    </TouchableOpacity>
  );

  const renderToggle = (
    title: string,
    sub: string,
    value: boolean,
    onChange: (v: boolean) => void,
  ) => (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        <Text style={styles.settingSub}>{sub}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: colors.primary, false: colors.surfaceRaised }}
        thumbColor={value ? colors.accent : colors.subtle}
      />
    </View>
  );

  return (
    <View style={styles.root}>
      <ScreenBackground />
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBackClick}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Notifications</Text>
          {unreadCount > 0 && (
            <TouchableOpacity onPress={markAllRead}>
              <Text style={styles.headerAction}>Mark all read</Text>
            </TouchableOpacity>
          )}
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {!permitted && (
            <View style={styles.banner}>
              <Text style={styles.bannerText}>
                Notifications are turned off for this app.
              </Text>
              <TouchableOpacity onPress={onEnablePress}>
                <Text style={styles.bannerButton}>Enable</Text>
              </TouchableOpacity>
            </View>
          )}

          <View style={styles.card}>
            {items.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyEmoji}>🔔</Text>
                <Text style={styles.emptyText}>You're all caught up</Text>
              </View>
            ) : (
              items.map(renderItem)
            )}
          </View>
          {items.length > 0 && (
            <TouchableOpacity onPress={clearInbox} style={styles.clearButton}>
              <Text style={styles.headerAction}>Clear all</Text>
            </TouchableOpacity>
          )}

          <Text style={styles.sectionTitle}>Settings</Text>
          <View style={styles.card}>
            {renderToggle(
              'Daily practice reminder',
              'A nudge to practice every day',
              settings.dailyReminder,
              v => update({ dailyReminder: v }),
            )}
            {settings.dailyReminder && (
              <View style={styles.timeRow}>
                {REMINDER_TIMES.map(t => {
                  const active =
                    settings.reminderHour === t.hour && settings.reminderMinute === 0;
                  return (
                    <TouchableOpacity
                      key={t.hour}
                      style={[styles.timeChip, active && styles.timeChipActive]}
                      onPress={() => update({ reminderHour: t.hour, reminderMinute: 0 })}
                    >
                      <Text style={[styles.timeChipText, active && styles.timeChipTextActive]}>
                        {t.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}
            {renderToggle(
              'Streak alerts',
              "Warn me when my streak is about to break",
              settings.streakAlerts,
              v => update({ streakAlerts: v }),
            )}
            {renderToggle(
              'Announcements',
              'News and updates from the team',
              settings.announcements,
              v => update({ announcements: v }),
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
};

export default NotificationsScreen;
