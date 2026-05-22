import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  FadeIn,
  FadeInDown,
  SlideInLeft,
  SlideInRight,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import {
  getDiscoverySlotDates,
  getTimezone,
  useDiscoverySlots,
  useUpcomingBookings,
} from '@/features/bookings';
import { trainers } from '@/features/trainers/data/trainers.data';
import { useTrainer } from '@/features/trainers/hooks/useTrainer';
import { ApiError } from '@/shared/api/types';
import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { DateTimeStep } from '../components/DateTimeStep';
import { PlatformStep } from '../components/PlatformStep';
import { SuccessView } from '../components/SuccessView';
import { SummaryStep } from '../components/SummaryStep';
import { useBookDiscoveryCall } from '../hooks/useBookDiscoveryCall';
import { CallDraft } from '../types/book-a-call.types';

type Step = 1 | 2 | 3 | 'success';

const STEP_DURATION = 320;

export function BookACallScreen() {
  const { colors, spacing } = useTheme();
  const { trainerId } = useLocalSearchParams<{ trainerId?: string }>();
  const user = useAuthStore((state) => state.user);
  const { data: fetchedTrainer, isLoading: isTrainerLoading } = useTrainer(trainerId);
  const trainer = fetchedTrainer ?? (!trainerId ? trainers[0] : undefined);
  const bookDiscoveryCall = useBookDiscoveryCall();
  const timezone = getTimezone();
  const { data: discoverySlots = [], isLoading: isLoadingSlots } = useDiscoverySlots(timezone);
  const { data: upcomingBookings = [], isLoading: isLoadingUpcomingBookings } = useUpcomingBookings({
    timezone,
    type: 'discovery',
    limit: 50,
  });
  const areSlotsReady = !isLoadingSlots && !isLoadingUpcomingBookings;
  const availableSlotDates = getDiscoverySlotDates(discoverySlots, upcomingBookings);

  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<CallDraft>({
    contactMode: null,
    phoneNumber: '',
    date: null,
    time: null,
  });
  const [submitError, setSubmitError] = useState<string | null>(null);
  // Tracks whether the user is moving forward or backward so the step content
  // can slide in from the correct edge.
  const direction = useRef<'forward' | 'backward'>('forward');

  const progress = useSharedValue(1 / 3);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  function updateDraft(patch: Partial<CallDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleBack() {
    if (step === 1 || step === 'success') {
      router.back();
    } else {
      direction.current = 'backward';
      setStep(((step as number) - 1) as Step);
    }
  }

  function advance() {
    direction.current = 'forward';
    if (step === 3) {
      setStep('success');
    } else {
      setStep(((step as number) + 1) as Step);
    }
  }

  async function submitDiscoveryCall() {
    if (!trainer || !draft.contactMode || !draft.date || !draft.time) {
      return;
    }

    setSubmitError(null);

    try {
      await bookDiscoveryCall.mutateAsync({
        name: user?.name ?? 'FitCall User',
        email: user?.email ?? '',
        contact_mode: draft.contactMode,
        phone_number: draft.phoneNumber.trim(),
        trainer_id: trainer.id,
        selected_datetime: buildSelectedDateTime(draft.date, draft.time),
        timezone,
      });
      advance();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'We could not submit your call request. Please try again.';
      setSubmitError(message);
    }
  }

  const isSuccess = step === 'success';
  const numericStep = isSuccess ? 3 : (step as number);
  const title = step === 3 || step === 'success' ? 'Call Request Summary' : 'Request a Call';

  // Drive progress-bar fill whenever the step changes.
  useEffect(() => {
    progress.value = withTiming(numericStep / 3, { duration: 400 });
  }, [numericStep, progress]);

  if (isTrainerLoading || !trainer) {
    return (
      <SafeAreaView
        style={[styles.container, styles.centered, { backgroundColor: colors.background }]}
        edges={['top', 'bottom']}
      >
        <ActivityIndicator color={colors.primary} />
      </SafeAreaView>
    );
  }

  const entering = direction.current === 'forward' ? SlideInRight : SlideInLeft;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {!isSuccess && (
        <Animated.View
          entering={FadeInDown.duration(360)}
          style={[styles.header, { paddingHorizontal: spacing.md, paddingTop: spacing.sm }]}
        >
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>
            {title}
          </Typography>

          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <Animated.View
              style={[styles.progressFill, { backgroundColor: colors.primary }, progressStyle]}
            />
          </View>
          <Typography variant="body2" color={colors.textSecondary} style={styles.stepLabel}>
            Step {numericStep} of 3
          </Typography>
        </Animated.View>
      )}

      <Animated.View
        key={String(step)}
        entering={isSuccess ? FadeIn.duration(360) : entering.duration(STEP_DURATION)}
        style={styles.content}
      >
        {step === 1 && (
          <PlatformStep
            trainer={trainer}
            draft={draft}
            onUpdate={updateDraft}
            onContinue={advance}
          />
        )}
        {step === 2 && (
          <DateTimeStep
            draft={draft}
            onUpdate={updateDraft}
            onContinue={advance}
            availableSlots={availableSlotDates}
            isLoadingSlots={!areSlotsReady}
            useRemoteSlots={areSlotsReady}
          />
        )}
        {step === 3 && (
          <SummaryStep
            draft={draft}
            onSubmit={submitDiscoveryCall}
            isSubmitting={bookDiscoveryCall.isPending}
            errorMessage={submitError}
          />
        )}
        {step === 'success' && <SuccessView />}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  centered: { alignItems: 'center', justifyContent: 'center' },
  header: { paddingBottom: 18 },
  backBtn: { marginBottom: 12 },
  headerTitle: { fontWeight: '700', marginBottom: 12 },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  stepLabel: { marginBottom: 0 },
  content: { flex: 1 },
});

function buildSelectedDateTime(date: Date, time: string): string {
  const [rawTime, period] = time.split(' ');
  const [rawHour, rawMinute] = rawTime.split(':').map(Number);
  let hour = rawHour;

  if (period === 'PM' && hour !== 12) {
    hour += 12;
  }

  if (period === 'AM' && hour === 12) {
    hour = 0;
  }

  const selected = new Date(date);
  selected.setHours(hour, rawMinute ?? 0, 0, 0);

  return selected.toISOString();
}
