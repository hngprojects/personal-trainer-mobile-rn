import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { Trainer } from '@/features/trainers/types/trainer.types';
import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

import { PLATFORM_LOGOS } from '../data/platform-logos';
import { CallDraft, CallPlatform } from '../types/book-a-call.types';

const AGENT_BULLETS = [
  'Answer any questions you have about FitCall',
  'Walk you through how sessions work',
  "Guide you through getting started if you're ready",
];

const PLATFORMS: { id: CallPlatform; name: string; logo: ImageSourcePropType }[] = [
  { id: 'zoom', name: 'Zoom', logo: PLATFORM_LOGOS.zoom },
  { id: 'google-meet', name: 'Google Meet', logo: PLATFORM_LOGOS['google-meet'] },
];

interface PlatformStepProps {
  trainer: Trainer;
  draft: CallDraft;
  onUpdate: (patch: Partial<CallDraft>) => void;
  onContinue: () => void;
}

export function PlatformStep({ trainer, draft, onUpdate, onContinue }: PlatformStepProps) {
  const { colors, spacing } = useTheme();

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Heading */}
        <Animated.View entering={FadeInDown.duration(360)}>
          <Typography variant="h2" style={styles.heading}>
            Got questions? Let&apos;s answer them.
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
            One of our agents will reach out to you on your chosen platform.
          </Typography>
        </Animated.View>

        {/* Info card */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(360)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Typography variant="body2" style={styles.cardLabel}>
            On this call, our agent will:
          </Typography>
          {AGENT_BULLETS.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <Ionicons
                name="checkmark"
                size={14}
                color={palette.success['4']}
                style={styles.checkIcon}
              />
              <Typography variant="body2" color={colors.textSecondary} style={styles.bulletText}>
                {bullet}
              </Typography>
            </View>
          ))}
        </Animated.View>

        {/* Trainer / enquiring-about card */}
        <Animated.View
          entering={FadeInUp.delay(160).duration(360)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Typography variant="body2" color={colors.primary} style={styles.enquiringLabel}>
            Enquiring about
          </Typography>
          <View style={styles.trainerRow}>
            <Image source={{ uri: trainer.image }} style={styles.trainerAvatar} />
            <View style={styles.trainerNameRow}>
              <Typography variant="body1" style={styles.trainerName}>
                {trainer.name}
              </Typography>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={palette.success['4']}
                style={styles.verifiedIcon}
              />
            </View>
          </View>
        </Animated.View>

        {/* Platform selection */}
        <Animated.View entering={FadeInUp.delay(220).duration(360)}>
          <Typography variant="body1" style={styles.sectionHeader}>
            Choose your preferred platform
          </Typography>
        </Animated.View>

        {PLATFORMS.map((p, i) => {
          const selected = draft.platform === p.id;
          return (
            <Animated.View key={p.id} entering={FadeInUp.delay(260 + i * 80).duration(360)}>
              <Pressable
                onPress={() => onUpdate({ platform: p.id })}
                style={[
                  styles.platformCard,
                  {
                    backgroundColor: colors.surface,
                    borderColor: selected ? colors.primary : colors.border,
                    borderWidth: selected ? 1.5 : 1,
                  },
                ]}
              >
                <View style={styles.platformLogoBox}>
                  <Image source={p.logo} style={styles.platformLogo} />
                </View>
                <View style={styles.platformText}>
                  <Typography variant="body1" style={styles.platformName}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color={colors.textSecondary}>
                    Video call platform
                  </Typography>
                </View>
                <View
                  style={[
                    styles.radioOuter,
                    { borderColor: selected ? colors.primary : colors.border },
                  ]}
                >
                  {selected && (
                    <View style={[styles.radioInner, { backgroundColor: colors.primary }]} />
                  )}
                </View>
              </Pressable>
            </Animated.View>
          );
        })}

        {/* Info banner */}
        <Animated.View
          entering={FadeInUp.delay(440).duration(360)}
          style={[styles.infoBanner, { backgroundColor: colors.primarySubtle }]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Typography variant="body2" color={colors.primary} style={styles.infoText}>
            Make sure you have the selected app installed before your call.
          </Typography>
        </Animated.View>

        <View style={styles.footerSpacer} />
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            paddingHorizontal: spacing.md,
            paddingBottom: spacing.lg,
            backgroundColor: colors.background,
          },
        ]}
      >
        <Button label="Continue" disabled={draft.platform === null} onPress={onContinue} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { flex: 1 },
  content: { paddingTop: 18, paddingBottom: 16 },
  heading: { fontWeight: '700', marginBottom: 6 },
  subtitle: { marginBottom: 20, lineHeight: 22 },
  card: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    marginBottom: 12,
  },
  cardLabel: { fontWeight: '600', marginBottom: 10 },
  bulletRow: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 6 },
  checkIcon: { marginRight: 8, marginTop: 1 },
  bulletText: { flex: 1, lineHeight: 20 },
  enquiringLabel: { fontSize: 13, fontWeight: '500', marginBottom: 10 },
  trainerRow: { flexDirection: 'row', alignItems: 'center' },
  trainerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  trainerNameRow: { flexDirection: 'row', alignItems: 'center' },
  trainerName: { fontWeight: '700', marginRight: 6 },
  verifiedIcon: {},
  sectionHeader: { fontWeight: '700', marginTop: 8, marginBottom: 12 },
  platformCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  platformLogoBox: {
    width: 40,
    height: 40,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  platformLogo: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  platformText: { flex: 1 },
  platformName: { fontWeight: '600', marginBottom: 2 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: 12,
    padding: 14,
    marginTop: 4,
    marginBottom: 8,
  },
  infoIcon: { marginRight: 8, marginTop: 1 },
  infoText: { flex: 1, lineHeight: 20 },
  footerSpacer: { height: 8 },
  footer: { paddingTop: 12 },
});
