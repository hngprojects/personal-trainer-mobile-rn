import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

const LOGO = require('../../../../assets/images/logo.png');

export function TermsOfServiceScreen() {
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  const handleBack = () => {
    if (router.canGoBack()) router.back();
  };

  return (
    <SafeAreaView
      edges={['top', 'bottom']}
      style={[styles.safe, { backgroundColor: colors.background }]}
    >
      <StatusBar style={statusBarStyle} />

      <View style={styles.headerBar}>
        <Pressable hitSlop={12} onPress={handleBack} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={colors.text} />
        </Pressable>
      </View>

      <Animated.ScrollView
        entering={FadeIn.duration(280)}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.brandRow}>
          <Image source={LOGO} style={styles.brandLogo} resizeMode="contain" />
          <Typography style={[styles.brandText, { color: colors.text }]}>FITCALL</Typography>
        </View>

        <Typography style={[styles.pageTitle, { color: colors.text }]}>Terms of Service</Typography>
        <Typography style={[styles.lastUpdated, { color: colors.textSecondary }]}>
          Last Updated: May 2, 2026
        </Typography>

        <Section title="1. Acceptance of Terms">
          <Body>
            By creating an account or using FitCall, you agree to these Terms of Service and our
            Privacy Policy. If you do not agree, please do not use the service.
          </Body>
        </Section>

        <Section title="2. Fitness and Wellness Guidance">
          <Body>
            FitCall connects clients with fitness professionals and wellness content. The service is
            not a substitute for medical advice, diagnosis, or treatment. Consult a qualified health
            professional before starting a new fitness program.
          </Body>
        </Section>

        <Section title="3. Accounts and Responsibilities">
          <Body>
            You are responsible for keeping your account information accurate and your login details
            secure. You agree not to misuse the platform, impersonate another person, or interfere
            with other users' access to the service.
          </Body>
        </Section>

        <Section title="4. Bookings and Sessions">
          <Body>
            Discovery calls and training sessions are subject to trainer availability. You agree to
            provide accurate contact information and attend scheduled calls or sessions at the
            selected time.
          </Body>
        </Section>

        <Section title="5. Changes to the Service">
          <Body>
            We may update, suspend, or discontinue parts of FitCall as we improve the product. We may
            also update these terms and will make the latest version available in the app.
          </Body>
        </Section>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  const { colors } = useTheme();
  return <Typography style={[styles.body, { color: colors.textSecondary }]}>{children}</Typography>;
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  const { colors } = useTheme();
  return (
    <View style={styles.section}>
      <Typography style={[styles.sectionTitle, { color: colors.text }]}>{title}</Typography>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  headerBar: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 4,
  },
  backBtn: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 22,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
    marginBottom: 18,
  },
  brandLogo: {
    width: 22,
    height: 22,
  },
  brandText: {
    fontSize: 18,
    fontFamily: fonts.bold,
    letterSpacing: 0.5,
  },
  pageTitle: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  lastUpdated: {
    fontSize: 11,
    fontFamily: fonts.regular,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  section: {
    marginTop: 18,
    gap: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontFamily: fonts.bold,
    marginBottom: 2,
  },
  body: {
    fontSize: 12,
    fontFamily: fonts.regular,
    lineHeight: 18,
    marginTop: 6,
    textAlign: 'justify',
  },
});
