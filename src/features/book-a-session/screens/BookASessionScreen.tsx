import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
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

// DateTimeStep is identical between call and session bookings — reuse instead
// of duplicating. SessionDraft is structurally equivalent to CallDraft.
import { DateTimeStep } from '@/features/book-a-call/components/DateTimeStep';
import { trainers } from '@/features/trainers/data/trainers.data';
import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { PlatformStep } from '../components/PlatformStep';
import { SuccessView } from '../components/SuccessView';
import { SummaryStep } from '../components/SummaryStep';
import { SessionDraft } from '../types/book-a-session.types';

type Step = 1 | 2 | 3 | 'success';

const STEP_DURATION = 320;

export function BookASessionScreen() {
  const { colors, spacing } = useTheme();
  const { trainerId } = useLocalSearchParams<{ trainerId?: string }>();
  const trainer = trainers.find((t) => t.id === trainerId) ?? trainers[0];

  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<SessionDraft>({ platform: null, date: null, time: null });
  const direction = useRef<'forward' | 'backward'>('forward');

  const progress = useSharedValue(1 / 3);
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  function updateDraft(patch: Partial<SessionDraft>) {
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

  const isSuccess = step === 'success';
  const numericStep = isSuccess ? 3 : (step as number);
  const title = step === 3 ? 'Booking Summary' : 'Book a Session';

  useEffect(() => {
    progress.value = withTiming(numericStep / 3, { duration: 400 });
  }, [numericStep, progress]);

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
        {step === 2 && <DateTimeStep draft={draft} onUpdate={updateDraft} onContinue={advance} />}
        {step === 3 && <SummaryStep trainer={trainer} draft={draft} onSubmit={advance} />}
        {step === 'success' && <SuccessView trainer={trainer} />}
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
