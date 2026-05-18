import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

interface SubscriptionPlansScreenProps {
  onBack: () => void;
  onSelectPlan: (planId: string) => void;
  step: number;
  totalSteps: number;
}

const PLANS = [
  {
    id: 'guaranteed',
    title: 'The Guaranteed',
    price: '$80',
    billing: 'per month, billed half-yearly',
    features: [
      'Custom workout plan',
      'Nutrition guidance',
      '24/7 direct messaging',
      'Weekly check-ins',
    ],
    tag: 'BEST VALUE',
  },
  {
    id: 'casual',
    title: 'The Casual',
    price: '$70',
    billing: 'per month, billed quarterly',
    features: ['Pre-made workout plan', 'General nutrition tips', 'Weekly group call'],
  },
  {
    id: 'consistent',
    title: 'The Consistent',
    price: '$120',
    billing: 'per month, billed monthly',
    features: [
      'Custom workout plan',
      'Nutrition guidance',
      '24/7 direct messaging',
      'Bi-weekly check-ins',
    ],
  },
];

export function SubscriptionPlansScreen({
  onBack,
  onSelectPlan,
  step,
  totalSteps,
}: SubscriptionPlansScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedPlanId, setSelectedPlanId] = useState<string>('guaranteed');

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            Back
          </Typography>
        </Pressable>
        <Typography variant="body2" style={{ fontWeight: '500' }}>
          {step} of {totalSteps}
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.md, paddingBottom: 40 + insets.bottom },
        ]}
      >
        <Typography variant="h2" style={styles.title}>
          Choose your plan
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
          A plan to suit every budget and lifestyle.
        </Typography>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;

            return (
              <Pressable
                key={plan.id}
                onPress={() => setSelectedPlanId(plan.id)}
                style={[
                  styles.planCard,
                  {
                    backgroundColor: colors.background,
                    borderColor: isSelected ? colors.success : colors.border,
                  },
                  isSelected && { borderWidth: 2 },
                ]}
              >
                {plan.tag && (
                  <View style={[styles.tag, { backgroundColor: colors.surfaceMuted }]}>
                    <Typography
                      variant="label"
                      color={colors.success}
                      style={{ fontWeight: '600' }}
                    >
                      {plan.tag}
                    </Typography>
                  </View>
                )}

                <Typography variant="h3" style={{ marginBottom: 4 }}>
                  {plan.title}
                </Typography>
                <Typography variant="h1" style={{ marginBottom: 4 }}>
                  {plan.price}
                </Typography>
                <Typography
                  variant="label"
                  color={colors.textSecondary}
                  style={{ marginBottom: 16 }}
                >
                  {plan.billing}
                </Typography>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <View key={i} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={isSelected ? colors.success : colors.iconMuted}
                      />
                      <Typography variant="body2" style={{ marginLeft: 8 }}>
                        {feature}
                      </Typography>
                    </View>
                  ))}
                </View>

                {isSelected && (
                  <Button
                    label="Try for 7 days"
                    onPress={() => onSelectPlan(plan.id)}
                    style={{ marginTop: 24, backgroundColor: colors.primary }}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 56,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: -8,
  },
  content: {
    paddingTop: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 24,
  },
  plansContainer: {
    gap: 16,
  },
  planCard: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    position: 'relative',
  },
  tag: {
    position: 'absolute',
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
