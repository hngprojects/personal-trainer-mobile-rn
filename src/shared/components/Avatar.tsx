import React from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, View } from 'react-native';

import { fonts, palette, useTheme } from '@/shared/theme';

import { Typography } from './Typography';

interface AvatarProps {
  /** User's full name — used for the initials fallback when no `uri` is set. */
  name?: string | null;
  /** Remote / local image URI. Falls back to initials when null/undefined. */
  uri?: string | null;
  /** Diameter in px. Default 64. */
  size?: number;
  /** Shows a dimmed overlay + spinner while an upload is in flight. */
  loading?: boolean;
  /** Optional icon rendered in a small circular badge on the bottom-right. */
  badgeIcon?: React.ReactNode;
  onPress?: () => void;
  onBadgePress?: () => void;
  accessibilityLabel?: string;
}

function getInitials(name?: string | null): string {
  const trimmed = name?.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  if (parts.length === 1) return parts[0]!.slice(0, 1).toUpperCase();
  const first = parts[0]![0] ?? '';
  const last = parts[parts.length - 1]![0] ?? '';
  return (first + last).toUpperCase();
}

export function Avatar({
  name,
  uri,
  size = 64,
  loading = false,
  badgeIcon,
  onPress,
  onBadgePress,
  accessibilityLabel,
}: AvatarProps) {
  const { colors } = useTheme();
  const radius = size / 2;
  const badgeSize = Math.max(18, Math.round(size * 0.28));
  const badgeOffset = -Math.round(badgeSize * 0.1);

  const fallbackBg = colors.primary;
  const hasImage = !!uri;

  const imageContent = (
    <>
      {hasImage ? (
        <Image source={{ uri }} style={{ width: size, height: size, borderRadius: radius }} />
      ) : (
        <View
          style={[
            styles.fallback,
            { width: size, height: size, borderRadius: radius, backgroundColor: fallbackBg },
          ]}
        >
          <Typography style={[styles.initials, { fontSize: Math.round(size * 0.4) }]}>
            {getInitials(name)}
          </Typography>
        </View>
      )}

      {loading ? (
        <View style={[styles.overlay, { width: size, height: size, borderRadius: radius }]}>
          <ActivityIndicator color="#FFFFFF" />
        </View>
      ) : null}
    </>
  );

  const badgeStyle = [
    styles.badge,
    {
      width: badgeSize,
      height: badgeSize,
      borderRadius: badgeSize / 2,
      right: badgeOffset,
      bottom: badgeOffset,
      borderColor: colors.background,
    },
  ];

  const badge = badgeIcon ? (
    onBadgePress ? (
      <Pressable
        onPress={onBadgePress}
        disabled={loading}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Edit profile picture"
        style={badgeStyle}
      >
        {badgeIcon}
      </Pressable>
    ) : (
      <View style={badgeStyle}>{badgeIcon}</View>
    )
  ) : null;

  const inner = (
    <View style={{ width: size, height: size }}>
      {onPress ? (
        <Pressable
          onPress={onPress}
          disabled={loading}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel ?? 'Profile picture'}
        >
          {imageContent}
        </Pressable>
      ) : (
        imageContent
      )}
      {badge}
    </View>
  );

  return inner;
}

const styles = StyleSheet.create({
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    color: '#FFFFFF',
    fontFamily: fonts.semibold,
    letterSpacing: 0.5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    backgroundColor: palette.highlightBlue['5'],
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
});
