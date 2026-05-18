import { useMemo } from 'react';
import { StyleSheet } from 'react-native';

import { fonts, palette, useTheme } from '@/shared/theme';

export const HERO_GRADIENT: readonly [string, string, string] = [
  '#1B3F75',
  '#0F2E5C',
  '#081F40',
] as const;

export function useHomeStyles() {
  const { colors } = useTheme();

  return useMemo(
    () =>
      StyleSheet.create({
        body: {
          paddingBottom: 24,
        },
        loadingContainer: {
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
        },
        loadingLogo: {
          width: 72,
          height: 72,
          resizeMode: 'contain',
        },
        refreshVeil: {
          ...StyleSheet.absoluteFillObject,
          zIndex: 8,
          backgroundColor: colors.background,
        },
        refreshLogoLayer: {
          position: 'absolute',
          top: 28,
          left: 0,
          right: 0,
          zIndex: 10,
          alignItems: 'center',
        },
        refreshLogo: {
          width: 42,
          height: 42,
          resizeMode: 'contain',
        },
        header: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        headerLeft: {
          flexDirection: 'row',
          alignItems: 'center',
        },
        avatar: {
          width: 40,
          height: 40,
          borderRadius: 20,
        },
        greeting: {
          fontSize: 16,
          fontFamily: fonts.semibold,
          color: colors.text,
        },
        userName: {
          fontSize: 13,
          fontFamily: fonts.regular,
          color: colors.textSecondary,
          marginTop: 2,
        },
        bellButton: {
          width: 40,
          height: 40,
          alignItems: 'center',
          justifyContent: 'center',
        },

        // Hero — always dark gradient, white text in both themes
        heroCard: {
          borderRadius: 18,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
          minHeight: 170,
          overflow: 'hidden',
        },
        heroLeft: {
          flex: 1,
          paddingRight: 8,
        },
        heroTitle: {
          fontSize: 19,
          fontFamily: fonts.bold,
          color: '#FFFFFF',
          lineHeight: 26,
        },
        heroText: {
          fontSize: 12,
          fontFamily: fonts.regular,
          color: 'rgba(255,255,255,0.78)',
          lineHeight: 18,
          marginTop: 8,
        },
        heroImage: {
          width: 150,
          height: 175,
          marginRight: -12,
          marginVertical: -10,
          resizeMode: 'contain',
        },

        sectionTitle: {
          fontSize: 16,
          fontFamily: fonts.semibold,
          color: colors.text,
          marginBottom: 12,
        },
        categories: {
          flexDirection: 'row',
          justifyContent: 'space-between',
        },
        categoryItem: {
          alignItems: 'center',
          gap: 6,
        },
        categoryCircle: {
          width: 56,
          height: 56,
          borderRadius: 28,
          padding: 3,
          backgroundColor: colors.surfaceMuted,
          borderWidth: 1,
          borderColor: 'transparent',
          overflow: 'hidden',
        },
        categoryCircleSelected: {
          borderColor: palette.highlightBlue['5'],
          backgroundColor: palette.highlightBlue['1'],
        },
        categoryImage: {
          width: '100%',
          height: '100%',
          borderRadius: 25,
          resizeMode: 'cover',
        },
        categoryText: {
          fontSize: 11,
          fontFamily: fonts.regular,
          color: colors.textSecondary,
        },
        categoryTextSelected: {
          fontFamily: fonts.semibold,
          color: palette.highlightBlue['5'],
        },
        trainersGrid: {
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: 12,
          paddingBottom: 24,
        },
        emptyTrainers: {
          width: '100%',
          minHeight: 120,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 24,
        },
        emptyTrainersText: {
          fontSize: 13,
          fontFamily: fonts.regular,
          color: colors.textSecondary,
          textAlign: 'center',
        },
        trainerCard: {
          width: '48%',
          backgroundColor: colors.background,
          borderRadius: 14,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: colors.divider,
        },
        trainerImage: {
          width: '100%',
          height: 130,
        },
        trainerBody: {
          gap: 6,
        },
        trainerNameRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        },
        trainerName: {
          fontSize: 13,
          fontFamily: fonts.semibold,
          color: colors.text,
          flex: 1,
        },
        trainerRating: {
          fontSize: 12,
          fontFamily: fonts.semibold,
          color: palette.gold['5'],
          marginLeft: 6,
        },
      }),
    [colors],
  );
}
