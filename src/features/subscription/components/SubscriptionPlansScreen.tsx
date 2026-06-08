import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { SUBSCRIPTION_PLANS } from '../constants/products';
import { useSubscriptionPurchase } from '../hooks/useSubscriptionPurchase';

interface SubscriptionPlansScreenProps {
  onBack: () => void;
  onSelectPlan: (planId: string) => void;
  step: number;
  totalSteps: number;
  /** Trainer the purchase is being attributed to, shown for context. */
  trainerName?: string;
  trainerImage?: string;
}

// Plans render from the shared catalog (products.ts) so plan_id/SKUs stay in one
// place. The price prefers the store's localized value and falls back to the
// catalog's displayPrice until the store responds.
const PLANS = SUBSCRIPTION_PLANS;
const DEFAULT_PLAN_ID = PLANS[0]?.planId ?? '';

export function SubscriptionPlansScreen({
  onBack,
  onSelectPlan,
  step,
  totalSteps,
  trainerName,
  trainerImage,
}: SubscriptionPlansScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { priceForPlan } = useSubscriptionPurchase();
  const [selectedPlanId, setSelectedPlanId] = useState<string>(DEFAULT_PLAN_ID);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <LinearGradient
        colors={['#0B1A33', '#0A1428', '#05080F']}
        locations={[0, 0.5, 1]}
        style={StyleSheet.absoluteFill}
      />
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          <Typography variant="body2" color="#FFFFFF" style={{ fontWeight: '500' }}>
            Back
          </Typography>
        </Pressable>
        {totalSteps > 1 ? (
          <Typography variant="body2" color="rgba(255,255,255,0.7)" style={{ fontWeight: '500' }}>
            {step} of {totalSteps}
          </Typography>
        ) : null}
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.md, paddingBottom: 40 + insets.bottom },
        ]}
      >
        {trainerName || trainerImage ? (
          <View style={styles.trainerRow}>
            <Avatar name={trainerName ?? 'Trainer'} uri={trainerImage} size={48} />
          </View>
        ) : null}
        <Typography variant="h2" color="#FFFFFF" style={styles.title}>
          Choose your plan
        </Typography>
        <Typography variant="body2" color="rgba(255,255,255,0.7)" style={styles.subtitle}>
          {trainerName
            ? `Buy sessions to train with ${trainerName}. 12 & 18-session packs work across any trainer.`
            : 'A plan to suit every budget and lifestyle.'}
        </Typography>

        <View style={styles.plansContainer}>
          {PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.planId;
            const price = priceForPlan(plan.planId) ?? plan.displayPrice;

            return (
              <Pressable
                key={plan.planId}
                onPress={() => setSelectedPlanId(plan.planId)}
                style={[
                  styles.planCard,
                  plan.tag ? styles.planCardTagged : null,
                  {
                    backgroundColor: isSelected
                      ? 'rgba(255,255,255,0.16)'
                      : 'rgba(255,255,255,0.10)',
                    borderColor: isSelected ? colors.success : 'rgba(255,255,255,0.24)',
                  },
                  isSelected && { borderWidth: 2 },
                ]}
              >
                {plan.tag && (
                  <View style={[styles.tag, { backgroundColor: colors.success }]}>
                    <Typography variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
                      {plan.tag}
                    </Typography>
                  </View>
                )}

                <Typography variant="h3" color="#FFFFFF" style={{ marginBottom: 4 }}>
                  {plan.title}
                </Typography>
                <Typography variant="h1" color="#FFFFFF" style={{ marginBottom: 4 }}>
                  {price}
                </Typography>
                <Typography
                  variant="label"
                  color="rgba(255,255,255,0.6)"
                  style={{ marginBottom: 16 }}
                >
                  {plan.scope}
                </Typography>

                <View style={styles.featuresList}>
                  {plan.features.map((feature, i) => (
                    <View key={i} style={styles.featureItem}>
                      <Ionicons
                        name="checkmark-circle"
                        size={18}
                        color={isSelected ? colors.success : 'rgba(255,255,255,0.5)'}
                      />
                      <Typography
                        variant="body2"
                        color="rgba(255,255,255,0.85)"
                        style={{ marginLeft: 8 }}
                      >
                        {feature}
                      </Typography>
                    </View>
                  ))}
                </View>

                {isSelected && (
                  <Pressable style={styles.glassCta} onPress={() => onSelectPlan(plan.planId)}>
                    <View style={styles.glassHighlight} />
                    <Typography variant="body1" color="#FFFFFF" style={styles.glassCtaText}>
                      Continue
                    </Typography>
                    <View style={styles.glassCtaIcon}>
                      <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
                    </View>
                  </Pressable>
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
    backgroundColor: '#05080F',
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
  trainerRow: {
    alignItems: 'center',
    marginBottom: 16,
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
  // Extra top room so the floating "BEST VALUE" badge sits above the card edge
  // instead of overlapping the card's content.
  planCardTagged: {
    marginTop: 16,
    paddingTop: 28,
  },
  tag: {
    position: 'absolute',
    top: -13,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 999,
  },
  featuresList: {
    gap: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  glassHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  glassCta: {
    marginTop: 24,
    minHeight: 54,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 20,
    paddingRight: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    overflow: 'hidden',
  },
  glassCtaText: {
    flex: 1,
    minWidth: 0,
    textAlign: 'center',
    fontWeight: '900',
  },
  glassCtaIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.24)',
  },
});
