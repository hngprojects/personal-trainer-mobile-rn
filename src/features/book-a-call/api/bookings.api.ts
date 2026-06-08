import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';
import type { OutreachMethod } from '@/features/bookings';

export interface BookDiscoveryCallRequest {
  name: string;
  email: string;
  contact_mode: OutreachMethod;
  /** Required for `phone_callback` and `imessage` (E.164). */
  phone_number: string;
  /** Required for `messenger`. */
  messenger_handle?: string;
  trainer_id: string;
  selected_datetime: string;
  timezone: string;
}

export async function bookDiscoveryCall(payload: BookDiscoveryCallRequest): Promise<string> {
  const response = await client.post<ApiEnvelope<string>>('/bookings/discovery', payload);

  return response.data.data;
}
