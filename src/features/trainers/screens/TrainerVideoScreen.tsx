import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const VIDEO_SOURCE =
  'https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/720/Big_Buck_Bunny_720_10s_5MB.mp4';

export function TrainerVideoScreen() {
  const insets = useSafeAreaInsets();
  const player = useVideoPlayer(VIDEO_SOURCE, (instance) => {
    instance.loop = false;
    instance.play();
  });

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Back button positioned relative to the device's top inset so it never collides
          with the notch / Dynamic Island / Android status bar. */}
      <Pressable
        style={[styles.backButton, { top: insets.top + 12, left: insets.left + 16 }]}
        onPress={() => router.back()}
        hitSlop={12}
      >
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <VideoView
        player={player}
        style={styles.video}
        nativeControls
        contentFit="contain"
        allowsPictureInPicture
      />
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
