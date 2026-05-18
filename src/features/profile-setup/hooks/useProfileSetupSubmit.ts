import { router } from 'expo-router';

import { toApiFitnessGoals, toApiFitnessLevel } from '@/features/profile/api/profile.types';
import { useUpdateProfile } from '@/features/profile/hooks/useUpdateProfile';
import { toast } from '@/shared/components';

import { useProfileSetupStore } from '../store/profile-setup.store';

export function useProfileSetupSubmit() {
  const draft = useProfileSetupStore((s) => s.draft);
  const reset = useProfileSetupStore((s) => s.reset);
  const updateProfile = useUpdateProfile();

  const submit = () => {
    const payload = {
      name: draft.name.trim(),
      ...(draft.gender ? { gender: draft.gender } : {}),
      ...(draft.goals.length ? { fitness_goals: toApiFitnessGoals(draft.goals) } : {}),
      ...(draft.fitnessLevel ? { fitness_level: toApiFitnessLevel(draft.fitnessLevel) } : {}),
    };

    updateProfile.mutate(payload, {
      onSuccess: () => {
        reset();
        router.replace('/');
      },
      onError: () => {
        toast.error("We couldn't save your profile. Please try again.");
      },
    });
  };

  return {
    submit,
    isSubmitting: updateProfile.isPending,
  };
}
