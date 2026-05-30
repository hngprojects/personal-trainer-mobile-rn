import { useQuery } from '@tanstack/react-query';

import { fetchTrainers } from '../api/trainers.api';

export function useTrainers(category?: string | null) {
  return useQuery({
    queryKey: ['trainers', category ?? 'all'],
    queryFn: () => fetchTrainers(category),
  });
}
