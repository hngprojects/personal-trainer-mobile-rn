import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

interface PlanDetailsScreenProps {
  onBack: () => void;
  onSubscribe: () => void;
  planId: string;
}

export function PlanDetailsScreen({ onBack, onSubscribe, planId }: PlanDetailsScreenProps) {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.surface }]} edges={['top']}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
          <Typography variant="body2" style={{ fontWeight: '500' }}>
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
        <Typography variant="h2" style={styles.title}>
          Selected plan
        </Typography>

        <View style={[styles.priceHeader, { borderBottomColor: colors.border }]}>
          <View>
            <Typography variant="body2" color={colors.text}>
              $80.00
            </Typography>
            <Typography variant="label" color={colors.textSecondary}>
              per month, billed half-yearly
            </Typography>
          </View>
          <Typography variant="body2" color={colors.primary} style={{ fontWeight: '600' }}>
            Change plan
          </Typography>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            What you get
          </Typography>
          <View style={styles.featureItem}>
            <Ionicons name="checkmark-circle-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" style={{ marginLeft: 12 }}>
              A personalized workout program
            </Typography>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="restaurant-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" style={{ marginLeft: 12 }}>
              Food and macro guidelines
            </Typography>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="chatbubbles-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" style={{ marginLeft: 12 }}>
              Weekly check-ins for accountability
            </Typography>
          </View>
          <View style={styles.featureItem}>
            <Ionicons name="call-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" style={{ marginLeft: 12 }}>
              Access to a community of like-minded people
            </Typography>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Expected results
          </Typography>
          <View style={styles.resultsGrid}>
            <View
              style={[
                styles.resultBox,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Ionicons name="trending-down" size={24} color={colors.iconMuted} />
              <Typography variant="label" style={{ marginTop: 8 }}>
                Weight loss
              </Typography>
            </View>
            <View
              style={[
                styles.resultBox,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Ionicons name="barbell" size={24} color={colors.iconMuted} />
              <Typography variant="label" style={{ marginTop: 8 }}>
                Muscle gain
              </Typography>
            </View>
            <View
              style={[
                styles.resultBox,
                { backgroundColor: colors.surfaceMuted, borderColor: colors.border },
              ]}
            >
              <Ionicons name="flash" size={24} color={colors.iconMuted} />
              <Typography variant="label" style={{ marginTop: 8 }}>
                More energy
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Cancellation
          </Typography>
          <View style={styles.featureItem}>
            <Ionicons name="close-circle-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" style={{ marginLeft: 12, flex: 1, lineHeight: 20 }}>
              You can cancel your subscription at any time. No questions asked.
            </Typography>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
            paddingHorizontal: spacing.md,
            paddingTop: spacing.md,
            paddingBottom: spacing.md + insets.bottom,
          },
        ]}
      >
        <Button label="Try it out for 7 days" onPress={onSubscribe} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  priceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 24,
    borderBottomWidth: 1,
    marginBottom: 24,
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
