import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ImageBackground, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthForm, AuthLegalNotice } from '@/features/auth';
import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');
const AUTH_BG = require('../../../assets/images/auth-bg.jpg');

export default function LoginScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <ImageBackground source={AUTH_BG} style={styles.root} imageStyle={styles.backgroundImage}>
        {/* Image fills the full screen via absoluteFill + cover. The phone's
            aspect (~9:19.5) is taller than the photo's (~2:3), so a thin slice
            of the sides gets cropped — the centered subject stays in frame. */}
        {/* Top scrim darkens the area behind the logo / title; bottom scrim
            covers the form area for legible white text on top. */}
        <LinearGradient
          colors={['rgba(0,0,0,0.58)', 'rgba(0,0,0,0.14)', 'rgba(0,0,0,0.16)', 'rgba(0,0,0,0.68)']}
          locations={[0, 0.24, 0.58, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          <ScrollView
            contentContainerStyle={[styles.scroll, { padding: spacing.md }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.page}>
              {/* Top: branding only — trainer photo dominates the middle. */}
              <View style={[styles.header, { gap: spacing.xs, marginTop: spacing.sm }]}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                <Typography style={styles.title}>Welcome back</Typography>
                <Typography style={styles.subtitle}>Sign in to continue your journey</Typography>
              </View>

              {/* Bottom: form + legal sit on the dark base of the gradient. */}
              <View style={styles.bottomBlock}>
                <AuthForm variant="signin" onDark />
                <View style={styles.legalFooter}>
                  <AuthLegalNotice variant="signin" onDark />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </ImageBackground>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
  },
  page: {
    flex: 1,
    justifyContent: 'space-between',
  },
  bottomBlock: {
    width: '100%',
  },
  legalFooter: {
    paddingTop: 18,
    paddingBottom: 4,
  },
  header: { alignItems: 'center' },
  logo: { width: 56, height: 56, marginBottom: 8 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    textAlign: 'center',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.78)',
  },
});
