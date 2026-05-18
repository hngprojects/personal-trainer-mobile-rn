import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

interface IntroScreenProps {
  onContinue: () => void;
  onSkip: () => void;
  step: number;
  totalSteps: number;
}

export function IntroScreen({ onContinue, onSkip, step, totalSteps }: IntroScreenProps) {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.surface }]}
      edges={['top', 'bottom']}
    >
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <View style={styles.stepContainer}>
          <Typography variant="body2" style={{ fontWeight: '500' }}>
            {step} of {totalSteps}
          </Typography>
          <View style={styles.divider} />
          <Typography
            variant="body2"
            color={colors.primary}
            style={{ fontWeight: '600' }}
            onPress={onSkip}
          >
            Skip &gt;
          </Typography>
        </View>
      </View>

      <View style={[styles.content, { paddingHorizontal: spacing.md }]}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://i.pravatar.cc/500?img=11' }} // Mock trainer video thumb
            style={styles.image}
          />
          <View style={styles.playButton}>
            <Ionicons name="play" size={24} color="#FFFFFF" />
          </View>
        </View>

        <Typography variant="h2" style={styles.title}>
          The ultimate keep-it-real companion
        </Typography>

        <Typography variant="body1" color={palette.neutral['6']} style={styles.description}>
          My job is to help you crush it. No sugar-coating, no fluff—just real talk and real
          results. Are you ready to level up?
        </Typography>
      </View>

      <View style={[styles.footer, { padding: spacing.md }]}>
        <Button label="Continue" onPress={onContinue} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 56,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  divider: {
    width: 1,
    height: 12,
    backgroundColor: palette.neutral['3'],
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 32,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  playButton: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: palette.neutral['2'],
  },
});
