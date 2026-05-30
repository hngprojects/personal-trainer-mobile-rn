import { Ionicons } from '@expo/vector-icons';
import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ActivityIndicator, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Avatar, Button, Screen, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

import { useSessionDetails } from '../hooks/useSessionDetails';

const FALLBACK_BACKGROUND = require('../../../../assets/images/auth-bg.jpg');

export function SessionDetailsScreen() {
  // `id` is the session_id (from booking.session_id) and drives GET /sessions/{id}.
  // `bookingId` is the booking row's id, used for PUT /bookings/{id}/reschedule.
  const {
    id,
    bookingId,
    bookingType,
    trainerId,
    trainerName,
    trainerAvatar,
    platform,
    date,
    time,
    duration,
  } = useLocalSearchParams<{
    id: string;
    bookingId?: string;
    bookingType?: string;
    trainerId?: string;
    trainerName?: string;
    trainerAvatar?: string;
    platform?: string;
    date?: string;
    time?: string;
    duration?: string;
  }>();
  const { spacing, colors, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { data: apiSession, isLoading } = useSessionDetails(id);
  const glassSurface = isDark ? 'rgba(0,0,0,0.48)' : 'rgba(255,255,255,0.78)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.20)' : 'rgba(255,255,255,0.46)';
  const backgroundSource = trainerAvatar ? { uri: trainerAvatar } : FALLBACK_BACKGROUND;

  if (isLoading) {
    return (
      <Screen padding={false} edges={[]} backgroundColor="#000000">
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <ExpoImage source={backgroundSource} style={styles.backgroundImage} contentFit="cover" />
        <View pointerEvents="none" style={styles.backgroundScrim} />
        <View style={styles.loading}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!apiSession) {
    return (
      <Screen padding={false} edges={[]} backgroundColor="#000000">
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <ExpoImage source={backgroundSource} style={styles.backgroundImage} contentFit="cover" />
        <View pointerEvents="none" style={styles.backgroundScrim} />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0.84)', 'rgba(0,0,0,0.96)']}
          style={styles.backgroundShade}
        />
        <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
          </Pressable>
          <Typography variant="h3" style={[styles.headerTitle, { color: '#FFFFFF' }]}>
            Session Not Found
          </Typography>
        </View>
        <View
          style={[
            styles.scrollContent,
            { paddingHorizontal: spacing.md, alignItems: 'center', marginTop: 100 },
          ]}
        >
          <Typography variant="body1" color="rgba(255,255,255,0.74)">
            The session you are looking for does not exist or has been removed.
          </Typography>
          <Button
            label="Go Back"
            onPress={() => router.back()}
            style={{ marginTop: 24, width: '100%' }}
          />
        </View>
      </Screen>
    );
  }

  // Reschedule operates on the booking, not the session.
  const rescheduleId = bookingId;
  const handleReschedule = () => {
    if (!rescheduleId) return;
    router.push({
      pathname: '/reschedule-session' as any,
      params: { id: rescheduleId, bookingType, trainerId },
    });
  };
  const startDate = parseValidDate(apiSession.actualStart);
  const endDate = parseValidDate(apiSession.actualEnd);
  const displayDate = startDate
    ? startDate.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      })
    : date;
  const displayTime =
    startDate && endDate ? `${formatTime(startDate)} - ${formatTime(endDate)}` : time;
  const displayDuration =
    startDate && endDate
      ? `${Math.max(1, Math.round((endDate.getTime() - startDate.getTime()) / 60000))} mins`
      : duration;

  return (
    <Screen padding={false} edges={[]} backgroundColor="#000000">
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <ExpoImage
        source={backgroundSource}
        style={styles.backgroundImage}
        contentFit="cover"
        transition={180}
      />
      <View pointerEvents="none" style={styles.backgroundScrim} />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.58)', 'rgba(0,0,0,0.72)', 'rgba(0,0,0,0.88)', 'rgba(0,0,0,0.96)']}
        locations={[0, 0.28, 0.68, 1]}
        style={styles.backgroundShade}
      />

      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </Pressable>
        <Typography variant="h3" style={[styles.headerTitle, { color: '#FFFFFF' }]}>
          Session Details
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: spacing.md, paddingBottom: 190 + insets.bottom },
        ]}
      >
        <Typography variant="body2" color="rgba(255,255,255,0.74)" style={styles.sectionLabel}>
          Your Trainer
        </Typography>

        <View
          style={[styles.trainerCard, { backgroundColor: glassSurface, borderColor: glassBorder }]}
        >
          <Avatar name={trainerName ?? 'FitCall Trainer'} uri={trainerAvatar || null} size={56} />
          <View style={styles.trainerInfo}>
            <View style={styles.trainerHeader}>
              <Typography style={[styles.trainerName, { color: '#FFFFFF' }]}>
                {trainerName ?? 'FitCall Trainer'}
              </Typography>
              <Ionicons name="checkmark-circle" size={16} color={colors.success} />
            </View>
            <Typography variant="label" color="rgba(255,255,255,0.70)">
              Strength & Accountability
            </Typography>
          </View>
        </View>

        <Typography variant="body2" color="rgba(255,255,255,0.74)" style={styles.sectionLabel}>
          Booking Information
        </Typography>

        <View
          style={[styles.infoList, { backgroundColor: glassSurface, borderColor: glassBorder }]}
        >
          <InfoItem icon="calendar-outline" label="Date" value={displayDate ?? 'Pending'} />
          <InfoItem icon="time-outline" label="Time" value={displayTime ?? 'Pending'} />
          <InfoItem
            icon="hourglass-outline"
            label="Duration"
            value={displayDuration ?? '60 mins'}
          />
          <InfoItem
            icon="videocam-outline"
            label="Platform"
            value={platform || 'Zoom'}
            isPlatform
          />
          {apiSession?.trainerNote ? (
            <InfoItem
              icon="document-text-outline"
              label="Trainer Note"
              value={apiSession.trainerNote}
            />
          ) : null}
        </View>

        <Typography variant="body2" color="rgba(255,255,255,0.74)" style={styles.sectionLabel}>
          Session Goals
        </Typography>

        <View style={styles.goalsContainer}>
          {['Cardio', 'Core Strength', 'Weight Loss', 'Mobility'].map((goal) => (
            <View
              key={goal}
              style={[styles.goalTag, { backgroundColor: glassSurface, borderColor: glassBorder }]}
            >
              <Typography variant="label" color="rgba(255,255,255,0.78)">
                {goal}
              </Typography>
            </View>
          ))}
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.md,
            paddingTop: 0,
            paddingBottom: spacing.md + insets.bottom,
          },
        ]}
      >
        <Button
          label="Reschedule"
          onPress={handleReschedule}
          disabled={!rescheduleId}
          style={styles.glassButton}
        />
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
        <Ionicons name={icon} size={20} color="rgba(255,255,255,0.68)" />
        <Typography variant="body2" color="rgba(255,255,255,0.70)" style={styles.infoLabel}>
          {label}
        </Typography>
      </View>
      <View style={styles.infoValueContainer}>
        {isPlatform && <View style={[styles.platformDot, { backgroundColor: colors.primary }]} />}
        <Typography variant="body2" style={[styles.infoValue, { color: '#FFFFFF' }]}>
          {value}
        </Typography>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  backgroundScrim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.56)',
  },
  backgroundShade: {
    ...StyleSheet.absoluteFillObject,
  },
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
  sectionLabel: {
    fontFamily: fonts.semibold,
    marginTop: 24,
    marginBottom: 12,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
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
    borderRadius: 16,
    borderWidth: 1,
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
  },
  goalsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  goalTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  glassButton: {
    backgroundColor: 'rgba(255,255,255,0.22)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.34)',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

function parseValidDate(value: string | null | undefined) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : null;
}
