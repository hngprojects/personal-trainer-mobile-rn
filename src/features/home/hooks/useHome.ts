import { useAuthStore } from '@/features/auth/store/auth.store';

export function useHome() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const logout = () => clearSession();

  return { user, logout };
}
