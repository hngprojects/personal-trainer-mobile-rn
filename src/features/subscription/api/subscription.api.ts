import { client } from '@/shared/api/client';
import { ApiError } from '@/shared/api/types';
import type { ApiEnvelope } from '@/shared/api/types';

export type StorePlatform = 'apple' | 'google';

export interface Subscription {
  id: string;
  clientId: string;
  trainerId: string;
  planId: string;
  platform: StorePlatform;
  sessionsPerMonth: number;
  sessionsUsedThisMonth: number;
  amount: number;
  currency: string;
  status: string; // 'active' | 'cancelled' | ...
  currentPeriodStart: string;
  currentPeriodEnd: string;
  createdAt: string;
}

export interface SubscriptionUsage {
  sessionsPerMonth: number;
  sessionsUsed: number;
  sessionsRemaining: number;
  currentPeriodStart: string;
  currentPeriodEnd: string;
}

export interface CreateSubscriptionInput {
  planId: string;
  trainerId: string;
  platform: StorePlatform;
  productId: string;
  /** Apple App Store receipt (sent for platform === 'apple'). */
  receiptData?: string | null;
  /** Google Play purchase token (sent for platform === 'google'). */
  purchaseToken?: string | null;
}

interface RawSubscription {
  id: string;
  client_id: string;
  trainer_id: string;
  plan_id: string;
  platform: StorePlatform;
  sessions_per_month: number;
  sessions_used_this_month: number;
  amount: number;
  currency: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  created_at: string;
}

interface RawUsage {
  sessions_per_month: number;
  sessions_used: number;
  sessions_remaining: number;
  current_period_start: string;
  current_period_end: string;
}

function mapSubscription(d: RawSubscription): Subscription {
  return {
    id: d.id,
    clientId: d.client_id,
    trainerId: d.trainer_id,
    planId: d.plan_id,
    platform: d.platform,
    sessionsPerMonth: d.sessions_per_month,
    sessionsUsedThisMonth: d.sessions_used_this_month,
    amount: d.amount,
    currency: d.currency,
    status: d.status,
    currentPeriodStart: d.current_period_start,
    currentPeriodEnd: d.current_period_end,
    createdAt: d.created_at,
  };
}

function mapUsage(d: RawUsage): SubscriptionUsage {
  return {
    sessionsPerMonth: d.sessions_per_month,
    sessionsUsed: d.sessions_used,
    sessionsRemaining: d.sessions_remaining,
    currentPeriodStart: d.current_period_start,
    currentPeriodEnd: d.current_period_end,
  };
}

/**
 * POST /subscriptions — verify the Apple receipt / Google purchase token and
 * activate the subscription for the authenticated client. Throws ApiError(409)
 * if the receipt/token was already used.
 */
export async function createSubscription(input: CreateSubscriptionInput): Promise<Subscription> {
  const res = await client.post<ApiEnvelope<RawSubscription>>('/subscriptions', {
    plan_id: input.planId,
    trainer_id: input.trainerId,
    platform: input.platform,
    product_id: input.productId,
    ...(input.platform === 'apple'
      ? { receipt_data: input.receiptData }
      : { purchase_token: input.purchaseToken }),
  });
  return mapSubscription(res.data.data);
}

/** GET /subscriptions/me — the client's active subscription, or null if none (404). */
export async function getMySubscription(): Promise<Subscription | null> {
  try {
    const res = await client.get<ApiEnvelope<RawSubscription>>('/subscriptions/me');
    return mapSubscription(res.data.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** GET /subscriptions/me/usage — sessions used/remaining this period, or null (404). */
export async function getMySubscriptionUsage(): Promise<SubscriptionUsage | null> {
  try {
    const res = await client.get<ApiEnvelope<RawUsage>>('/subscriptions/me/usage');
    return mapUsage(res.data.data);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null;
    throw error;
  }
}

/** POST /client/cancel/subscription — cancel the active subscription immediately. */
export async function cancelSubscription(): Promise<Subscription> {
  const res = await client.post<ApiEnvelope<RawSubscription>>('/client/cancel/subscription', {});
  return mapSubscription(res.data.data);
}
