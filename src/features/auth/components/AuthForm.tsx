import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { ApiError } from '@/shared/api/types';
import { SocialButton, toast, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useGoogleAuth } from '../hooks/useGoogleAuth';

const MESSAGES = {
  noIdToken: "We couldn't get a sign-in token from Google. Please try again.",
  playServicesMissing: 'Google Play Services is unavailable on this device.',
  googleGeneric: "Google sign-in didn't work. Please try again.",
  apiUnauthorized: "We couldn't verify your Google account. Please try again.",
  apiUnavailable: 'Sign-in is temporarily unavailable. Please try again in a few minutes.',
  apiServerError: "Something went wrong on our end. We're on it — please try again shortly.",
  apiGeneric: "We couldn't sign you in. Please try again.",
  appleStub: 'Apple sign-in is coming soon.',
};

function friendlyApiMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return MESSAGES.apiUnauthorized;
    if (error.status === 503) return MESSAGES.apiUnavailable;
    if (error.status >= 500) return MESSAGES.apiServerError;
  }
  return MESSAGES.apiGeneric;
}

const APPLE_ICON = require('../../../../assets/images/apple.png');
const GOOGLE_ICON = require('../../../../assets/images/google.png');

type AuthFormVariant = 'signup' | 'signin';

interface AuthFormProps {
  variant: AuthFormVariant;
}

export function AuthForm({ variant }: AuthFormProps) {
  const { spacing } = useTheme();
  const googleAuth = useGoogleAuth();

  const verb = variant === 'signup' ? 'Sign Up' : 'Sign In';
  const footerText = variant === 'signup' ? 'Already have an account? ' : "Don't have an account? ";
  const footerLinkLabel = variant === 'signup' ? 'Log in' : 'Sign up';
  const footerHref = variant === 'signup' ? '/(auth)/login' : '/(auth)/register';

  const handleGoogle = async () => {
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;
      const idToken = response.data.idToken;
      if (!idToken) {
        toast.error(MESSAGES.noIdToken);
        return;
      }
      googleAuth.mutate(idToken, {
        onError: (error) => toast.error(friendlyApiMessage(error)),
      });
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (
          error.code === statusCodes.SIGN_IN_CANCELLED ||
          error.code === statusCodes.IN_PROGRESS
        ) {
          return;
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          toast.error(MESSAGES.playServicesMissing);
          return;
        }
      }
      toast.error(MESSAGES.googleGeneric);
    }
  };

  // TODO: replace with expo-apple-authentication once the Apple flow is ready.
  const handleApple = () => {
    toast.info(MESSAGES.appleStub);
  };

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <SocialButton
        icon={<Image source={APPLE_ICON} style={styles.icon} resizeMode="contain" />}
        label={`${verb} with Apple`}
        onPress={handleApple}
      />
      <SocialButton
        icon={<Image source={GOOGLE_ICON} style={styles.icon} resizeMode="contain" />}
        label={`${verb} with Google`}
        onPress={handleGoogle}
        disabled={googleAuth.isPending}
      />

      <View style={[styles.footer, { marginTop: spacing.md }]}>
        <Typography style={styles.footerText}>{footerText}</Typography>
        <Pressable onPress={() => router.replace(footerHref)}>
          <Typography style={styles.link}>{footerLinkLabel}</Typography>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  icon: { width: 20, height: 20 },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.neutral['7'],
  },
  link: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: palette.highlightBlue['5'],
  },
});
