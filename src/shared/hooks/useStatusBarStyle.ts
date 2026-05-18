import { useTheme } from '@/shared/theme';

export type StatusBarTone = 'auto' | 'forceLight' | 'forceDark';

/**
 * Picks 'light' or 'dark' content for the status bar based on the active theme.
 * Pass `forceLight` / `forceDark` for screens with a fixed backdrop (e.g. video
 * player) that should override the theme.
 */
export function useStatusBarStyle(tone: StatusBarTone = 'auto'): 'light' | 'dark' {
  const { isDark } = useTheme();
  if (tone === 'forceLight') return 'light';
  if (tone === 'forceDark') return 'dark';
  return isDark ? 'light' : 'dark';
}
