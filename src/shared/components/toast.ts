import { ToastVariant, useToastStore } from '@/shared/store/toast.store';

interface ShowOptions {
  message: string;
  variant?: ToastVariant;
  duration?: number;
}

export const toast = {
  show: (opts: ShowOptions) => useToastStore.getState().show(opts),
  success: (message: string, duration?: number) =>
    useToastStore.getState().show({ message, variant: 'success', duration }),
  error: (message: string, duration?: number) =>
    useToastStore.getState().show({ message, variant: 'error', duration }),
  info: (message: string, duration?: number) =>
    useToastStore.getState().show({ message, variant: 'info', duration }),
  hide: (id: string) => useToastStore.getState().hide(id),
  clear: () => useToastStore.getState().clear(),
};
