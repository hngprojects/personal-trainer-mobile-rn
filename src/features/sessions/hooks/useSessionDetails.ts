import { useQuery } from '@tanstack/react-query';

import { fetchSessionById } from '../api/sessions.api';

export function useSessionDetails(id?: string | null) {
  return useQuery({
    queryKey: ['session', id],
    queryFn: () => fetchSessionById(id as string),
    enabled: Boolean(id),
  });
}
