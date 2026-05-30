import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import * as SystemUI from 'expo-system-ui';

import { STORAGE_KEYS } from '@/shared/constants/keys';
import { asyncStorage } from '@/shared/storage/asyncStorage';

import { Colors, darkColors, lightColors } from './colors';
import { spacing } from './spacing';
import { typography } from './typography';

export type ThemeMode = 'light' | 'dark' | 'system';
type ResolvedColorScheme = 'light' | 'dark';

function resolveSystemScheme(): ResolvedColorScheme {
  return Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
}

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colors: Colors;
  typography: typeof typography;
  spacing: typeof spacing;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ThemeProviderProps {
  children: React.ReactNode;
  initialMode?: ThemeMode;
}

export function ThemeProvider({ children, initialMode = 'system' }: ThemeProviderProps) {
  const [systemScheme, setSystemScheme] = useState<ResolvedColorScheme>(resolveSystemScheme);
  const [mode, setModeState] = useState<ThemeMode>(initialMode);

  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme === 'dark' ? 'dark' : 'light');
      setModeState('system');
      asyncStorage.setItem(STORAGE_KEYS.THEME_MODE, 'system').catch(() => undefined);
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    asyncStorage.getItem<ThemeMode>(STORAGE_KEYS.THEME_MODE).then((saved) => {
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        setModeState(saved);
      }
    });
  }, []);

  const setMode = useCallback(async (newMode: ThemeMode) => {
    setModeState(newMode);
    await asyncStorage.setItem(STORAGE_KEYS.THEME_MODE, newMode);
  }, []);

  const isDark = mode === 'dark' || (mode === 'system' && systemScheme === 'dark');
  const colors = isDark ? darkColors : lightColors;

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background).catch((error) => {
      if (__DEV__) {
        // Nice-to-have in prod; in dev surface the failure so it doesn't
        // silently mask a misconfiguration.
        console.warn('[theme] SystemUI.setBackgroundColorAsync failed', error);
      }
    });
  }, [colors.background]);

  const value = useMemo(
    () => ({ mode, setMode, colors, typography, spacing, isDark }),
    [mode, setMode, colors, isDark],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
