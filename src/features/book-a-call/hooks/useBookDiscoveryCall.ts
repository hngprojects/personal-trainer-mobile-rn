import { useMutation } from '@tanstack/react-query';

import { bookDiscoveryCall } from '../api/bookings.api';

export function useBookDiscoveryCall() {
  return useMutation({
    mutationFn: bookDiscoveryCall,
  });
}
