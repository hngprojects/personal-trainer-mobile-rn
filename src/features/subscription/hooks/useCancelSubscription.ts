import { useMutation, useQueryClient } from '@tanstack/react-query';

import { toast } from '@/shared/components';
import { ApiError } from '@/shared/api/types';

import { cancelSubscription } from '../api/subscription.api';
import { MY_SUBSCRIPTION_QUERY_KEY } from './useMySubscription';
import { SUBSCRIPTION_USAGE_QUERY_KEY } from './useSubscriptionUsage';

/**
 * POST /client/cancel/subscription — cancel the active subscription immediately.
 * Refreshes the cached subscription + usage so the UI reflects the change. A 409
 * (already cancelled) is surfaced as a benign message rather than an error.
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelSubscription,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: SUBSCRIPTION_USAGE_QUERY_KEY });
      toast.success('Your subscription has been cancelled.');
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        // Already cancelled — reconcile the cache and treat as a no-op.
        queryClient.invalidateQueries({ queryKey: MY_SUBSCRIPTION_QUERY_KEY });
        toast.success('Your subscription is already cancelled.');
        return;
      }
      const message =
        error instanceof ApiError
          ? error.message
          : "We couldn't cancel your subscription. Please try again.";
      toast.error(message);
    },
  });
}
