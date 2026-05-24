import { useQuery } from '@tanstack/react-query';

import { fetchSessionById } from '../api/sessions.api';

export function useSessionDetails(id?: string | null) {
  return useQuery({
    queryKey: ['session', id],
    // `enabled` prevents auto-execution, but a manual refetch() can still
    // invoke queryFn. Guard against a missing id at runtime instead of
    // casting it through.
    queryFn: () => {
      if (!id) throw new Error('useSessionDetails called without a session id');
      return fetchSessionById(id);
    },
    enabled: Boolean(id),
  });
}
