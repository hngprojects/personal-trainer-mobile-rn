import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { ResizeMode, Video } from 'expo-av';
import { Pressable, StyleSheet, View } from 'react-native';

export function TrainerVideoScreen() {
  return (
    <View style={styles.container}>
      {/* BACK BUTTON */}
      <Pressable style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#fff" />
      </Pressable>

      {/* VIDEO */}
      <Video
        source={{
          uri: 'https://cdn.coverr.co/videos/coverr-man-working-out-at-the-gym-1567977609848?download=1080p',
        }}
        style={styles.video}
        useNativeControls
        resizeMode={ResizeMode.CONTAIN}
        shouldPlay
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
    top: 60,
    left: 20,
    zIndex: 10,
  },

  video: {
    width: '100%',
    height: 260,
  },
});
