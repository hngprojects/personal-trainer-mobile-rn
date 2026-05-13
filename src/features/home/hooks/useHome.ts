import { useAuthStore } from '@/features/auth/store/auth.store';

export function useHome() {
  const user = useAuthStore((s) => s.user);
  return { user };
}
