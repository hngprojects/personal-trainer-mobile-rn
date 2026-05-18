import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { useSessionStore } from '@/features/sessions/store/useSessionStore';
import { Button, Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

const AVAILABLE_TIMES = [
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
];

export default function RescheduleScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sessions } = useSessionStore();
  const { colors, spacing } = useTheme();

  const session = sessions.find((s) => s.id === id);

  const [selectedDate, setSelectedDate] = useState<number>(24); // Default to mock Aug 24
  const [selectedTime, setSelectedTime] = useState<string>('10:30 AM');

  if (!session) {
    return (
      <Screen>
        <Typography>Session not found</Typography>
      </Screen>
    );
  }

  const handleContinue = () => {
    // In a real app we'd pass the actual Date object
    router.push({
      pathname: `/(main)/session/[id]/confirm-reschedule`,
      params: {
        id: session.id,
        newDate: `2024-08-${selectedDate.toString().padStart(2, '0')}`,
        newTime: selectedTime,
      },
    } as any);
  };

  const renderCalendar = () => {
    const daysOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
    const daysInMonth = 31;
    const startDay = 4; // Mock August 1st 2024 is a Thursday (4)

    const grid = [];
    let currentDay = 1;

    for (let row = 0; row < 6; row++) {
      const rowCells = [];
      for (let col = 0; col < 7; col++) {
        if (row === 0 && col < startDay) {
          rowCells.push(<View key={`empty-${col}`} style={styles.calendarCell} />);
        } else if (currentDay <= daysInMonth) {
          const day = currentDay;
          const isSelected = selectedDate === day;
          rowCells.push(
            <Pressable
              key={`day-${day}`}
              style={[
                styles.calendarCell,
                isSelected && { backgroundColor: colors.primary, borderRadius: 20 },
              ]}
              onPress={() => setSelectedDate(day)}
            >
              <Typography
                variant="body2"
                style={{
                  color: isSelected ? '#FFFFFF' : palette.neutral['9'],
                  fontWeight: isSelected ? '600' : '400',
                }}
              >
                {day}
              </Typography>
            </Pressable>,
          );
          currentDay++;
        } else {
          rowCells.push(<View key={`empty-end-${col}`} style={styles.calendarCell} />);
        }
      }
      grid.push(
        <View key={`row-${row}`} style={styles.calendarRow}>
          {rowCells}
        </View>,
      );
      if (currentDay > daysInMonth) break;
    }

    return (
      <View style={styles.calendarContainer}>
        <View style={styles.calendarHeader}>
          <Typography variant="h3" style={{ fontFamily: fonts.bold }}>
            August 2024
          </Typography>
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <Ionicons name="chevron-back" size={24} color={palette.neutral['9']} />
            <Ionicons name="chevron-forward" size={24} color={palette.neutral['9']} />
          </View>
        </View>

        <View style={styles.calendarDaysHeader}>
          {daysOfWeek.map((d, i) => (
            <View key={`dow-${i}`} style={styles.calendarCell}>
              <Typography variant="label" color={palette.neutral['5']}>
                {d}
              </Typography>
            </View>
          ))}
        </View>
        {grid}
      </View>
    );
  };

  return (
    <Screen padding={false} backgroundColor={colors.surface}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Reschedule Session
        </Typography>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <Typography variant="label" color={palette.neutral['5']} style={{ marginBottom: 4 }}>
          Step 1 of 2
        </Typography>
        <Typography variant="h3" style={{ marginBottom: spacing.xl }}>
          Pick a new date and time
        </Typography>

        {renderCalendar()}

        <View style={{ marginTop: spacing.xl, marginBottom: spacing.sm }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: spacing.md }}>
            <Ionicons name="time-outline" size={20} color={colors.primary} />
            <Typography variant="body2" style={{ marginLeft: 8, fontWeight: '500' }}>
              Available times (West Africa Standard Time)
            </Typography>
          </View>

          <View style={styles.timesGrid}>
            {AVAILABLE_TIMES.map((time) => {
              const isSelected = selectedTime === time;
              return (
                <Pressable
                  key={time}
                  style={[
                    styles.timeButton,
                    { borderColor: isSelected ? colors.primary : palette.neutral['2'] },
                    isSelected && { backgroundColor: palette.highlightBlue['0.5'] },
                  ]}
                  onPress={() => setSelectedTime(time)}
                >
                  <Typography
                    variant="label"
                    color={isSelected ? colors.primary : palette.neutral['7']}
                    style={{ fontWeight: isSelected ? '600' : '500' }}
                  >
                    {time}
                  </Typography>
                </Pressable>
              );
            })}
          </View>
        </View>
      </ScrollView>

      <View
        style={[styles.bottomBar, { borderTopColor: palette.neutral['2'], padding: spacing.md }]}
      >
        <Button label="Continue to confirm" onPress={handleContinue} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  calendarContainer: {
    marginBottom: 8,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarDaysHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarRow: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  calendarCell: {
    flex: 1,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeButton: {
    width: '30%', // roughly 3 per row
    borderWidth: 1,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  bottomBar: {
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
});
