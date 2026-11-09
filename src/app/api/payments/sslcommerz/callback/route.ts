import { confirmSslcommerzOrder, failSslcommerzOrder, getSslcommerzConfig } from '@/lib/sslcommerz';

export async function POST(request: Request) {
  const config = getSslcommerzConfig();
  if (!config) return new Response('Payment gateway is not configured.', { status: 503 });

  const form = await request.formData().catch(() => null);
  const transactionId = form?.get('tran_id');
  const validationId = form?.get('val_id');
  const gatewayStatus = form?.get('status');
  const orderNumber = typeof transactionId === 'string' ? transactionId : '';
  const fallback = new URL('/checkout?payment=pending', config.appUrl);
  const redirectToOrder = (payment: 'paid' | 'pending' | 'failed') => {
    if (!/^SPL-\d{4}-\d{8}$/.test(orderNumber)) return fallback;
    return new URL(`/order-success/${encodeURIComponent(orderNumber)}?payment=${payment}`, config.appUrl);
  };

  if (!/^SPL-\d{4}-\d{8}$/.test(orderNumber)) {
    return Response.redirect(redirectToOrder('pending'), 303);
  }

  try {
    if (typeof gatewayStatus === 'string'
      && ['FAILED', 'CANCELLED', 'EXPIRED', 'UNATTEMPTED'].includes(gatewayStatus)) {
      const isFailed = await failSslcommerzOrder(orderNumber);
      return Response.redirect(redirectToOrder(isFailed ? 'failed' : 'pending'), 303);
    }
    if (typeof validationId === 'string' && validationId) {
      const isPaid = await confirmSslcommerzOrder(orderNumber, validationId);
      return Response.redirect(redirectToOrder(isPaid ? 'paid' : 'pending'), 303);
    }
    return Response.redirect(redirectToOrder('pending'), 303);
  } catch (error) {
    console.error('SSLCommerz callback validation failed.', error);
    return Response.redirect(redirectToOrder('pending'), 303);
  }
}
