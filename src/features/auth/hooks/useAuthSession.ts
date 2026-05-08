import { useAuthStore } from '../store/auth.store';

export function useAuthSession() {
  const accessToken = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);

  return {
    isLoggedIn: accessToken !== null,
    user,
    accessToken,
  };
}
