import { Redirect, Stack } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { useAuthSession } from '@/features/auth';
import { useProfile } from '@/features/profile';
import { ReactivateAccountOverlay } from '@/features/profile/components/ReactivateAccountOverlay';
import { useTheme } from '@/shared/theme';

const LOGO = require('../../../assets/images/logo.png');

function MainLoadingScreen() {
  const { colors } = useTheme();
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [rotation]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  return (
    <View style={[styles.loading, { backgroundColor: colors.background }]}>
      <Animated.Image source={LOGO} style={[styles.logo, logoStyle]} />
    </View>
  );
}

export default function MainLayout() {
  const { isLoggedIn, user } = useAuthSession();
  const profileQuery = useProfile();
  const { colors } = useTheme();

  // Guard: any internal route requires an active session.
  if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  if (profileQuery.isLoading) {
    return <MainLoadingScreen />;
  }

  const profileComplete = profileQuery.isSuccess
    ? profileQuery.data.profileComplete
    : user?.profileComplete;

  if (!profileQuery.isError && profileComplete === false) {
    return <Redirect href="/profile-setup" />;
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        {/* Per-screen overrides only — expo-router auto-detects the (tabs) group
            and the trainer-profile route. Declaring (tabs) explicitly triggers a
            "no route named (tabs) exists" warning because the bundler flattens
            group folders into the parent's child list. */}
        <Stack.Screen name="trainer-video" options={{ animation: 'fade' }} />
      </Stack>
      {/* Takes over the app when the account is deactivated (blocked everywhere). */}
      <ReactivateAccountOverlay />
    </>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 72,
    height: 72,
    resizeMode: 'contain',
  },
});
