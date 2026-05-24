import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, View } from 'react-native';
import Animated, {
  Easing,
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientAvatarStack } from '@/features/trainers/components/ClientAvatarStack';
import { SpecialtyTags } from '@/features/trainers/components/SpecialtyTags';
import { useInfiniteTrainers } from '@/features/trainers/hooks/useInfiniteTrainers';
import type { Trainer } from '@/features/trainers/types/trainer.types';
import { Avatar, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { useTheme } from '@/shared/theme';

import { useHome } from '../hooks/useHome';
import { HERO_GRADIENT, useHomeStyles } from './HomeScreen.styles';

const CATEGORIES = [
  {
    label: 'Yoga',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=300',
  },
  {
    label: 'Mobility',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=300',
  },
  {
    label: 'Cardio',
    image: 'https://images.unsplash.com/photo-1538805060514-97d9cc17730c?q=80&w=300',
  },
  {
    label: 'Endurance',
    image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?q=80&w=300',
  },
  {
    label: 'Strength',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=300',
  },
] as const;

const ENTRY_DURATION = 420;

const HERO_IMAGE = require('../../../../assets/images/hero-trainers.png');
const LOGO = require('../../../../assets/images/logo.png');

function getTimeOfDayGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Good Morning';
  }

  if (hour < 17) {
    return 'Good Afternoon';
  }

  return 'Good Evening';
}

