import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AccordionItem, Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

interface TestimonialScreenProps {
  onContinue: () => void;
  onSkip: () => void;
  step: number;
  totalSteps: number;
}

export function TestimonialScreen({
  onContinue,
  onSkip,
  step,
  totalSteps,
}: TestimonialScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
      edges={['top', 'bottom']}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={styles.stepContainer}>
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            {step} of {totalSteps}
          </Typography>
          <View style={styles.divider} />
          <Typography
            variant="body2"
            color={colors.primary}
            style={{ fontWeight: '600' }}
            onPress={onSkip}
          >
            Skip &gt;
          </Typography>
        </View>
      </View>

      <ScrollView contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}>
        <Typography variant="h2" style={styles.title}>
          &quot;You don&apos;t stop when someone is yelling&quot;
        </Typography>

        <View style={styles.testimonialCard}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((i) => (
              <Ionicons key={i} name="star" size={20} color={palette.gold['4']} />
            ))}
          </View>
          <Typography variant="body2" style={styles.quote}>
            &quot;I love Chantelle because she pushes me harder than anyone else without resorting
            to yelling or negativity. Her support is incredible.&quot;
          </Typography>
          <View style={styles.author}>
            <Image source={{ uri: 'https://i.pravatar.cc/100?img=5' }} style={styles.authorImage} />
            <View>
              <Typography variant="label" style={{ fontWeight: '600' }}>
                Sarah T.
              </Typography>
              <Typography variant="label" color={palette.neutral['5']}>
                Lost 15 lbs
              </Typography>
            </View>
          </View>
        </View>

        <View style={styles.accordionSection}>
          <AccordionItem
            title="Custom Workout Plans"
            content="Tailored specifically for your body type, fitness level, and personal goals. No cookie-cutter programs."
            isInitiallyExpanded={false}
          />
          <AccordionItem
            title="Nutrition Guidance"
            content="Get meal plans and macro-tracking advice to fuel your body and maximize your results safely."
            isInitiallyExpanded={false}
          />
          <AccordionItem
            title="24/7 Access & Support"
            content="Direct messaging access to Chantelle for any questions, form checks, or motivation when you need it most."
            isInitiallyExpanded={true}
          />
        </View>
      </ScrollView>

      <View style={[styles.footer, { padding: spacing.md }]}>
        <Button label="Continue" onPress={onContinue} />
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 56,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: palette.neutral['3'],
  },
  content: {
    paddingTop: 16,
    paddingBottom: 40,
  },
  title: {
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 32,
  },
  testimonialCard: {
    alignItems: 'center',
    marginBottom: 40,
  },
  stars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 16,
  },
  quote: {
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 24,
    marginBottom: 16,
    color: palette.neutral['7'],
  },
  author: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  authorImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  accordionSection: {
    marginTop: 16,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.neutral['2'],
  },
});
