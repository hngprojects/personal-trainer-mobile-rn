import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import React from 'react';
import { useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';

import { Button, FormField, Typography } from '@/shared/components';
import { useTheme } from '@/shared/theme';

import { useLogin } from '../hooks/useLogin';
import { LoginFormData, loginSchema } from '../schemas/auth.schemas';

export function LoginForm() {
  const { spacing } = useTheme();
  const { mutate: login, isPending, error } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (data: LoginFormData) => login(data);

  return (
    <View style={[styles.container, { gap: spacing.md }]}>
      <FormField
        control={control}
        name="email"
        label="Email"
        keyboardType="email-address"
        textContentType="emailAddress"
        placeholder="jeffery@logickoder.dev"
      />
      <FormField
        control={control}
        name="password"
        label="Password"
        secureTextEntry
        textContentType="password"
        placeholder="••••••••"
      />

      {error && (
        <Typography variant="body2" color="red" align="center">
          {error.message}
        </Typography>
      )}

      <Button
        label="Sign In"
        onPress={handleSubmit(onSubmit)}
        isLoading={isPending}
        style={{ marginTop: spacing.xs }}
      />

      <Button
        label="Create an account"
        variant="ghost"
        onPress={() => router.push('/(auth)/register')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { width: '100%' },
});
