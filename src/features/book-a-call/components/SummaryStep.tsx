import { Ionicons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

import { CallContactMode, CallDraft } from '../types/book-a-call.types';

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

function contactModeLabel(mode: CallContactMode): string {
  return mode === 'phone_callback' ? 'Phone Call' : 'Zoom Meeting';
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
  isSubmitting?: boolean;
  errorMessage?: string | null;
}

export function SummaryStep({
  draft,
  onSubmit,
  isSubmitting = false,
  errorMessage,
}: SummaryStepProps) {
  const { colors, spacing } = useTheme();

  const contactMode = draft.contactMode!;
  const date = draft.date!;
  const time = draft.time!;
  const endTime = addOneHour(time);

  const whatHappensNext = [
    'One of our agents reviews your request',
    `Agent contacts you by ${contactModeLabel(contactMode)} at your preferred time`,
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
              icon: 'call-outline' as const,
              label: 'Phone',
              value: draft.phoneNumber,
              valueNode: null,
            },
            {
              icon:
                contactMode === 'phone_callback'
                  ? ('call-outline' as const)
                  : ('videocam-outline' as const),
              label: 'Contact',
              value: contactModeLabel(contactMode),
              valueNode: null,
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

        {errorMessage ? (
          <Animated.View
            entering={FadeInUp.duration(260)}
            style={[styles.errorBanner, { backgroundColor: colors.error + '14' }]}
          >
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Typography variant="body2" color={colors.error} style={styles.errorText}>
              {errorMessage}
            </Typography>
          </Animated.View>
        ) : null}

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
        <Button label="Submit Request" isLoading={isSubmitting} onPress={onSubmit} />
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  errorText: { flex: 1, lineHeight: 20 },
  footerSpacer: { height: 8 },
  footer: { paddingTop: 12 },
});
