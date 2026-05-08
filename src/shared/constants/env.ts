import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

export const env = {
  API_BASE_URL: extra?.apiBaseUrl ?? 'https://api.example.com',
} as const;
