import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { router } from 'expo-router';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { secureStorage } from '@/shared/storage/secureStorage';
import { useNotificationStore } from '../store/notifications.store';
import { notificationService } from '../services/notificationService';
import type { NotificationType } from '../api/notifications.types';

export function usePushNotifications() {
  const { isLoggedIn, user } = useAuthSession();
  const store = useNotificationStore();
  const settings = store.settings;

  const notificationListener = useRef<any>(null);
  const responseListener = useRef<any>(null);

  // 1. Configure foreground notification handler based on user settings
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: settings.soundEnabled,
        shouldSetBadge: true,
        shouldShowBanner: true,
        shouldShowList: true,
      }),
    });
  }, [settings.soundEnabled]);

  // 2. Load persisted notifications and settings on boot
  useEffect(() => {
    store.loadPersistedData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 3. Main Permission and Token Registration Flow
  useEffect(() => {
    let active = true;

    async function setupNotifications() {
      if (!isLoggedIn || !user?.id) {
        // Unconditionally clear tokens on logout to prevent credential leakage
        store.addLog('info', 'User logged out. Clearing device push token session.');
        if (store.deviceToken) {
          store.setDeviceToken(null);
        }
        await secureStorage.clearDevicePushToken();
        return;
      }

      store.addLog('info', 'Initializing notification services...');

      // Check if physical device
      if (!Device.isDevice) {
        store.setPermissionStatus('denied');
        store.addLog(
          'warning',
          'Running on simulator/emulator.',
          'Native push notifications may fail. Local Background simulator fallback is active!',
        );

        // Use a mock push token on simulator so users can still trigger background-simulated notifications
        const mockToken = 'ExponentPushToken[mock_simulator_token]';
        if (store.deviceToken !== mockToken) {
          store.setDeviceToken(mockToken);
          await secureStorage.saveDevicePushToken(mockToken);
          store.addLog('info', 'Mock Simulator Push Token assigned.', mockToken);
        }
        return;
      }

      try {
        // Request Permissions
        const { status: existingStatus } = (await Notifications.getPermissionsAsync()) as any;
        let finalStatus = existingStatus;

        if (existingStatus !== 'granted') {
          const { status } = (await Notifications.requestPermissionsAsync()) as any;
          finalStatus = status;
        }

        if (finalStatus !== 'granted') {
          store.setPermissionStatus('denied');
          store.addLog(
            'error',
            'Push notification permission denied.',
            'Go to system settings to enable notification permissions.',
          );
          return;
        }

        store.setPermissionStatus('granted');

        // Android special configurations (sound channel/importance)
        if (Platform.OS === 'android') {
          await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }

        // Get Expo Push Token
        const projectId =
          Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;

        if (!projectId && __DEV__) {
          store.addLog(
            'warning',
            'EAS Project ID not found in app config.',
            'Push notifications might fail. Using custom project fallback or mock token.',
          );
        }

        const tokenData = await Notifications.getExpoPushTokenAsync({
          projectId: projectId || undefined,
        });
        const token = tokenData.data;

        if (!active) return;

        // Check if token has changed or has not been registered yet
        const lastRegisteredToken = await secureStorage.getDevicePushToken();

        if (token && token !== lastRegisteredToken) {
          await notificationService.registerTokenWithBackend(user.id, token);
        } else if (token) {
          store.setDeviceToken(token);
          store.addLog('info', 'Device push token active & already registered.', token);
        }
      } catch (err: any) {
        store.addLog('error', 'Failed to initialize push notifications.', err.message || err);
      }
    }

    setupNotifications();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn, user?.id]);

  // 4. Notification Listeners Setup
  useEffect(() => {
    // Listen for incoming notifications when the app is in the FOREGROUND
    notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
      const { title, body, data } = notification.request.content;
      const type = (data?.type as NotificationType) || 'workout';

      // Verify category toggles before listing
      const shouldList =
        (type === 'workout' && settings.workoutReminders) ||
        (type === 'trainer' && settings.trainerMessages) ||
        (type === 'session' && settings.sessionAlerts) ||
        (type === 'progress' && settings.progressUpdates);

      if (shouldList) {
        store.addNotification({
          type,
          title: title || 'New Alert',
          body: body || '',
          data: data || undefined,
        });
      }
    });

    const handleResponse = (response: Notifications.NotificationResponse) => {
      const { data } = response.notification.request.content;
      const type = data?.type as NotificationType;

      store.addLog(
        'info',
        'Notification tapped by user',
        `Action type: ${type || 'generic'}\nPlatform: ${Platform.OS}`,
      );

      // Mark tapped notifications as read (if matching)
      if (data?.notificationId) {
        store.markAsRead(data.notificationId as string);
      }

      // Navigate dynamically based on notification details
      // Deep routing can be added here (e.g. going to direct messaging, calendar, or specific workout screen)
      if (type === 'trainer') {
        router.push('/(main)/notifications' as never); // Direct to messages feed
      } else {
        router.push('/(main)/notifications' as never); // Fallback to notifications list
      }
    };

    // Listen for notification TAPS (foreground/background/running state clicks)
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(handleResponse);

    // Retrieve and handle any cold-start (terminated-state) notification tap that launched the app
    Notifications.getLastNotificationResponseAsync()
      .then((lastResponse) => {
        if (lastResponse) {
          handleResponse(lastResponse);
        }
      })
      .catch(() => undefined);

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings]);

  return {
    permissionStatus: store.permissionStatus,
    deviceToken: store.deviceToken,
    notifications: store.notifications,
    logs: store.logs,
    isRegistering: store.isRegistering,
  };
}
