import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Avatar, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

import { Session } from '../data/sessions.data';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const { spacing, colors } = useTheme();

  // Only paid sessions that have a linked session row open the details page.
  // Discovery calls have no /sessions/{id} record, and paid sessions before
  // they start (sessionId === null) don't either — both stay non-tappable.
  const canOpenDetails = session.bookingType === 'session' && Boolean(session.sessionId);

  const handlePress = () => {
    if (!canOpenDetails) return;
    router.push({
      pathname: '/session-details' as any,
      params: {
        id: session.sessionId!,
        bookingId: session.id,
        bookingType: session.bookingType,
        trainerId: session.trainerId ?? '',
        trainerName: session.trainerName,
        trainerAvatar: session.trainerAvatar ?? '',
        platform: session.platform ?? '',
        date: session.date,
        time: session.time,
        duration: session.duration,
      },
    });
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'rescheduled':
        return colors.warning;
      case 'upcoming':
        return colors.primary; // Blue for "Reschedule" link
      default:
        return colors.textSecondary;
    }
  };

  const getStatusText = () => {
    if (session.status === 'upcoming') return 'Reschedule';
    return session.status.charAt(0).toUpperCase() + session.status.slice(1);
  };

  const handleStatusPress = (e: any) => {
    if (session.status === 'upcoming') {
      e.stopPropagation();
      router.push({
        pathname: '/reschedule-session' as any,
        params: {
          id: session.id,
          bookingType: session.bookingType,
          trainerId: session.trainerId ?? '',
        },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={!canOpenDetails}
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.divider,
          padding: spacing.md,
          marginBottom: spacing.sm,
        },
      ]}
    >
      <View style={styles.row}>
        {session.bookingType === 'discovery' ? (
          <View
            style={[
              styles.avatar,
              styles.discoveryAvatar,
              { backgroundColor: colors.primarySubtle },
            ]}
          >
            <Ionicons name="call" size={22} color={colors.primary} />
          </View>
        ) : (
          <Avatar name={session.trainerName} uri={session.trainerAvatar} size={48} />
        )}
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Typography variant="body1" style={styles.type}>
              {session.type}
            </Typography>
            <Typography
              variant="label"
              color={colors.textSecondary}
              style={styles.duration}
              numberOfLines={1}
            >
              {session.duration}
            </Typography>
          </View>
          <View style={styles.footerRow}>
            <Typography
              variant="label"
              color={colors.textSecondary}
              style={styles.trainer}
              numberOfLines={1}
            >
              {session.trainerName} · {session.date.split(',')[1]?.trim() || session.date}
            </Typography>
            <Pressable onPress={handleStatusPress}>
              <Typography
                style={[
                  styles.status,
                  { color: getStatusColor() },
                  session.status === 'upcoming' && styles.rescheduleLink,
                ]}
              >
                {getStatusText()}
              </Typography>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  discoveryAvatar: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  type: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  status: {
    fontSize: 10,
    fontFamily: fonts.medium,
  },
  rescheduleLink: {
    textDecorationLine: 'underline',
  },
  trainer: {
    fontSize: 11,
    flex: 1,
    flexShrink: 1,
    marginRight: 8,
  },
  duration: {
    fontSize: 11,
    flexShrink: 0,
  },
});
