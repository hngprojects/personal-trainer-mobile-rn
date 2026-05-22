import { useQuery } from '@tanstack/react-query';

import { BookingType, fetchUpcomingBookings } from '../api/bookings.api';

interface UseUpcomingBookingsOptions {
  timezone?: string;
  type?: BookingType;
  page?: number;
  limit?: number;
}

export function useUpcomingBookings(options: UseUpcomingBookingsOptions = {}) {
  return useQuery({
    queryKey: ['upcoming-bookings', options],
    queryFn: () => fetchUpcomingBookings(options),
    staleTime: 60_000,
  });
}
