import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button, Screen, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { mockSessions } from '../data/sessions.data';
import { SessionCard } from './SessionCard';

export function SessionsScreen() {
  const { spacing, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const [activeTab, setActiveTab] = useState<'Upcoming' | 'History'>('Upcoming');

  const upcomingSessions = mockSessions.filter(
    (s) => s.status === 'upcoming' || s.status === 'rescheduled',
  );
  const historySessions = mockSessions.filter(
    (s) => s.status === 'completed' || s.status === 'cancelled',
  );

  const displayedSessions = activeTab === 'Upcoming' ? upcomingSessions : historySessions;
  const isEmpty = displayedSessions.length === 0;

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

        {isEmpty ? (
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
              onPress={() => router.push('/')}
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
    </Screen>
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
});
