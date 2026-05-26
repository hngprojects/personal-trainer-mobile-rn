export type NotificationType = 'workout' | 'trainer' | 'session' | 'progress';

export interface DeviceTokenRegisterRequest {
  userId: string;
  token: string;
  platform: 'ios' | 'android' | 'web';
}

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  timestamp: number;
  read: boolean;
  data?: Record<string, any>;
}

export interface NotificationLog {
  id: string;
  timestamp: number;
  level: 'info' | 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

export interface NotificationSettings {
  workoutReminders: boolean;
  trainerMessages: boolean;
  sessionAlerts: boolean;
  progressUpdates: boolean;
  soundEnabled: boolean;
  vibrateEnabled: boolean;
}
