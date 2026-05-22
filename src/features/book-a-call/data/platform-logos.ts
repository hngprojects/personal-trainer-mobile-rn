import type { ImageSourcePropType } from 'react-native';

export type PlatformLogoKey = 'zoom';

export const PLATFORM_LOGOS: Record<PlatformLogoKey, ImageSourcePropType> = {
  zoom: require('../../../../assets/images/book-a-call/zoom.png'),
};
