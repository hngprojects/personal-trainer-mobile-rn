import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { useAuthStore, useLogout } from '@/features/auth';
import { Button, Screen, toast, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

export function ProfileScreen() {
  const { spacing } = useTheme();
  const user = useAuthStore((s) => s.user);
  const logoutMutation = useLogout();

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onError: () => toast.error("We couldn't reach the server, but you've been signed out."),
    });
  };

  return (
    <Screen scrollable padding={false} edges={['top']} backgroundColor="#FFFFFF">
      <StatusBar style="dark" />

      <View style={[styles.body, { paddingHorizontal: spacing.md, paddingTop: spacing.lg }]}>
        <Animated.View entering={FadeInDown.duration(420)}>
          <Typography style={styles.title}>Profile</Typography>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(120).duration(420)}
          style={[styles.userCard, { padding: spacing.md, marginTop: spacing.lg }]}
        >
          <View style={styles.avatarFallback}>
            <Ionicons name="person" size={28} color={palette.neutral['4']} />
          </View>
          <View style={styles.userInfo}>
            <Typography style={styles.userName}>{user?.name ?? 'Member'}</Typography>
            <Typography style={styles.userEmail}>{user?.email ?? '—'}</Typography>
          </View>
        </Animated.View>

        <Animated.View
          entering={FadeInUp.delay(220).duration(420)}
          style={{ marginTop: spacing.xl }}
        >
          <Button
            label="Log out"
            variant="outline"
            isLoading={logoutMutation.isPending}
            onPress={handleLogout}
          />
        </Animated.View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: { flex: 1 },
  title: {
    fontSize: 22,
    fontFamily: fonts.bold,
    color: palette.neutral['9'],
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: palette.neutral['0.5'],
    borderRadius: 14,
    borderWidth: 1,
    borderColor: palette.neutral['1'],
  },
  avatarFallback: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.neutral['1'],
    alignItems: 'center',
    justifyContent: 'center',
  },
  userInfo: { marginLeft: 12, flex: 1 },
  userName: {
    fontSize: 15,
    fontFamily: fonts.semibold,
    color: palette.neutral['9'],
  },
  userEmail: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.neutral['5'],
    marginTop: 2,
  },
});
