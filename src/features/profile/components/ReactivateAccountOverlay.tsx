import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import React from 'react';
import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { useLogout } from '@/features/auth/hooks/useLogout';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { Button, Typography } from '@/shared/components';
import { fonts, useTheme } from '@/shared/theme';

import { ACCOUNT_DELETION_POLICY_URL } from '../constants/policy';
import { useReactivateAccount } from '../hooks/useAccountActions';

/**
 * Full-screen prompt shown when the logged-in account is deactivated. Deactivated
 * users are blocked on every protected route, so this takes over the app until
 * they either reactivate or log out. Mounted from the authenticated layout and
 * driven by `auth.isDeactivated`.
 */
export function ReactivateAccountOverlay() {
  const isDeactivated = useAuthStore((s) => s.isDeactivated);
  const { colors, isDark } = useTheme();
  const reactivate = useReactivateAccount();
  const logout = useLogout();

  const glassSurface = isDark ? 'rgba(20,24,34,0.92)' : 'rgba(255,255,255,0.96)';
  const glassBorder = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.08)';

  const openPolicy = () => {
    WebBrowser.openBrowserAsync(ACCOUNT_DELETION_POLICY_URL).catch(() => undefined);
  };

  const busy = reactivate.isPending || logout.isPending;

  return (
    <Modal
      transparent
      visible={isDeactivated}
      animationType="fade"
      onRequestClose={() => undefined}
    >
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: glassSurface, borderColor: glassBorder }]}>
          <View style={[styles.iconCircle, { backgroundColor: colors.primarySubtle }]}>
            <Ionicons name="pause-circle-outline" size={30} color={colors.primary} />
          </View>

          <Typography style={[styles.title, { color: colors.text }]}>
            Your account is deactivated
          </Typography>
          <Typography style={[styles.body, { color: colors.textSecondary }]}>
            Your account is currently inactive, so you can&apos;t access FitCall. Reactivate to pick
            up right where you left off.
          </Typography>

          <Button
            label="Reactivate Account"
            onPress={() => reactivate.mutate()}
            isLoading={reactivate.isPending}
            disabled={busy}
            style={styles.primaryBtn}
          />

          <Pressable onPress={openPolicy} hitSlop={8} style={styles.policyRow}>
            <Ionicons name="document-text-outline" size={15} color={colors.primary} />
            <Typography style={[styles.policyText, { color: colors.primary }]}>
              Read our account deletion policy
            </Typography>
          </Pressable>

          <Pressable onPress={() => logout.mutate()} hitSlop={8} disabled={busy}>
            <Typography style={[styles.logout, { color: colors.textSecondary }]}>
              Log out instead
            </Typography>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 28,
    backgroundColor: 'rgba(0,0,0,0.62)',
  },
  card: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 20,
    borderWidth: 1,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  title: {
    fontSize: 17,
    fontFamily: fonts.bold,
    textAlign: 'center',
  },
  body: {
    fontSize: 13,
    fontFamily: fonts.regular,
    textAlign: 'center',
    lineHeight: 19,
  },
  primaryBtn: {
    width: '100%',
    marginTop: 6,
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  policyText: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    textDecorationLine: 'underline',
  },
  logout: {
    fontSize: 13,
    fontFamily: fonts.medium,
    marginTop: 4,
  },
});
