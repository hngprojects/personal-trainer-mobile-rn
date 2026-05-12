import { Tabs } from 'expo-router';

import { useTheme } from '@/shared/theme';

export default function MainLayout() {
  const { colors } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: colors.tabBar,
          borderTopColor: colors.border,
        },
        tabBarActiveTintColor:
          colors.tabBarActive,
        tabBarInactiveTintColor:
          colors.tabBarInactive,
        headerStyle: {
          backgroundColor:
            colors.surface,
        },
        headerTintColor: colors.text,
        headerShadowVisible: false,
      }}>
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,
        }}
      />

      {/* TRAINERS */}
      <Tabs.Screen
        name="trainers"
        options={{
          title: 'Trainers',
          headerShown: false,
        }}
      />

      {/* PROFILE SCREEN */}
      <Tabs.Screen
        name="trainer-profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      {/* VIDEO SCREEN */}
      <Tabs.Screen
        name="trainer-video"
        options={{
          href: null,
          headerShown: false,
        }}
      />
    </Tabs>
  );
}