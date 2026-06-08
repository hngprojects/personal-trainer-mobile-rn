import React, { useEffect, useState } from 'react';
import { Image, LayoutChangeEvent, StyleSheet, useWindowDimensions } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

/**
 * Full-bleed background that crossfades between the coach photos. Each image is
 * stacked absolutely and fills the whole screen (`cover`); only the active
 * layer fades to opaque while the rest fade out, so transitions never flash to
 * black. The screens render their scrim gradient + content on top of this.
 *
 * Images are sized to the container's *measured* size (via onLayout) rather
 * than relying on `absoluteFill` resolving through the parent chain. The window
 * dimensions seed the first paint; onLayout then corrects to the real painted
 * area so the photo fills edge-to-edge on any device — including under
 * translucent status / navigation bars where window height falls short.
 *
 * Sources are loaded dynamically from assets/coaches via Metro's
 * require.context, so the slideshow plays through whatever images live in that
 * folder — drop a file in (or remove one) and it's picked up on the next build,
 * no code change needed. Keys are sorted for a stable, deterministic order.
 */
const coachesContext = (
  require as unknown as {
    context: (
      dir: string,
      useSubdirs: boolean,
      regExp: RegExp,
    ) => { keys(): string[]; (id: string): number };
  }
).context('../../../../assets/coaches', false, /\.(png|jpe?g|webp)$/);

const AUTH_BACKGROUNDS: number[] = coachesContext
  .keys()
  .sort()
  .map((key) => coachesContext(key));

const HOLD_DURATION = 5000;
const FADE_DURATION = 1100;

interface AuthBackgroundLayerProps {
  source: number;
  index: number;
  active: SharedValue<number>;
  width: number;
  height: number;
}

function AuthBackgroundLayer({ source, index, active, width, height }: AuthBackgroundLayerProps) {
  const animatedStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active.value === index ? 1 : 0, { duration: FADE_DURATION }),
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]} pointerEvents="none">
      <Image source={source} resizeMode="cover" style={{ width, height }} />
    </Animated.View>
  );
}

export function AuthBackground() {
  const window = useWindowDimensions();
  const active = useSharedValue(0);
  const [activeIndex, setActiveIndex] = useState(0);
  // Seed with window size for the first paint; correct to the real painted area
  // once the container lays out.
  const [size, setSize] = useState({ width: window.width, height: window.height });

  useEffect(() => {
    if (AUTH_BACKGROUNDS.length < 2) return;
    const id = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % AUTH_BACKGROUNDS.length);
    }, HOLD_DURATION);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    active.value = activeIndex;
  }, [activeIndex, active]);

  const handleLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.width === width && prev.height === height ? prev : { width, height }));
  };

  return (
    <Animated.View style={StyleSheet.absoluteFill} pointerEvents="none" onLayout={handleLayout}>
      {AUTH_BACKGROUNDS.map((source, index) => (
        <AuthBackgroundLayer
          key={index}
          source={source}
          index={index}
          active={active}
          width={size.width}
          height={size.height}
        />
      ))}
    </Animated.View>
  );
}
