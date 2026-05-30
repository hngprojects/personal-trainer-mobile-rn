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

import { Button, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

import type { UserNotification } from '../api/notifications.api';
import { useNotifications } from '../hooks/useNotifications';

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
  const createdAt = notification.createdAt
    ? new Date(notification.createdAt).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
      })
    : null;

  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.cardIcon}>
        <Ionicons name={iconForNotification(notification.type)} size={22} color={colors.primary} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.cardTitleRow}>
          <Typography variant="body1" style={styles.cardTitle}>
            {notification.title}
          </Typography>
          {createdAt ? (
            <Typography variant="body2" color={colors.textSecondary} style={styles.cardDate}>
              {createdAt}
            </Typography>
          ) : null}
        </View>
        <Typography variant="body2" color={colors.textSecondary} style={styles.cardMessage}>
          {notification.message}
        </Typography>
      </View>
    </View>
  );
}

function iconForNotification(type: string | null): keyof typeof Ionicons.glyphMap {
  if (type === 'session') return 'calendar-outline';
  if (type === 'trainer') return 'person-outline';
  if (type === 'progress') return 'trophy-outline';
  if (type === 'workout') return 'barbell-outline';
  return 'notifications-outline';
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    marginRight: 40,
    textAlign: 'center',
    fontFamily: fonts.semibold,
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
    paddingTop: 16,
  },
  emptyState: {
    minHeight: 420,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stateIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  stateTitle: {
    fontFamily: fonts.semibold,
    textAlign: 'center',
    marginBottom: 8,
  },
  stateMessage: {
    textAlign: 'center',
    lineHeight: 21,
  },
  retryButton: {
    marginTop: 18,
    minWidth: 140,
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
  cardTitleRow: {
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
    marginTop: 4,
    lineHeight: 20,
  },
});
