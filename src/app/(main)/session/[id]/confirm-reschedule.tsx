import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/features/sessions/store/useSessionStore';
import { Button, Screen, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

export default function ConfirmRescheduleScreen() {
  const { id, newDate, newTime } = useLocalSearchParams<{
    id: string;
    newDate: string;
    newTime: string;
  }>();
  const router = useRouter();
  const { sessions, rescheduleSession } = useSessionStore();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const session = sessions.find((s) => s.id === id);

  if (!session || !newDate || !newTime) {
    return (
      <Screen>
        <Typography>Invalid Session Data</Typography>
      </Screen>
    );
  }

  const handleConfirm = () => {
    // Determine end time mock (assume 1 hr later)
    let newEndTime = '12:30 PM'; // Simplified mock
    if (newTime.includes('AM')) {
      newEndTime = newTime.replace('AM', 'AM'); // just fake it
    }

    rescheduleSession(session.id, newDate, newTime, newEndTime);

    // After success, go to a success screen or just pop to root/sessions
    // Here we will navigate back to the tabs to show the updated list
    router.dismissAll();
    router.replace('/(main)/(tabs)/sessions');
  };

  const oldDateObj = new Date(session.date);
  const newDateObj = new Date(newDate);

  const formatDate = (date: Date) =>
    date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

  return (
    <Screen padding={false} edges={['top']} backgroundColor={colors.surface}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Session Details
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{
          padding: spacing.md,
          paddingBottom: 180 + insets.bottom,
        }}
      >
        <Typography variant="label" color={colors.textSecondary} style={{ marginBottom: 4 }}>
          Step 2 of 2
        </Typography>
        <Typography variant="h3" style={{ marginBottom: spacing.xl }}>
          Confirm your new schedule
        </Typography>

        <View style={[styles.comparisonCard, { borderColor: colors.border }]}>
          <View style={styles.comparisonColumn}>
            <Typography variant="label" color={colors.textSecondary}>
              CURRENT
            </Typography>
            <Typography
              variant="body2"
              color={colors.warning}
              style={{ fontWeight: '600', marginTop: 8 }}
            >
              {formatDate(oldDateObj)}
            </Typography>
            <Typography
              variant="body2"
              color={colors.warning}
              style={{ fontWeight: '500', marginTop: 4 }}
            >
              {session.startTime}
            </Typography>
          </View>

          <View style={styles.arrowContainer}>
            <Ionicons name="arrow-forward" size={24} color={colors.iconMuted} />
          </View>

          <View style={styles.comparisonColumn}>
            <Typography variant="label" color={colors.textSecondary}>
              NEW
            </Typography>
            <Typography
              variant="body2"
              color={colors.primary}
              style={{ fontWeight: '600', marginTop: 8 }}
            >
              {formatDate(newDateObj)}
            </Typography>
            <Typography
              variant="body2"
              color={colors.primary}
              style={{ fontWeight: '500', marginTop: 4 }}
            >
              {newTime}
            </Typography>
          </View>
        </View>

        <Typography variant="h3" style={{ marginTop: spacing.xl, marginBottom: spacing.md }}>
          Trainer
        </Typography>
        <View style={styles.trainerInfo}>
          <Image
            source={{ uri: session.trainerAvatar }}
            style={[styles.avatarLarge, { backgroundColor: colors.surfaceMuted }]}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h3">{session.trainerName}</Typography>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.success}
                style={{ marginLeft: 4 }}
              />
            </View>
            <Typography variant="body2" color={colors.textSecondary}>
              Certified Fitness Trainer
            </Typography>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.bottomBar,
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
          label="Confirm Reschedule"
          onPress={handleConfirm}
          style={{ marginBottom: spacing.sm }}
        />

        <View style={[styles.warningBanner, { backgroundColor: colors.surfaceMuted }]}>
          <Ionicons
            name="warning"
            size={20}
            color={colors.warning}
            style={{ marginRight: 8, marginTop: 2 }}
          />
          <Typography variant="label" color={colors.warning} style={{ flex: 1 }}>
            Rescheduling less than 24 hours before the session may incur a fee.
          </Typography>
        </View>
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
  comparisonCard: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  comparisonColumn: {
    flex: 1,
  },
  arrowContainer: {
    paddingHorizontal: 16,
  },
  trainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarLarge: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 16,
  },
  bottomBar: {
    borderTopWidth: 1,
  },
  warningBanner: {
    flexDirection: 'row',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
});