export function HomeScreen() {
  const { spacing, colors } = useTheme();
  const styles = useHomeStyles();
  const statusBarStyle = useStatusBarStyle();
  const { user } = useHome();
  const displayName = user?.name ?? '';
  const greeting = getTimeOfDayGreeting();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const {
    data: trainerPages,
    isLoading,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useInfiniteTrainers(selectedCategory);
  const trainers = useMemo(
    () => trainerPages?.pages.flatMap((page) => page.trainers) ?? [],
    [trainerPages],
  );
  const filteredTrainers = useMemo(() => {
    if (!selectedCategory) {
      return trainers;
    }

    const category = selectedCategory.toLowerCase();
    return trainers.filter((trainer) => {
      const specialty = trainer.specialty.toLowerCase();
      const tags = trainer.tags.map((tag) => tag.toLowerCase());

      return specialty.includes(category) || tags.includes(category);
    });
  }, [selectedCategory, trainers]);
  const showTrainerLoading = isLoading && trainers.length === 0;
  const showLoadMore = isFetchingNextPage && trainers.length > 0;

  const scrollY = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const refreshLogoVisibility = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

  function handleScrollNearEnd(event: {
    nativeEvent: {
      contentOffset: { y: number };
      contentSize: { height: number };
      layoutMeasurement: { height: number };
    };
  }) {
    const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
    const distanceFromBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
    if (distanceFromBottom < 260 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }

  useEffect(() => {
    logoRotation.value = withRepeat(
      withTiming(360, {
        duration: 1100,
        easing: Easing.linear,
      }),
      -1,
      false,
    );
  }, [logoRotation]);

  useEffect(() => {
    refreshLogoVisibility.value = withTiming(isRefetching ? 1 : 0, { duration: 160 });
  }, [isRefetching, refreshLogoVisibility]);

  // Header fades + scales slightly as the user scrolls.
  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(scrollY.value, [0, 80], [1, 0.65], Extrapolation.CLAMP),
    transform: [
      {
        scale: interpolate(scrollY.value, [0, 80], [1, 0.96], Extrapolation.CLAMP),
      },
    ],
  }));

  // Hero parallax + opacity ramp on scroll.
  const heroAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateY: interpolate(scrollY.value, [-100, 0, 220], [-30, 0, 60], Extrapolation.CLAMP),
      },
      {
        scale: interpolate(scrollY.value, [0, 220], [1, 0.97], Extrapolation.CLAMP),
      },
    ],
    opacity: interpolate(scrollY.value, [0, 140, 240], [1, 0.85, 0.55], Extrapolation.CLAMP),
  }));

  const loaderLogoStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${logoRotation.value}deg` }],
  }));

  const refreshLogoStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshLogoVisibility.value);

    return {
      opacity: visibility,
      transform: [
        {
          translateY: interpolate(scrollY.value, [-110, 0], [74, 40], Extrapolation.CLAMP),
        },
        { scale: interpolate(visibility, [0, 1], [0.86, 1], Extrapolation.CLAMP) },
        { rotate: `${logoRotation.value}deg` },
      ],
    };
  });

  const contentRefreshStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshLogoVisibility.value);

    return {
      opacity: interpolate(visibility, [0, 1], [1, 0.46], Extrapolation.CLAMP),
      transform: [{ scale: interpolate(visibility, [0, 1], [1, 0.985], Extrapolation.CLAMP) }],
    };
  });

  const refreshVeilStyle = useAnimatedStyle(() => {
    const pullVisibility = interpolate(scrollY.value, [-70, -24], [1, 0], Extrapolation.CLAMP);
    const visibility = Math.max(pullVisibility, refreshLogoVisibility.value);

    return {
      opacity: interpolate(visibility, [0, 1], [0, 0.62], Extrapolation.CLAMP),
    };
  });

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar style={statusBarStyle} />
      <Animated.View pointerEvents="none" style={[styles.refreshVeil, refreshVeilStyle]} />
      <Animated.View pointerEvents="none" style={[styles.refreshLogoLayer, refreshLogoStyle]}>
        <Animated.Image source={LOGO} style={styles.refreshLogo} />
      </Animated.View>

      <Animated.ScrollView
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleScrollNearEnd}
        onScrollEndDrag={handleScrollNearEnd}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingHorizontal: spacing.md }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor="transparent"
            colors={['transparent']}
            progressBackgroundColor="transparent"
            progressViewOffset={-1000}
          />
        }
      >
        <Animated.View style={contentRefreshStyle}>
          {/* HEADER — outer wrapper owns the entry animation, inner owns the scroll-driven style */}
          <Animated.View
            entering={FadeInDown.duration(ENTRY_DURATION)}
            style={{ marginTop: spacing.sm }}
          >
            <Animated.View style={[styles.header, headerAnimatedStyle]}>
              <Pressable
                style={styles.headerLeft}
                onPress={() => router.push('/(main)/(tabs)/profile' as Href)}
                accessibilityRole="button"
                accessibilityLabel="Open your profile"
                hitSlop={8}
              >
                <Avatar name={displayName} uri={user?.avatarUrl} size={40} />
                <View style={{ marginLeft: spacing.sm }}>
                  <Typography style={styles.greeting}>Hi, {greeting}!</Typography>
                  <Typography style={styles.userName}>{displayName}</Typography>
                </View>
              </Pressable>
              <Pressable
                hitSlop={8}
                style={styles.bellButton}
                onPress={() => router.push('/(main)/notifications' as Href)}
                accessibilityRole="button"
                accessibilityLabel="Open notifications"
              >
                <Ionicons name="notifications-outline" size={22} color={colors.text} />
              </Pressable>
            </Animated.View>
          </Animated.View>

          {/* HERO — same split: outer = entering, inner = scroll-driven */}
          <Animated.View
            entering={FadeInUp.delay(100).duration(ENTRY_DURATION)}
            style={{ marginTop: spacing.lg }}
          >
            <Animated.View style={heroAnimatedStyle}>
              <LinearGradient
                colors={HERO_GRADIENT}
                locations={[0, 0.55, 1]}
                start={{ x: 1, y: 0 }}
                end={{ x: 0, y: 1 }}
                style={styles.heroCard}
              >
                <View style={styles.heroLeft}>
                  <Typography style={styles.heroTitle}>Your Fitness Journey Starts Here</Typography>
                  <Typography style={styles.heroText}>
                    Explore training programs built around your goals and routine.
                  </Typography>
                </View>

                {/* Alpha-channel PNG — fuses with the gradient naturally, no overlay needed. */}
                <Image source={HERO_IMAGE} style={styles.heroImage} />
              </LinearGradient>
            </Animated.View>
          </Animated.View>

          {/* CATEGORIES */}
          <Animated.View entering={FadeIn.delay(200).duration(ENTRY_DURATION)}>
            <Typography style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              Categories
            </Typography>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categories}
            >
              <Pressable
                style={styles.categoryItem}
                onPress={() => setSelectedCategory(null)}
                accessibilityRole="button"
                accessibilityLabel="Show all trainers"
                accessibilityState={{ selected: selectedCategory === null }}
              >
                <View
                  style={[
                    styles.categoryCircle,
                    styles.categoryIconCircle,
                    selectedCategory === null && styles.categoryCircleSelected,
                  ]}
                >
                  <Ionicons
                    name="grid-outline"
                    size={24}
                    color={selectedCategory === null ? colors.primary : colors.textSecondary}
                  />
                </View>
                <Typography
                  style={[
                    styles.categoryText,
                    selectedCategory === null && styles.categoryTextSelected,
                  ]}
                >
                  All
                </Typography>
              </Pressable>
              {CATEGORIES.map((category, index) => {
                const isSelected = selectedCategory === category.label;

                return (
                  <Animated.View
                    key={category.label}
                    entering={FadeInUp.delay(220 + index * 40).duration(ENTRY_DURATION)}
                  >
                    <Pressable
                      style={styles.categoryItem}
                      onPress={() =>
                        setSelectedCategory((current) =>
                          current === category.label ? null : category.label,
                        )
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Show ${category.label} trainers`}
                      accessibilityState={{ selected: isSelected }}
                    >
                      <View
                        style={[styles.categoryCircle, isSelected && styles.categoryCircleSelected]}
                      >
                        <Image source={{ uri: category.image }} style={styles.categoryImage} />
                      </View>
                      <Typography
                        style={[styles.categoryText, isSelected && styles.categoryTextSelected]}
                      >
                        {category.label}
                      </Typography>
                    </Pressable>
                  </Animated.View>
                );
              })}
            </ScrollView>
          </Animated.View>

          {/* TRAINERS */}
          <Animated.View entering={FadeIn.delay(400).duration(ENTRY_DURATION)}>
            <Typography style={[styles.sectionTitle, { marginTop: spacing.lg }]}>
              {selectedCategory ? `${selectedCategory} Trainers` : 'Trainers'}
            </Typography>
          </Animated.View>
          <View style={styles.trainersGrid}>
            {showTrainerLoading ? (
              <View style={styles.emptyTrainers}>
                <Animated.Image source={LOGO} style={[styles.inlineLoadingLogo, loaderLogoStyle]} />
                <Typography style={styles.emptyTrainersText}>Loading trainers...</Typography>
              </View>
            ) : filteredTrainers.length === 0 ? (
              <View style={styles.emptyTrainers}>
                <Typography style={styles.emptyTrainersText}>
                  {selectedCategory
                    ? 'No trainers found for this category.'
                    : 'No trainers available yet.'}
                </Typography>
              </View>
            ) : (
              filteredTrainers.map((trainer: Trainer, index: number) => (
                <Animated.View
                  key={trainer.id}
                  entering={FadeInUp.delay(420 + index * 80).duration(ENTRY_DURATION)}
                  style={styles.trainerCard}
                >
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/(main)/trainer-profile',
                        params: { trainerId: trainer.id },
                      } as never)
                    }
                  >
                    <Image source={{ uri: trainer.image }} style={styles.trainerImage} />
                    <View style={[styles.trainerBody, { padding: spacing.sm }]}>
                      <SpecialtyTags tags={trainer.tags} />
                      <View style={styles.trainerNameRow}>
                        <Typography style={styles.trainerName} numberOfLines={1}>
                          {trainer.name}
                        </Typography>
                        <Typography style={styles.trainerRating}>★ {trainer.rating}</Typography>
                      </View>
                      <ClientAvatarStack
                        avatars={trainer.clientAvatars}
                        totalClients={trainer.clients}
                      />
                    </View>
                  </Pressable>
                </Animated.View>
              ))
            )}
            {showLoadMore ? (
              <View style={styles.emptyTrainers}>
                <Animated.Image source={LOGO} style={[styles.inlineLoadingLogo, loaderLogoStyle]} />
                <Typography style={styles.emptyTrainersText}>Loading more trainers...</Typography>
              </View>
            ) : null}
          </View>
        </Animated.View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
