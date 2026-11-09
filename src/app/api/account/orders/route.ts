import { getAuthenticatedCustomer } from '@/lib/customer-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const customer = await getAuthenticatedCustomer();
  if (!customer) {
    return Response.json({ error: 'Sign in to view your orders.' }, {
      status: 401,
      headers: { 'Cache-Control': 'no-store' },
    });
  }

  try {
    const orders = await prisma.order.findMany({
      where: { customerId: customer.id },
      orderBy: { createdAt: 'desc' },
      take: 50,
      select: {
        orderNumber: true,
        createdAt: true,
        orderStatus: true,
        paymentStatus: true,
        paymentMethod: true,
        currency: true,
        total: true,
        items: { select: { titleSnapshot: true, quantity: true } },
      },
    });

    return Response.json({
      orders: orders.map((order) => ({
        ...order,
        createdAt: order.createdAt.toISOString(),
        orderStatus: order.orderStatus.toLowerCase(),
        paymentStatus: order.paymentStatus.toLowerCase(),
        paymentMethod: order.paymentMethod === 'sslcommerz' ? 'sslcommerz' : 'cod',
        total: Number(order.total),
        items: order.items.map((item) => ({
          title: item.titleSnapshot ?? 'Product',
          quantity: item.quantity,
        })),
      })),
    }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('Customer order history could not be loaded.', error);
    return Response.json({ error: 'Your orders could not be loaded. Please try again.' }, {
      status: 500,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}
