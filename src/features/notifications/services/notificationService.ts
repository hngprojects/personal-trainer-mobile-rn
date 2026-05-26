import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';

import { secureStorage } from '@/shared/storage/secureStorage';
import { notificationsApi } from '../api/notifications.api';
import type { NotificationType } from '../api/notifications.types';
import { useNotificationStore } from '../store/notifications.store';

const EXPO_PUSH_API_URL = 'https://exp.host/--/api/v2/push/send';

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function registerTokenWithBackend(userId: string, token: string): Promise<void> {
  const store = useNotificationStore.getState();
  store.setRegistering(true);
  store.addLog('info', 'Registering device push token with backend...', `Token: ${token}`);

  const maxAttempts = 3;
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const platform =
        Platform.OS === 'ios' ? 'ios' : Platform.OS === 'android' ? 'android' : 'web';

      // Attempt API request
      await notificationsApi.registerDeviceToken({
        userId,
        token,
        platform,
      });

      // Save token securely on device to mark it as registered
      await secureStorage.saveDevicePushToken(token);

      store.setPermissionStatus('granted');
      store.setDeviceToken(token);
      store.addLog(
        'success',
        'Device token successfully registered with backend!',
        `Platform: ${platform}\nToken: ${token}`,
      );
      store.setRegistering(false);
      return;
    } catch (error: any) {
      lastError = error;
      const status = error.status ? `(Status: ${error.status})` : '';

      store.addLog(
        'warning',
        `Registration attempt ${attempt} failed ${status}: ${error.message || error}`,
        attempt < maxAttempts ? `Retrying in ${Math.pow(2, attempt)}s...` : 'No more retries left.',
      );

      if (attempt < maxAttempts) {
        await sleep(Math.pow(2, attempt) * 1000);
      }
    }
  }

  // If we reach here, registration failed all retries
  store.addLog(
    'error',
    'Push token registration failed after all retry attempts. Fallback to mock registration.',
    `Reason: ${lastError?.message || lastError}`,
  );

  // Set store state anyway so mock delivery works even if backend fails/is off-grid
  store.setDeviceToken(token);
  store.setRegistering(false);
}

interface TriggerNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, any>;
  deliveryMode: 'push' | 'local';
}

async function triggerNotification(params: TriggerNotificationParams): Promise<boolean> {
  const store = useNotificationStore.getState();
  const { type, title, body, data, deliveryMode } = params;

  store.addLog(
    'info',
    `Triggering ${type} alert (${deliveryMode} mode)`,
    `Title: ${title}\nBody: ${body}`,
  );

  const token = store.deviceToken;
  const isExpoToken = token && token.startsWith('ExponentPushToken');

  if (deliveryMode === 'push' && isExpoToken) {
    // Attempt standard Expo Push API send
    try {
      const response = await fetch(EXPO_PUSH_API_URL, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: token,
          sound: 'default',
          title,
          body,
          data: { ...data, type },
        }),
      });

      if (response.ok) {
        store.addLog(
          'success',
          `Remote push notification dispatched successfully via Expo Push API`,
        );
        return true;
      } else {
        const text = await response.text();
        throw new Error(`Expo API returned ${response.status}: ${text}`);
      }
    } catch (error: any) {
      store.addLog(
        'warning',
        `Expo Push API delivery failed. Falling back to background simulator.`,
        error.message || error,
      );
      // Fall through to local background simulation on failure
    }
  }

  // Simulator Fallback (or if local mode is explicitly selected / no push token exists)
  try {
    store.addLog(
      'info',
      'Scheduling local notification with 2-second delay to simulate background push...',
      'Tip: Lock your device or press Home now to test background banner!',
    );

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: store.settings.soundEnabled ? 'default' : undefined,
        data: { ...data, type },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 2,
      },
    });

    return true;
  } catch (error: any) {
    store.addLog('error', 'Failed to schedule local notification', error.message || error);
    return false;
  }
}

export const notificationService = {
  registerTokenWithBackend,
  triggerNotification,
};
