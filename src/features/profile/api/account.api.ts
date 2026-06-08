import { client } from '@/shared/api/client';
import type { ApiEnvelope } from '@/shared/api/types';

/**
 * POST /users/me/deactivate — user-initiated soft delete. The account becomes
 * inactive: the user can still log in but is blocked on every protected route
 * until they reactivate. Throws ApiError(409) if already deactivated.
 */
async function deactivateAccount(): Promise<string> {
  const res = await client.post<ApiEnvelope<string>>('/users/me/deactivate');
  return res.data.data;
}

/**
 * POST /users/me/reactivate — restore a deactivated account. Exempt from the
 * deactivation middleware, so a deactivated (but logged-in) user can call it.
 * Throws ApiError(409) if the account is already active.
 */
async function reactivateAccount(): Promise<string> {
  const res = await client.post<ApiEnvelope<string>>('/users/me/reactivate');
  return res.data.data;
}

/**
 * DELETE /users/me — irreversible. Permanently deletes the account and all
 * associated data. Only client accounts can self-delete (403 otherwise).
 */
async function deleteAccount(): Promise<string> {
  const res = await client.delete<ApiEnvelope<string>>('/users/me');
  return res.data.data;
}

export const accountApi = { deactivateAccount, reactivateAccount, deleteAccount };
