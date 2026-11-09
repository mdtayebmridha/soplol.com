import { prisma } from '@/lib/prisma';

const SANDBOX = 'https://sandbox.sslcommerz.com';
const LIVE = 'https://securepay.sslcommerz.com';

export function getSslcommerzConfig() {
  const storeId = process.env.SSLCOMMERZ_STORE_ID?.trim();
  const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD?.trim();
  const appUrl = process.env.APP_URL?.trim().replace(/\/$/, '');
  if (!storeId || !storePassword || !appUrl) return null;
  let parsedUrl: URL;
  try { parsedUrl = new URL(appUrl); } catch { return null; }
  if (parsedUrl.protocol !== 'https:' && process.env.NODE_ENV === 'production') return null;
  return {
    storeId,
    storePassword,
    appUrl,
    live: process.env.SSLCOMMERZ_LIVE === 'true',
  };
}

export function isSslcommerzConfigured() {
  return Boolean(getSslcommerzConfig());
}

export function getSslcommerzBaseUrl(live: boolean) {
  return live ? LIVE : SANDBOX;
}

export async function validateSslcommerzPayment(validationId: string) {
  const config = getSslcommerzConfig();
  if (!config) throw new Error('SSLCommerz is not configured.');
  const endpoint = new URL('/validator/api/validationserverAPI.php', getSslcommerzBaseUrl(config.live));
  endpoint.search = new URLSearchParams({
    val_id: validationId,
    store_id: config.storeId,
    store_passwd: config.storePassword,
    format: 'json',
  }).toString();
  const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Could not validate payment with SSLCommerz.');
  return await response.json() as {
    status?: string;
    tran_id?: string;
    val_id?: string;
    amount?: string;
    currency?: string;
    bank_tran_id?: string;
    risk_level?: string | number;
  };
}

export async function lookupSslcommerzTransaction(orderNumber: string) {
  const config = getSslcommerzConfig();
  if (!config) throw new Error('SSLCommerz is not configured.');
  const endpoint = new URL('/validator/api/merchantTransIDvalidationAPI.php', getSslcommerzBaseUrl(config.live));
  endpoint.search = new URLSearchParams({
    tran_id: orderNumber,
    store_id: config.storeId,
    store_passwd: config.storePassword,
    format: 'json',
  }).toString();
  const response = await fetch(endpoint, { cache: 'no-store', signal: AbortSignal.timeout(15_000) });
  if (!response.ok) throw new Error('Could not check transaction status with SSLCommerz.');
  return await response.json() as {
    APIConnect?: string;
    element?: Array<{
      status?: string;
      tran_id?: string;
      amount?: string;
      currency?: string;
      currency_type?: string;
      currency_amount?: string;
      val_id?: string;
    }>;
  };
}

export async function failSslcommerzOrder(orderNumber: string) {
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    select: {
      id: true,
      total: true,
      currency: true,
      paymentStatus: true,
      paymentMethod: true,
      gatewayTransactionId: true,
      orderStatus: true,
      items: { select: { productId: true, quantity: true } },
    },
  });
  if (!order || order.paymentMethod !== 'sslcommerz'
    || order.gatewayTransactionId !== orderNumber
    || order.paymentStatus !== 'PENDING'
    || order.orderStatus === 'CANCELLED') return false;

  const gateway = await lookupSslcommerzTransaction(orderNumber);
  const transaction = gateway.element?.find((item) => item.tran_id === orderNumber);
  const amount = transaction?.currency_type === order.currency
    ? transaction.currency_amount
    : transaction?.amount;
  if (gateway.APIConnect !== 'DONE'
    || !transaction
    || !['FAILED', 'CANCELLED', 'EXPIRED', 'UNATTEMPTED'].includes(transaction.status ?? '')
    || (transaction.currency_type ?? transaction.currency) !== order.currency
    || Math.round(Number(amount) * 100) !== Math.round(Number(order.total) * 100)) return false;

  const result = await prisma.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: {
        id: order.id,
        paymentStatus: 'PENDING',
        paymentMethod: 'sslcommerz',
        gatewayTransactionId: orderNumber,
        orderStatus: { not: 'CANCELLED' },
      },
      data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED' },
    });
    if (updated.count !== 1) return false;

    for (const item of order.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stockQuantity: { increment: item.quantity }, inStock: true },
      });
    }
    return true;
  });
  return result;
}

export async function confirmSslcommerzOrder(orderNumber: string, validationId: string) {
  const [order, validation] = await Promise.all([
    prisma.order.findUnique({ where: { orderNumber }, select: { id: true, total: true, currency: true, paymentStatus: true, paymentMethod: true, gatewayTransactionId: true, orderStatus: true } }),
    validateSslcommerzPayment(validationId),
  ]);
  if (!order || order.paymentMethod !== 'sslcommerz'
    || order.orderStatus === 'CANCELLED'
    || order.gatewayTransactionId !== orderNumber
    || validation.tran_id !== orderNumber
    || validation.val_id !== validationId
    || !['VALID', 'VALIDATED'].includes(validation.status ?? '')
    || String(validation.risk_level ?? '0') === '1'
    || validation.currency !== order.currency
    || Math.round(Number(validation.amount) * 100) !== Math.round(Number(order.total) * 100)) {
    return false;
  }
  if (order.paymentStatus === 'PAID') return true;
  if (order.paymentStatus !== 'PENDING') return false;
  const updated = await prisma.order.updateMany({
    where: { id: order.id, paymentStatus: 'PENDING', paymentMethod: 'sslcommerz', orderStatus: { not: 'CANCELLED' } },
    data: { paymentStatus: 'PAID', paidAt: new Date(), gatewayValidationId: validationId },
  });
  if (updated.count === 1) return true;
  const latest = await prisma.order.findUnique({ where: { id: order.id }, select: { paymentStatus: true, orderStatus: true } });
  return latest?.paymentStatus === 'PAID' && latest.orderStatus !== 'CANCELLED';
}
