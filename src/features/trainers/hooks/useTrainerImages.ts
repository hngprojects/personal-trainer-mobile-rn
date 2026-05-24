import { useQuery } from '@tanstack/react-query';

import { fetchTrainerImages } from '../api/trainers.api';

export function useTrainerImages(id?: string | null) {
  return useQuery({
    queryKey: ['trainer-images', id],
    queryFn: () => fetchTrainerImages(id as string),
    enabled: Boolean(id),
  });
}
