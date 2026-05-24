import { useMutation, useQueryClient } from '@tanstack/react-query';

import { RescheduleBookingRequest, rescheduleBooking } from '../api/bookings.api';

interface RescheduleBookingVariables extends RescheduleBookingRequest {
  id: string;
}

export function useRescheduleBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...payload }: RescheduleBookingVariables) => rescheduleBooking(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['session', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] });
    },
  });
}
