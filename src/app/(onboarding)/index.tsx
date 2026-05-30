import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';

export default function OnboardingScreen() {
  const { slides, goToLogin, goToRegister } = useOnboarding();

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <OnboardingPager slides={slides} onLogin={goToLogin} onRegister={goToRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
