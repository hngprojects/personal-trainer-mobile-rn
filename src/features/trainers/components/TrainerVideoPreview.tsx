import { Ionicons } from '@expo/vector-icons';
import { ResizeMode, Video } from 'expo-av';
import { useRef, useState } from 'react';
import { ActivityIndicator, Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  videoUrl: string;
}

export function TrainerVideoPreview({ videoUrl }: Props) {
  const video = useRef<Video>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  return (
    <>
      <View style={styles.container}>
        {loading && (
          <View style={styles.loader}>
            <ActivityIndicator size="large" color="#fff" />
          </View>
        )}

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load video</Text>
          </View>
        ) : (
          <>
            <Video
              ref={video}
              source={{ uri: videoUrl }}
              style={styles.video}
              useNativeControls
              resizeMode={ResizeMode.COVER}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
            />

            <Pressable style={styles.expandButton} onPress={() => setFullscreen(true)}>
              <Ionicons name="expand" size={20} color="#fff" />
            </Pressable>
          </>
        )}
      </View>

      <Modal visible={fullscreen} animationType="slide">
        <View style={styles.fullscreenContainer}>
          <Pressable style={styles.closeButton} onPress={() => setFullscreen(false)}>
            <Ionicons name="close" size={28} color="#fff" />
          </Pressable>

          <Video
            source={{ uri: videoUrl }}
            style={styles.fullscreenVideo}
            useNativeControls
            shouldPlay
            resizeMode={ResizeMode.CONTAIN}
          />
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 220,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginTop: 18,
  },
  video: {
    width: '100%',
    height: '100%',
  },
  loader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  expandButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#fff',
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
  },
  fullscreenVideo: {
    width: '100%',
    height: 300,
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 100,
  },
});
