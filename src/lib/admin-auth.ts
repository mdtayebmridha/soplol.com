import 'server-only';

import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

export const ADMIN_SESSION_COOKIE = 'soplol_admin_session';
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

export function getAdminAccessKey() {
  const key = process.env.ADMIN_ACCESS_KEY;
  return key && key.length >= 32 ? key : null;
}

export function isValidAdminAccessKey(candidate: string, configuredKey: string) {
  const candidateHash = createHash('sha256').update(candidate).digest();
  const configuredHash = createHash('sha256').update(configuredKey).digest();
  return timingSafeEqual(candidateHash, configuredHash);
}

export function createAdminSession(expiresAt: number, secret: string) {
  const payload = `admin-session:${expiresAt}`;
  const signature = createHmac('sha256', secret).update(payload).digest('hex');
  return `${expiresAt}.${signature}`;
}

export function isValidAdminSession(session: string | undefined, secret: string | null) {
  if (!session || !secret) return false;

  const [expiresAtValue, signature, extra] = session.split('.');
  const expiresAt = Number(expiresAtValue);
  if (extra || !Number.isInteger(expiresAt) || expiresAt <= Math.floor(Date.now() / 1000)) {
    return false;
  }

  const expectedSession = createAdminSession(expiresAt, secret);
  const expectedSignature = expectedSession.split('.')[1];
  const actualHash = createHash('sha256').update(signature || '').digest();
  const expectedHash = createHash('sha256').update(expectedSignature).digest();
  return timingSafeEqual(actualHash, expectedHash);
}
