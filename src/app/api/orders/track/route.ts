import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { normalizeBangladeshPhone } from '@/lib/phone';

const inputSchema = z.object({
  orderNumber: z.string().trim().toUpperCase().regex(/^SPL-\d{4}-\d{8}$/),
  phone: z.string().trim().min(7).max(24),
});

type RateLimitBucket = { count: number; resetAt: number };
const globalForTracking = globalThis as typeof globalThis & {
  orderTrackingLimits?: Map<string, RateLimitBucket>;
};
const trackingLimits = globalForTracking.orderTrackingLimits ?? new Map<string, RateLimitBucket>();
globalForTracking.orderTrackingLimits = trackingLimits;

function isRateLimited(request: Request, orderNumber: string) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'unknown';
  const now = Date.now();
  if (trackingLimits.size > 5_000) {
    for (const [key, bucket] of trackingLimits) {
      if (bucket.resetAt <= now) trackingLimits.delete(key);
      else if (trackingLimits.size > 4_000) trackingLimits.delete(key);
      if (trackingLimits.size <= 4_000) break;
    }
  }

  const keys = [`ip:${ip}`, `order:${orderNumber}`];
  const limits = [20, 8];
  let blocked = false;
  for (let index = 0; index < keys.length; index += 1) {
    const key = keys[index];
    const bucket = trackingLimits.get(key);
    if (!bucket || bucket.resetAt <= now) {
      trackingLimits.set(key, { count: 1, resetAt: now + 60_000 });
      continue;
    }
    bucket.count += 1;
    if (bucket.count > limits[index]) blocked = true;
  }
  return blocked;
}

export async function POST(request: Request) {
  let input: z.infer<typeof inputSchema>;
  try {
    input = inputSchema.parse(await request.json());
  } catch {
    return Response.json({ error: 'Enter a valid order number and phone number.' }, { status: 400 });
  }

  const phone = normalizeBangladeshPhone(input.phone);
  if (!phone) {
    return Response.json({ error: 'No matching order was found.' }, { status: 404 });
  }
  if (isRateLimited(request, input.orderNumber)) {
    return Response.json({ error: 'Too many tracking attempts. Please try again shortly.' }, { status: 429 });
  }

  const order = await prisma.order.findUnique({
    where: { orderNumber: input.orderNumber },
    include: { items: true },
  });
  if (!order) {
    return Response.json({ error: 'No matching order was found.' }, { status: 404 });
  }

  const customer = order.customerData as { phone?: unknown };
  if (typeof customer.phone !== 'string' || normalizeBangladeshPhone(customer.phone) !== phone) {
    return Response.json({ error: 'No matching order was found.' }, { status: 404 });
  }

  const address = order.shippingAddress as {
    city?: unknown;
    district?: unknown;
    country?: unknown;
  };

  return Response.json({
    order: {
      orderNumber: order.orderNumber,
      createdAt: order.createdAt.toISOString(),
      orderStatus: order.orderStatus.toLowerCase(),
      paymentStatus: order.paymentStatus.toLowerCase(),
      paymentMethod: order.paymentMethod === 'sslcommerz' ? 'sslcommerz' : 'cod',
      currency: order.currency,
      total: Number(order.total),
      deliveryArea: [address.city, address.district]
        .filter((value): value is string => typeof value === 'string' && value.length > 0)
        .join(', '),
      country: typeof address.country === 'string' ? address.country : 'Bangladesh',
      items: order.items.map((item) => ({
        title: item.titleSnapshot ?? 'Product',
        quantity: item.quantity,
      })),
    },
  });
}
