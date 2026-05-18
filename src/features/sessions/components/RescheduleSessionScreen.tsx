import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { Button, Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

const REASONS = [
  'Something came up',
  'Feeling unwell',
  'Work conflict',
  'Personal emergency',
  'Travel',
  'Other',
];

const TIME_SLOTS = [
  '7:00 AM',
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
  '6:00 PM',
];

export function RescheduleSessionScreen() {
  useLocalSearchParams<{ id: string }>();
  const { spacing, colors } = useTheme();
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState('');

  // Real Date-based state for calendar
  const [viewDate, setViewDate] = useState(new Date(2026, 4, 1)); // Starting with May 2026 as per design
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const today = new Date();
  const currentDay = today.getDate();
  const isCurrentMonth =
    today.getMonth() === viewDate.getMonth() && today.getFullYear() === viewDate.getFullYear();

  const handlePrevMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const timezoneOffset = -new Date().getTimezoneOffset() / 60;
  const timezoneStr = `GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;

  const handleContinue = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      // Complete flow
      router.back();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      router.back();
    }
  };

  return (
    <Screen padding={false} edges={['top']} backgroundColor="#FFFFFF">
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={palette.neutral['9']} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Reschedule Session
        </Typography>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}>
        <Typography variant="label" color={colors.textSecondary} style={styles.stepIndicator}>
          Step {step} of 2
        </Typography>

        {step === 1 ? (
          <ReasonStep selectedReason={selectedReason} onSelectReason={setSelectedReason} />
        ) : (
          <DateTimeStep
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            timezoneStr={timezoneStr}
            isCurrentMonth={isCurrentMonth}
            currentDay={currentDay}
          />
        )}
      </ScrollView>

      <View style={[styles.footer, { padding: spacing.md }]}>
        <Button
          label={step === 1 ? 'Continue' : 'Continue to Confirm'}
          onPress={handleContinue}
          disabled={step === 1 ? !selectedReason : !selectedDate || !selectedTime}
        />
      </View>
    </Screen>
  );
}

function ReasonStep({
  selectedReason,
  onSelectReason,
}: {
  selectedReason: string;
  onSelectReason: (reason: string) => void;
}) {
  const { colors } = useTheme();
  return (
    <View>
      <Typography variant="h2" style={styles.stepTitle}>
        Why do you need to reschedule?
      </Typography>
      <Typography variant="body2" color={colors.textSecondary} style={styles.stepSubtitle}>
        This helps your trainer prepare for the change.
      </Typography>

      <Typography variant="body2" style={styles.label}>
        Select a reason
      </Typography>
      <View style={styles.reasonsGrid}>
        {REASONS.map((reason) => (
          <Pressable
            key={reason}
            onPress={() => onSelectReason(reason)}
            style={[
              styles.reasonChip,
              selectedReason === reason && [
                styles.activeReasonChip,
                { borderColor: colors.primary },
              ],
            ]}
          >
            <Typography
              variant="label"
              style={[
                styles.reasonText,
                selectedReason === reason && [styles.activeReasonText, { color: colors.primary }],
              ]}
            >
              {reason}
            </Typography>
          </Pressable>
        ))}
      </View>

      <Typography variant="body2" style={[styles.label, { marginTop: 24 }]}>
        Additional details
      </Typography>
      <TextInput
        placeholder="Tell us a bit more about why you're rescheduling..."
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />
    </View>
  );
}

function DateTimeStep({
  selectedDate,
  onSelectDate,
  selectedTime,
  onSelectTime,
  viewDate,
  onPrevMonth,
  onNextMonth,
  timezoneStr,
  isCurrentMonth,
  currentDay,
}: {
  selectedDate: number | null;
  onSelectDate: (date: number) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  timezoneStr: string;
  isCurrentMonth: boolean;
  currentDay: number;
}) {
  const { colors } = useTheme();

  return (
    <View>
      <Typography variant="h2" style={styles.stepTitle}>
        Pick a new date and time
      </Typography>
      <Typography variant="body2" color={colors.textSecondary} style={styles.stepSubtitle}>
        Choose a slot that fits your schedule. All times are shown in your local timezone.
      </Typography>

      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Pressable onPress={onPrevMonth}>
            <Ionicons name="chevron-back" size={20} color={palette.neutral['9']} />
          </Pressable>
          <Typography style={styles.calendarMonth}>
            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <Pressable onPress={onNextMonth}>
            <Ionicons name="chevron-forward" size={20} color={palette.neutral['9']} />
          </Pressable>
        </View>

        <View style={styles.daysRow}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
            <Typography key={d} variant="label" style={styles.dayLabel}>
              {d}
            </Typography>
          ))}
        </View>

        <View style={styles.datesGrid}>
          {/* Empty spaces for the first few days if month doesn't start on Sunday */}
          {Array.from({ length: 4 }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dateCircle} />
          ))}
          {Array.from({ length: 28 }, (_, i) => i + 1).map((date) => {
            const isPast = isCurrentMonth && date < currentDay;
            return (
              <Pressable
                key={date}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.dateCircle,
                  selectedDate === date && [
                    styles.activeDateCircle,
                    { backgroundColor: colors.primary },
                  ],
                  isPast && styles.unavailableDate,
                ]}
                disabled={isPast}
              >
                <Typography
                  style={[
                    styles.dateText,
                    selectedDate === date && styles.activeDateText,
                    isPast && styles.unavailableText,
                  ]}
                >
                  {date}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <LegendItem color={palette.neutral['2']} label="Unavailable" />
        <LegendItem color={palette.neutral['1']} label="Available" />
        <LegendItem color={colors.primary} label="Selected" />
      </View>

      <Typography variant="body2" style={[styles.label, { marginTop: 24 }]}>
        <Ionicons name="time-outline" size={16} /> Available Times in your Timezone ({timezoneStr})
      </Typography>

      <View style={styles.timesGrid}>
        {TIME_SLOTS.map((time) => (
          <Pressable
            key={time}
            onPress={() => onSelectTime(time)}
            style={[
              styles.timeSlot,
              selectedTime === time && [
                styles.activeTimeSlot,
                { backgroundColor: colors.primary, borderColor: colors.primary },
              ],
            ]}
          >
            <Typography
              variant="label"
              style={[styles.timeText, selectedTime === time && styles.activeTimeText]}
            >
              {time}
            </Typography>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Typography variant="label" color={palette.neutral['5']}>
        {label}
      </Typography>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
    marginLeft: 4,
  },
  scrollContent: {
    paddingTop: 8,
    paddingBottom: 100,
  },
  stepIndicator: {
    fontFamily: fonts.semibold,
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 32,
  },
  label: {
    fontFamily: fonts.semibold,
    marginBottom: 12,
  },
  reasonsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  reasonChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
    minWidth: '48%',
  },
  activeReasonChip: {
    backgroundColor: palette.neutral['0.5'],
  },
  reasonText: {
    textAlign: 'center',
    color: palette.neutral['5'],
  },
  activeReasonText: {
    fontFamily: fonts.semibold,
  },
  textArea: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
    padding: 16,
    textAlignVertical: 'top',
    height: 120,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  calendarMonth: {
    fontFamily: fonts.semibold,
    fontSize: 14,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  dayLabel: {
    width: 40,
    textAlign: 'center',
    color: palette.neutral['4'],
    fontSize: 10,
  },
  datesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  dateCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeDateCircle: {},
  unavailableDate: {
    backgroundColor: palette.neutral['0.5'],
  },
  dateText: {
    fontFamily: fonts.medium,
    fontSize: 14,
    color: palette.neutral['9'],
  },
  activeDateText: {
    color: '#FFFFFF',
  },
  unavailableText: {
    color: palette.neutral['3'],
  },
  legend: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  activeTimeSlot: {},
  timeText: {
    fontSize: 12,
    color: palette.neutral['7'],
  },
  activeTimeText: {
    color: '#FFFFFF',
    fontFamily: fonts.semibold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: palette.neutral['1'],
  },
});
