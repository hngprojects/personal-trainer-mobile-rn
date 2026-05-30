import { useQuery } from '@tanstack/react-query';

import { fetchNotifications } from '../api/notifications.api';

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: fetchNotifications,
    staleTime: 30_000,
  });
}
