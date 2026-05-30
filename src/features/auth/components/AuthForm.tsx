import {
  GoogleSignin,
  isErrorWithCode,
  isSuccessResponse,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import { router } from 'expo-router';
import React, { useState } from 'react';
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
};

function friendlyApiMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return MESSAGES.apiUnauthorized;
    if (error.status === 503) return MESSAGES.apiUnavailable;
    if (error.status >= 500) return MESSAGES.apiServerError;
  }
  return MESSAGES.apiGeneric;
}

const GOOGLE_ICON = require('../../../../assets/images/google.png');

type AuthFormVariant = 'signup' | 'signin';

interface AuthFormProps {
  variant: AuthFormVariant;
  /**
   * When true, render text against a dark/photo backdrop — overrides the
   * theme's `textSecondary` with a high-contrast off-white so the "already
   * have an account" prompt stays readable on the auth-bg image.
   */
  onDark?: boolean;
}

export function AuthForm({ variant, onDark }: AuthFormProps) {
  const { spacing, colors } = useTheme();
  const secondaryColor = onDark ? 'rgba(255,255,255,0.78)' : colors.textSecondary;
  const linkColor = onDark ? '#FFFFFF' : palette.highlightBlue['5'];
  const googleAuth = useGoogleAuth();
  const [isGoogleFlowPending, setIsGoogleFlowPending] = useState(false);

  const verb = variant === 'signup' ? 'Sign Up' : 'Sign In';
  const footerText = variant === 'signup' ? 'Already have an account? ' : "Don't have an account? ";
  const footerLinkLabel = variant === 'signup' ? 'Log in' : 'Sign up';
  const footerHref = variant === 'signup' ? '/(auth)/login' : '/(auth)/register';

  const handleGoogle = async () => {
    if (isGoogleFlowPending || googleAuth.isPending) return;

    setIsGoogleFlowPending(true);
    try {
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      await GoogleSignin.signOut().catch(() => undefined);
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return;
      const idToken = response.data.idToken;
      if (!idToken) {
        toast.error(MESSAGES.noIdToken);
        return;
      }
      googleAuth.mutate(idToken, {
        onError: (error) => {
          toast.error(friendlyApiMessage(error));
        },
      });
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === statusCodes.SIGN_IN_CANCELLED) {
          return;
        }
        if (error.code === statusCodes.IN_PROGRESS) {
          toast.info('Google sign-in is already open. Please finish or try again.');
          return;
        }
        if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
          toast.error(MESSAGES.playServicesMissing);
          return;
        }
      }
      toast.error(MESSAGES.googleGeneric);
    } finally {
      setIsGoogleFlowPending(false);
    }
  };

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <SocialButton
        icon={<Image source={GOOGLE_ICON} style={styles.icon} resizeMode="contain" />}
        label={`${verb} with Google`}
        onPress={handleGoogle}
        disabled={googleAuth.isPending || isGoogleFlowPending}
      />

      <View style={[styles.footer, { marginTop: spacing.md }]}>
        <Typography style={[styles.footerText, { color: secondaryColor }]}>{footerText}</Typography>
        <Pressable onPress={() => router.replace(footerHref)}>
          <Typography style={[styles.link, { color: linkColor }]}>{footerLinkLabel}</Typography>
        </Pressable>
      </View>
    </View>
  );
}

export function AuthLegalNotice({ variant, onDark }: AuthFormProps) {
  const { colors } = useTheme();
  const verb = variant === 'signup' ? 'Sign Up' : 'Sign In';
  const bodyColor = onDark ? 'rgba(255,255,255,0.72)' : colors.textSecondary;
  const linkColor = onDark ? '#FFFFFF' : palette.highlightBlue['5'];

  return (
    <Typography style={[styles.legalText, { color: bodyColor }]}>
      By clicking &quot;{verb}&quot;, I have read and agree with the{' '}
      <Typography
        style={[styles.legalLink, { color: linkColor }]}
        onPress={() => router.push('/terms-of-service')}
      >
        Terms of Service
      </Typography>{' '}
      and{' '}
      <Typography
        style={[styles.legalLink, { color: linkColor }]}
        onPress={() => router.push('/privacy-policy')}
      >
        Privacy Policy
      </Typography>
    </Typography>
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
  },
  link: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: palette.highlightBlue['5'],
  },
  legalText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: 4,
  },
  legalLink: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    lineHeight: 20,
    color: palette.highlightBlue['5'],
  },
});
