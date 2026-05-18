import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';
import { GradientBackground } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';

export default function OnboardingScreen() {
  const { slides, goToLogin, goToRegister } = useOnboarding();
  const statusBarStyle = useStatusBarStyle();

  return (
    <GradientBackground>
      <StatusBar style={statusBarStyle} />
      <OnboardingPager slides={slides} onLogin={goToLogin} onRegister={goToRegister} />
    </GradientBackground>
  );
}
