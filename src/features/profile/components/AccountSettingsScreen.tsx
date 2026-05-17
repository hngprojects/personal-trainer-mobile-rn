import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Switch } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, palette, useTheme } from '@/shared/theme';

import { ScreenHeader } from './ScreenHeader';
import { SettingsRow } from './SettingsRow';

const GOOGLE_ICON = require('../../../../assets/images/google.png');
const APPLE_ICON = require('../../../../assets/images/apple.png');

export function AccountSettingsScreen() {
  const [twoFactor, setTwoFactor] = useState(false);
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(280)}>
          <ScreenHeader title="Account Setting" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>
            Linked Accounts
          </Typography>
          <SettingsRow
            icon={<Image source={GOOGLE_ICON} style={styles.brandIcon} resizeMode="contain" />}
            label="Google"
            rightSlot={
              <Typography style={[styles.statusConnected, { color: colors.success }]}>
                Connected
              </Typography>
            }
          />
          <SettingsRow
            icon={<Image source={APPLE_ICON} style={styles.brandIcon} resizeMode="contain" />}
            label="Apple"
            rightSlot={
              <Pressable hitSlop={8}>
                <Typography style={[styles.statusConnect, { color: colors.warning }]}>
                  Connect
                </Typography>
              </Pressable>
            }
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>Security</Typography>
          <SettingsRow
            icon={<Ionicons name="shield-checkmark-outline" size={18} color={colors.icon} />}
            label="Two-Factor Authentication"
            subtitle="Add an extra layer of security"
            rightSlot={
              <Switch
                value={twoFactor}
                onValueChange={setTwoFactor}
                trackColor={{ false: palette.neutral['2'], true: palette.highlightBlue['5'] }}
                thumbColor="#FFFFFF"
                ios_backgroundColor={palette.neutral['2']}
              />
            }
          />
          <SettingsRow
            icon={<Ionicons name="phone-portrait-outline" size={18} color={colors.icon} />}
            label="Active Sessions & Devices"
            subtitle="1 device currently logged in"
            onPress={() => {}}
          />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(220).duration(360)} style={styles.deactivateWrap}>
          <Pressable hitSlop={10}>
            <Typography style={[styles.deactivate, { color: colors.error }]}>
              Deactivate Account
            </Typography>
          </Pressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
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
  brandIcon: {
    width: 20,
    height: 20,
  },
  statusConnected: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
  statusConnect: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
  deactivateWrap: {
    alignItems: 'center',
    paddingTop: 48,
  },
  deactivate: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    textDecorationLine: 'underline',
  },
});
