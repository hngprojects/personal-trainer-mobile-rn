import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';

import type { UserNotification } from '../api/notifications.api';
import { useNotifications } from '../hooks/useNotifications';
import { Button, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

export function NotificationsScreen() {
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();
  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
    isRefetching,
  } = useNotifications();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
      edges={['top']}
    >
      <StatusBar style={colors.background === '#FFFFFF' ? 'dark' : 'light'} />

      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={colors.icon} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Notifications
        </Typography>
      </View>

      {isLoading ? (
        <View style={styles.centerState}>
          <ActivityIndicator color={colors.primary} />
          <Typography variant="body2" color={colors.textSecondary} style={styles.centerText}>
            Loading notifications...
          </Typography>
        </View>
      ) : isError ? (
        <View style={[styles.centerState, { paddingHorizontal: spacing.md }]}>
          <View style={[styles.stateIcon, { backgroundColor: colors.error + '14' }]}>
            <Ionicons name="alert-circle-outline" size={30} color={colors.error} />
          </View>
          <Typography variant="h3" style={styles.stateTitle}>
            Could not load notifications
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={styles.stateMessage}>
            Please check your connection and try again.
          </Typography>
          <Button label="Try Again" onPress={() => refetch()} style={styles.retryButton} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[
            styles.listContent,
            { paddingHorizontal: spacing.md, paddingBottom: spacing.xl + insets.bottom },
          ]}
          refreshControl={
            <RefreshControl
              refreshing={isRefetching}
              onRefresh={refetch}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {notifications.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={[styles.stateIcon, { backgroundColor: colors.primarySubtle }]}>
                <Ionicons name="notifications-outline" size={30} color={colors.primary} />
              </View>
              <Typography variant="h3" style={styles.stateTitle}>
                No notifications yet
              </Typography>
              <Typography variant="body2" color={colors.textSecondary} style={styles.stateMessage}>
                Updates about sessions, calls, and account activity will appear here.
              </Typography>
            </View>
          ) : (
            notifications.map((notification) => (
              <NotificationCard key={notification.id} notification={notification} />
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function NotificationCard({ notification }: { notification: UserNotification }) {
  const { colors } = useTheme();
  const dateLabel = formatNotificationDate(notification.sentAt ?? notification.createdAt);

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.divider,
        },
      ]}
    >
      <View style={[styles.cardIcon, { backgroundColor: colors.primarySubtle }]}>
        <Ionicons name={getNotificationIcon(notification.type)} size={20} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardHeader}>
          <Typography variant="body1" style={styles.cardTitle} numberOfLines={2}>
            {notification.title}
          </Typography>
          {dateLabel ? (
            <Typography variant="label" color={colors.textMuted} style={styles.cardDate}>
              {dateLabel}
            </Typography>
          ) : null}
        </View>
        {notification.message ? (
          <Typography variant="body2" color={colors.textSecondary} style={styles.cardMessage}>
            {notification.message}
          </Typography>
        ) : null}
      </View>
    </View>
  );
}

function getNotificationIcon(type: string | null): keyof typeof Ionicons.glyphMap {
  switch (type) {
    case 'booking':
    case 'session':
      return 'calendar-outline';
    case 'payment':
      return 'card-outline';
    case 'reminder':
      return 'alarm-outline';
    case 'test':
      return 'flask-outline';
    default:
      return 'notifications-outline';
  }
}

function formatNotificationDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) return null;

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginRight: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  centerState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerText: {
    marginTop: 12,
  },
  listContent: {
    flexGrow: 1,
    paddingTop: 12,
  },
  emptyState: {
    flex: 1,
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateIcon: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontFamily: fonts.bold,
    textAlign: 'center',
    marginBottom: 8,
  },
  stateMessage: {
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 290,
  },
  retryButton: {
    width: '100%',
    marginTop: 24,
  },
  card: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    marginBottom: 12,
  },
  cardIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
  },
  cardTitle: {
    flex: 1,
    fontFamily: fonts.semibold,
  },
  cardDate: {
    marginTop: 2,
  },
  cardMessage: {
    marginTop: 6,
    lineHeight: 20,
  },
});
