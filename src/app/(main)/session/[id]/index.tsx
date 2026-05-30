import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useSessionStore } from '@/features/sessions/store/useSessionStore';
import { Button, Screen, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sessions, cancelSession } = useSessionStore();
  const { colors, spacing } = useTheme();
  const insets = useSafeAreaInsets();

  const session = sessions.find((s) => s.id === id);

  const [isRescheduleModalVisible, setIsRescheduleModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [additionalDetails, setAdditionalDetails] = useState('');

  if (!session) {
    return (
      <Screen>
        <Typography>Session not found</Typography>
      </Screen>
    );
  }

  const reasons = [
    'Schedule conflict',
    'Not feeling well',
    'Forgot/Missed it',
    'Trainer issue',
    'Other',
  ];

  const handleContinueReschedule = () => {
    setIsRescheduleModalVisible(false);
    router.push({ pathname: '/session/[id]/reschedule', params: { id: session.id } });
  };

  const handleContinueCancel = () => {
    setIsCancelModalVisible(false);
    cancelSession(session.id);
    router.back();
  };

  const renderModalContent = (type: 'reschedule' | 'cancel') => (
    <View style={[styles.modalOverlay, { backgroundColor: colors.modalBackdrop }]}>
      <Pressable
        style={styles.modalDismissArea}
        onPress={() =>
          type === 'reschedule'
            ? setIsRescheduleModalVisible(false)
            : setIsCancelModalVisible(false)
        }
      />
      <View
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.background,
            padding: spacing.lg,
            paddingBottom: spacing.lg + insets.bottom,
          },
        ]}
      >
        <Typography variant="h3" style={{ marginBottom: spacing.sm }}>
          {type === 'reschedule' ? 'Why do you want to reschedule?' : 'Why do you need to cancel?'}
        </Typography>
        <Typography
          variant="body2"
          color={colors.textSecondary}
          style={{ marginBottom: spacing.md }}
        >
          Please select a reason so we can let the trainer know.
        </Typography>

        <View style={styles.reasonsContainer}>
          {reasons.map((reason) => {
            const isSelected = selectedReason === reason;
            return (
              <Pressable
                key={reason}
                style={[
                  styles.reasonBadge,
                  { borderColor: isSelected ? colors.primary : colors.border },
                  isSelected && { backgroundColor: colors.primarySubtle },
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Typography
                  variant="label"
                  color={isSelected ? colors.primary : colors.text}
                  style={{ fontWeight: isSelected ? '600' : '400' }}
                >
                  {reason}
                </Typography>
              </Pressable>
            );
          })}
        </View>

        <Typography variant="body2" style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}>
          Additional details
        </Typography>
        <TextInput
          style={[
            styles.textInput,
            {
              borderColor: colors.border,
              backgroundColor: colors.inputBackground,
              color: colors.text,
            },
          ]}
          placeholder="I have a doctor's appointment at that time..."
          placeholderTextColor={colors.iconMuted}
          multiline
          numberOfLines={4}
          value={additionalDetails}
          onChangeText={setAdditionalDetails}
        />

        <Button
          label="Continue"
          onPress={type === 'reschedule' ? handleContinueReschedule : handleContinueCancel}
          style={{ marginTop: spacing.xl }}
          disabled={!selectedReason}
        />
      </View>
    </View>
  );

  const hasBottomBar = session.status === 'upcoming';
  // Reserve enough scroll space for the floating bottom action bar so the last
  // detail row never gets hidden behind it (two stacked buttons + spacing +
  // device safe-area).
  const scrollBottomPadding = hasBottomBar ? 140 + insets.bottom : spacing.lg + insets.bottom;

  return (
    <Screen padding={false} edges={['top']} backgroundColor={colors.surface}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Session Details
        </Typography>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: spacing.md, paddingBottom: scrollBottomPadding }}
      >
        <View style={styles.trainerInfo}>
          <Image
            source={{ uri: session.trainerAvatar }}
            style={[styles.avatarLarge, { backgroundColor: colors.surfaceMuted }]}
          />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h3">{session.trainerName}</Typography>
              <Ionicons
                name="checkmark-circle"
                size={16}
                color={colors.success}
                style={{ marginLeft: 4 }}
              />
            </View>
            <Typography variant="body2" color={colors.textSecondary}>
              Certified Fitness Trainer
            </Typography>
          </View>
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Typography variant="h3" style={styles.sectionTitle}>
            Booking Details
          </Typography>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" color={colors.text} style={styles.detailText}>
              {new Date(session.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" color={colors.text} style={styles.detailText}>
              {session.startTime} - {session.endTime} (1 hr)
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="videocam-outline" size={20} color={colors.iconMuted} />
            <Typography variant="body2" color={colors.text} style={styles.detailText}>
              {session.platform} {session.link ? '(Zoom)' : ''}
            </Typography>
          </View>
          {session.link && (
            <View style={styles.detailRow}>
              <Ionicons name="link-outline" size={20} color={colors.iconMuted} />
              <Typography variant="body2" color={colors.primary} style={styles.detailText}>
                {session.link}
              </Typography>
            </View>
          )}
        </View>

        <View style={[styles.section, { borderTopColor: colors.border }]}>
          <Typography variant="h3" style={styles.sectionTitle}>
            What to bring
          </Typography>
          <Typography variant="body2" color={colors.text}>
            Water bottle, towel, yoga mat
          </Typography>
        </View>
      </ScrollView>

      {hasBottomBar && (
        <View
          style={[
            styles.bottomBar,
            {
              backgroundColor: colors.background,
              borderTopColor: colors.border,
              paddingHorizontal: spacing.md,
              paddingTop: spacing.md,
              paddingBottom: spacing.md + insets.bottom,
            },
          ]}
        >
          <Button
            label="Reschedule"
            onPress={() => setIsRescheduleModalVisible(true)}
            style={{ marginBottom: spacing.sm }}
          />
          <Button
            label="Cancel Session"
            variant="ghost"
            onPress={() => setIsCancelModalVisible(true)}
          />
        </View>
      )}

      <Modal visible={isRescheduleModalVisible} transparent animationType="slide">
        {renderModalContent('reschedule')}
      </Modal>

      <Modal visible={isCancelModalVisible} transparent animationType="slide">
        {renderModalContent('cancel')}
      </Modal>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.bold,
  },
  trainerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarLarge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    marginRight: 16,
  },
  section: {
    paddingVertical: 20,
    borderTopWidth: 1,
  },
  sectionTitle: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    marginLeft: 12,
  },
  bottomBar: {
    borderTopWidth: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  reasonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  reasonBadge: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
    fontFamily: fonts.regular,
  },
});
