import React from 'react';

import { OnboardingPager, useOnboarding } from '@/features/onboarding';
import { Screen } from '@/shared/components';

export default function OnboardingScreen() {
  const { slides, currentSlide, isLastSlide, goToNext, skip } = useOnboarding();

  return (
    <Screen padding={false} edges={['top', 'bottom']}>
      <OnboardingPager
        slides={slides}
        currentSlide={currentSlide}
        isLastSlide={isLastSlide}
        onNext={goToNext}
        onSkip={skip}
        onSlideChange={() => {}}
      />
    </Screen>
  );
}
