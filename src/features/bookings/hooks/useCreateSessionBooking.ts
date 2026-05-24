import { useMutation, useQueryClient } from '@tanstack/react-query';

import { createSessionBooking } from '../api/bookings.api';

export function useCreateSessionBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSessionBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] });
    },
  });
}
