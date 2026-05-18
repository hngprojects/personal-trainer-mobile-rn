import type { ImageSourcePropType } from 'react-native';

import type { CallPlatform } from '../types/book-a-call.types';

// Remote app icons from Wikimedia Commons. The request-call cards need the
// recognizable product icons, not full wordmarks or company domain logos.
export const PLATFORM_LOGOS: Record<CallPlatform, ImageSourcePropType> = {
  zoom: { uri: 'https://commons.wikimedia.org/wiki/Special:FilePath/Zoom-icon.png?width=120' },
  'google-meet': {
    uri: 'https://commons.wikimedia.org/wiki/Special:FilePath/Google_Meet.png?width=120',
  },
};
