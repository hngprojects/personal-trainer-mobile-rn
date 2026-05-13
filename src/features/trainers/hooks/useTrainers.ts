import { useQuery } from '@tanstack/react-query';

import { fetchTrainers } from '../api/trainers.api';

export function useTrainers() {
  return useQuery({
    queryKey: ['trainers'],
    queryFn: fetchTrainers,
  });
}
