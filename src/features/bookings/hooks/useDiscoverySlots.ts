import { useQuery } from '@tanstack/react-query';

import { fetchDiscoverySlots } from '../api/bookings.api';

export function useDiscoverySlots(timezone?: string) {
  return useQuery({
    queryKey: ['discovery-slots', timezone ?? 'local'],
    queryFn: () => fetchDiscoverySlots(timezone),
    // Slots can be added or removed at any time — refetch every time the
    // booking screen mounts so users don't see a stale calendar.
    staleTime: 0,
    refetchOnMount: 'always',
  });
}
