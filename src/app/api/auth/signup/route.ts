import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { createCustomerSession, hashPassword, isAuthRateLimited } from '@/lib/customer-auth';

const schema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export async function POST(request: Request) {
  if (isAuthRateLimited(request, 'signup')) return Response.json({ error: 'Too many attempts. Please try again in a minute.' }, { status: 429 });
  let input: z.infer<typeof schema>;
  try { input = schema.parse(await request.json()); }
  catch { return Response.json({ error: 'Enter a valid name, email, and password of at least 8 characters.' }, { status: 400 }); }

  const email = input.email.toLowerCase();
  const existing = await prisma.customer.findUnique({ where: { email }, select: { id: true } });
  if (existing) return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });

  try {
    const customer = await prisma.customer.create({
      data: { email, fullName: input.name, passwordHash: await hashPassword(input.password) },
      select: { id: true, email: true, fullName: true },
    });
    await createCustomerSession(customer.id);
    return Response.json({ user: { name: customer.fullName, email: customer.email } }, { status: 201 });
  } catch (error) {
    if (error && typeof error === 'object' && 'code' in error && error.code === 'P2002') {
      return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }
    console.error('Customer signup failed', error);
    return Response.json({ error: 'Account could not be created. Please try again.' }, { status: 500 });
  }
}
