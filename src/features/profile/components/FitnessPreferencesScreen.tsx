import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth/store/auth.store';
import { toast, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useUpdateProfile } from '../hooks/useUpdateProfile';
import { ScreenHeader } from './ScreenHeader';

const MAX_GOALS = 4;

type ApiGoal =
  | 'lose_weight'
  | 'build_muscle'
  | 'improve_flexibility'
  | 'boost_energy'
  | 'build_healthy_habits'
  | 'build_strength';

interface PreferenceItem {
  id: string;
  label: string;
  goal: ApiGoal;
  image: string;
}

const PREFERENCES: PreferenceItem[] = [
  {
    id: 'burn-thigh-fat',
    label: 'Burn Thigh Fat',
    goal: 'lose_weight',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=180',
  },
  {
    id: 'shoulder-workout',
    label: 'Shoulder workout',
    goal: 'build_muscle',
    image: 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?q=80&w=180',
  },
  {
    id: 'full-body',
    label: 'Full Body',
    goal: 'build_strength',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=180',
  },
  {
    id: 'leg-workout',
    label: 'Leg workout',
    goal: 'build_strength',
    image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?q=80&w=180',
  },
  {
    id: 'abs-workout',
    label: 'Abs workout',
    goal: 'build_muscle',
    image: 'https://images.unsplash.com/photo-1571019613914-85f342c6a11e?q=80&w=180',
  },
  {
    id: 'chest-workout',
    label: 'Chest Workout',
    goal: 'build_muscle',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?q=80&w=180',
  },
  {
    id: 'back-workout',
    label: 'Back Workout',
    goal: 'build_strength',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=180',
  },
  {
    id: 'lower-body-stretching',
    label: 'Lower body stretching',
    goal: 'improve_flexibility',
    image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=180',
  },
  {
    id: 'butt-lift',
    label: 'Butt lift',
    goal: 'build_strength',
    image: 'https://images.unsplash.com/photo-1599058917212-d750089bc07e?q=80&w=180',
  },
  {
    id: 'plank-workout',
    label: 'Plank workout',
    goal: 'boost_energy',
    image: 'https://images.unsplash.com/photo-1566241142559-40e1dab266c6?q=80&w=180',
  },
];

export function FitnessPreferencesScreen() {
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const userGoals = useAuthStore((s) => s.user?.fitnessGoals ?? []);
  const updateProfile = useUpdateProfile();
  const initialSelection = useMemo(() => getInitialSelectedIds(userGoals), [userGoals]);
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (!hasInteracted) {
      setSelectedIds(initialSelection);
    }
  }, [hasInteracted, initialSelection]);

  const togglePreference = (item: PreferenceItem) => {
    const isRemoving = selectedIds.includes(item.id);
    const nextSelectedIds = isRemoving
      ? selectedIds.filter((id) => id !== item.id)
      : [...selectedIds, item.id];

    const nextFitnessGoals = Array.from(
      new Set(
        PREFERENCES.filter((preference) => nextSelectedIds.includes(preference.id)).map(
          (preference) => preference.goal,
        ),
      ),
    );

    if (!isRemoving && nextSelectedIds.length > MAX_GOALS) {
      toast.error(`Pick up to ${MAX_GOALS} goals.`);
      return;
    }

    const previousSelectedIds = selectedIds;
    setHasInteracted(true);
    setSelectedIds(nextSelectedIds);

    updateProfile.mutate(
      { fitness_goals: nextFitnessGoals },
      {
        onError: () => {
          setSelectedIds(previousSelectedIds);
          toast.error("We couldn't update your goals. Please try again.");
        },
      },
    );
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />
      <ScreenHeader title="Fitness Goals" />

      <Animated.ScrollView
        entering={FadeInDown.duration(260)}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Typography style={[styles.sectionTitle, { color: colors.text }]}>Preferences</Typography>

        <View style={styles.list}>
          {PREFERENCES.map((item, index) => {
            const selected = selectedIds.includes(item.id);
            return (
              <Animated.View
                key={item.id}
                entering={FadeInDown.delay(70 + index * 35).duration(300)}
                layout={LinearTransition.duration(180)}
              >
                <Pressable
                  onPress={() => togglePreference(item)}
                  disabled={updateProfile.isPending}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: selected, disabled: updateProfile.isPending }}
                  style={({ pressed }) => [
                    styles.row,
                    pressed && !updateProfile.isPending ? styles.pressed : null,
                  ]}
                >
                  <Image source={{ uri: item.image }} style={styles.thumbnail} />
                  <Typography style={[styles.label, { color: colors.text }]} numberOfLines={1}>
                    {item.label}
                  </Typography>
                  <View
                    style={[
                      styles.checkCircle,
                      { borderColor: selected ? palette.highlightBlue['5'] : colors.border },
                    ]}
                  >
                    {selected ? (
                      <Ionicons name="checkmark" size={10} color={palette.highlightBlue['5']} />
                    ) : null}
                  </View>
                </Pressable>
              </Animated.View>
            );
          })}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function getInitialSelectedIds(goals: string[]) {
  const selected: string[] = [];
  const seenGoals = new Set<ApiGoal | string>();

  for (const goal of goals.map(normalizeGoal)) {
    if (seenGoals.has(goal)) continue;
    const item = PREFERENCES.find((preference) => preference.goal === goal);
    if (item) {
      selected.push(item.id);
      seenGoals.add(goal);
    }
  }

  return selected;
}

function normalizeGoal(goal: string): ApiGoal | string {
  const legacyMap: Record<string, ApiGoal> = {
    flexibility: 'improve_flexibility',
    endurance: 'boost_energy',
    boost_endurance: 'boost_energy',
    habits: 'build_healthy_habits',
    strength: 'build_strength',
  };

  return legacyMap[goal] ?? goal;
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 4,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.medium,
    marginBottom: 8,
  },
  list: {
    gap: 12,
  },
  row: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  pressed: {
    opacity: 0.72,
  },
  thumbnail: {
    width: 44,
    height: 44,
    borderRadius: 2,
    backgroundColor: palette.neutral['1'],
  },
  label: {
    flex: 1,
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  checkCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
