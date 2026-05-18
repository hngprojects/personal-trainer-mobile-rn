import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, Modal, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { useSessionStore } from '@/features/sessions/store/useSessionStore';
import { Button, Screen, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

export default function SessionDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { sessions, cancelSession } = useSessionStore();
  const { colors, spacing } = useTheme();

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
    router.push(`/session/${session.id}/reschedule`);
  };

  const handleContinueCancel = () => {
    setIsCancelModalVisible(false);
    cancelSession(session.id);
    router.back();
  };

  const renderModalContent = (type: 'reschedule' | 'cancel') => (
    <View style={styles.modalOverlay}>
      <Pressable
        style={styles.modalDismissArea}
        onPress={() =>
          type === 'reschedule'
            ? setIsRescheduleModalVisible(false)
            : setIsCancelModalVisible(false)
        }
      />
      <View style={[styles.modalContent, { padding: spacing.lg }]}>
        <Typography variant="h3" style={{ marginBottom: spacing.sm }}>
          {type === 'reschedule' ? 'Why do you want to reschedule?' : 'Why do you need to cancel?'}
        </Typography>
        <Typography variant="body2" color={palette.neutral['5']} style={{ marginBottom: spacing.md }}>
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
                  { borderColor: isSelected ? colors.primary : palette.neutral['2'] },
                  isSelected && { backgroundColor: palette.highlightBlue['0.5'] },
                ]}
                onPress={() => setSelectedReason(reason)}
              >
                <Typography
                  variant="body3"
                  color={isSelected ? colors.primary : palette.neutral['7']}
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
          style={[styles.textInput, { borderColor: palette.neutral['2'] }]}
          placeholder="I have a doctor's appointment at that time..."
          placeholderTextColor={palette.neutral['4']}
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

  return (
    <Screen padding={false} backgroundColor={colors.surface}>
      <View style={[styles.header, { paddingHorizontal: spacing.md }]}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.text} />
        </Pressable>
        <Typography variant="h3" style={styles.headerTitle}>
          Session Details
        </Typography>
      </View>

      <ScrollView contentContainerStyle={{ padding: spacing.md, paddingBottom: 100 }}>
        <View style={styles.trainerInfo}>
          <Image source={{ uri: session.trainerAvatar }} style={styles.avatarLarge} />
          <View>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Typography variant="h3">{session.trainerName}</Typography>
              <Ionicons name="checkmark-circle" size={16} color={palette.success['5']} style={{ marginLeft: 4 }} />
            </View>
            <Typography variant="body2" color={palette.neutral['5']}>
              Certified Fitness Trainer
            </Typography>
          </View>
        </View>

        <View style={[styles.section, { borderTopColor: palette.neutral['2'] }]}>
          <Typography variant="h4" style={styles.sectionTitle}>
            Booking Details
          </Typography>
          <View style={styles.detailRow}>
            <Ionicons name="calendar-outline" size={20} color={palette.neutral['5']} />
            <Typography variant="body2" style={styles.detailText}>
              {new Date(session.date).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="time-outline" size={20} color={palette.neutral['5']} />
            <Typography variant="body2" style={styles.detailText}>
              {session.startTime} - {session.endTime} (1 hr)
            </Typography>
          </View>
          <View style={styles.detailRow}>
            <Ionicons name="videocam-outline" size={20} color={palette.neutral['5']} />
            <Typography variant="body2" style={styles.detailText}>
              {session.platform} {session.link ? '(Zoom)' : ''}
            </Typography>
          </View>
          {session.link && (
            <View style={styles.detailRow}>
              <Ionicons name="link-outline" size={20} color={palette.neutral['5']} />
              <Typography variant="body2" style={[styles.detailText, { color: colors.primary }]}>
                {session.link}
              </Typography>
            </View>
          )}
        </View>

        <View style={[styles.section, { borderTopColor: palette.neutral['2'] }]}>
          <Typography variant="h4" style={styles.sectionTitle}>
            What to bring
          </Typography>
          <Typography variant="body2" color={palette.neutral['7']}>
            Water bottle, towel, yoga mat
          </Typography>
        </View>
      </ScrollView>

      {session.status === 'upcoming' && (
        <View style={[styles.bottomBar, { borderTopColor: palette.neutral['2'], padding: spacing.md }]}>
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
    backgroundColor: palette.neutral['2'],
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
    color: palette.neutral['7'],
  },
  bottomBar: {
    borderTopWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalDismissArea: {
    flex: 1,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
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
