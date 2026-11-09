import { confirmSslcommerzOrder, failSslcommerzOrder, getSslcommerzConfig } from '@/lib/sslcommerz';

export async function POST(request: Request) {
  if (!getSslcommerzConfig()) return Response.json({ received: false }, { status: 503 });
  const form = await request.formData().catch(() => null);
  const orderNumber = form?.get('tran_id');
  const validationId = form?.get('val_id');
  const gatewayStatus = form?.get('status');
  if (typeof orderNumber !== 'string' || !/^SPL-\d{4}-\d{8}$/.test(orderNumber)) {
    return Response.json({ received: false }, { status: 400 });
  }
  try {
    if (typeof gatewayStatus === 'string'
      && ['FAILED', 'CANCELLED', 'EXPIRED', 'UNATTEMPTED'].includes(gatewayStatus)) {
      const failed = await failSslcommerzOrder(orderNumber);
      return Response.json({ received: true, failed });
    }
    if (typeof validationId === 'string' && validationId.length > 0 && validationId.length <= 100) {
      const paid = await confirmSslcommerzOrder(orderNumber, validationId);
      return Response.json({ received: true, paid });
    }
    return Response.json({ received: false }, { status: 400 });
  } catch (error) {
    console.error('SSLCommerz IPN validation failed.', error);
    return Response.json({ received: false }, { status: 502 });
  }
}
