import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

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
  const insets = useSafeAreaInsets();
  const statusBarStyle = useStatusBarStyle();
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
    <Screen padding={false} edges={['top']}>
      <StatusBar style={statusBarStyle} />

      <View style={styles.header}>
        <Pressable onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Reschedule Session
        </Typography>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md, paddingBottom: 120 + insets.bottom },
        ]}
        // Lift the focused input above the absolute-positioned footer
        // (button + bottom safe-area inset).
        bottomOffset={spacing.md * 2 + 48 + insets.bottom}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
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
      </KeyboardAwareScrollView>

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
        {REASONS.map((reason) => {
          const isActive = selectedReason === reason;
          return (
            <Pressable
              key={reason}
              onPress={() => onSelectReason(reason)}
              style={[
                styles.reasonChip,
                {
                  backgroundColor: isActive ? colors.primarySubtle : colors.background,
                  borderColor: isActive ? colors.primary : colors.divider,
                },
              ]}
            >
              <Typography
                variant="label"
                color={isActive ? colors.primary : colors.textSecondary}
                style={[styles.reasonText, isActive && styles.activeReasonText]}
              >
                {reason}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Typography variant="body2" style={[styles.label, { marginTop: 24 }]}>
        Additional details
      </Typography>
      <TextInput
        placeholder="Tell us a bit more about why you're rescheduling..."
        placeholderTextColor={colors.iconMuted}
        multiline
        numberOfLines={4}
        style={[
          styles.textArea,
          {
            backgroundColor: colors.inputBackground,
            borderColor: colors.divider,
            color: colors.text,
          },
        ]}
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

      <View
        style={[
          styles.calendarContainer,
          { backgroundColor: colors.background, borderColor: colors.divider },
        ]}
      >
        <View style={styles.calendarHeader}>
          <Pressable onPress={onPrevMonth}>
            <Ionicons name="chevron-back" size={20} color={colors.icon} />
          </Pressable>
          <Typography style={styles.calendarMonth}>
            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
          </Typography>
          <Pressable onPress={onNextMonth}>
            <Ionicons name="chevron-forward" size={20} color={colors.icon} />
          </Pressable>
        </View>

        <View style={styles.daysRow}>
          {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d) => (
            <Typography key={d} variant="label" color={colors.iconMuted} style={styles.dayLabel}>
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
            const isSelected = selectedDate === date;
            return (
              <Pressable
                key={date}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.dateCircle,
                  isSelected && { backgroundColor: colors.primary },
                  isPast && { backgroundColor: colors.surfaceMuted },
                ]}
                disabled={isPast}
              >
                <Typography
                  color={isSelected ? '#FFFFFF' : isPast ? colors.textMuted : colors.text}
                  style={styles.dateText}
                >
                  {date}
                </Typography>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <LegendItem color={colors.border} label="Unavailable" />
        <LegendItem color={colors.divider} label="Available" />
        <LegendItem color={colors.primary} label="Selected" />
      </View>

      <Typography variant="body2" style={[styles.label, { marginTop: 24 }]}>
        <Ionicons name="time-outline" size={16} color={colors.icon} /> Available Times in your
        Timezone ({timezoneStr})
      </Typography>

      <View style={styles.timesGrid}>
        {TIME_SLOTS.map((time) => {
          const isSelected = selectedTime === time;
          return (
            <Pressable
              key={time}
              onPress={() => onSelectTime(time)}
              style={[
                styles.timeSlot,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.divider,
                },
              ]}
            >
              <Typography
                variant="label"
                color={isSelected ? '#FFFFFF' : colors.text}
                style={[styles.timeText, isSelected && styles.activeTimeText]}
              >
                {time}
              </Typography>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, { backgroundColor: color }]} />
      <Typography variant="label" color={colors.textSecondary}>
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
    borderRadius: 12,
    borderWidth: 1,
    minWidth: '48%',
  },
  reasonText: {
    textAlign: 'center',
  },
  activeReasonText: {
    fontFamily: fonts.semibold,
  },
  textArea: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 16,
    textAlignVertical: 'top',
    height: 120,
    fontFamily: fonts.regular,
    fontSize: 13,
  },
  calendarContainer: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
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
  dateText: {
    fontFamily: fonts.medium,
    fontSize: 14,
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
    alignItems: 'center',
  },
  timeText: {
    fontSize: 12,
  },
  activeTimeText: {
    fontFamily: fonts.semibold,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
  },
});
