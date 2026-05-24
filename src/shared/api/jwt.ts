export function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    return JSON.parse(decodeBase64Url(payload)) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function hasJwtExp(token: string) {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === 'number' && Number.isFinite(payload.exp);
}

export function isJwtExpired(token: string) {
  const payload = decodeJwtPayload(token);
  if (typeof payload?.exp !== 'number') return true;
  return payload.exp * 1000 <= Date.now();
}

export function getJwtType(token: string) {
  const payload = decodeJwtPayload(token);
  return typeof payload?.type === 'string' ? payload.type : null;
}

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');

  if (typeof atob === 'function') {
    return atob(padded);
  }

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let buffer = 0;
  let bits = 0;
  const bytes: string[] = [];

  for (const char of padded.replace(/=+$/, '')) {
    const index = alphabet.indexOf(char);
    if (index < 0) throw new Error('Invalid base64 character');
    buffer = (buffer << 6) | index;
    bits += 6;
    if (bits >= 8) {
      bits -= 8;
      bytes.push(`%${((buffer >> bits) & 0xff).toString(16).padStart(2, '0')}`);
    }
  }

  return decodeURIComponent(bytes.join(''));
}
