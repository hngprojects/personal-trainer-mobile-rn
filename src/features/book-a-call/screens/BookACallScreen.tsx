import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { trainers } from '@/features/trainers/data/trainers.data';
import { Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { DateTimeStep } from '../components/DateTimeStep';
import { PlatformStep } from '../components/PlatformStep';
import { SuccessView } from '../components/SuccessView';
import { SummaryStep } from '../components/SummaryStep';
import { CallDraft } from '../types/book-a-call.types';

type Step = 1 | 2 | 3 | 'success';

export function BookACallScreen() {
  const { colors, spacing } = useTheme();
  const { trainerId } = useLocalSearchParams<{ trainerId?: string }>();
  const trainer = trainers.find((t) => t.id === trainerId) ?? trainers[0];

  const [step, setStep] = useState<Step>(1);
  const [draft, setDraft] = useState<CallDraft>({ platform: null, date: null, time: null });

  function updateDraft(patch: Partial<CallDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleBack() {
    if (step === 1 || step === 'success') {
      router.back();
    } else {
      setStep(((step as number) - 1) as Step);
    }
  }

  function advance() {
    if (step === 3) {
      setStep('success');
    } else {
      setStep(((step as number) + 1) as Step);
    }
  }

  const isSuccess = step === 'success';
  const numericStep = isSuccess ? 3 : (step as number);
  const title = step === 3 || step === 'success' ? 'Call Request Summary' : 'Request a Call';

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top', 'bottom']}
    >
      {/* Header */}
      {!isSuccess && (
        <View style={[styles.header, { paddingHorizontal: spacing.md, paddingTop: spacing.sm }]}>
          <Pressable onPress={handleBack} hitSlop={12} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          <Typography variant="h2" style={styles.headerTitle}>
            {title}
          </Typography>

          {/* Progress bar */}
          <View style={[styles.progressTrack, { backgroundColor: colors.border }]}>
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.primary,
                  width: `${(numericStep / 3) * 100}%`,
                },
              ]}
            />
          </View>
          <Typography variant="body2" color={colors.textSecondary} style={styles.stepLabel}>
            Step {numericStep} of 3
          </Typography>
        </View>
      )}

      {/* Content */}
      <View style={styles.content}>
        {step === 1 && (
          <PlatformStep
            trainer={trainer}
            draft={draft}
            onUpdate={updateDraft}
            onContinue={advance}
          />
        )}
        {step === 2 && <DateTimeStep draft={draft} onUpdate={updateDraft} onContinue={advance} />}
        {step === 3 && <SummaryStep draft={draft} onSubmit={advance} />}
        {step === 'success' && <SuccessView />}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingBottom: 8 },
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
  stepLabel: { marginBottom: 4 },
  content: { flex: 1 },
});
