import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const LOGO = require('../../../../assets/images/logo.png');

const SPIN_DURATION = 1000;
const HOLD_DURATION = 500;

interface EntryScreenProps {
  onComplete: () => void;
}

export function EntryScreen({ onComplete }: EntryScreenProps) {
  const rotation = useSharedValue(-360);
  const scale = useSharedValue(0.4);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) });
    scale.value = withTiming(1, { duration: SPIN_DURATION, easing: Easing.out(Easing.cubic) });
    rotation.value = withTiming(0, { duration: SPIN_DURATION, easing: Easing.out(Easing.cubic) });

    const timer = setTimeout(onComplete, SPIN_DURATION + HOLD_DURATION);
    return () => clearTimeout(timer);
  }, [onComplete, opacity, scale, rotation]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ rotate: `${rotation.value}deg` }, { scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.Image source={LOGO} style={[styles.logo, animatedStyle]} resizeMode="contain" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  logo: { width: 200, height: 200 },
});
