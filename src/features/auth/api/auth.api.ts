import { client } from '@/shared/api/client';

import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  VerifyOtpRequest,
} from './auth.types';

async function login(data: LoginRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/login', data);
  return res.data;
}

async function register(data: RegisterRequest): Promise<RegisterResponse> {
  const res = await client.post<RegisterResponse>('/auth/register', data);
  return res.data;
}

async function verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  const res = await client.post<AuthResponse>('/auth/verify-otp', data);
  return res.data;
}

async function resendOtp(data: ResendOtpRequest): Promise<RegisterResponse> {
  const res = await client.post<RegisterResponse>('/auth/resend-otp', data);
  return res.data;
}

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  const res = await client.post<AuthTokens>('/auth/refresh', { refreshToken });
  return res.data;
}

export const authApi = { login, register, verifyOtp, resendOtp, refreshTokens };
