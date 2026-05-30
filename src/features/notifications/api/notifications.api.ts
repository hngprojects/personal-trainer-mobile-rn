import { client } from '@/shared/api/client';
import { env } from '@/shared/constants/env';
import type { ApiEnvelope } from '@/shared/api/types';

export interface UserNotification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: string | null;
  status: string | null;
  idempotencyKey: string | null;
  retryCount: number | null;
  sentAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

type UnknownRecord = Record<string, unknown>;

export async function fetchNotifications(): Promise<UserNotification[]> {
  const response = await client.get<ApiEnvelope<unknown>>('/notifications');
  return extractNotifications(response.data.data)
    .map(normalizeNotification)
    .filter((item): item is UserNotification => item !== null);
}

export function getNotificationsWebSocketUrl(accessToken: string): string {
  const base = env.API_BASE_URL.replace(/^http/, 'ws').replace(/\/$/, '');
  return `${base}/notifications/ws?token=${encodeURIComponent(accessToken)}`;
}

function extractNotifications(data: unknown): unknown[] {
  if (Array.isArray(data)) return data;
  if (!isRecord(data)) return [];

  for (const key of ['notifications', 'items', 'results', 'data']) {
    const value = data[key];
    if (Array.isArray(value)) return value;
  }

  if (typeof data.id === 'string') return [data];

  return [];
}

export function normalizeNotification(raw: unknown): UserNotification | null {
  if (!isRecord(raw)) return null;

  const id = pickString(raw, ['id', 'notification_id']);
  if (!id) return null;

  return {
    id,
    userId: pickString(raw, ['user_id', 'userId']),
    title: pickString(raw, ['title']) ?? 'Notification',
    message: pickString(raw, ['message', 'body', 'description']) ?? '',
    type: pickString(raw, ['type']),
    status: pickString(raw, ['status']),
    idempotencyKey: pickString(raw, ['idempotency_key', 'idempotencyKey']),
    retryCount: pickNumber(raw, ['retry_count', 'retryCount']),
    sentAt: pickString(raw, ['sent_at', 'sentAt']),
    createdAt: pickString(raw, ['created_at', 'createdAt']),
    updatedAt: pickString(raw, ['updated_at', 'updatedAt']),
  };
}

function pickString(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'string' && value.length > 0) return value;
  }
  return null;
}

function pickNumber(record: UnknownRecord, keys: string[]) {
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && Number.isFinite(value)) return value;
    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === 'object' && value !== null;
}
