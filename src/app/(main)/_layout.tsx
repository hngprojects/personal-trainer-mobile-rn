import { Redirect, Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { useAuthSession } from '@/features/auth/hooks/useAuthSession';
import { useTheme } from '@/shared/theme';

export default function MainLayout() {
  const { colors } = useTheme();
  const { isLoggedIn } = useAuthSession();

  // TEMPORARY ACCESS
  // Remove this later when auth is ready
  // if (!isLoggedIn) return <Redirect href="/(auth)/login" />;

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopColor: '#EAEAEA',
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },

        tabBarActiveTintColor: '#005F86',
        tabBarInactiveTintColor: '#999',

        headerStyle: {
          backgroundColor: colors.surface,
        },

        headerTintColor: colors.text,
        headerShadowVisible: false,

        tabBarLabelStyle: {
          fontSize: 11,
          marginTop: 2,
        },
      }}>
      {/* HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="home-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* TRAINERS */}
      <Tabs.Screen
        name="trainers"
        options={{
          title: 'Trainers',
          headerShown: false,

          tabBarIcon: ({ color, size }) => (
            <Ionicons
              name="people-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      {/* PROFILE SCREEN HIDDEN */}
      <Tabs.Screen
        name="trainer-profile"
        options={{
          href: null,
          headerShown: false,
        }}
      />

      {/* VIDEO SCREEN HIDDEN */}
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