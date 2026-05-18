import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

export function SuccessView() {
  const { colors, spacing } = useTheme();

  const checkScale = useSharedValue(0);
  const checkOpacity = useSharedValue(0);
  const glowScale = useSharedValue(0.6);
  const glowOpacity = useSharedValue(0);

  useEffect(() => {
    glowOpacity.value = withTiming(1, { duration: 380, easing: Easing.out(Easing.cubic) });
    glowScale.value = withSequence(
      withTiming(1, { duration: 420, easing: Easing.out(Easing.cubic) }),
      // Gentle pulsing breath after the entry settles.
      withRepeat(
        withSequence(
          withTiming(1.06, { duration: 1100, easing: Easing.inOut(Easing.cubic) }),
          withTiming(1, { duration: 1100, easing: Easing.inOut(Easing.cubic) }),
        ),
        -1,
        false,
      ),
    );

    checkOpacity.value = withDelay(180, withTiming(1, { duration: 220 }));
    checkScale.value = withDelay(180, withSpring(1, { damping: 9, stiffness: 140 }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
    transform: [{ scale: glowScale.value }],
  }));

  const checkStyle = useAnimatedStyle(() => ({
    opacity: checkOpacity.value,
    transform: [{ scale: checkScale.value }],
  }));

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, paddingHorizontal: spacing.lg }]}
    >
      <View style={styles.inner}>
        <Animated.View
          style={[styles.glowRing, { backgroundColor: palette.success['0.5'] }, glowStyle]}
        >
          <Animated.View
            style={[styles.iconCircle, { backgroundColor: palette.success['4'] }, checkStyle]}
          >
            <Ionicons name="checkmark" size={36} color="#fff" />
          </Animated.View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(420).duration(360)}>
          <Typography variant="h2" align="center" style={styles.title}>
            Request Submitted!
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(560).duration(360)}>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            align="center"
            style={styles.body}
          >
            We&apos;ve received your call request. An agent will reach out to you at your preferred
            time.
          </Typography>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(680).duration(360)}>
          <Typography
            variant="body2"
            color={colors.textSecondary}
            align="center"
            style={styles.body}
          >
            A confirmation link has been sent to your email address.
          </Typography>
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(800).duration(420)}
        style={[styles.footer, { paddingBottom: spacing.lg }]}
      >
        <Button label="Back to Home" onPress={() => router.replace('/(main)/(tabs)' as never)} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  glowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '700' },
  body: { lineHeight: 22, paddingHorizontal: 8 },
  footer: { paddingTop: 12 },
});
