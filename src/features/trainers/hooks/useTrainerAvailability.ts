import { useQuery } from '@tanstack/react-query';

import { fetchTrainerAvailability } from '../api/trainers.api';

export function useTrainerAvailability(id?: string | null) {
  return useQuery({
    queryKey: ['trainer-availability', id],
    queryFn: () => fetchTrainerAvailability(id as string),
    enabled: Boolean(id),
    // Availability changes when a trainer edits their schedule — refetch on
    // mount so the booking screen never shows a stale calendar.
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
