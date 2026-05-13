import React from 'react';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';

interface StepShellProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
  children: React.ReactNode;
  keyboardAware?: boolean;
}

export function StepShell({
  index,
  scrollX,
  slideWidth,
  children,
  keyboardAware = false,
}: StepShellProps) {
  const inputRange = [(index - 1) * slideWidth, index * slideWidth, (index + 1) * slideWidth];

  const contentStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollX.value, inputRange, [0, 1, 0], Extrapolation.CLAMP),
    transform: [
      {
        translateY: interpolate(scrollX.value, inputRange, [32, 0, 32], Extrapolation.CLAMP),
      },
    ],
  }));

  const Body = <Animated.View style={[styles.body, contentStyle]}>{children}</Animated.View>;

  return (
    <View style={[styles.slide, { width: slideWidth }]}>
      {keyboardAware ? (
        <KeyboardAwareScrollView
          style={styles.fill}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bottomOffset={24}
        >
          {Body}
        </KeyboardAwareScrollView>
      ) : (
        <Animated.ScrollView
          style={styles.fill}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {Body}
        </Animated.ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, paddingHorizontal: 20 },
  fill: { flex: 1 },
  scrollContent: { paddingBottom: 32, flexGrow: 1 },
  body: { flex: 1 },
});
