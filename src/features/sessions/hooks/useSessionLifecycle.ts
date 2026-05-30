import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ReviewPayload {
  rating: number;
  comment?: string;
}

export function useStartSession(sessionId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error('Cannot start a session without a session id');
      // TODO: Replace with the backend start-session endpoint when it is available.
      return { sessionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] });
    },
  });
}

export function useEndSession(sessionId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error('Cannot end a session without a session id');
      // TODO: Replace with the backend end-session endpoint when it is available.
      return { sessionId };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
      queryClient.invalidateQueries({ queryKey: ['upcoming-bookings'] });
    },
  });
}

export function useSubmitTrainerReview(sessionId?: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ReviewPayload) => {
      if (!sessionId) throw new Error('Cannot review a session without a session id');
      // TODO: Replace with the backend trainer-review endpoint when it is available.
      return { sessionId, ...payload };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['session', sessionId] });
    },
  });
}
