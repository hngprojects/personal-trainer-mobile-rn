import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable, StyleSheet, View } from 'react-native';

import { Button, Typography } from '@/shared/components';
import { fonts, palette, useTheme } from '@/shared/theme';

import { AuthResponse } from '../api/auth.types';
import { useResendOtp } from '../hooks/useResendOtp';
import { useVerifyOtp } from '../hooks/useVerifyOtp';
import { otpSchema, OtpFormData } from '../schemas/auth.schemas';
import { OtpInput } from './OtpInput';

const RESEND_COOLDOWN = 30;

interface OtpFormProps {
  email: string;
  onVerified: (response: AuthResponse) => void;
}

export function OtpForm({ email, onVerified }: OtpFormProps) {
  const { spacing } = useTheme();
  const verify = useVerifyOtp();
  const resend = useResendOtp();
  const [secondsLeft, setSecondsLeft] = useState(RESEND_COOLDOWN);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const id = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(id);
  }, [secondsLeft]);

  const { control, handleSubmit } = useForm<OtpFormData>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const onSubmit = (data: OtpFormData) => {
    verify.mutate(
      { email, otp: data.otp },
      { onSuccess: (response) => onVerified(response) },
    );
  };

  const handleResend = () => {
    if (secondsLeft > 0) return;
    resend.mutate({ email });
    setSecondsLeft(RESEND_COOLDOWN);
  };

  return (
    <View style={{ gap: spacing.lg }}>
      <Controller
        control={control}
        name="otp"
        render={({ field, fieldState: { error } }) => (
          <OtpInput value={field.value} onChange={field.onChange} error={error?.message} />
        )}
      />

      <View style={styles.resendRow}>
        <Typography style={styles.resendText}>Did not receive any OTP? </Typography>
        {secondsLeft > 0 ? (
          <Typography style={styles.resendCountdown}>Resend in {secondsLeft}sec</Typography>
        ) : (
          <Pressable onPress={handleResend} disabled={resend.isPending}>
            <Typography style={styles.resendLink}>Resend</Typography>
          </Pressable>
        )}
      </View>

      {verify.error && (
        <Typography style={styles.apiError}>{verify.error.message}</Typography>
      )}

      <Button label="Verify" onPress={handleSubmit(onSubmit)} isLoading={verify.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resendText: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.neutral['7'],
  },
  resendCountdown: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: palette.highlightRed['5'],
  },
  resendLink: {
    fontSize: 13,
    fontFamily: fonts.semibold,
    color: palette.highlightRed['5'],
  },
  apiError: {
    fontSize: 13,
    fontFamily: fonts.regular,
    color: palette.highlightRed['5'],
    textAlign: 'center',
  },
});
