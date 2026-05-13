import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Href, router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Image, Pressable, RefreshControl, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeIn,
  FadeInDown,
  FadeInUp,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ClientAvatarStack } from '@/features/trainers/components/ClientAvatarStack';
import { SpecialtyTags } from '@/features/trainers/components/SpecialtyTags';
import { TrainerCardSkeleton } from '@/features/trainers/components/TrainerCardSkeleton';
import { useTrainers } from '@/features/trainers/hooks/useTrainers';
import type { Trainer } from '@/features/trainers/types/trainer.types';
import { Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

import { useHome } from '../hooks/useHome';
import { HERO_GRADIENT, homeStyles as styles } from './HomeScreen.styles';

const CATEGORIES = ['Yoga', 'Mobility', 'Cardio', 'Endurance', 'Strength'];

const ENTRY_DURATION = 420;

const HERO_IMAGE = require('../../../../assets/images/hero-trainers.png');

export function HomeScreen() {
  const { spacing } = useTheme();
  const { user } = useHome();
  const displayName = user?.name ?? '';
  const { data: trainers = [], isLoading, isRefetching, refetch } = useTrainers();
  const showSkeletons = isLoading && trainers.length === 0;

  const scrollY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (e) => {
      scrollY.value = e.contentOffset.y;
    },
  });

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

  return (
    <SafeAreaView edges={['top']} style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      <StatusBar style="dark" />

      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.body, { paddingHorizontal: spacing.md }]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            tintColor={palette.highlightBlue['5']}
            colors={[palette.highlightBlue['5']]}
          />
        }
      >
        {/* HEADER — outer wrapper owns the entry animation, inner owns the scroll-driven style */}
        <Animated.View
          entering={FadeInDown.duration(ENTRY_DURATION)}
          style={{ marginTop: spacing.sm }}
        >
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <View style={styles.headerLeft}>
              <Image
                source={{ uri: 'https://randomuser.me/api/portraits/men/32.jpg' }}
                style={styles.avatar}
              />
              <View style={{ marginLeft: spacing.sm }}>
                <Typography style={styles.greeting}>Hi, Good Morning!</Typography>
                <Typography style={styles.userName}>{displayName}</Typography>
              </View>
            </View>
            <Pressable hitSlop={8} style={styles.bellButton}>
              <Ionicons name="notifications-outline" size={22} color={palette.neutral['9']} />
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
          <View style={styles.categories}>
            {CATEGORIES.map((label, index) => (
              <Animated.View
                key={label}
                entering={FadeInUp.delay(220 + index * 40).duration(ENTRY_DURATION)}
                style={styles.categoryItem}
              >
                <View style={styles.categoryCircle} />
                <Typography style={styles.categoryText}>{label}</Typography>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* TRAINERS */}
        <Animated.View entering={FadeIn.delay(400).duration(ENTRY_DURATION)}>
          <Typography style={[styles.sectionTitle, { marginTop: spacing.lg }]}>Trainers</Typography>
        </Animated.View>
        <View style={styles.trainersGrid}>
          {showSkeletons
            ? [0, 1, 2, 3].map((i) => <TrainerCardSkeleton key={i} />)
            : trainers.slice(0, 4).map((trainer: Trainer, index: number) => (
                <Animated.View
                  key={trainer.id}
                  entering={FadeInUp.delay(420 + index * 80).duration(ENTRY_DURATION)}
                  style={styles.trainerCard}
                >
                  <Pressable onPress={() => router.push('/trainer-profile' as Href)}>
                    <Image source={{ uri: trainer.image }} style={styles.trainerImage} />
                    <View style={[styles.trainerBody, { padding: spacing.sm }]}>
                      <SpecialtyTags tags={trainer.tags} />
                      <View style={styles.trainerNameRow}>
                        <Typography style={styles.trainerName}>{trainer.name}</Typography>
                        <Typography style={styles.trainerRating}>★ {trainer.rating}</Typography>
                      </View>
                      <ClientAvatarStack
                        avatars={trainer.clientAvatars}
                        totalClients={trainer.clients}
                      />
                    </View>
                  </Pressable>
                </Animated.View>
              ))}
        </View>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}
