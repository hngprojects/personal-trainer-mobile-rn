import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/shared/components';
import { palette, useTheme } from '@/shared/theme';

export function SuccessView() {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: colors.surface, paddingHorizontal: spacing.lg }]}
    >
      <View style={styles.inner}>
        {/* Glow ring + checkmark */}
        <View style={[styles.glowRing, { backgroundColor: palette.success['0.5'] }]}>
          <View style={[styles.iconCircle, { backgroundColor: palette.success['4'] }]}>
            <Ionicons name="checkmark" size={36} color="#fff" />
          </View>
        </View>

        <Typography variant="h2" align="center" style={styles.title}>
          Request Submitted!
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} align="center" style={styles.body}>
          We&apos;ve received your call request. An agent will reach out to you at your preferred
          time.
        </Typography>
        <Typography variant="body2" color={colors.textSecondary} align="center" style={styles.body}>
          A confirmation link has been sent to your email address.
        </Typography>
      </View>

      <View style={[styles.footer, { paddingBottom: spacing.lg }]}>
        <Button label="Back to Home" onPress={() => router.replace('/(main)/(tabs)' as never)} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  glowRing: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: { fontWeight: '700' },
  body: { lineHeight: 22, paddingHorizontal: 8 },
  footer: { paddingTop: 12 },
});
