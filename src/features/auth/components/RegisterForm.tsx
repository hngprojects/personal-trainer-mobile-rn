import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { Image, Pressable, StyleSheet, View } from 'react-native';

import { Button, FormField, OrDivider, SocialButton, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { useRegister } from '../hooks/useRegister';
import { registerSchema, RegisterFormData } from '../schemas/auth.schemas';

const APPLE_ICON = require('../../../../assets/images/apple.png');
const GOOGLE_ICON = require('../../../../assets/images/google.png');

export function RegisterForm() {
  const { spacing } = useTheme();
  const { mutate: register, isPending, error } = useRegister();

  const { control, handleSubmit } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterFormData) => register(data);

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <SocialButton
        icon={<Image source={APPLE_ICON} style={styles.socialIcon} resizeMode="contain" />}
        label="Sign Up with Apple"
        onPress={() => {}}
      />
      <SocialButton
        icon={<Image source={GOOGLE_ICON} style={styles.socialIcon} resizeMode="contain" />}
        label="Sign Up with Google"
        onPress={() => {}}
      />

      <View style={{ marginVertical: spacing.xs }}>
        <OrDivider />
      </View>

      <FormField
        control={control}
        name="name"
        label="Name"
        required
        placeholder="Enter your name"
      />
      <FormField
        control={control}
        name="email"
        label="Enter email address"
        required
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="Enter your email address"
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        required
        secureTextEntry
        textContentType="newPassword"
        placeholder="Enter your password"
      />

      {error && (
        <Typography style={styles.apiError}>
          {error.message}
        </Typography>
      )}

      <Button
        label="Sign up"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        style={{ marginTop: spacing.sm }}
      />

      <View style={[styles.footer, { marginTop: spacing.xs }]}>
        <Typography style={styles.footerText}>Already have an account? </Typography>
        <Pressable onPress={() => router.replace('/(auth)/login')}>
          <Typography style={styles.link}>Log in</Typography>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
  socialIcon: { width: 20, height: 20 },
  apiError: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.highlightRed['5'],
    textAlign: 'center',
  },
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
