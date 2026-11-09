import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  ADMIN_SESSION_COOKIE,
  getAdminAccessKey,
  isValidAdminSession,
} from '@/lib/admin-auth';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!isValidAdminSession(session, getAdminAccessKey())) {
    redirect('/admin-access');
  }

  return <>{children}</>;
}
