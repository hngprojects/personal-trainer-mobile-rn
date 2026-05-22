import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

export interface BookDiscoveryCallRequest {
  name: string;
  email: string;
  contact_mode: 'zoom_meeting' | 'phone_callback';
  phone_number: string;
  trainer_id: string;
  selected_datetime: string;
  timezone: string;
}

export async function bookDiscoveryCall(payload: BookDiscoveryCallRequest): Promise<string> {
  const response = await client.post<ApiEnvelope<string>>('/bookings/discovery', payload);

  return response.data.data;
}
