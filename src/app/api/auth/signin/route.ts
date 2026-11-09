import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createCustomerSession, isAuthRateLimited, verifyPassword } from '@/lib/customer-auth';

const schema = z.object({ email: z.string().trim().email().max(254), password: z.string().min(1).max(128) });

export async function POST(request: Request) {
  if (isAuthRateLimited(request, 'signin')) return Response.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
  let input: z.infer<typeof schema>;
  try { input = schema.parse(await request.json()); }
  catch { return Response.json({ error: 'Enter a valid email and password.' }, { status: 400 }); }

  const customer = await prisma.customer.findUnique({ where: { email: input.email.toLowerCase() } });
  if (!customer?.passwordHash || !(await verifyPassword(input.password, customer.passwordHash))) {
    return Response.json({ error: 'Email or password is incorrect.' }, { status: 401 });
  }
  await createCustomerSession(customer.id);
  return Response.json({ user: { name: customer.fullName, email: customer.email } });
}
