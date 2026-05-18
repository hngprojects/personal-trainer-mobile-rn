import { Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View, ViewStyle } from 'react-native';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';
import { CallDraft } from '../types/book-a-call.types';

const DAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
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
const UNAVAILABLE_TIMES = new Set(['7:00 AM', '1:00 PM', '6:00 PM']);

const CIRCLE_SIZE = 36;
const CIRCLE_RADIUS = CIRCLE_SIZE / 2;
const DASH_COUNT = 10;
const DASH_WIDTH = 5;
const DASH_HEIGHT = 1.5;

function DashedCircle({
  color,
  style,
  children,
}: {
  color: string;
  style?: ViewStyle;
  children?: React.ReactNode;
}) {
  return (
    <View style={[{ width: CIRCLE_SIZE, height: CIRCLE_SIZE }, style]}>
      {Array.from({ length: DASH_COUNT }, (_, i) => {
        const angle = (i * 360) / DASH_COUNT;
        const rad = ((angle - 90) * Math.PI) / 180;
        const x = CIRCLE_RADIUS + (CIRCLE_RADIUS - 2) * Math.cos(rad) - DASH_WIDTH / 2;
        const y = CIRCLE_RADIUS + (CIRCLE_RADIUS - 2) * Math.sin(rad) - DASH_HEIGHT / 2;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              width: DASH_WIDTH,
              height: DASH_HEIGHT,
              backgroundColor: color,
              left: x,
              top: y,
              borderRadius: 1,
              transform: [{ rotate: `${angle}deg` }],
            }}
          />
        );
      })}
      {children}
    </View>
  );
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay()); // back to Sunday
  d.setHours(0, 0, 0, 0);
  return d;
}

interface DateTimeStepProps {
  draft: CallDraft;
  onUpdate: (patch: Partial<CallDraft>) => void;
  onContinue: () => void;
}

