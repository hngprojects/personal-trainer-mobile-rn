import { useQuery } from '@tanstack/react-query';

import { fetchTrainerAvailability } from '../api/trainers.api';

export function useTrainerAvailability(id?: string | null) {
  return useQuery({
    queryKey: ['trainer-availability', id],
    queryFn: () => fetchTrainerAvailability(id as string),
    enabled: Boolean(id),
  });
}
