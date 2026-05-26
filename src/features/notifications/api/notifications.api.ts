import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

import type { DeviceTokenRegisterRequest } from './notifications.types';

const REGISTER_TOKEN_ENDPOINT = '/users/me/device-token';

async function registerDeviceToken(payload: DeviceTokenRegisterRequest): Promise<void> {
  // This targets the backend API for push token registration.
  // Using the shared Axios client which auto-injects the access token in headers.
  await client.post<ApiEnvelope<null>>(REGISTER_TOKEN_ENDPOINT, {
    token: payload.token,
    platform: payload.platform,
    user_id: payload.userId,
  });
}

export const notificationsApi = {
  registerDeviceToken,
};
