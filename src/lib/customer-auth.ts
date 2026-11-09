import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

const scrypt = promisify(scryptCallback);
const SESSION_COOKIE = 'soplol_customer_session';
const SESSION_DAYS = 30;
type AuthLimit = { count: number; resetAt: number };
const authLimits = (globalThis as typeof globalThis & { customerAuthLimits?: Map<string, AuthLimit> }).customerAuthLimits
  ?? new Map<string, AuthLimit>();
(globalThis as typeof globalThis & { customerAuthLimits?: Map<string, AuthLimit> }).customerAuthLimits = authLimits;

export function isAuthRateLimited(request: Request, action: string) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip') || 'unknown';
  const key = `${action}:${ip}`;
  const now = Date.now();
  if (authLimits.size > 5_000) {
    for (const [entryKey, entry] of authLimits) {
      if (entry.resetAt <= now) authLimits.delete(entryKey);
      else if (authLimits.size > 4_000) authLimits.delete(entryKey);
      if (authLimits.size <= 4_000) break;
    }
  }
  const bucket = authLimits.get(key);
  if (!bucket || bucket.resetAt <= now) {
    authLimits.set(key, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  bucket.count += 1;
  return bucket.count > 10;
}

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64) as Buffer;
  return `scrypt:${salt.toString('hex')}:${derived.toString('hex')}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [scheme, saltHex, hashHex] = stored.split(':');
  if (scheme !== 'scrypt' || !saltHex || !hashHex) return false;
  const expected = Buffer.from(hashHex, 'hex');
  const actual = await scrypt(password, Buffer.from(saltHex, 'hex'), expected.length) as Buffer;
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const DEMO_CUSTOMER = {
  id: 'demo-customer-id',
  fullName: 'Demo Reviewer',
  email: 'demo@soplol.com',
};
export const DEMO_PASSWORD = 'demo1234';
const DEMO_TOKEN_PREFIX = 'demo_session_';

export async function createDemoCustomerSession() {
  const token = `${DEMO_TOKEN_PREFIX}${Date.now()}`;
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex');
}

export async function createCustomerSession(customerId: string) {
  const token = randomBytes(32).toString('base64url');
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await prisma.customerSession.create({
    data: { customerId, tokenHash: hashSessionToken(token), expiresAt },
  });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

export async function getAuthenticatedCustomer() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  if (token.startsWith(DEMO_TOKEN_PREFIX)) {
    return DEMO_CUSTOMER;
  }
  try {
    const session = await prisma.customerSession.findUnique({
      where: { tokenHash: hashSessionToken(token) },
      include: { customer: { select: { id: true, email: true, fullName: true } } },
    });
    if (!session || session.expiresAt <= new Date()) return null;
    const customer = (session as unknown as { customer?: { id: string; email: string; fullName: string } }).customer;
    return customer ?? null;
  } catch {
    return null;
  }
}

export async function clearCustomerSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token && !token.startsWith(DEMO_TOKEN_PREFIX)) {
    try {
      await prisma.customerSession.deleteMany({ where: { tokenHash: hashSessionToken(token) } });
    } catch {}
  }
  cookieStore.delete(SESSION_COOKIE);
}
