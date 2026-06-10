import React from 'react';
import { Text, TextProps, TextStyle } from 'react-native';

import { useTheme } from '@/shared/theme';
import { TypographyVariant } from '@/shared/theme/typography';

interface TypographyProps extends TextProps {
  variant?: TypographyVariant;
  color?: string;
  align?: TextStyle['textAlign'];
}

// Headings get a font-scale cap so the largest system text setting doesn't break
// chip rows and card titles. Body / label remain uncapped so users who need
// scaled body text still get it.
const HEADING_MAX_FONT_SCALE: Partial<Record<TypographyVariant, number>> = {
  h1: 1.6,
  h2: 1.6,
  h3: 1.8,
};

export function Typography({ variant = 'body1', color, align, style, ...props }: TypographyProps) {
  const { colors, typography } = useTheme();
  const maxScale = HEADING_MAX_FONT_SCALE[variant];

  return (
    <Text
      maxFontSizeMultiplier={props.maxFontSizeMultiplier ?? maxScale}
      style={[typography[variant], { color: color ?? colors.text, textAlign: align }, style]}
      {...props}
    />
  );
}
