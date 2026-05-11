import { ApiError } from '@/shared/api/types';

import type {
  AuthResponse,
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  ResendOtpRequest,
  VerifyOtpRequest,
} from './auth.types';

const DUMMY_USER = {
  id: 'logickoder',
  email: 'jeffery@logickoder.dev',
  firstName: 'Jeffery',
  lastName: 'Orazulike',
};

const DUMMY_ACCESS = 'dummy.access.token';
const DUMMY_REFRESH = 'dummy.refresh.token';
const DUMMY_ACCESS_ROTATED = 'dummy.access.token.rotated';

function delay(ms: number) {
  return new Promise<void>((resolve) => setTimeout(resolve, ms));
}

function splitName(name: string): { firstName: string; lastName: string } {
  const parts = name.trim().split(/\s+/);
  return { firstName: parts[0] ?? '', lastName: parts.slice(1).join(' ') };
}

async function login(data: LoginRequest): Promise<AuthResponse> {
  await delay(800);
  if (data.email === 'jeffery@logickoder.dev' && data.password === 'Password1') {
    return {
      user: DUMMY_USER,
      tokens: { accessToken: DUMMY_ACCESS, refreshToken: DUMMY_REFRESH },
    };
  }
  throw new ApiError('Invalid credentials', 401);
}

async function register(data: RegisterRequest): Promise<RegisterResponse> {
  await delay(800);
  if (!data.email || !data.password) {
    throw new ApiError('Email and password are required', 400);
  }
  return { email: data.email };
}

async function verifyOtp(data: VerifyOtpRequest): Promise<AuthResponse> {
  await delay(600);
  if (!/^\d{6}$/.test(data.otp)) {
    throw new ApiError('Invalid OTP', 400);
  }
  const { firstName, lastName } = splitName(data.email.split('@')[0] ?? 'User');
  return {
    user: {
      id: `user-${Date.now()}`,
      email: data.email,
      firstName,
      lastName,
    },
    tokens: { accessToken: DUMMY_ACCESS, refreshToken: DUMMY_REFRESH },
  };
}

async function resendOtp(data: ResendOtpRequest): Promise<RegisterResponse> {
  await delay(500);
  return { email: data.email };
}

async function refreshTokens(refreshToken: string): Promise<AuthTokens> {
  await delay(400);
  if (refreshToken === DUMMY_REFRESH) {
    return { accessToken: DUMMY_ACCESS_ROTATED, refreshToken: DUMMY_REFRESH };
  }
  throw new ApiError('Refresh token invalid', 401);
}

export const authApi = { login, register, verifyOtp, resendOtp, refreshTokens };
