import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { FlatList, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

import { Button, Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { mockSessions } from '../data/sessions.data';
import { SessionCard } from './SessionCard';

export function SessionsScreen() {
  const { spacing, colors } = useTheme();
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
    <Screen scrollable={false} padding={false} edges={['top']} backgroundColor="#FFFFFF">
      <StatusBar style="dark" />

      <View style={[styles.body, { paddingHorizontal: spacing.md, paddingTop: spacing.lg }]}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Typography style={styles.title}>Sessions</Typography>
        </Animated.View>

        {/* Tabs */}
        <View style={[styles.tabsContainer, { marginTop: spacing.md }]}>
          {(['Upcoming', 'History'] as const).map((tab) => (
            <Pressable
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
            >
              <Typography
                style={[
                  styles.tabText,
                  activeTab === tab ? styles.activeTabText : { color: colors.textSecondary },
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
            <View style={styles.iconCircle}>
              <Ionicons name="calendar-outline" size={32} color={palette.neutral['5']} />
            </View>
            <Typography style={styles.emptyTitle}>No scheduled session yet?</Typography>
            <Typography style={styles.emptyText}>
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
    color: palette.neutral['9'],
  },
  tabsContainer: {
    flexDirection: 'row',
    backgroundColor: palette.neutral['0.5'],
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
    backgroundColor: '#FFFFFF',
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
    color: palette.neutral['9'],
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
    backgroundColor: palette.neutral['0.5'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: fonts.semibold,
    color: palette.neutral['9'],
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    textAlign: 'center',
    lineHeight: 20,
  },
  bookBtn: {
    width: '100%',
  },
});
