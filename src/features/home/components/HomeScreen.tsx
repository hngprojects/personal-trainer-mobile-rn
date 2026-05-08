import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button, Screen, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';
import { ThemeMode } from '@/shared/theme/ThemeContext';

import { useHome } from '../hooks/useHome';

const THEME_CYCLE: ThemeMode[] = ['system', 'light', 'dark'];

export function HomeScreen() {
  const { colors, spacing, mode, setMode } = useTheme();
  const { user, logout } = useHome();

  const cycleTheme = () => {
    const next = THEME_CYCLE[(THEME_CYCLE.indexOf(mode) + 1) % THEME_CYCLE.length];
    setMode(next);
  };

  const greeting = user ? `Welcome back, ${user.firstName}!` : 'Welcome!';

  return (
    <Screen>
      <View style={[styles.container, { gap: spacing.xl }]}>
        <View style={styles.center}>
          <Typography variant="h1" align="center">
            {greeting}
          </Typography>
          {user && (
            <Typography variant="body1" color={colors.textSecondary} align="center">
              {user.email}
            </Typography>
          )}
        </View>

        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              padding: spacing.md,
              borderRadius: spacing.sm,
              gap: spacing.sm,
            },
          ]}
        >
          <Typography variant="h3">Theme</Typography>
          <Typography variant="body2" color={colors.textSecondary}>
            Current: <Typography variant="body2">{mode}</Typography>
          </Typography>
          <Button label={`Switch theme (${mode})`} variant="outline" onPress={cycleTheme} />
        </View>

        <Button label="Sign Out" variant="outline" onPress={logout} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center' },
  center: { alignItems: 'center', gap: 8 },
  card: { borderWidth: 1 },
});
