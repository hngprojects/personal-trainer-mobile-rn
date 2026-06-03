import { useEventListener } from 'expo';
import { useVideoPlayer } from 'expo-video';
import { useCallback, useRef } from 'react';

interface SequentialVideoOptions {
  muted?: boolean;
  /** Start playing the first clip on mount. Defaults to true. */
  autoPlay?: boolean;
}

/**
 * Plays through a list of video URLs back-to-back: when one clip ends, the next
 * loads and plays, wrapping around to the first. A single-URL list simply
 * loops. Because `useVideoPlayer` only reads its source on first construction,
 * remount this (via a `key` derived from the source list) when the list itself
 * changes — e.g. once the media request resolves.
 */
export function useSequentialVideoPlayer(
  sources: string[],
  { muted = false, autoPlay = true }: SequentialVideoOptions = {},
) {
  const indexRef = useRef(0);
  const single = sources.length < 2;

  const player = useVideoPlayer(sources[0], (instance) => {
    // One clip → let the native player loop it; multiple → advance manually on
    // 'playToEnd' so we can swap sources.
    instance.loop = single;
    instance.muted = muted;
    if (autoPlay) instance.play();
  });

  const advance = useCallback(async () => {
    if (single) return;
    const next = (indexRef.current + 1) % sources.length;
    try {
      await player.replaceAsync(sources[next]);
      player.play();
      indexRef.current = next;
    } catch {
      // Source swap can fail if the view is tearing down; ignore — the next
      // 'playToEnd' (or a remount) recovers.
    }
  }, [player, single, sources]);

  useEventListener(player, 'playToEnd', advance);

  return player;
}
