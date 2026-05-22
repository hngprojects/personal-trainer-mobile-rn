import { useQuery } from '@tanstack/react-query';

import { fetchTrainerById } from '../api/trainers.api';

export function useTrainer(id?: string | null) {
  return useQuery({
    queryKey: ['trainer', id],
    queryFn: () => fetchTrainerById(id as string),
    enabled: Boolean(id),
  });
}
