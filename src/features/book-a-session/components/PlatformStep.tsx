import { Ionicons } from '@expo/vector-icons';
import { Image, ImageSourcePropType, Pressable, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

import { PLATFORM_LOGOS } from '@/features/book-a-call/data/platform-logos';
import { Trainer } from '@/features/trainers/types/trainer.types';
import { Button, TextInput, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { SessionDraft, SessionPlatform } from '../types/book-a-session.types';

interface PlatformOption {
  id: SessionPlatform;
  name: string;
  description: string;
  logo?: ImageSourcePropType;
  icon?: keyof typeof Ionicons.glyphMap;
}

const PLATFORMS: PlatformOption[] = [
  {
    id: 'zoom',
    name: 'Zoom',
    description: 'Your trainer will send a Zoom link before the session.',
    logo: PLATFORM_LOGOS.zoom,
  },
  {
    id: 'phone_call',
    name: 'Phone Call',
    description: 'Your trainer will call the phone number you provide.',
    icon: 'call-outline',
  },
];

interface PlatformStepProps {
  trainer: Trainer;
  draft: SessionDraft;
  onUpdate: (patch: Partial<SessionDraft>) => void;
  onContinue: () => void;
}

export function PlatformStep({ trainer, draft, onUpdate, onContinue }: PlatformStepProps) {
  const { colors, spacing } = useTheme();

  const requiresPhone = draft.platform === 'phone_call';
  const phoneProvided = draft.phoneNumber.trim().length > 0;
  const canContinue = draft.platform !== null && (!requiresPhone || phoneProvided);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.content, { paddingHorizontal: spacing.md }]}
        showsVerticalScrollIndicator={false}
        bottomOffset={112}
        keyboardShouldPersistTaps="handled"
      >
        <Animated.View entering={FadeInDown.duration(360)}>
          <Typography variant="h2" style={styles.heading}>
            How should the session happen?
          </Typography>
          <Typography variant="body2" color={colors.textSecondary} style={styles.subtitle}>
            Choose a video meeting or a direct phone call.
          </Typography>
        </Animated.View>

        {/* Trainer / booking-with card */}
        <Animated.View
          entering={FadeInUp.delay(80).duration(360)}
          style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Typography variant="body2" color={colors.primary} style={styles.bookingLabel}>
            Booking session with
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
                color={colors.success}
                style={styles.verifiedIcon}
              />
            </View>
          </View>
        </Animated.View>

        {PLATFORMS.map((p, i) => {
          const selected = draft.platform === p.id;
          return (
            <Animated.View key={p.id} entering={FadeInUp.delay(160 + i * 80).duration(360)}>
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
                  {p.logo ? (
                    <Image source={p.logo} style={styles.platformLogo} />
                  ) : (
                    <Ionicons name={p.icon} size={24} color={colors.primary} />
                  )}
                </View>
                <View style={styles.platformText}>
                  <Typography variant="body1" style={styles.platformName}>
                    {p.name}
                  </Typography>
                  <Typography variant="body2" color={colors.textSecondary}>
                    {p.description}
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

        {requiresPhone && (
          <Animated.View entering={FadeInUp.duration(260)}>
            <Typography variant="body1" style={styles.phoneLabel}>
              Your phone number
            </Typography>
            <TextInput
              value={draft.phoneNumber}
              onChangeText={(phoneNumber) => onUpdate({ phoneNumber })}
              placeholder="+1 555 123 4567"
              keyboardType="phone-pad"
              textContentType="telephoneNumber"
              autoComplete="tel"
              style={styles.phoneInput}
            />
          </Animated.View>
        )}

        <Animated.View
          entering={FadeInUp.delay(340).duration(360)}
          style={[styles.infoBanner, { backgroundColor: colors.primarySubtle }]}
        >
          <Ionicons
            name="information-circle-outline"
            size={18}
            color={colors.primary}
            style={styles.infoIcon}
          />
          <Typography variant="body2" color={colors.primary} style={styles.infoText}>
            {requiresPhone
              ? 'Use a number where you can take the trainer’s call at the booked time.'
              : 'Make sure you have Zoom installed before your session.'}
          </Typography>
        </Animated.View>

        <View style={styles.footerSpacer} />
      </KeyboardAwareScrollView>

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
        <Button label="Continue" disabled={!canContinue} onPress={onContinue} />
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
    marginBottom: 16,
  },
  bookingLabel: { fontSize: 13, fontWeight: '500', marginBottom: 10 },
  trainerRow: { flexDirection: 'row', alignItems: 'center' },
  trainerAvatar: { width: 48, height: 48, borderRadius: 24, marginRight: 12 },
  trainerNameRow: { flexDirection: 'row', alignItems: 'center' },
  trainerName: { fontWeight: '700', marginRight: 6 },
  verifiedIcon: {},
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
  phoneLabel: { fontWeight: '700', marginTop: 4, marginBottom: 12 },
  phoneInput: { fontSize: 15, marginBottom: 12 },
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
  footerSpacer: { height: 128 },
  footer: { paddingTop: 12 },
});
