import { router } from 'expo-router';
import { useCallback, useState } from 'react';

import { getMySubscription } from '../api/subscription.api';

interface StartBookingOptions {
  trainerId: string;
  trainerName?: string;
  trainerImage?: string;
}

/**
 * Gates "Book a session" on having an active subscription. If the client already
 * has one (GET /subscriptions/me returns an active sub — reusable across
 * trainers; the backend enforces remaining sessions), go straight to booking
 * without paying again. Otherwise route to the subscription page, carrying the
 * trainer so the purchase is attributed to them. If the check fails we err
 * toward showing the subscription page rather than letting an unentitled user
 * into booking.
 */
export function useBookingGate() {
  const [checking, setChecking] = useState(false);

  const goToSubscription = useCallback((opts: StartBookingOptions) => {
    router.push({
      pathname: '/(main)/subscription/plans',
      params: {
        trainerId: opts.trainerId,
        trainerName: opts.trainerName ?? '',
        trainerImage: opts.trainerImage ?? '',
      },
    } as never);
  }, []);

  const startBooking = useCallback(
    async (opts: StartBookingOptions) => {
      setChecking(true);
      try {
        const subscription = await getMySubscription();
        if (subscription && subscription.status === 'active') {
          // Reuse the existing subscription — no second payment.
          router.push({
            pathname: '/book-a-session',
            params: { trainerId: opts.trainerId },
          } as never);
        } else {
          goToSubscription(opts);
        }
      } catch {
        goToSubscription(opts);
      } finally {
        setChecking(false);
      }
    },
    [goToSubscription],
  );

  return { startBooking, checking };
}
