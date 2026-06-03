import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { VideoView } from 'expo-video';
import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { FALLBACK_VIDEO_URL, useMediaVideos, useSequentialVideoPlayer } from '@/features/media';

interface ProfileSetupVideoPlayerProps {
  sources: string[];
}

// Isolated so the screen can remount it (via `key`) when the resolved source
// list changes — the sequential player only reads its sources on first
// construction.
function ProfileSetupVideoPlayer({ sources }: ProfileSetupVideoPlayerProps) {
  const player = useSequentialVideoPlayer(sources);

  return (
    <VideoView
      player={player}
      style={styles.video}
      nativeControls
      contentFit="contain"
      allowsPictureInPicture
    />
  );
}

export function ProfileSetupVideoScreen() {
  const insets = useSafeAreaInsets();
  const { data: videos, isLoading } = useMediaVideos();

  // Play through every ready video from the org library; fall back to a
  // placeholder if the library is empty or the request failed.
  const sources = videos?.length ? videos.map((item) => item.url) : [FALLBACK_VIDEO_URL];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <Pressable
        style={[styles.backButton, { top: insets.top + 12, left: insets.left + 16 }]}
        onPress={() => router.back()}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <ProfileSetupVideoPlayer key={sources.join('|')} sources={sources} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    zIndex: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: 260,
  },
});
