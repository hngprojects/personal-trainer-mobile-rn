import { StatusBar } from 'expo-status-bar';
import React from 'react';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';
import { GradientBackground } from '@/shared/components';

export default function OnboardingScreen() {
  const { slides, goToLogin, goToRegister } = useOnboarding();

  return (
    <GradientBackground>
      <StatusBar style="dark" />
      <OnboardingPager slides={slides} onLogin={goToLogin} onRegister={goToRegister} />
    </GradientBackground>
  );
}
