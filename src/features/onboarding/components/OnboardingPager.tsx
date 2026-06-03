import { useEventListener } from 'expo';
import { LinearGradient } from 'expo-linear-gradient';
import { useVideoPlayer, VideoView } from 'expo-video';
import React, { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, useWindowDimensions, View } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { OnboardingSlideData } from '../data/slides';
import { OnboardingSlide } from './OnboardingSlide';

const VIDEO_FADE_DURATION = 420;

interface OnboardingPagerProps {
  slides: OnboardingSlideData[];
  /**
   * Background videos to cycle through, sourced from the org media library.
   * May be empty while the media request is loading — the background simply
   * stays dark until the real videos arrive (no placeholder).
   */
  videos: string[];
  onLogin: () => void;
  onRegister: () => void;
}

export function OnboardingPager({ slides, videos, onLogin, onRegister }: OnboardingPagerProps) {
  const { width } = useWindowDimensions();
  const scrollX = useSharedValue(0);
  const videoFade = useSharedValue(0);
  const videoIndexRef = useRef(0);
  const isTransitioningRef = useRef(false);
  const transitionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const player = useVideoPlayer(videos[0] ?? null, (instance) => {
    instance.loop = false;
    instance.muted = true;
    instance.play();
  });

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollX.value = e.contentOffset.x;
    },
  });

  const transitionToNextVideo = useCallback(() => {
    if (isTransitioningRef.current || !videos.length) return;

    isTransitioningRef.current = true;
    videoFade.value = withTiming(1, { duration: VIDEO_FADE_DURATION });

    transitionTimeoutRef.current = setTimeout(async () => {
      // Single video → just loop it; nothing to cross-fade to.
      const nextIndex = videos.length > 1 ? (videoIndexRef.current + 1) % videos.length : 0;

      try {
        await player.replaceAsync(videos[nextIndex]);
        player.loop = false;
        player.muted = true;
        player.play();
        videoIndexRef.current = nextIndex;
      } finally {
        videoFade.value = withTiming(0, { duration: VIDEO_FADE_DURATION + 120 });
        isTransitioningRef.current = false;
      }
    }, VIDEO_FADE_DURATION);
  }, [player, videoFade, videos]);

  useEventListener(player, 'playToEnd', transitionToNextVideo);
  useEventListener(player, 'statusChange', ({ status }) => {
    if (status === 'error') {
      transitionToNextVideo();
    }
  });

  useEffect(
    () => () => {
      if (transitionTimeoutRef.current) {
        clearTimeout(transitionTimeoutRef.current);
      }
    },
    [],
  );

  const videoTransitionStyle = useAnimatedStyle(() => ({
    opacity: videoFade.value,
  }));

  return (
    <View style={styles.fill}>
      <VideoView
        player={player}
        style={styles.backgroundVideo}
        contentFit="cover"
        nativeControls={false}
        allowsPictureInPicture={false}
      />
      <LinearGradient
        pointerEvents="none"
        colors={[
          'rgba(8,31,64,0.36)',
          'rgba(15,46,92,0.38)',
          'rgba(6,24,49,0.64)',
          'rgba(0,0,0,0.92)',
        ]}
        locations={[0, 0.34, 0.68, 1]}
        style={styles.overlay}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(27,63,117,0.24)', 'rgba(255,255,255,0.06)', 'rgba(0,0,0,0)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0.7 }}
        style={styles.blueSheen}
      />
      <Animated.View pointerEvents="none" style={[styles.transitionWash, videoTransitionStyle]} />
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        style={styles.fill}
      >
        {slides.map((slide, i) => (
          <OnboardingSlide
            key={slide.id}
            slide={slide}
            index={i}
            scrollX={scrollX}
            totalSlides={slides.length}
            slideWidth={width}
            onLogin={onLogin}
            onRegister={onRegister}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  fill: { flex: 1 },
  backgroundVideo: {
    ...StyleSheet.absoluteFillObject,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  blueSheen: {
    ...StyleSheet.absoluteFillObject,
  },
  transitionWash: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#061831',
  },
});
