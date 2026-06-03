import { LinearGradient } from 'expo-linear-gradient';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AuthBackground, AuthForm, AuthLegalNotice } from '@/features/auth';
import { Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

export default function RegisterScreen() {
  const { spacing } = useTheme();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" />
      <View style={styles.root}>
        <AuthBackground />
        <LinearGradient
          colors={['rgba(0,0,0,0.72)', 'rgba(0,0,0,0.34)', 'rgba(0,0,0,0.42)', 'rgba(0,0,0,0.84)']}
          locations={[0, 0.24, 0.58, 1]}
          style={StyleSheet.absoluteFill}
        />
        <SafeAreaView edges={['top', 'bottom']} style={styles.safe}>
          <ScrollView
            contentContainerStyle={[styles.scroll, { padding: spacing.md }]}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.page}>
              <View style={[styles.header, { gap: spacing.xs, marginTop: spacing.sm }]}>
                <Image source={LOGO} style={styles.logo} resizeMode="contain" />
                <Typography style={styles.title}>Create your account</Typography>
                <Typography style={styles.subtitle}>
                  Let&apos;s get you started in a few minutes
                </Typography>
              </View>

              <View style={styles.bottomBlock}>
                <AuthForm variant="signup" onDark />
                <View style={styles.legalFooter}>
                  <AuthLegalNotice variant="signup" onDark />
                </View>
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#000',
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
    textShadowColor: 'rgba(0,0,0,0.55)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 6,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.regular,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.88)',
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
});
