import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface PreviewImage {
  id: string;
  imageUrl: string;
}

interface ImagePreviewModalProps {
  images: PreviewImage[];
  index: number | null;
  onClose: () => void;
  onChangeIndex?: (index: number) => void;
}

export function ImagePreviewModal({
  images,
  index,
  onClose,
  onChangeIndex,
}: ImagePreviewModalProps) {
  const insets = useSafeAreaInsets();
  const image = index !== null ? images[index] : null;
  const canGoPrevious = !!onChangeIndex && index !== null && index > 0;
  const canGoNext = !!onChangeIndex && index !== null && index < images.length - 1;

  return (
    <Modal transparent visible={index !== null} animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <Pressable
          hitSlop={12}
          onPress={onClose}
          style={[styles.closeButton, { top: insets.top + 14 }]}
        >
          <Ionicons name="close" size={24} color="#FFFFFF" />
        </Pressable>

        {image ? (
          <Image source={{ uri: image.imageUrl }} style={styles.image} resizeMode="contain" />
        ) : null}

        {canGoPrevious ? (
          <Pressable
            hitSlop={12}
            onPress={() => onChangeIndex((index as number) - 1)}
            style={styles.previousButton}
          >
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </Pressable>
        ) : null}
        {canGoNext ? (
          <Pressable
            hitSlop={12}
            onPress={() => onChangeIndex((index as number) + 1)}
            style={styles.nextButton}
          >
            <Ionicons name="chevron-forward" size={28} color="#FFFFFF" />
          </Pressable>
        ) : null}

        {images.length > 1 && index !== null ? (
          <View style={[styles.counter, { bottom: insets.bottom + 22 }]}>
            <Text style={styles.counterText}>
              {index + 1} / {images.length}
            </Text>
          </View>
        ) : null}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '82%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 3,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previousButton: {
    position: 'absolute',
    left: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButton: {
    position: 'absolute',
    right: 14,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  counter: {
    position: 'absolute',
    alignSelf: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.14)',
  },
  counterText: { color: '#FFFFFF', fontWeight: '700', fontSize: 12 },
});
