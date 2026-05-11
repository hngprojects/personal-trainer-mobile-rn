import { loginSchema, otpSchema, registerSchema } from '@/features/auth/schemas/auth.schemas';

describe('loginSchema', () => {
  it('passes valid credentials', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: 'Password1' }).success).toBe(true);
  });

  it('rejects invalid email', () => {
    expect(loginSchema.safeParse({ email: 'not-an-email', password: 'Password1' }).success).toBe(false);
  });

  it('rejects password under 8 chars', () => {
    expect(loginSchema.safeParse({ email: 'test@example.com', password: 'abc' }).success).toBe(false);
  });
});

describe('registerSchema', () => {
  const valid = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Password1',
  };

  it('passes valid registration data', () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it('rejects name under 2 chars', () => {
    expect(registerSchema.safeParse({ ...valid, name: 'J' }).success).toBe(false);
  });

  it('rejects invalid email', () => {
    expect(registerSchema.safeParse({ ...valid, email: 'not-an-email' }).success).toBe(false);
  });

  it('rejects password under 8 chars', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'Pass1' }).success).toBe(false);
  });

  it('rejects password without uppercase', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'password1' }).success).toBe(false);
  });

  it('rejects password without number', () => {
    expect(registerSchema.safeParse({ ...valid, password: 'PasswordA' }).success).toBe(false);
  });
});

describe('otpSchema', () => {
  it('passes a six-digit numeric code', () => {
    expect(otpSchema.safeParse({ otp: '123456' }).success).toBe(true);
  });

  it('rejects codes shorter than six digits', () => {
    expect(otpSchema.safeParse({ otp: '12345' }).success).toBe(false);
  });

  it('rejects codes longer than six digits', () => {
    expect(otpSchema.safeParse({ otp: '1234567' }).success).toBe(false);
  });

  it('rejects codes containing non-digit characters', () => {
    expect(otpSchema.safeParse({ otp: '12a456' }).success).toBe(false);
  });
});
