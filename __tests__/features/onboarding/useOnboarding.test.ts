import { act, renderHook } from '@testing-library/react-native';

import { SLIDES } from '@/features/onboarding/data/slides';
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding';
import { useOnboardingStore } from '@/features/onboarding/store/onboarding.store';

beforeEach(() => {
  useOnboardingStore.setState({ hasCompleted: false, isLoading: true, pendingAuth: 'login' });
});

describe('useOnboarding', () => {
  it('exposes all slides', () => {
    const { result } = renderHook(() => useOnboarding());
    expect(result.current.slides).toHaveLength(SLIDES.length);
  });

  it('goToLogin marks onboarding complete with pendingAuth = login', async () => {
    const { result } = renderHook(() => useOnboarding());
    await act(async () => {
      result.current.goToLogin();
    });
    const state = useOnboardingStore.getState();
    expect(state.hasCompleted).toBe(true);
    expect(state.pendingAuth).toBe('login');
  });

  it('goToRegister marks onboarding complete with pendingAuth = register', async () => {
    const { result } = renderHook(() => useOnboarding());
    await act(async () => {
      result.current.goToRegister();
    });
    const state = useOnboardingStore.getState();
    expect(state.hasCompleted).toBe(true);
    expect(state.pendingAuth).toBe('register');
  });
});
