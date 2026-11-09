'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE,
  createAdminSession,
  getAdminAccessKey,
  isValidAdminAccessKey,
} from '@/lib/admin-auth';

export type AdminAuthState = { error?: string } | undefined;

export async function loginAdmin(
  _previousState: AdminAuthState,
  formData: FormData
): Promise<AdminAuthState> {
  const configuredKey = getAdminAccessKey();
  if (!configuredKey) {
    return { error: 'Admin access is not configured. Contact the site administrator.' };
  }

  const submittedKey = formData.get('accessKey');
  if (typeof submittedKey !== 'string' || submittedKey.length > 512 ||
      !isValidAdminAccessKey(submittedKey, configuredKey)) {
    return { error: 'The access key is incorrect.' };
  }

  const expiresAt = Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE;
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, createAdminSession(expiresAt, configuredKey), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: ADMIN_SESSION_MAX_AGE,
  });

  redirect('/admin');
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_SESSION_COOKIE, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/admin',
    maxAge: 0,
  });
  redirect('/');
}
