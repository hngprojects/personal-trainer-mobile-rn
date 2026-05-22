import { useQuery } from '@tanstack/react-query';

import { fetchDiscoverySlots } from '../api/bookings.api';

export function useDiscoverySlots(timezone?: string) {
  return useQuery({
    queryKey: ['discovery-slots', timezone ?? 'local'],
    queryFn: () => fetchDiscoverySlots(timezone),
    staleTime: 60_000,
  });
}
