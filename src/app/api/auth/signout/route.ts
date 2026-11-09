import { clearCustomerSession } from '@/lib/customer-auth';

export async function POST() {
  await clearCustomerSession();
  return Response.json({ success: true }, { headers: { 'Cache-Control': 'no-store' } });
}
