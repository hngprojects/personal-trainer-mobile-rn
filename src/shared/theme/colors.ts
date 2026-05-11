export const palette = {
  anchor: '#2D3A2E',

  brown: {
    '0.5': '#EDF5EE',
    '1': '#FDDEC8',
    '2': '#F9B98E',
    '3': '#F29056',
    '4': '#DC6B28',
    '5': '#A84200',
    '6': '#622900',
    '7': '#4A1E00',
    '8': '#311400',
    '9': '#0A0E0A',
  },

  orange: {
    '0.5': '#FEF2EC',
    '1': '#FDDCCC',
    '2': '#FAB99A',
    '3': '#F49370',
    '4': '#F07040',
    '5': '#E8622A',
    '6': '#C44B1A',
    '7': '#9C3710',
    '8': '#6E2208',
    '9': '#3E1103',
  },

  gold: {
    '0.5': '#FEF9EC',
    '1': '#FDEECA',
    '2': '#FAD98A',
    '3': '#F7C24A',
    '4': '#F5A623',
    '5': '#D48A0C',
    '6': '#A86908',
    '7': '#9C3710',
    '8': '#503003',
    '9': '#2A1801',
  },

  neutral: {
    '0.5': '#F8F7F5',
    '1': '#EDECEA',
    '2': '#D8D6D2',
    '3': '#BCBAB5',
    '4': '#9E9B96',
    '5': '#7E7C78',
    '6': '#5E5C59',
    '7': '#3D3C3A',
    '8': '#252422',
    '9': '#131210',
  },

  success: {
    '0.5': '#EAF7EC',
    '1': '#C8EACC',
    '2': '#96D69E',
    '3': '#5DBF69',
    '4': '#2EA83A',
    '5': '#1E7829',
    '6': '#14561C',
    '7': '#0C3A12',
    '8': '#072209',
    '9': '#030E04',
  },

  highlightBlue: {
    '0.5': '#EDF4FD',
    '1': '#CCE2FA',
    '2': '#96C5F5',
    '3': '#5EA3EE',
    '4': '#60A5FA',
    '5': '#1861B8',
    '6': '#0F4690',
    '7': '#082F68',
    '8': '#1E40AF',
    '9': '#020D20',
  },

  highlightRed: {
    '0.5': '#FEF0EF',
    '1': '#FDD8D7',
    '2': '#F9AEAC',
    '3': '#FCA5A5',
    '4': '#F87171',
    '5': '#EF4444',
    '6': '#DC2626',
    '7': '#B91C1C',
    '8': '#7F1D1D',
    '9': '#220403',
  },
} as const;

// FitCall brand navy — established by the onboarding screen design
const BRAND = {
  base: '#0F2E5C',
  pressed: '#06203F',
  subtle: '#E8EEF8',
};

export const lightColors = {
  background: palette.neutral['0.5'],
  surface: '#FFFFFF',
  primary: BRAND.base,
  primaryPressed: BRAND.pressed,
  primarySubtle: BRAND.subtle,
  text: palette.neutral['9'],
  textSecondary: palette.neutral['5'],
  border: palette.neutral['2'],
  inputBackground: '#FFFFFF',
  error: palette.highlightRed['5'],
  success: palette.success['5'],
  warning: palette.gold['5'],
  tabBar: '#FFFFFF',
  tabBarActive: BRAND.base,
  tabBarInactive: palette.neutral['5'],
};

export type Colors = Record<keyof typeof lightColors, string>;

export const darkColors: Colors = {
  background: palette.neutral['9'],
  surface: palette.neutral['8'],
  primary: BRAND.base,
  primaryPressed: BRAND.pressed,
  primarySubtle: palette.neutral['7'],
  text: palette.neutral['0.5'],
  textSecondary: palette.neutral['4'],
  border: palette.neutral['7'],
  inputBackground: palette.neutral['8'],
  error: palette.highlightRed['4'],
  success: palette.success['4'],
  warning: palette.gold['4'],
  tabBar: palette.neutral['8'],
  tabBarActive: BRAND.base,
  tabBarInactive: palette.neutral['5'],
};
