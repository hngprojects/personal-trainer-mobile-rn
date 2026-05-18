import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { SharedValue } from 'react-native-reanimated';

import { useAuthStore } from '@/features/auth';
import { TextInput } from '@/shared/components';

import { useProfileSetupStore } from '../../store/profile-setup.store';
import type { Gender } from '../../types/profile-setup.types';
import { GenderDropdown } from '../GenderDropdown';
import { StepShell } from '../StepShell';

interface BasicInfoStepProps {
  index: number;
  scrollX: SharedValue<number>;
  slideWidth: number;
}

export function BasicInfoStep({ index, scrollX, slideWidth }: BasicInfoStepProps) {
  const authUser = useAuthStore((s) => s.user);
  const draftName = useProfileSetupStore((s) => s.draft.name);
  const draftGender = useProfileSetupStore((s) => s.draft.gender);
  const patchDraft = useProfileSetupStore((s) => s.patchDraft);
  const setGender = useProfileSetupStore((s) => s.setGender);

  // Seed the draft with the auth user's name on mount so the Continue button
  // reflects validity immediately — without this the user has to retype the
  // prefilled name for the screen-level validation to flip to true.
  useEffect(() => {
    if (!draftName && authUser?.name) {
      patchDraft({ name: authUser.name });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleNameChange = (next: string) => {
    patchDraft({ name: next });
  };

  const handleGenderChange = (next: Gender) => {
    setGender(next);
  };

  return (
    <StepShell index={index} scrollX={scrollX} slideWidth={slideWidth} keyboardAware>
      <View style={styles.form}>
        <TextInput
          label="What name would you like us to call you?"
          placeholder="Esiraku Dorathy"
          autoCapitalize="words"
          value={draftName}
          onChangeText={handleNameChange}
          returnKeyType="next"
        />
        <GenderDropdown value={draftGender} onChange={handleGenderChange} />
      </View>
    </StepShell>
  );
}

const styles = StyleSheet.create({
  form: { gap: 16 },
});
