import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { KeyboardProvider } from 'react-native-keyboard-controller';

import { queryClient } from '@/shared/api/queryClient';
import { ToastHost } from '@/shared/components';
import { ThemeProvider } from '@/shared/theme';

interface AppProvidersProps {
  children: React.ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <KeyboardProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          {children}
          <ToastHost />
        </ThemeProvider>
      </QueryClientProvider>
    </KeyboardProvider>
  );
}
