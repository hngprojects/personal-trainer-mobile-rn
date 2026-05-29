import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Pressable, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getDiscoverySlotDates,
  getTimezone,
  getTrainerAvailabilityDates,
  RescheduleReason,
  useDiscoverySlots,
  useRescheduleBooking,
  useUpcomingBookings,
} from '@/features/bookings';
import { useTrainerAvailability } from '@/features/trainers/hooks/useTrainerAvailability';
import { ApiError } from '@/shared/api/types';
import { Button, Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

const REASONS: { label: string; code: RescheduleReason }[] = [
  { label: 'Something came up', code: 'something_came_up' },
  { label: 'Feeling unwell', code: 'feeling_unwell' },
  { label: 'Work conflict', code: 'work_conflict' },
  { label: 'Personal emergency', code: 'personal_emergency' },
  { label: 'Travel', code: 'travel' },
  { label: 'Other', code: 'other' },
];

export function RescheduleSessionScreen() {
  const { id, bookingType, trainerId } = useLocalSearchParams<{
    id: string;
    bookingType?: string;
    trainerId?: string;
  }>();
  const { spacing, colors } = useTheme();
  const insets = useSafeAreaInsets();
  const statusBarStyle = useStatusBarStyle();
  const reschedule = useRescheduleBooking();
  const [step, setStep] = useState(1);
  const [selectedReason, setSelectedReason] = useState<RescheduleReason | ''>('');
  const [notes, setNotes] = useState('');
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Real Date-based state for calendar
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState('');

  const timezone = getTimezone();
  const isDiscovery = bookingType === 'discovery';
  const { data: trainerAvailability = [], isLoading: isLoadingTrainerAvailability } =
    useTrainerAvailability(!isDiscovery ? trainerId : undefined);
  const { data: discoverySlots = [], isLoading: isLoadingDiscoverySlots } =
    useDiscoverySlots(timezone);
  const { data: upcomingBookings = [], isLoading: isLoadingUpcomingBookings } = useUpcomingBookings(
    {
      timezone,
      type: isDiscovery ? 'discovery' : 'session',
      limit: 50,
    },
  );
  const availableSlots = isDiscovery
    ? getDiscoverySlotDates(discoverySlots, upcomingBookings)
    : trainerId
      ? getTrainerAvailabilityDates(trainerAvailability, upcomingBookings)
      : [];
  const isLoadingAvailability =
    isLoadingUpcomingBookings ||
    (isDiscovery ? isLoadingDiscoverySlots : Boolean(trainerId) && isLoadingTrainerAvailability);

  const today = new Date();
  const todayStart = startOfDay(today);
  const isCurrentOrPastMonth =
    viewDate.getFullYear() < today.getFullYear() ||
    (viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() <= today.getMonth());

  const handlePrevMonth = () => {
    if (isCurrentOrPastMonth) return;
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
  };

  const timezoneOffset = -new Date().getTimezoneOffset() / 60;
  const timezoneStr = `GMT${timezoneOffset >= 0 ? '+' : ''}${timezoneOffset}`;

  const handleContinue = async () => {
    if (step < 2) {
      setStep(step + 1);
      return;
    }

    if (!id || !selectedReason || selectedDate === null || !selectedTime) return;

    setSubmitError(null);

    try {
      await reschedule.mutateAsync({
        id,
        new_datetime: buildRescheduleDateTime(viewDate, selectedDate, selectedTime),
        timezone: getTimezone(),
        reason: selectedReason,
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      });
      router.back();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? error.message
          : 'We could not reschedule this session. Please try again.';
      setSubmitError(message);
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
          <ReasonStep
            selectedReason={selectedReason}
            onSelectReason={setSelectedReason}
            notes={notes}
            onNotesChange={setNotes}
          />
        ) : (
          <DateTimeStep
            selectedDate={selectedDate}
            onSelectDate={(date) => {
              setSelectedDate(date);
              setSelectedTime('');
            }}
            selectedTime={selectedTime}
            onSelectTime={setSelectedTime}
            viewDate={viewDate}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
            timezoneStr={timezoneStr}
            todayStart={todayStart}
            isCurrentOrPastMonth={isCurrentOrPastMonth}
            availableSlots={availableSlots}
            isLoadingAvailability={isLoadingAvailability}
          />
        )}

        {submitError ? (
          <View style={[styles.errorBanner, { backgroundColor: colors.error + '14' }]}>
            <Ionicons name="alert-circle-outline" size={18} color={colors.error} />
            <Typography variant="body2" color={colors.error} style={styles.errorText}>
              {submitError}
            </Typography>
          </View>
        ) : null}
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
          label={step === 1 ? 'Continue' : 'Confirm Reschedule'}
          onPress={handleContinue}
          isLoading={reschedule.isPending}
          disabled={
            step === 1 ? !selectedReason : !selectedDate || !selectedTime || isLoadingAvailability
          }
        />
      </View>
    </Screen>
  );
}

