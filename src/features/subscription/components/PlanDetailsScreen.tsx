import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { planForId } from '../constants/products';
import { useSubscriptionPurchase } from '../hooks/useSubscriptionPurchase';

interface PlanDetailsScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
  planId: string;
  /** Optional trainer the subscription is tied to (forwarded to the backend). */
  trainerId?: string;
  trainerName?: string;
  trainerImage?: string;
}

export function PlanDetailsScreen({
  onBack,
  onSubscribe,
  planId,
  trainerId,
  trainerName,
  trainerImage,
}: PlanDetailsScreenProps) {
  const { spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const { purchase, pending, priceForPlan } = useSubscriptionPurchase();

  const plan = planForId(planId);
  // Prefer the store's localized price; fall back to the catalog price, then a
  // placeholder until the product loads (or on platforms without billing).
  const price = priceForPlan(planId) ?? plan?.displayPrice ?? '—';

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
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingHorizontal: spacing.md, paddingBottom: 40 + insets.bottom },
        ]}
      >
        <Typography variant="h2" color="#FFFFFF" style={styles.title}>
          Selected plan
        </Typography>
        {trainerName || trainerImage ? (
          <View style={styles.trainerLine}>
            <Avatar name={trainerName ?? 'Trainer'} uri={trainerImage} size={36} />
            <Typography variant="body2" color="rgba(255,255,255,0.7)">
              Training with {trainerName ?? 'your trainer'}
            </Typography>
          </View>
        ) : null}

        <View style={[styles.priceHeader, { borderBottomColor: 'rgba(255,255,255,0.16)' }]}>
          <View style={styles.priceHeaderInfo}>
            <Typography variant="body2" color="#FFFFFF">
              {price}
            </Typography>
            <Typography variant="label" color="rgba(255,255,255,0.6)">
              {plan ? `${plan.title} · ${plan.scope}` : 'Session pack'}
            </Typography>
          </View>
          <Pressable onPress={onBack} style={styles.changePlanChip}>
            <View style={styles.glassHighlight} />
            <Typography variant="label" color="#FFFFFF" style={{ fontWeight: '700' }}>
              Change
            </Typography>
          </Pressable>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" color="#FFFFFF" style={styles.sectionTitle}>
            What you get
          </Typography>
          {(plan?.features ?? ['Personal training sessions']).map((feature) => (
            <View key={feature} style={styles.featureItem}>
              <Ionicons name="checkmark-circle-outline" size={20} color="rgba(255,255,255,0.7)" />
              <Typography
                variant="body2"
                color="rgba(255,255,255,0.85)"
                style={{ marginLeft: 12, flex: 1 }}
              >
                {feature}
              </Typography>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Typography variant="h3" color="#FFFFFF" style={styles.sectionTitle}>
            Expected results
          </Typography>
          <View style={styles.resultsGrid}>
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.24)',
                },
              ]}
            >
              <Ionicons name="trending-down" size={24} color="rgba(255,255,255,0.7)" />
              <Typography variant="label" color="rgba(255,255,255,0.85)" style={{ marginTop: 8 }}>
                Weight loss
              </Typography>
            </View>
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.24)',
                },
              ]}
            >
              <Ionicons name="barbell" size={24} color="rgba(255,255,255,0.7)" />
              <Typography variant="label" color="rgba(255,255,255,0.85)" style={{ marginTop: 8 }}>
                Muscle gain
              </Typography>
            </View>
            <View
              style={[
                styles.resultBox,
                {
                  backgroundColor: 'rgba(255,255,255,0.12)',
                  borderColor: 'rgba(255,255,255,0.24)',
                },
              ]}
            >
              <Ionicons name="flash" size={24} color="rgba(255,255,255,0.7)" />
              <Typography variant="label" color="rgba(255,255,255,0.85)" style={{ marginTop: 8 }}>
                More energy
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" color="#FFFFFF" style={styles.sectionTitle}>
            How it works
          </Typography>
          <View style={styles.featureItem}>
            <Ionicons name="card-outline" size={20} color="rgba(255,255,255,0.7)" />
            <Typography
              variant="body2"
              color="rgba(255,255,255,0.85)"
              style={{ marginLeft: 12, flex: 1, lineHeight: 20 }}
            >
              A one-time purchase — no auto-renewal. We’ll let you know when your sessions run out
              so you can top up.
            </Typography>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: 'rgba(5,8,15,0.92)',
            borderTopColor: 'rgba(255,255,255,0.12)',
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.md + insets.bottom,
          },
        ]}
      >
        <Pressable
          style={[styles.glassCta, pending && { opacity: 0.6 }]}
          disabled={pending}
          onPress={() => purchase(planId, { trainerId, onSuccess: onSubscribe })}
        >
          <View style={styles.glassHighlight} />
          {pending ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Typography variant="body1" color="#FFFFFF" style={styles.glassCtaText}>
                {price !== '—' ? `Buy · ${price}` : 'Buy sessions'}
              </Typography>
              <View style={styles.glassCtaIcon}>
                <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
              </View>
            </>
          )}
        </Pressable>
      </View>
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
    marginBottom: 24,
  },
  trainerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: -12,
    marginBottom: 20,
  },
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 24,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  // flex so a long "title · scope" line wraps instead of pushing the chip off-screen.
  priceHeaderInfo: {
    flex: 1,
    marginRight: 12,
  },
  // Translucent inner highlight shared by the glass surfaces below.
  glassHighlight: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  changePlanChip: {
    flexShrink: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.30)',
    overflow: 'hidden',
  },
  glassCta: {
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
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  resultsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  resultBox: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '30%',
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
  },
  footer: {
    borderTopWidth: 1,
  },
});
