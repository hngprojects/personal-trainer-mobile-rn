import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { env } from '@/shared/constants/env';

export function configureGoogleSignin() {
  GoogleSignin.configure({
    webClientId: env.GOOGLE_WEB_CLIENT_ID,
    iosClientId: env.GOOGLE_IOS_CLIENT_ID || undefined,
  });
}
