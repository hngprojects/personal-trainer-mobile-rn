import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { Session } from '../data/sessions.data';

interface SessionCardProps {
  session: Session;
}

export function SessionCard({ session }: SessionCardProps) {
  const { spacing, colors } = useTheme();

  const handlePress = () => {
    router.push({
      pathname: '/session-details' as any,
      params: { id: session.id },
    });
  };

  const getStatusColor = () => {
    switch (session.status) {
      case 'rescheduled':
        return palette.orange['5'];
      case 'upcoming':
        return colors.primary; // Blue for "Reschedule" link
      default:
        return palette.neutral['5'];
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
        params: { id: session.id },
      });
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      style={[styles.container, { padding: spacing.md, marginBottom: spacing.sm }]}
    >
      <View style={styles.row}>
        <Image source={{ uri: session.trainerAvatar }} style={styles.avatar} />
        <View style={styles.content}>
          <View style={styles.headerRow}>
            <Typography variant="body1" style={styles.type}>
              {session.type}
            </Typography>
            <Typography variant="label" color={colors.textSecondary} style={styles.duration}>
              {session.duration}
            </Typography>
          </View>
          <View style={styles.footerRow}>
            <Typography variant="label" color={colors.textSecondary} style={styles.trainer}>
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.neutral['0.5'],
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
  },
  duration: {
    fontSize: 11,
  },
});
