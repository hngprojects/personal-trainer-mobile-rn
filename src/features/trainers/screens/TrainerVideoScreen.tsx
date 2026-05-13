import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';
import { router } from 'expo-router';
import { Pressable, StyleSheet, View } from 'react-native';

export function TrainerVideoScreen() {
  const player = useVideoPlayer(
    'https://cdn.coverr.co/videos/coverr-man-working-out-at-the-gym-1567977609848?download=1080p',
    (p) => {
      p.play();
    },
  );

  return (
    <View style={styles.container}>
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      <VideoView player={player} style={styles.video} contentFit="contain" nativeControls />
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
    top: 60,
    left: 20,
    zIndex: 10,
  },

  video: {
    width: '100%',
    height: 260,
  },
});
