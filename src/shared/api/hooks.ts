import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { ApiError } from './types';

export function useApiMutation<TData, TVariables = void, TContext = unknown>(
  mutationFn: (vars: TVariables) => Promise<TData>,
  options?: Omit<UseMutationOptions<TData, ApiError, TVariables, TContext>, 'mutationFn'>,
) {
  return useMutation<TData, ApiError, TVariables, TContext>({ mutationFn, ...options });
}

export function useApiQuery<TData>(
  queryKey: unknown[],
  queryFn: () => Promise<TData>,
  options?: Omit<UseQueryOptions<TData, ApiError>, 'queryKey' | 'queryFn'>,
) {
  return useQuery<TData, ApiError>({ queryKey, queryFn, ...options });
}
