import { Ionicons } from '@expo/vector-icons';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { Trainer } from '@/features/trainers/types/trainer.types';
import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';
import { CallDraft, CallPlatform } from '../types/book-a-call.types';

const ZOOM_LOGO = require('../../../../assets/images/book-a-call/zoom.png');
const GMEET_LOGO = require('../../../../assets/images/book-a-call/google-meet.png');

const AGENT_BULLETS = [
  'Answer any questions you have about FitCall',
  'Walk you through how sessions work',
  "Guide you through getting started if you're ready",
];

const PLATFORMS: { id: CallPlatform; name: string; logo: number }[] = [
  { id: 'zoom', name: 'Zoom', logo: ZOOM_LOGO },
  { id: 'google-meet', name: 'Google Meet', logo: GMEET_LOGO },
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
        <Typography variant="h2" style={styles.heading}>
          Got questions? Let&apos;s answer them.
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
          One of our agents will reach out to you on your chosen platform.
        </Typography>

        {/* Info card */}
        <View
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
        </View>

        {/* Trainer / enquiring-about card */}
        <View
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
        </View>

        {/* Platform selection */}
        <Typography variant="body1" style={styles.sectionHeader}>
          Choose your preferred platform
        </Typography>

        {PLATFORMS.map((p) => {
          const selected = draft.platform === p.id;
          return (
            <Pressable
              key={p.id}
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
              <Image source={p.logo} style={styles.platformLogo} resizeMode="contain" />
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
          );
        })}

        {/* Info banner */}
        <View style={[styles.infoBanner, { backgroundColor: colors.primarySubtle }]}>
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Typography variant="body2" color={colors.primary} style={styles.infoText}>
            Make sure you have the selected app installed before your call.
          </Typography>
        </View>

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
  content: { paddingTop: 8, paddingBottom: 16 },
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
  platformLogo: { width: 40, height: 40, borderRadius: 8, marginRight: 12 },
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
