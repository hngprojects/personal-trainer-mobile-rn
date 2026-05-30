import { TextStyle } from 'react-native';

import { fonts } from './fonts';

export const typography = {
  h1: { fontFamily: fonts.bold, fontSize: 32, lineHeight: 40 } satisfies TextStyle,
  h2: { fontFamily: fonts.bold, fontSize: 24, lineHeight: 32 } satisfies TextStyle,
  h3: { fontFamily: fonts.semibold, fontSize: 20, lineHeight: 28 } satisfies TextStyle,
  body1: { fontFamily: fonts.regular, fontSize: 16, lineHeight: 24 } satisfies TextStyle,
  body2: { fontFamily: fonts.regular, fontSize: 14, lineHeight: 20 } satisfies TextStyle,
  label: { fontFamily: fonts.medium, fontSize: 12, lineHeight: 16 } satisfies TextStyle,
} as const;

export type TypographyVariant = keyof typeof typography;