export function DateTimeStep({ draft, onUpdate, onContinue }: DateTimeStepProps) {
  const { colors, spacing } = useTheme();
  const today = new Date();
  const todayMidnight = startOfDay(today);

  const [weekStart, setWeekStart] = useState(() => getWeekStart(today));

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    return d;
  });

  const timezoneLabel = useMemo(() => {
    const offsetMinutes = -new Date().getTimezoneOffset();
    const sign = offsetMinutes >= 0 ? '+' : '-';
    const abs = Math.abs(offsetMinutes);
    const hours = String(Math.floor(abs / 60)).padStart(2, '0');
    const minutes = String(abs % 60).padStart(2, '0');
    return `GMT${sign}${hours}:${minutes}`;
  }, []);

  // Header label — show both months if the week straddles a boundary
  const lastDay = weekDays[6];
  const headerLabel =
    weekStart.getMonth() === lastDay.getMonth()
      ? `${MONTH_NAMES[weekStart.getMonth()]} ${weekStart.getFullYear()}`
      : `${MONTH_NAMES[weekStart.getMonth()]} / ${MONTH_NAMES[lastDay.getMonth()]} ${lastDay.getFullYear()}`;

  function prevWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  }

  function nextWeek() {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  }

  function onDayPress(date: Date) {
    if (date.getDay() === 0 || date.getDay() === 6) return; // weekend
    if (date < todayMidnight) return; // past
    onUpdate({ date, time: null });
  }

  function onTimePress(slot: string) {
    if (UNAVAILABLE_TIMES.has(slot)) return;
    onUpdate({ time: slot });
  }

  const isValid = draft.date !== null && draft.time !== null;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        <Typography variant="h2" style={styles.heading}>
          Pick a date and time
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
          Only available slots are shown.
        </Typography>

        {/* Calendar card */}
        <View
          style={[
            styles.calendarCard,
            { backgroundColor: colors.surface, borderColor: colors.border },
          ]}
        >
          {/* Week header */}
          <View style={styles.monthHeader}>
            <Pressable onPress={prevWeek} hitSlop={12} style={styles.chevronBtn}>
              <Ionicons name="chevron-back" size={18} color={colors.text} />
            </Pressable>
            <View style={styles.monthTitleRow}>
              <Typography variant="body1" style={styles.monthTitle}>
                {headerLabel}
              </Typography>
              <Ionicons
                name="chevron-down"
                size={14}
                color={colors.text}
                style={styles.dropChevron}
              />
            </View>
            <Pressable onPress={nextWeek} hitSlop={12} style={styles.chevronBtn}>
              <Ionicons name="chevron-forward" size={18} color={colors.text} />
            </Pressable>
          </View>

          {/* Day-of-week labels */}
          <View style={styles.dowRow}>
            {DAY_LABELS.map((d) => (
              <Typography
                key={d}
                variant="body2"
                color={colors.textSecondary}
                style={styles.dowLabel}
              >
                {d}
              </Typography>
            ))}
          </View>

          {/* Single week row */}
          <View style={styles.weekRow}>
            {weekDays.map((date, i) => {
              const isToday = isSameDay(date, today);
              const isPast = date < todayMidnight;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const avail = !isWeekend && !isPast;
              const selected = draft.date ? isSameDay(date, draft.date) : false;

              return (
                <Pressable
                  key={i}
                  onPress={() => avail && onDayPress(date)}
                  style={[styles.dayCell, !avail && { opacity: 0.3 }]}
                >
                  {isToday && !selected ? (
                    <DashedCircle color={colors.textSecondary}>
                      <Typography
                        variant="body2"
                        color={colors.text}
                        style={[styles.dayText, styles.dayTextAbsolute]}
                      >
                        {date.getDate()}
                      </Typography>
                    </DashedCircle>
                  ) : (
                    <View
                      style={[styles.dayCircle, selected && { backgroundColor: colors.primary }]}
                    >
                      <Typography
                        variant="body2"
                        color={selected ? '#fff' : colors.text}
                        style={styles.dayText}
                      >
                        {date.getDate()}
                      </Typography>
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legend}>
          {[
            { color: palette.neutral['3'], fill: true, label: 'Unavailable' },
            { color: colors.border, fill: false, label: 'Available' },
            { color: colors.primary, fill: true, label: 'Selected' },
          ].map(({ color, fill, label }) => (
            <View key={label} style={styles.legendItem}>
              <View
                style={[
                  styles.legendCircle,
                  fill
                    ? { backgroundColor: color }
                    : { borderWidth: 1.5, borderColor: color, backgroundColor: 'transparent' },
                ]}
              />
              <Typography variant="body2" color={colors.textSecondary} style={styles.legendLabel}>
                {label}
              </Typography>
            </View>
          ))}
        </View>

        {/* Time slots header */}
        <View style={styles.timezoneRow}>
          <Ionicons
            name="globe-outline"
            size={15}
            color={colors.textSecondary}
            style={styles.globeIcon}
          />
          <Typography variant="body2" color={colors.textSecondary}>
            Available Times in your timezone ({timezoneLabel})
          </Typography>
        </View>

        {/* Time grid */}
        <View style={styles.timeGrid}>
          {TIME_SLOTS.map((slot) => {
            const unavail = UNAVAILABLE_TIMES.has(slot);
            const selected = draft.time === slot;
            return (
              <Pressable
                key={slot}
                onPress={() => onTimePress(slot)}
                style={[
                  styles.timeSlot,
                  unavail && styles.timeSlotUnavail,
                  !unavail &&
                    !selected && { borderWidth: 1, borderColor: colors.border, borderRadius: 10 },
                  selected && { backgroundColor: colors.primary, borderRadius: 10 },
                ]}
                disabled={unavail}
              >
                <Typography
                  variant="body2"
                  color={selected ? '#fff' : unavail ? colors.textSecondary : colors.text}
                  style={[styles.timeText, selected && { fontWeight: '600' }]}
                >
                  {selected ? `✓ ${slot}` : slot}
                </Typography>
              </Pressable>
            );
          })}
        </View>

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
        <Button label="Continue" disabled={!isValid} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingTop: 8, paddingBottom: 16 },
  heading: { fontWeight: '700', marginBottom: 6 },
  subtitle: { marginBottom: 20 },
  calendarCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 16,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  chevronBtn: { padding: 4 },
  monthTitleRow: { flexDirection: 'row', alignItems: 'center' },
  monthTitle: { fontWeight: '600' },
  dropChevron: { marginLeft: 4 },
  dowRow: { flexDirection: 'row', marginBottom: 8 },
  dowLabel: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '600' },
  weekRow: { flexDirection: 'row' },
  dayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 4,
  },
  dayCircle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_RADIUS,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  dayText: { fontSize: 13, fontWeight: '500' },
  dayTextAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    textAlign: 'center',
    lineHeight: CIRCLE_SIZE,
  },
  legend: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 20,
  },
  legendItem: { flexDirection: 'row', alignItems: 'center' },
  legendCircle: { width: 16, height: 16, borderRadius: 8, marginRight: 6 },
  legendLabel: { fontSize: 12 },
  timezoneRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  globeIcon: { marginRight: 6 },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeSlot: {
    width: '30%',
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timeSlotUnavail: { opacity: 0.4 },
  timeText: { fontSize: 13 },
  footerSpacer: { height: 8 },
  footer: { paddingTop: 12 },
});
