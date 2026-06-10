import { useEffect, useState } from 'react';
import { AccessibilityInfo } from 'react-native';

/**
 * Subscribe to the OS-level "reduce motion" / "remove animations" preference.
 *
 * Returns true when the user has asked the system to minimise animations
 * (iOS Settings → Accessibility → Motion → Reduce Motion; Android Settings →
 * Accessibility → Remove animations).
 *
 * Use this to short-circuit Reanimated `entering`/`exiting` props and any
 * looping `withRepeat` animations. The accompanying `entryAnim` helper in
 * `@/shared/animation/entries` is the typical call site.
 *
 * Note: react-native-reanimated exports its own `useReducedMotion` that works
 * inside worklets. This hook is the JS-thread equivalent for prop-time
 * decisions and listens to live changes via AccessibilityInfo events.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    let isMounted = true;
    AccessibilityInfo.isReduceMotionEnabled().then((value) => {
      if (isMounted) setReduced(value);
    });
    const subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', setReduced);
    return () => {
      isMounted = false;
      subscription.remove();
    };
  }, []);

  return reduced;
}
