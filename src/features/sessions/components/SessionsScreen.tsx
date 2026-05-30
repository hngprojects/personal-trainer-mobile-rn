import { Ionicons } from '@expo/vector-icons';
import { useQueries } from '@tanstack/react-query';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { getTimezone, UpcomingBooking, useUpcomingBookings } from '@/features/bookings';
import { fetchTrainerById } from '@/features/trainers/api/trainers.api';
import { useTrainers } from '@/features/trainers/hooks/useTrainers';
import type { Trainer } from '@/features/trainers/types/trainer.types';
import { Button, Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { Session } from '../data/sessions.data';
import { SessionCard } from './SessionCard';

const LOGO = require('../../../../assets/images/logo.png');

export function SessionsScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'History'>('Upcoming');
  const [pickTrainerModalVisible, setPickTrainerModalVisible] = useState(false);

  const goPickTrainer = () => {
    setPickTrainerModalVisible(false);
    router.push('/');
  };
  const timezone = getTimezone();
  const {
    data: upcomingBookings = [],
    isLoading,
    isError,
    refetch,
  } = useUpcomingBookings({
    timezone,
    page: 1,
    limit: 50,
  });
  const { data: allTrainers = [] } = useTrainers();
  const trainerIdsToFetch = Array.from(
    new Set(
      upcomingBookings
        .filter((booking) => booking.type === 'session' && booking.trainerId)
        .filter((booking) => !booking.trainerAvatar || booking.trainerName === 'FitCall Rep')
        .map((booking) => booking.trainerId as string),
    ),
  );
  const trainerQueries = useQueries({
    queries: trainerIdsToFetch.map((trainerId) => ({
      queryKey: ['trainer', trainerId],
      queryFn: () => fetchTrainerById(trainerId),
      staleTime: 60_000,
    })),
  });
  const isLoadingTrainerDetails = trainerQueries.some((query) => query.isLoading);
  const trainersById = new Map<string, Trainer>();
  const trainersByName = new Map<string, Trainer>();
  allTrainers.forEach((trainer) => {
    trainersByName.set(normalizeName(trainer.name), trainer);
  });
  trainerQueries.forEach((query, index) => {
    const trainer = query.data;
    if (trainer) trainersById.set(trainerIdsToFetch[index]!, trainer);
  });
  const apiSessions = upcomingBookings
    .map((booking) =>
      mapUpcomingBookingToSession(
        booking,
        (booking.trainerId ? trainersById.get(booking.trainerId) : undefined) ??
          trainersByName.get(normalizeName(booking.trainerName)),
      ),
    )
    .sort(sortSessionsByNewestCreated);

  const upcomingSessions = apiSessions
    .filter((s) => !isPastSession(s) && (s.status === 'upcoming' || s.status === 'rescheduled'))
    .sort(sortSessionsByNewestCreated);
  const historySessions = apiSessions
    .filter((s) => isPastSession(s) || s.status === 'completed' || s.status === 'cancelled')
    .sort(sortSessionsByNewestScheduled);

  const displayedSessions = activeTab === 'Upcoming' ? upcomingSessions : historySessions;
  const isEmpty = displayedSessions.length === 0;
  const showLoadingState = isLoading || (upcomingBookings.length > 0 && isLoadingTrainerDetails);

  return (
    <Screen scrollable={false} padding={false} edges={['top']}>
      <StatusBar style={statusBarStyle} />

      <View style={[styles.body, { paddingHorizontal: spacing.md, paddingTop: spacing.lg }]}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Typography style={[styles.title, { color: colors.text }]}>Sessions</Typography>
        </Animated.View>

        {/* Tabs */}
        <View
          style={[
            styles.tabsContainer,
            { marginTop: spacing.md, backgroundColor: colors.surfaceMuted },
          ]}
        >
          {(['Upcoming', 'History'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[
                styles.tab,
                activeTab === tab && [styles.activeTab, { backgroundColor: colors.background }],
              ]}
            >
              <Typography
                style={[
                  styles.tabText,
                  { color: activeTab === tab ? colors.text : colors.textSecondary },
                  activeTab === tab && styles.activeTabText,
                ]}
              >
                {tab}
              </Typography>
            </Pressable>
          ))}
        </View>

        {showLoadingState ? (
          <SessionsLoadingState />
        ) : isError ? (
          <Animated.View
            entering={FadeIn.delay(150).duration(450)}
            style={[styles.empty, { marginTop: spacing.xxl }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
              <Ionicons name="cloud-offline-outline" size={32} color={colors.iconMuted} />
            </View>
            <Typography style={[styles.emptyTitle, { color: colors.text }]}>
              We could not load your sessions
            </Typography>
            <Typography style={[styles.emptyText, { color: colors.textSecondary }]}>
              Check your connection and try again.
            </Typography>
            <Button
              label="Try Again"
              onPress={() => refetch()}
              style={[styles.bookBtn, { marginTop: spacing.xl }]}
            />
          </Animated.View>
        ) : isEmpty ? (
          <Animated.View
            entering={FadeIn.delay(150).duration(450)}
            style={[styles.empty, { marginTop: spacing.xxl }]}
          >
            <View style={[styles.iconCircle, { backgroundColor: colors.surfaceMuted }]}>
              <Ionicons name="calendar-outline" size={32} color={colors.iconMuted} />
            </View>
            <Typography style={[styles.emptyTitle, { color: colors.text }]}>
              No scheduled session yet?
            </Typography>
            <Typography style={[styles.emptyText, { color: colors.textSecondary }]}>
              Connect with one of our trainers to schedule your first session.
            </Typography>
            <Button
              label="Book Session"
              onPress={() => setPickTrainerModalVisible(true)}
              style={[styles.bookBtn, { marginTop: spacing.xl }]}
            />
          </Animated.View>
        ) : (
          <FlatList
            data={displayedSessions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <SessionCard session={item} />}
            contentContainerStyle={{ paddingTop: spacing.md, paddingBottom: spacing.xxl }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <Modal
        transparent
        visible={pickTrainerModalVisible}
        animationType="fade"
        onRequestClose={() => setPickTrainerModalVisible(false)}
      >
        <View style={[styles.modalOverlay, { backgroundColor: colors.modalBackdrop }]}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setPickTrainerModalVisible(false)}
          />
          <View style={[styles.modalCard, { backgroundColor: colors.background }]}>
            <View style={[styles.modalIconCircle, { backgroundColor: colors.primarySubtle }]}>
              <Ionicons name="people-outline" size={28} color={colors.primary} />
            </View>
            <Typography style={[styles.modalTitle, { color: colors.text }]}>
              Pick a trainer first
            </Typography>
            <Typography style={[styles.modalBody, { color: colors.textSecondary }]}>
              You&apos;ll book your session with a specific trainer. Browse trainers on the home
              screen and tap the one you&apos;d like to work with.
            </Typography>
            <View style={styles.modalActions}>
              <Button
                label="Cancel"
                variant="outline"
                onPress={() => setPickTrainerModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button label="Browse trainers" onPress={goPickTrainer} style={styles.modalBtn} />
            </View>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

function SessionsLoadingState() {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View
      entering={FadeIn.duration(180)}
      style={[styles.loading, { backgroundColor: colors.background }]}
    >
      <Animated.Image source={LOGO} style={[styles.loadingLogo, logoStyle]} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeTab: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontFamily: fonts.medium,
  },
  activeTabText: {
    fontFamily: fonts.semibold,
  },
  empty: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 20,
  },
  bookBtn: {
    width: '100%',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingLogo: {
    width: 58,
    height: 58,
    resizeMode: 'contain',
  },
  modalOverlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  modalIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    textAlign: 'center',
  },
  modalBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 19,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  modalBtn: {
    flex: 1,
  },
});

function mapUpcomingBookingToSession(booking: UpcomingBooking, trainer?: Trainer): Session {
  const start = new Date(booking.startsAt);
  const durationMinutes = booking.durationMinutes ?? 60;
  const end = booking.endsAt
    ? new Date(booking.endsAt)
    : new Date(start.getTime() + durationMinutes * 60_000);

  return {
    id: booking.id,
    trainerId: trainer?.id ?? booking.trainerId,
    sessionId: booking.sessionId,
    bookingType: booking.type,
    trainerName: trainer?.name ?? booking.trainerName,
    trainerAvatar: trainer?.image ?? booking.trainerAvatar,
    type: booking.type === 'discovery' ? 'Discovery Call' : 'Training Session',
    date: start.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    time: `${formatTime(start)} - ${formatTime(end)}`,
    duration: `${durationMinutes} mins`,
    status: normalizeStatus(booking.status),
    startsAt: booking.startsAt,
    createdAt: booking.createdAt,
    platform: booking.platform ?? 'Video Call',
  };
}

function isPastSession(session: Session) {
  if (!session.startsAt) return false;
  const time = new Date(session.startsAt).getTime();
  return Number.isFinite(time) && time < Date.now();
}

function sortSessionsByNewestCreated(a: Session, b: Session) {
  return getSortableDate(b.createdAt ?? b.startsAt) - getSortableDate(a.createdAt ?? a.startsAt);
}

function sortSessionsByNewestScheduled(a: Session, b: Session) {
  return getSortableDate(b.startsAt ?? b.createdAt) - getSortableDate(a.startsAt ?? a.createdAt);
}

function getSortableDate(value: string | null | undefined) {
  if (!value) return 0;
  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : 0;
}

function normalizeName(value: string) {
  return value.trim().toLowerCase();
}

function normalizeStatus(status: string): Session['status'] {
  // Lower-case + trim so backend variants like "Completed", "CANCELLED",
  // " rescheduled " don't fall through to the default 'upcoming' and land
  // under the wrong tab.
  switch (status.trim().toLowerCase()) {
    case 'completed':
      return 'completed';
    case 'cancelled':
    case 'canceled':
      return 'cancelled';
    case 'rescheduled':
      return 'rescheduled';
    default:
      return 'upcoming';
  }
}

function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}
