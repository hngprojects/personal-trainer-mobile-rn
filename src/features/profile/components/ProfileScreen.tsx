import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Switch } from 'react-native';
import Animated, { FadeIn, FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth';
import { Avatar, LogoRefreshScrollView, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, palette, useTheme } from '@/shared/theme';

import { usePickAndUploadAvatar } from '../hooks/usePickAndUploadAvatar';
import { useProfile } from '../hooks/useProfile';
import { ScreenHeader } from './ScreenHeader';
import { SettingsRow } from './SettingsRow';

export function ProfileScreen() {
  const user = useAuthStore((s) => s.user);
  const { isDark, setMode, colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const { pick: pickAvatar, isUploading } = usePickAndUploadAvatar();

  // Pull fresh profile data on mount; the hook also syncs the auth store
  // so the rest of the UI reads from useAuthStore as before.
  const { refetch, isRefetching } = useProfile();

  const navigate = (path: string) => () => router.push(path as never);

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />

      <LogoRefreshScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshing={isRefetching}
        onRefresh={refetch}
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <ScreenHeader title="Profile Setting" />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(80).duration(360)} style={styles.profileBlock}>
          <Avatar
            name={user?.name}
            uri={user?.avatarUrl}
            size={84}
            loading={isUploading}
            onPress={pickAvatar}
            accessibilityLabel="Change profile picture"
            badgeIcon={<Ionicons name="pencil" size={11} color="#FFFFFF" />}
          />
          <Typography style={[styles.name, { color: colors.text, marginTop: 10 }]}>
            {user?.name ?? 'Member'}
          </Typography>
          <Typography style={[styles.email, { color: colors.textSecondary }]}>
            {user?.email ?? '—'}
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>
            General Settings
          </Typography>
          <SettingsRow
            icon={<Ionicons name="settings-outline" size={18} color={colors.icon} />}
            label="Account Settings"
            onPress={navigate('/account-settings')}
          />
          <SettingsRow
            icon={<Ionicons name="person-outline" size={18} color={colors.icon} />}
            label="Personal Information"
            onPress={navigate('/personal-information')}
          />
          <SettingsRow
            icon={<Ionicons name="moon-outline" size={18} color={colors.icon} />}
            label="App Appearance"
            rightSlot={
              <Switch
                value={isDark}
                onValueChange={(v) => setMode(v ? 'dark' : 'light')}
                trackColor={{ false: palette.neutral['2'], true: palette.highlightBlue['5'] }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={palette.neutral['2']}
              />
            }
          />
          <SettingsRow
            icon={<Ionicons name="eye-outline" size={18} color={colors.icon} />}
            label="Privacy Policy"
            onPress={navigate('/privacy-policy')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>
            Preferences and Subscriptions
          </Typography>
          <SettingsRow
            icon={<Ionicons name="card-outline" size={18} color={colors.icon} />}
            label="Subscription Overview"
            onPress={navigate('/subscription')}
          />
          <SettingsRow
            icon={<Ionicons name="barbell-outline" size={18} color={colors.icon} />}
            label="Fitness Goals & Preferences"
            onPress={navigate('/fitness-preferences')}
          />
          <SettingsRow
            icon={<Ionicons name="notifications-outline" size={18} color={colors.icon} />}
            label="Notifications & Reminders"
            onPress={navigate('/notifications')}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(260).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>Support</Typography>
          <SettingsRow
            icon={<Ionicons name="chatbubble-outline" size={18} color={colors.icon} />}
            label="Contact Us"
            onPress={navigate('/contact-us')}
          />
          <SettingsRow
            icon={<Ionicons name="help-circle-outline" size={18} color={colors.icon} />}
            label="FAQ"
            onPress={navigate('/faq')}
          />
        </Animated.View>
      </LogoRefreshScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  profileBlock: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 18,
  },
  name: {
    fontSize: 15,
    fontFamily: fonts.semibold,
  },
  email: {
    fontSize: 12,
    fontFamily: fonts.regular,
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 4,
  },
});
