import { createStore } from './factory';

export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastItem {
  id: string;
  message: string;
  variant: ToastVariant;
  duration: number;
}

interface ToastState {
  toasts: ToastItem[];
}

interface ToastActions {
  show: (opts: { message: string; variant?: ToastVariant; duration?: number }) => string;
  hide: (id: string) => void;
  clear: () => void;
}

const DEFAULT_DURATION = 3500;

export const useToastStore = createStore<ToastState & ToastActions>((set) => ({
  toasts: [],
  show: ({ message, variant = 'info', duration = DEFAULT_DURATION }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    set((s) => ({ toasts: [...s.toasts, { id, message, variant, duration }] }));
    return id;
  },
  hide: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
  clear: () => set({ toasts: [] }),
}));
