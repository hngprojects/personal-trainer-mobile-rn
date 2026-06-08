import { useMutation, useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { ApiError } from '@/shared/api/types';
import { toast } from '@/shared/components';

import { accountApi } from '../api/account.api';
import { PROFILE_QUERY_KEY } from './useProfile';

// Clearing the session drops the user back to the auth flow via the auth gate —
// reused after deactivate (so the next login surfaces the reactivate prompt) and
// after permanent delete.
function endSession(queryClient: ReturnType<typeof useQueryClient>) {
  useAuthStore.getState().clearSession();
  queryClient.removeQueries({ queryKey: PROFILE_QUERY_KEY as unknown as unknown[] });
}

/**
 * Deactivate (soft delete). On success the account is inactive; we sign the user
 * out so that logging back in surfaces the reactivation prompt. A 409 (already
 * deactivated) is treated the same — just sign out.
 */
export function useDeactivateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApi.deactivateAccount,
    onSuccess: () => {
      toast.success('Your account has been deactivated.');
      endSession(queryClient);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        toast.success('Your account is already deactivated.');
        endSession(queryClient);
        return;
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : "We couldn't deactivate your account. Please try again.",
      );
    },
  });
}

/**
 * Reactivate a deactivated account (the logged-in user calls this from the
 * post-login prompt). On success the account is active again. A 409 (already
 * active) is treated as success.
 */
export function useReactivateAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApi.reactivateAccount,
    onSuccess: () => {
      useAuthStore.getState().setDeactivated(false);
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY as unknown as unknown[] });
      toast.success('Welcome back — your account is active again.');
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 409) {
        useAuthStore.getState().setDeactivated(false);
        return;
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : "We couldn't reactivate your account. Please try again.",
      );
    },
  });
}

/**
 * Permanently delete the account (irreversible). On success the user is signed
 * out. 403 means the account isn't a client account (only clients self-delete).
 */
export function useDeleteAccount() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApi.deleteAccount,
    onSuccess: () => {
      toast.success('Your account has been permanently deleted.');
      endSession(queryClient);
    },
    onError: (error) => {
      if (error instanceof ApiError && error.status === 403) {
        toast.error('Only client accounts can be deleted from the app.');
        return;
      }
      toast.error(
        error instanceof ApiError
          ? error.message
          : "We couldn't delete your account. Please try again.",
      );
    },
  });
}
