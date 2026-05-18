import { Ionicons } from '@expo/vector-icons';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

import { PLATFORM_LOGOS } from '../data/platform-logos';
import { CallDraft, CallPlatform } from '../types/book-a-call.types';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function platformLabel(p: CallPlatform): string {
  return p === 'google-meet' ? 'Google Meet' : 'Zoom';
}

function platformLogo(p: CallPlatform) {
  return PLATFORM_LOGOS[p];
}

function formatDate(d: Date): string {
  return `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
}

function addOneHour(time: string): string {
  const [rawTime, period] = time.split(' ');
  let [h] = rawTime.split(':').map(Number);
  if (period === 'PM' && h !== 12) h += 12;
  if (period === 'AM' && h === 12) h = 0;
  h += 1;
  const nextPeriod = h >= 12 && h < 24 ? 'PM' : 'AM';
  const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${displayH}:00 ${nextPeriod}`;
}

interface SummaryStepProps {
  draft: CallDraft;
  onSubmit: () => void;
}

export function SummaryStep({ draft, onSubmit }: SummaryStepProps) {
  const { colors, spacing } = useTheme();

  const platform = draft.platform!;
  const date = draft.date!;
  const time = draft.time!;
  const endTime = addOneHour(time);

  const whatHappensNext = [
    'One of our agents reviews your request',
    `Agent calls you on ${platformLabel(platform)} at your preferred time`,
    'Agent answers questions and helps you get started',
  ];

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <Typography variant="h2" style={styles.heading}>
            Review your call request
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
            Please review the details below and confirm.
          </Typography>
        </Animated.View>

        {/* Details card */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(360)}
          style={[
            styles.detailsCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {[
            {
              icon: 'calendar-outline' as const,
              label: 'Date',
              value: formatDate(date),
              valueNode: null,
            },
            {
              icon: 'time-outline' as const,
              label: 'Time',
              value: `${time} - ${endTime}`,
              valueNode: null,
            },
            {
              icon: 'timer-outline' as const,
              label: 'Duration',
              value: '60 mins',
              valueNode: null,
            },
            {
              icon: 'videocam-outline' as const,
              label: 'Platform',
              value: null,
              valueNode: (
                <View style={styles.platformValueRow}>
                  <Image
                    source={platformLogo(platform)}
                    style={styles.platformValueLogo}
                    resizeMode="contain"
                  />
                  <Typography variant="body2" color={colors.textSecondary}>
                    {platformLabel(platform)}
                  </Typography>
                </View>
              ),
            },
          ].map(({ icon, label, value, valueNode }, idx, arr) => (
            <View
              key={label}
              style={[
                styles.detailRow,
                idx < arr.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
              ]}
            >
              <View style={styles.detailLeft}>
                <Ionicons
                  name={icon}
                  size={18}
                  color={colors.textSecondary}
                  style={styles.detailIcon}
                />
                <Typography variant="body2" color={colors.text}>
                  {label}
                </Typography>
              </View>
              {valueNode ?? (
                <Typography variant="body2" color={colors.textSecondary}>
                  {value}
                </Typography>
              )}
            </View>
          ))}
        </Animated.View>

        {/* What happens next */}
        <Animated.View
          entering={FadeInUp.delay(180).duration(360)}
          style={[
            styles.nextCard,
            { backgroundColor: colors.background, borderColor: colors.border },
          ]}
        >
          <Typography variant="body1" style={styles.nextHeading}>
            What happens next
          </Typography>
          {whatHappensNext.map((item) => (
            <View key={item} style={styles.nextRow}>
              <Ionicons
                name="checkmark"
                size={14}
                color={palette.success['4']}
                style={styles.nextCheck}
              />
              <Typography variant="body2" color={colors.textSecondary} style={styles.nextText}>
                {item}
              </Typography>
            </View>
          ))}
        </Animated.View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.lg,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Button label="Submit Request" onPress={onSubmit} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingTop: 8, paddingBottom: 16 },
  heading: { fontWeight: '700', marginBottom: 6 },
  subtitle: { marginBottom: 24 },
  detailsCard: {
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 20,
    overflow: 'hidden',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  detailLeft: { flexDirection: 'row', alignItems: 'center' },
  detailIcon: { marginRight: 10 },
  platformValueRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  platformValueLogo: { width: 20, height: 20 },
  nextCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
  },
  nextHeading: { fontWeight: '700', marginBottom: 12 },
  nextRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 8 },
  nextCheck: { marginRight: 8, marginTop: 1 },
  nextText: { flex: 1, lineHeight: 20 },
  footerSpacer: { height: 8 },
  footer: { paddingTop: 12 },
});
