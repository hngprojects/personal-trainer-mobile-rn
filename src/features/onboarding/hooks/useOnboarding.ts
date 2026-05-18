import { SLIDES } from '../data/slides';
import { useOnboardingStore } from '../store/onboarding.store';

export function useOnboarding() {
  const completeOnboarding = useOnboardingStore((s) => s.completeOnboarding);
  const setPendingAuth = useOnboardingStore((s) => s.setPendingAuth);

  const goToLogin = () => {
    setPendingAuth('login');
    completeOnboarding();
  };

  const goToRegister = () => {
    setPendingAuth('register');
    completeOnboarding();
  };

  return {
    slides: SLIDES,
    goToLogin,
    goToRegister,
  };
}
