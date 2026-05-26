import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

import type { DeviceTokenRegisterRequest } from './notifications.types';

const REGISTER_TOKEN_ENDPOINT = '/users/me/device-token';

function serializeRegistrationPayload(payload: DeviceTokenRegisterRequest) {
  return {
    token: payload.token,
    platform: payload.platform,
    user_id: payload.userId,
  };
}

async function registerDeviceToken(payload: DeviceTokenRegisterRequest): Promise<void> {
  // Centralized Axios client automatically injects authorization header
  await client.post<ApiEnvelope<null>>(
    REGISTER_TOKEN_ENDPOINT,
    serializeRegistrationPayload(payload),
  );
}

export const notificationsApi = {
  registerDeviceToken,
};
