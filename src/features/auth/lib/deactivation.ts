// Defensive deactivation detection from a user object's status flags. The
// backend's exact contract for signalling a soft-deleted (deactivated) account
// isn't fixed, so we check several shapes. The other half of detection — a
// deactivation-shaped 403 on protected routes — lives in the API client.

const INACTIVE_STATUSES = new Set(['inactive', 'deactivated', 'disabled', 'suspended']);

/** True when a user-like object's status flags indicate a deactivated account. */
export function deactivatedFromUser(user: {
  isActive?: boolean | null;
  is_active?: boolean | null;
  active?: boolean | null;
  status?: string | null;
}): boolean {
  if (user.isActive === false || user.is_active === false || user.active === false) return true;
  if (typeof user.status === 'string' && INACTIVE_STATUSES.has(user.status.toLowerCase())) {
    return true;
  }
  return false;
}
