import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

export interface SessionDetails {
  id: string;
  actualStart: string | null;
  actualEnd: string | null;
  trainerJoined: boolean;
  clientJoined: boolean;
  status: string;
  trainerNote: string | null;
  createdAt: string;
}

interface RawSessionDetails {
  id: string;
  actual_start?: string | null;
  actual_end?: string | null;
  scheduled_start?: string | null;
  scheduled_end?: string | null;
  trainer_joined: boolean;
  client_joined: boolean;
  status: string;
  trainer_note: string | null;
  created_at: string;
}

export async function fetchSessionById(id: string): Promise<SessionDetails> {
  const response = await client.get<ApiEnvelope<RawSessionDetails>>(`/sessions/${id}`);
  const session = response.data.data;

  return {
    id: session.id,
    actualStart: session.actual_start ?? session.scheduled_start ?? null,
    actualEnd: session.actual_end ?? session.scheduled_end ?? null,
    trainerJoined: session.trainer_joined,
    clientJoined: session.client_joined,
    status: session.status,
    trainerNote: session.trainer_note,
    createdAt: session.created_at,
  };
}
