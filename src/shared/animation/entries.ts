/**
 * Helpers for composing Reanimated entry animations that respect the user's
 * Reduce Motion preference.
 *
 * Usage at a call site:
 *
 *   const reduce = useReducedMotion();
 *   <Animated.View entering={maybeAnim(FadeInDown.duration(360), reduce)} />
 *
 * When `reduce` is true the helper returns `undefined`, which Reanimated treats
 * as "no animation" — the view appears immediately without motion. When
 * `reduce` is false the original animation passes through unchanged.
 */
export function maybeAnim<T>(animation: T, reduce: boolean): T | undefined {
  return reduce ? undefined : animation;
}
