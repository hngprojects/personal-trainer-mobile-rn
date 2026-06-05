import { useQuery } from '@tanstack/react-query';

import { getMySubscriptionUsage } from '../api/subscription.api';

export const SUBSCRIPTION_USAGE_QUERY_KEY = ['subscription', 'usage'] as const;

/** Sessions used/remaining for the current billing period (null if no sub). */
export function useSubscriptionUsage() {
  return useQuery({
    queryKey: SUBSCRIPTION_USAGE_QUERY_KEY,
    queryFn: getMySubscriptionUsage,
  });
}
