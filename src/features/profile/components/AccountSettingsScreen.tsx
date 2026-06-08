import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Animated, { FadeIn, FadeInUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { Button, toast, Typography } from '@/shared/components';
import { useStatusBarStyle } from '@/shared/hooks/useStatusBarStyle';
import { fonts, useTheme } from '@/shared/theme';

import { ACCOUNT_DELETION_POLICY_URL } from '../constants/policy';
import { useDeactivateAccount, useDeleteAccount } from '../hooks/useAccountActions';
import { CenterModal } from './CenterModal';
import { ScreenHeader } from './ScreenHeader';
import { SettingsRow } from './SettingsRow';

const GOOGLE_ICON = require('../../../../assets/images/google.png');

export function AccountSettingsScreen() {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [deactivateModalVisible, setDeactivateModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [finalDeleteModalVisible, setFinalDeleteModalVisible] = useState(false);
  const { colors, isDark } = useTheme();
  const statusBarStyle = useStatusBarStyle();
  const logoutMutation = useLogout();
  const deactivateMutation = useDeactivateAccount();
  const deleteMutation = useDeleteAccount();

  // Subtle glass surfaces, consistent with the rest of the app.
  const glassSurface = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.72)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.06)';

  const confirmLogout = () => {
    setLogoutModalVisible(false);
    logoutMutation.mutate(undefined, {
      onError: () => toast.error("We couldn't reach the server, but you've been signed out."),
    });
  };

  // Soft delete — reversible, so a single confirmation is enough. The hook
  // signs the user out so the next login surfaces the reactivation prompt.
  const confirmDeactivate = () => {
    setDeactivateModalVisible(false);
    deactivateMutation.mutate();
  };

  const askFinalDeleteConfirmation = () => {
    setDeleteModalVisible(false);
    setFinalDeleteModalVisible(true);
  };

  // Permanent delete — irreversible, gated behind a second confirmation.
  const confirmDelete = () => {
    setFinalDeleteModalVisible(false);
    deleteMutation.mutate();
  };

  const openPolicy = () => {
    WebBrowser.openBrowserAsync(ACCOUNT_DELETION_POLICY_URL).catch(() => undefined);
  };

  const busy = deactivateMutation.isPending || deleteMutation.isPending;

  return (
    <SafeAreaView edges={['top']} style={[styles.safe, { backgroundColor: colors.background }]}>
      <StatusBar style={statusBarStyle} />

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeIn.duration(280)}>
          <ScreenHeader title="Account Settings" />
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(80).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>
            Linked Accounts
          </Typography>
          <View
            style={[styles.glassCard, { backgroundColor: glassSurface, borderColor: glassBorder }]}
          >
            <SettingsRow
              icon={<Image source={GOOGLE_ICON} style={styles.brandIcon} resizeMode="contain" />}
              label="Google"
              rightSlot={
                <Typography style={[styles.statusConnected, { color: colors.success }]}>
                  Connected
                </Typography>
              }
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(140).duration(360)} style={styles.section}>
          <Typography style={[styles.sectionTitle, { color: colors.text }]}>Account</Typography>
          <View
            style={[styles.glassCard, { backgroundColor: glassSurface, borderColor: glassBorder }]}
          >
            <SettingsRow
              icon={<Ionicons name="pause-circle-outline" size={18} color={colors.icon} />}
              label="Deactivate Account"
              subtitle="Temporarily disable — reactivate anytime"
              onPress={() => setDeactivateModalVisible(true)}
            />
            <View style={[styles.rowDivider, { backgroundColor: glassBorder }]} />
            <SettingsRow
              icon={<Ionicons name="document-text-outline" size={18} color={colors.icon} />}
              label="Account Deletion Policy"
              rightSlot={<Ionicons name="open-outline" size={16} color={colors.iconMuted} />}
              onPress={openPolicy}
            />
            <View style={[styles.rowDivider, { backgroundColor: glassBorder }]} />
            <SettingsRow
              icon={<Ionicons name="trash-outline" size={18} color={colors.error} />}
              label="Delete Account"
              labelColor={colors.error}
              subtitle="Permanently erase your account and data"
              onPress={() => setDeleteModalVisible(true)}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInUp.delay(200).duration(360)} style={styles.logoutWrap}>
          <Button
            label="Log Out"
            isLoading={logoutMutation.isPending}
            disabled={busy}
            onPress={() => setLogoutModalVisible(true)}
          />
        </Animated.View>
      </ScrollView>

      <CenterModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        title="Log out?"
      >
        <Typography
          style={[styles.modalBody, { color: colors.textSecondary }]}
          accessibilityRole="text"
        >
          You&apos;ll need to sign in again to access your account.
        </Typography>
        <View style={styles.modalActions}>
          <Button
            label="Cancel"
            variant="outline"
            onPress={() => setLogoutModalVisible(false)}
            style={styles.modalBtn}
          />
          <Button label="Log Out" onPress={confirmLogout} style={styles.modalBtn} />
        </View>
      </CenterModal>

      <CenterModal
        visible={deactivateModalVisible}
        onClose={() => setDeactivateModalVisible(false)}
        title="Deactivate account?"
      >
        <Typography
          style={[styles.modalBody, { color: colors.textSecondary }]}
          accessibilityRole="text"
        >
          Your account will be temporarily disabled and you&apos;ll be signed out. You can
          reactivate anytime by logging back in.
        </Typography>
        <View style={styles.modalActions}>
          <Button
            label="Cancel"
            variant="outline"
            onPress={() => setDeactivateModalVisible(false)}
            style={styles.modalBtn}
          />
          <Button
            label="Deactivate"
            onPress={confirmDeactivate}
            isLoading={deactivateMutation.isPending}
            style={styles.modalBtn}
          />
        </View>
      </CenterModal>

      <CenterModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        title="Delete account permanently?"
      >
        <Typography
          style={[styles.modalBody, { color: colors.textSecondary }]}
          accessibilityRole="text"
        >
          This permanently erases your account and all your data — bookings, subscriptions, sessions
          and notifications. This cannot be undone.
        </Typography>
        <Pressable onPress={openPolicy} hitSlop={6} style={styles.modalPolicyRow}>
          <Typography style={[styles.modalPolicyLink, { color: colors.primary }]}>
            Read the account deletion policy
          </Typography>
        </Pressable>
        <View style={styles.modalActions}>
          <Button
            label="Cancel"
            variant="outline"
            onPress={() => setDeleteModalVisible(false)}
            style={styles.modalBtn}
          />
          <Button label="Continue" onPress={askFinalDeleteConfirmation} style={styles.modalBtn} />
        </View>
      </CenterModal>

      <CenterModal
        visible={finalDeleteModalVisible}
        onClose={() => setFinalDeleteModalVisible(false)}
        title="Final confirmation"
      >
        <Typography
          style={[styles.modalBody, { color: colors.textSecondary }]}
          accessibilityRole="text"
        >
          Are you absolutely sure? Deleting your account is permanent and your data cannot be
          recovered.
        </Typography>
        <View style={styles.modalActions}>
          <Button
            label="Go Back"
            variant="outline"
            onPress={() => setFinalDeleteModalVisible(false)}
            style={styles.modalBtn}
          />
          <Button
            label="Delete Forever"
            onPress={confirmDelete}
            isLoading={deleteMutation.isPending}
            style={styles.modalBtn}
          />
        </View>
      </CenterModal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontFamily: fonts.bold,
    marginBottom: 10,
  },
  glassCard: {
    borderRadius: 16,
    borderWidth: 1,
    paddingHorizontal: 16,
    overflow: 'hidden',
  },
  rowDivider: {
    height: StyleSheet.hairlineWidth,
  },
  brandIcon: {
    width: 20,
    height: 20,
  },
  statusConnected: {
    fontSize: 12,
    fontFamily: fonts.semibold,
  },
  logoutWrap: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  modalBody: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 18,
  },
  modalPolicyRow: {
    alignItems: 'center',
  },
  modalPolicyLink: {
    fontSize: 12,
    fontFamily: fonts.semibold,
    textDecorationLine: 'underline',
  },
  modalActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  modalBtn: {
    flex: 1,
    minWidth: 120,
  },
});
