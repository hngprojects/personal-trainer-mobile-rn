import { router } from 'expo-router';

import { useProfileSetupStore } from '../store/profile-setup.store';

// Local-only for now — no backend endpoint yet. Once the profile-update API
// lands, swap this for a useApiMutation that PATCHes the draft, then call
// useAuthStore.updateUser({ profileComplete: true }) on success.
export function useProfileSetupSubmit() {
  const reset = useProfileSetupStore((s) => s.reset);

  const submit = () => {
    reset();
    router.replace('/');
  };

  return {
    submit,
    isSubmitting: false,
  };
}
