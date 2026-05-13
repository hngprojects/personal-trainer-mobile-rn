import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { useAuthStore } from '@/features/auth';
import { TextInput } from '@/shared/components';
import { palette } from '@/shared/theme';

import { useProfileSetupStore } from '../../store/profile-setup.store';
import { StepShell } from '../StepShell';

interface BasicInfoStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

export function BasicInfoStep({ index, scrollX, slideWidth }: BasicInfoStepProps) {
  const authUser = useAuthStore((s) => s.user);
  const draftName = useProfileSetupStore((s) => s.draft.name);
  const patchDraft = useProfileSetupStore((s) => s.patchDraft);

  const email = authUser?.email ?? '';
  const [name, setName] = useState(draftName || authUser?.name || '');

  // Seed the store with the locked email + initial name so the screen-level
  // Continue button can validate against the draft.
  useEffect(() => {
    patchDraft({ email, name: name.trim() });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  const handleNameChange = (next: string) => {
    setName(next);
    patchDraft({ name: next.trim() });
  };

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth} keyboardAware>
      <View style={styles.form}>
        <TextInput
          label="Full Name"
          required
          placeholder="John Doe"
          autoCapitalize="words"
          value={name}
          onChangeText={handleNameChange}
          returnKeyType="next"
        />
        <TextInput
          label="Email"
          required
          value={email}
          editable={false}
          selectTextOnFocus={false}
          style={styles.lockedInput}
        />
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
  lockedInput: { color: palette.neutral['5'] },
});
