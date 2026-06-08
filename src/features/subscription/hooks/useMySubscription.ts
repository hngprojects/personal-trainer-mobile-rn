import { useQuery } from '@tanstack/react-query';

import { getMySubscription } from '../api/subscription.api';

export const MY_SUBSCRIPTION_QUERY_KEY = ['subscription', 'me'] as const;

/** The authenticated client's active subscription (null if none). */
export function useMySubscription() {
  return useQuery({
    queryKey: MY_SUBSCRIPTION_QUERY_KEY,
    queryFn: getMySubscription,
  });
}