function ReasonStep({
  selectedReason,
  onSelectReason,
  notes,
  onNotesChange,
}: {
  selectedReason: RescheduleReason | '';
  onSelectReason: (reason: RescheduleReason) => void;
  notes: string;
  onNotesChange: (notes: string) => void;
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
        {REASONS.map(({ label, code }) => {
          const isActive = selectedReason === code;
          return (
            <Pressable
              key={code}
              onPress={() => onSelectReason(code)}
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
                {label}
              </Typography>
            </Pressable>
          );
        })}
      </View>

      <Typography variant="body2" style={[styles.label, { marginTop: 24 }]}>
        Additional details
      </Typography>
      <TextInput
        value={notes}
        onChangeText={onNotesChange}
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
  todayStart,
  isCurrentOrPastMonth,
  availableSlots,
  isLoadingAvailability,
}: {
  selectedDate: number | null;
  onSelectDate: (date: number) => void;
  selectedTime: string;
  onSelectTime: (time: string) => void;
  viewDate: Date;
  onPrevMonth: () => void;
  onNextMonth: () => void;
  timezoneStr: string;
  todayStart: Date;
  isCurrentOrPastMonth: boolean;
  availableSlots: Date[];
  isLoadingAvailability: boolean;
}) {
  const { colors } = useTheme();
  const availableDates = getAvailableDatesForMonth(viewDate, availableSlots);
  const availableTimes = selectedDate
    ? getAvailableTimesForDate(
        new Date(viewDate.getFullYear(), viewDate.getMonth(), selectedDate),
        availableSlots,
      )
    : [];
  const calendarCells = getCalendarCells(viewDate);

  return (
    <View>
      <Typography variant="h2" style={styles.stepTitle}>
        Pick a new date and time
      </Typography>
      <Typography variant="body2" color={colors.textSecondary} style={styles.stepSubtitle}>
        {isLoadingAvailability
          ? 'Loading available slots...'
          : 'Only available reschedule slots are shown. All times are in your local timezone.'}
      </Typography>

      <View
        style={[
          styles.calendarContainer,
          { backgroundColor: colors.background, borderColor: colors.divider },
        ]}
      >
        <View style={styles.calendarHeader}>
          <Pressable onPress={onPrevMonth} disabled={isCurrentOrPastMonth}>
            <Ionicons
              name="chevron-back"
              size={20}
              color={isCurrentOrPastMonth ? colors.iconMuted : colors.icon}
            />
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
          {Array.from({ length: calendarCells.leadingEmpty }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.dateCircle} />
          ))}
          {Array.from({ length: calendarCells.daysInMonth }, (_, i) => i + 1).map((date) => {
            const cellDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), date);
            const isPast = cellDate < todayStart;
            if (isPast) {
              return <View key={date} style={styles.dateCircle} />;
            }

            const isSelected = selectedDate === date;
            const isAvailable = availableDates.has(date);
            const disabled = !isAvailable;
            return (
              <Pressable
                key={date}
                onPress={() => onSelectDate(date)}
                style={[
                  styles.dateCircle,
                  isSelected && { backgroundColor: colors.primary },
                  disabled && { backgroundColor: colors.surfaceMuted },
                ]}
                disabled={disabled}
              >
                <Typography
                  color={isSelected ? '#FFFFFF' : disabled ? colors.textMuted : colors.text}
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
        {isLoadingAvailability ? (
          <View style={styles.noSlots}>
            <Typography variant="body2" color={colors.textSecondary} style={styles.noSlotsText}>
              Loading available times...
            </Typography>
          </View>
        ) : availableSlots.length === 0 ? (
          <View style={styles.noSlots}>
            <Typography variant="body2" color={colors.textSecondary} style={styles.noSlotsText}>
              No available reschedule slots.
            </Typography>
          </View>
        ) : selectedDate === null ? (
          <View style={styles.noSlots}>
            <Typography variant="body2" color={colors.textSecondary} style={styles.noSlotsText}>
              Select an available day to see times.
            </Typography>
          </View>
        ) : availableTimes.length === 0 ? (
          <View style={styles.noSlots}>
            <Typography variant="body2" color={colors.textSecondary} style={styles.noSlotsText}>
              No times available on this day.
            </Typography>
          </View>
        ) : (
          availableTimes.map((time) => {
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
          })
        )}
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
  noSlots: {
    width: '100%',
    minHeight: 76,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noSlotsText: {
    textAlign: 'center',
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
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    borderRadius: 12,
    padding: 14,
    marginTop: 16,
  },
  errorText: { flex: 1, lineHeight: 20 },
});

function buildRescheduleDateTime(viewDate: Date, day: number, time: string): string {
  const [rawTime, period] = time.trim().split(/\s+/);
  const [rawHour, rawMinute] = rawTime.split(':').map(Number);
  let hour = rawHour;
  if (period === 'PM' && hour !== 12) hour += 12;
  if (period === 'AM' && hour === 12) hour = 0;

  const dt = new Date(viewDate.getFullYear(), viewDate.getMonth(), day, hour, rawMinute ?? 0, 0, 0);
  return dt.toISOString();
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function getCalendarCells(viewDate: Date) {
  return {
    leadingEmpty: new Date(viewDate.getFullYear(), viewDate.getMonth(), 1).getDay(),
    daysInMonth: new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 0).getDate(),
  };
}

function getAvailableDatesForMonth(viewDate: Date, availableSlots: Date[]) {
  const month = viewDate.getMonth();
  const year = viewDate.getFullYear();
  const now = new Date();
  return new Set(
    availableSlots
      .filter((slot) => slot.getTime() > now.getTime())
      .filter((slot) => slot.getFullYear() === year && slot.getMonth() === month)
      .map((slot) => slot.getDate()),
  );
}

function getAvailableTimesForDate(date: Date, availableSlots: Date[]) {
  const now = new Date();
  return Array.from(
    new Set(
      availableSlots
        .filter((slot) => slot.getTime() > now.getTime())
        .filter(
          (slot) =>
            slot.getFullYear() === date.getFullYear() &&
            slot.getMonth() === date.getMonth() &&
            slot.getDate() === date.getDate(),
        )
        .map(formatTime),
    ),
  );
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
