import { useInfiniteQuery } from '@tanstack/react-query';

import { fetchTrainersPage } from '../api/trainers.api';

const TRAINERS_PAGE_SIZE = 10;

export function useInfiniteTrainers(category?: string | null) {
  return useInfiniteQuery({
    queryKey: ['trainers', 'infinite', category ?? 'all'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) =>
      fetchTrainersPage({
        category,
        page: pageParam,
        limit: TRAINERS_PAGE_SIZE,
      }),
    getNextPageParam: (lastPage) => (lastPage.hasNextPage ? lastPage.page + 1 : undefined),
  });
}
