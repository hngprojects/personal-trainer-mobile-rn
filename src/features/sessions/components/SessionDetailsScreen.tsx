import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Button, Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { mockSessions } from '../data/sessions.data';

export function SessionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { spacing, colors } = useTheme();

  const session = mockSessions.find((s) => s.id === id) || mockSessions[0];

  const handleReschedule = () => {
    router.push({
      pathname: '/reschedule-session' as any,
      params: { id: session.id },
    });
  };

  return (
    <Screen padding={false} edges={['top']} backgroundColor="#FFFFFF">
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={palette.neutral['9']} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Session Details
        </Typography>
      </View>

      <ScrollView contentContainerStyle={[styles.scrollContent, { paddingHorizontal: spacing.md }]}>
        <Typography variant="body2" color={colors.textSecondary} style={styles.sectionLabel}>
          Your Trainer
        </Typography>

        <View style={styles.trainerCard}>
          <Image source={{ uri: session.trainerAvatar }} style={styles.trainerAvatar} />
          <View style={styles.trainerInfo}>
            <View style={styles.trainerHeader}>
              <Typography style={styles.trainerName}>{session.trainerName}</Typography>
              <Ionicons name="checkmark-circle" size={16} color={palette.success['5']} />
            </View>
            <Typography variant="label" color={colors.textSecondary}>
              Strength & Accountability
            </Typography>
          </View>
        </View>

        <Typography variant="body2" color={colors.textSecondary} style={styles.sectionLabel}>
          Booking Information
        </Typography>

        <View style={styles.infoList}>
          <InfoItem icon="calendar-outline" label="Date" value={session.date} />
          <InfoItem icon="time-outline" label="Time" value={session.time} />
          <InfoItem icon="hourglass-outline" label="Duration" value={session.duration} />
          <InfoItem
            icon="videocam-outline"
            label="Platform"
            value={session.platform || 'Zoom'}
            isPlatform
          />
        </View>

        <Typography variant="body2" color={colors.textSecondary} style={styles.sectionLabel}>
          Session Goals
        </Typography>

        <View style={styles.goalsContainer}>
          {(session.goals || ['Cardio', 'Core Strength', 'Weight Loss', 'Mobility']).map((goal) => (
            <View key={goal} style={styles.goalTag}>
              <Typography variant="label" color={colors.textSecondary}>
                {goal}
              </Typography>
            </View>
          ))}
        </View>
      </ScrollView>

      <View style={[styles.footer, { padding: spacing.md }]}>
        <Button label="Reschedule" onPress={handleReschedule} />
      </View>
    </Screen>
  );
}

function InfoItem({
  icon,
  label,
  value,
  isPlatform,
}: {
  icon: any;
  label: string;
  value: string;
  isPlatform?: boolean;
}) {
  const { colors } = useTheme();
  return (
    <View style={styles.infoItem}>
      <View style={styles.infoIconLabel}>
        <Ionicons name={icon} size={20} color={palette.neutral['4']} />
        <Typography variant="body2" color={colors.textSecondary} style={styles.infoLabel}>
          {label}
        </Typography>
      </View>
      <View style={styles.infoValueContainer}>
        {isPlatform && <View style={styles.platformDot} />}
        <Typography variant="body2" style={styles.infoValue}>
          {value}
        </Typography>
      </View>
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
  sectionLabel: {
    fontFamily: fonts.semibold,
    marginTop: 24,
    marginBottom: 12,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
  trainerAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  trainerInfo: {
    marginLeft: 16,
  },
  trainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  trainerName: {
    fontSize: 16,
    fontFamily: fonts.bold,
  },
  infoList: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
    paddingVertical: 8,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  infoIconLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoValue: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  platformDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: palette.neutral['0.5'],
    borderRadius: 20,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
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
