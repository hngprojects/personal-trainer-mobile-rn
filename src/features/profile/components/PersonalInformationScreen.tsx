import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuthStore } from '@/features/auth';
import { Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useDeviceLocation } from '../hooks/useDeviceLocation';
import { CenterModal } from './CenterModal';
import { InfoRow } from './InfoRow';
import { ScreenHeader } from './ScreenHeader';

const AVATAR_PLACEHOLDER = 'https://randomuser.me/api/portraits/women/68.jpg';

type Newsletter = 'yes' | 'no';

export function PersonalInformationScreen() {
  const user = useAuthStore((s) => s.user);
  const { data: location, status: locationStatus, refresh: refreshLocation } = useDeviceLocation();
  const { colors } = useTheme();
  const statusBarStyle = useStatusBarStyle();

  const [newsletter, setNewsletter] = useState<Newsletter>('yes');
  const [showNewsletter, setShowNewsletter] = useState(false);
  const [showLocation, setShowLocation] = useState(false);

  const locationLabel =
    location?.country ||
    (locationStatus === 'loading'
      ? 'Locating…'
      : locationStatus === 'denied'
        ? 'Off'
        : locationStatus === 'error'
          ? '—'
          : '—');

  const info = {
    name: user?.name ?? 'Grace Luke',
    gender: 'Female',
    dateOfBirth: '21/01/1985',
    phoneNumber: '+1 872 2391 3097',
    goal: 'Keep Fit',
  };

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(280)}>
          <ScreenHeader title="Personal Information" />
        </Animated.View>

        <Animated.View entering={FadeIn.delay(80).duration(360)} style={styles.avatarBlock}>
          <View style={styles.avatarWrap}>
            <Image source={{ uri: AVATAR_PLACEHOLDER }} style={styles.avatar} />
            <View style={[styles.avatarBadge, { borderColor: colors.background }]}>
              <Ionicons name="camera" size={11} color="#FFFFFF" />
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(360)} style={styles.list}>
          <InfoRow label="Name" value={info.name} />
          <InfoRow label="Gender" value={info.gender} />
          <InfoRow label="Date Of Birth" value={info.dateOfBirth} />
          <InfoRow label="Phone Number" value={info.phoneNumber} />
          <InfoRow label="Goal" value={info.goal} />
          <InfoRow
            label="Newsletter"
            value={newsletter === 'yes' ? 'Yes' : 'No'}
            onPress={() => setShowNewsletter(true)}
          />
          <InfoRow label="Location" value={locationLabel} onPress={() => setShowLocation(true)} />
        </Animated.View>
      </ScrollView>

      <CenterModal
        visible={showNewsletter}
        onClose={() => setShowNewsletter(false)}
        title="Newsletter"
      >
        <RadioOption
          label="Yes"
          selected={newsletter === 'yes'}
          onPress={() => {
            setNewsletter('yes');
            setShowNewsletter(false);
          }}
        />
        <RadioOption
          label="No"
          selected={newsletter === 'no'}
          onPress={() => {
            setNewsletter('no');
            setShowNewsletter(false);
          }}
        />
      </CenterModal>

      <CenterModal visible={showLocation} onClose={() => setShowLocation(false)} title="Location">
        {locationStatus === 'ready' && location ? (
          <>
            <View style={styles.locationRow}>
              <Typography style={[styles.locationLabel, { color: colors.text }]}>
                Country
              </Typography>
              <Typography style={[styles.locationValue, { color: colors.textMuted }]}>
                {location.country || '—'}
              </Typography>
            </View>
            <View style={styles.locationRow}>
              <Typography style={[styles.locationLabel, { color: colors.text }]}>
                City/State
              </Typography>
              <Typography style={[styles.locationValue, { color: colors.textMuted }]}>
                {location.cityState || '—'}
              </Typography>
            </View>
            <View style={styles.locationRow}>
              <Typography style={[styles.locationLabel, { color: colors.text }]}>
                Time Zone
              </Typography>
              <Typography style={[styles.locationValue, { color: colors.textMuted }]}>
                {location.timeZone}
              </Typography>
            </View>
          </>
        ) : (
          <View style={styles.locationFallback}>
            {locationStatus === 'loading' ? (
              <Typography style={[styles.locationHelp, { color: colors.textMuted }]}>
                Reading device location…
              </Typography>
            ) : locationStatus === 'denied' ? (
              <>
                <Typography style={[styles.locationHelp, { color: colors.textMuted }]}>
                  Location permission denied. Enable it in your device settings to see where you
                  are.
                </Typography>
                <Pressable onPress={refreshLocation} style={styles.retryBtn} hitSlop={6}>
                  <Typography style={styles.retryText}>Try again</Typography>
                </Pressable>
              </>
            ) : (
              <>
                <Typography style={[styles.locationHelp, { color: colors.textMuted }]}>
                  Couldn&apos;t read your location.
                </Typography>
                <Pressable onPress={refreshLocation} style={styles.retryBtn} hitSlop={6}>
                  <Typography style={styles.retryText}>Try again</Typography>
                </Pressable>
              </>
            )}
          </View>
        )}
      </CenterModal>
    </SafeAreaView>
  );
}

interface RadioOptionProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

function RadioOption({ label, selected, onPress }: RadioOptionProps) {
  const { colors } = useTheme();
  return (
    <Pressable onPress={onPress} style={styles.radioRow} hitSlop={6}>
      <View
        style={[
          styles.radioOuter,
          { borderColor: selected ? palette.highlightBlue['5'] : colors.border },
        ]}
      >
        {selected ? <View style={styles.radioInner} /> : null}
      </View>
      <Typography style={[styles.radioLabel, { color: colors.text }]}>{label}</Typography>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  avatarBlock: {
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 10,
  },
  avatarWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
  },
  avatarBadge: {
    position: 'absolute',
    right: -2,
    bottom: -2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: palette.highlightBlue['5'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  list: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  radioOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: palette.highlightBlue['5'],
  },
  radioLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  locationLabel: {
    fontSize: 12,
    fontFamily: fonts.medium,
  },
  locationValue: {
    flex: 1,
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: 'right',
  },
  locationFallback: {
    alignItems: 'center',
    gap: 12,
    paddingVertical: 4,
  },
  locationHelp: {
    fontSize: 12,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
  retryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  retryText: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    color: palette.highlightBlue['5'],
  },
});
