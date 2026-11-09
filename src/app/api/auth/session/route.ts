import { getAuthenticatedCustomer } from '@/lib/customer-auth';

export async function GET() {
  const customer = await getAuthenticatedCustomer();
  return Response.json({
    user: customer ? { name: customer.fullName, email: customer.email } : null,
  }, { headers: { 'Cache-Control': 'no-store' } });
}
