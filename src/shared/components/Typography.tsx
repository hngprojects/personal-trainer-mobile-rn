import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from '@/shared/theme';
import { TypographyVariant } from '@/shared/theme/typography';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

// Per-variant font-scale caps, tighter than the global 1.5x ceiling set in
// src/shared/setup/textScaling.ts. Headings live in fixed-width hero cards
// and titles where overflow is the most visually obvious, so we keep them
// noticeably tighter. Body/label fall back to the global cap.
const VARIANT_MAX_FONT_SCALE: Partial<Record<TypographyVariant, number>> = {
  h1: 1.3,
  h2: 1.3,
  h3: 1.4,
};

export function Typography({ variant = 'body1', color, align, style, ...props }: TypographyProps) {
  const { colors, typography } = useTheme();
  const variantCap = VARIANT_MAX_FONT_SCALE[variant];

  return (
    <Text
      maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? variantCap}
      style={[typography[variant], { color: color ?? colors.text, textAlign: align }, style]}
      {...props}
    />
  );
}
