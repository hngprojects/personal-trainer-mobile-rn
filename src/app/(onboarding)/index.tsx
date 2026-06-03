import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { useMediaVideos } from '@/features/media';
import { OnboardingPager, useOnboarding } from '@/features/onboarding';

export default function OnboardingScreen() {
  const { slides, goToLogin, goToRegister } = useOnboarding();
  const { data: videos } = useMediaVideos();

  // Cycle through every ready video the org library returns. While the request
  // is loading the list is empty — the pager keeps a dark background rather
  // than flashing a placeholder. Re-key the pager on the resolved set so the
  // video player re-initialises with the real clips once they arrive.
  const videoUrls = videos?.length ? videos.map((item) => item.url) : [];
  const videoKey = videoUrls.length ? videoUrls.join('|') : 'pending';

  return (
    <View style={styles.container}>
      <StatusBar style="light" translucent backgroundColor="transparent" />
      <OnboardingPager
        key={videoKey}
        slides={slides}
        videos={videoUrls}
        onLogin={goToLogin}
        onRegister={goToRegister}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
