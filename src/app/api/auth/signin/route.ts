import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import {
  createCustomerSession,
  createDemoCustomerSession,
  DEMO_CUSTOMER,
  DEMO_PASSWORD,
  isAuthRateLimited,
  verifyPassword,
} from '@/lib/customer-auth';

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  if (isAuthRateLimited(request, 'signin')) return Response.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
  let input: z.infer<typeof schema>;
  try { input = schema.parse(await request.json()); }
  catch { return Response.json({ error: 'Enter a valid email and password.' }, { status: 400 }); }

  const normalizedEmail = input.email.toLowerCase();

  // Demo review login support
  if (normalizedEmail === DEMO_CUSTOMER.email.toLowerCase() && input.password === DEMO_PASSWORD) {
    await createDemoCustomerSession();
    return Response.json({ user: { name: DEMO_CUSTOMER.fullName, email: DEMO_CUSTOMER.email } });
  }

  try {
    const customer = await prisma.customer.findUnique({ where: { email: normalizedEmail } });
    if (!customer?.passwordHash || !(await verifyPassword(input.password, customer.passwordHash))) {
      return Response.json({ error: 'Email or password is incorrect. (For demo review, use demo@soplol.com / demo1234)' }, { status: 401 });
    }
    await createCustomerSession(customer.id);
    return Response.json({ user: { name: customer.fullName, email: customer.email } });
  } catch {
    return Response.json({
      error: 'Database is in preview mode. Please sign in with the Demo Reviewer account: demo@soplol.com / demo1234',
    }, { status: 401 });
  }
}
