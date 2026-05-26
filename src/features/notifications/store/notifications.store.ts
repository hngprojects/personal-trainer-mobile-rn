import { asyncStorage } from '@/shared/storage/asyncStorage';
import { createStore } from '@/shared/store/factory';

import type {
  NotificationItem,
  NotificationLog,
  NotificationSettings,
} from '../api/notifications.types';

interface NotificationsState {
  permissionStatus: 'granted' | 'denied' | 'undetermined';
  deviceToken: string | null;
  notifications: NotificationItem[];
  logs: NotificationLog[];
  settings: NotificationSettings;
  isRegistering: boolean;
}

interface NotificationsActions {
  setPermissionStatus: (status: 'granted' | 'denied' | 'undetermined') => void;
  setDeviceToken: (token: string | null) => void;
  addNotification: (notification: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  addLog: (
    level: 'info' | 'success' | 'warning' | 'error',
    message: string,
    details?: string,
  ) => void;
  clearLogs: () => void;
  updateSettings: (patch: Partial<NotificationSettings>) => void;
  setRegistering: (loading: boolean) => void;
  loadPersistedData: () => Promise<void>;
}

const DEFAULT_SETTINGS: NotificationSettings = {
  workoutReminders: true,
  trainerMessages: true,
  sessionAlerts: true,
  progressUpdates: true,
  soundEnabled: true,
  vibrateEnabled: true,
};

const STORAGE_KEYS_NOTIF = {
  SETTINGS: 'app_notif_settings',
  ITEMS: 'app_notif_items',
  LOGS: 'app_notif_logs',
};

export const useNotificationStore = createStore<NotificationsState & NotificationsActions>(
  (set, get) => ({
    permissionStatus: 'undetermined',
    deviceToken: null,
    notifications: [],
    logs: [],
    settings: DEFAULT_SETTINGS,
    isRegistering: false,

    setPermissionStatus: (permissionStatus) => set({ permissionStatus }),

    setDeviceToken: (deviceToken) => set({ deviceToken }),

    addNotification: (notif) => {
      const newNotif: NotificationItem = {
        ...notif,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        read: false,
      };
      const nextNotifications = [newNotif, ...get().notifications];
      set({ notifications: nextNotifications });
      asyncStorage.setItem(STORAGE_KEYS_NOTIF.ITEMS, nextNotifications).catch(() => undefined);

      // Auto-log notification receipt
      get().addLog(
        'success',
        `Received notification: "${notif.title}"`,
        `Type: ${notif.type}\nBody: ${notif.body}`,
      );
    },

    markAsRead: (id) => {
      const nextNotifications = get().notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n,
      );
      set({ notifications: nextNotifications });
      asyncStorage.setItem(STORAGE_KEYS_NOTIF.ITEMS, nextNotifications).catch(() => undefined);
    },

    markAllAsRead: () => {
      const nextNotifications = get().notifications.map((n) => ({ ...n, read: true }));
      set({ notifications: nextNotifications });
      asyncStorage.setItem(STORAGE_KEYS_NOTIF.ITEMS, nextNotifications).catch(() => undefined);
    },

    clearNotifications: () => {
      set({ notifications: [] });
      asyncStorage.removeItem(STORAGE_KEYS_NOTIF.ITEMS).catch(() => undefined);
    },

    addLog: (level, message, details) => {
      const newLog: NotificationLog = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
        level,
        message,
        details,
      };
      const nextLogs = [newLog, ...get().logs].slice(0, 100); // Keep last 100 logs
      set({ logs: nextLogs });
      asyncStorage.setItem(STORAGE_KEYS_NOTIF.LOGS, nextLogs).catch(() => undefined);
    },

    clearLogs: () => {
      set({ logs: [] });
      asyncStorage.removeItem(STORAGE_KEYS_NOTIF.LOGS).catch(() => undefined);
    },

    updateSettings: (patch) => {
      const nextSettings = { ...get().settings, ...patch };
      set({ settings: nextSettings });
      asyncStorage.setItem(STORAGE_KEYS_NOTIF.SETTINGS, nextSettings).catch(() => undefined);
      get().addLog('info', 'Notification settings updated');
    },

    setRegistering: (isRegistering) => set({ isRegistering }),

    loadPersistedData: async () => {
      try {
        const [savedSettings, savedItems, savedLogs] = await Promise.all([
          asyncStorage.getItem<NotificationSettings>(STORAGE_KEYS_NOTIF.SETTINGS),
          asyncStorage.getItem<NotificationItem[]>(STORAGE_KEYS_NOTIF.ITEMS),
          asyncStorage.getItem<NotificationLog[]>(STORAGE_KEYS_NOTIF.LOGS),
        ]);

        set({
          settings: savedSettings ?? DEFAULT_SETTINGS,
          notifications: savedItems ?? [],
          logs: savedLogs ?? [],
        });
      } catch (e) {
        if (__DEV__) {
          console.warn('Failed to load persisted notification data', e);
        }
      }
    },
  }),
);
