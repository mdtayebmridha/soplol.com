import { randomInt } from 'node:crypto';
import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { CHECKOUT_RULES, getCouponRate } from '@/lib/checkout-rules';
import { normalizeBangladeshPhone } from '@/lib/phone';
import { getAuthenticatedCustomer } from '@/lib/customer-auth';
import { getSslcommerzBaseUrl, getSslcommerzConfig } from '@/lib/sslcommerz';

const checkoutSchema = z.object({
  customer: z.object({
    fullName: z.string().trim().min(2).max(120),
    email: z.union([z.string().trim().email().max(254), z.literal('')]).optional(),
    phone: z.string().trim().min(7).max(24),
  }),
  shippingAddress: z.object({
    street: z.string().trim().min(5).max(300),
    city: z.string().trim().min(2).max(100),
    district: z.string().trim().min(2).max(100),
    country: z.literal('Bangladesh'),
    postalCode: z.string().trim().max(20).optional(),
    region: z.enum(['dhaka', 'outside_dhaka']),
  }),
  items: z.array(z.object({
    productId: z.string().min(1).max(80),
    quantity: z.number().int().min(1).max(20),
    selectedVariants: z.record(z.string(), z.string().max(100)).default({}),
    personalizationText: z.string().max(500).optional(),
  })).min(1).max(30),
  currency: z.literal('BDT'),
  paymentMethod: z.enum(['cod', 'sslcommerz']),
  couponCode: z.string().trim().max(40).optional(),
  addGiftWrap: z.boolean().default(false),
  giftWrapNote: z.string().trim().max(300).optional(),
});

class CheckoutError extends Error {
  constructor(message: string, readonly status: number) {
    super(message);
  }
}

function createOrderNumber() {
  return `SPL-${new Date().getFullYear()}-${randomInt(10_000_000, 100_000_000)}`;
}

export async function POST(request: Request) {
  let parsed: z.infer<typeof checkoutSchema>;
  try {
    parsed = checkoutSchema.parse(await request.json());
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Please check your checkout details.' }, { status: 400 });
    }
    return Response.json({ error: 'Invalid checkout request.' }, { status: 400 });
  }

  const phone = normalizeBangladeshPhone(parsed.customer.phone);
  if (!phone) {
    return Response.json({ error: 'Enter a valid Bangladesh mobile number.' }, { status: 400 });
  }
  const gatewayConfig = parsed.paymentMethod === 'sslcommerz' ? getSslcommerzConfig() : null;
  if (parsed.paymentMethod === 'sslcommerz' && !gatewayConfig) {
    return Response.json({ error: 'Online payment is not enabled yet. Choose Cash on Delivery.' }, { status: 503 });
  }
  if (parsed.paymentMethod === 'sslcommerz' && !parsed.customer.email) {
    return Response.json({ error: 'An email address is required for online payment.' }, { status: 400 });
  }

  const couponCode = parsed.couponCode?.toUpperCase() ?? '';
  if (couponCode && !getCouponRate(couponCode)) {
    return Response.json({ error: 'This promotion code is not valid.' }, { status: 400 });
  }

  try {
    const customer = await getAuthenticatedCustomer();
    const order = await prisma.$transaction(async (tx) => {
      const lines: {
        productId: string;
        quantity: number;
        unitPrice: number;
        title: string;
        image: string | null;
        selectedVariants: Prisma.InputJsonValue;
        personalization: string | null;
      }[] = [];
      let subtotal = 0;

      for (const item of parsed.items) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
          include: { variants: true },
        });
        if (!product || !product.inStock || product.stockQuantity < item.quantity) {
          throw new CheckoutError('One or more products are no longer available in the requested quantity.', 409);
        }

        const expectedVariants = product.variants;
        const selectedKeys = Object.keys(item.selectedVariants);
        const variantsAreValid = expectedVariants.every((variant) =>
          item.selectedVariants[variant.name] && variant.options.includes(item.selectedVariants[variant.name])
        ) && selectedKeys.every((key) => expectedVariants.some((variant) => variant.name === key));
        if (!variantsAreValid) {
          throw new CheckoutError(`Please reselect options for ${product.title}.`, 409);
        }

        const quantityUpdate = await tx.product.updateMany({
          where: { id: product.id, inStock: true, stockQuantity: { gte: item.quantity } },
          data: { stockQuantity: { decrement: item.quantity } },
        });
        if (quantityUpdate.count !== 1) {
          throw new CheckoutError('Stock changed while placing the order. Please review your cart.', 409);
        }
        await tx.product.updateMany({
          where: { id: product.id, stockQuantity: 0 },
          data: { inStock: false },
        });

        const unitPrice = Number(product.priceBDT);
        subtotal += unitPrice * item.quantity;
        lines.push({
          productId: product.id,
          quantity: item.quantity,
          unitPrice,
          title: product.title,
          image: product.images[0] ?? null,
          selectedVariants: item.selectedVariants as Prisma.InputJsonValue,
          personalization: item.personalizationText ?? null,
        });
      }

      const discount = Math.round(subtotal * getCouponRate(couponCode));
      const shippingCost = CHECKOUT_RULES.shippingBDT[parsed.shippingAddress.region];
      const giftWrapCost = parsed.addGiftWrap ? CHECKOUT_RULES.giftWrapFeeBDT : 0;
      const total = subtotal - discount + shippingCost + giftWrapCost;

      const customerData = {
        fullName: parsed.customer.fullName,
        email: parsed.customer.email || null,
        phone,
      } as Prisma.InputJsonValue;
      const shippingAddress = {
        ...parsed.shippingAddress,
        postalCode: parsed.shippingAddress.postalCode || null,
      } as Prisma.InputJsonValue;
      const notes = parsed.addGiftWrap
        ? `Gift wrap requested. Greeting card: ${parsed.giftWrapNote || 'Best wishes!'}`
        : null;

      return tx.order.create({
        data: {
          orderNumber: createOrderNumber(),
          customerId: customer?.id,
          currency: 'BDT',
          subtotal,
          shippingCost,
          discount,
          promotionCode: couponCode || null,
          total,
          paymentMethod: parsed.paymentMethod === 'cod' ? 'cash_on_delivery' : 'sslcommerz',
          paymentProvider: parsed.paymentMethod === 'sslcommerz' ? 'sslcommerz' : null,
          gatewayTransactionId: null,
          paymentStatus: 'PENDING',
          orderStatus: 'PENDING',
          customerData,
          shippingAddress,
          notes,
          items: {
            create: lines.map((line) => ({
              productId: line.productId,
              quantity: line.quantity,
              unitPrice: line.unitPrice,
              titleSnapshot: line.title,
              imageSnapshot: line.image,
              selectedVariants: line.selectedVariants,
              personalization: line.personalization,
            })),
          },
        },
        select: { orderNumber: true, total: true, currency: true, items: { select: { quantity: true } } },
      });
    });

    if (parsed.paymentMethod === 'sslcommerz' && gatewayConfig) {
      if (Number(order.total) < 10 || Number(order.total) > 500_000) {
        await prisma.$transaction(async (tx) => {
          const savedOrder = await tx.order.findUnique({ where: { orderNumber: order.orderNumber }, include: { items: true } });
          if (!savedOrder || savedOrder.paymentStatus !== 'PENDING') return;
          await tx.order.update({ where: { id: savedOrder.id }, data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED', paymentProvider: 'sslcommerz' } });
          for (const item of savedOrder.items) {
            await tx.product.update({ where: { id: item.productId }, data: { stockQuantity: { increment: item.quantity }, inStock: true } });
          }
        });
        return Response.json({ error: 'SSLCommerz payments must be between BDT 10 and BDT 500,000. Choose Cash on Delivery for this order.' }, { status: 400 });
      }
      const callbackUrl = `${gatewayConfig.appUrl}/api/payments/sslcommerz/callback`;
      const gatewayPayload = new URLSearchParams({
        store_id: gatewayConfig.storeId,
        store_passwd: gatewayConfig.storePassword,
        total_amount: Number(order.total).toFixed(2),
        currency: 'BDT',
        tran_id: order.orderNumber,
        success_url: callbackUrl,
        fail_url: callbackUrl,
        cancel_url: callbackUrl,
        ipn_url: `${gatewayConfig.appUrl}/api/payments/sslcommerz/ipn`,
        cus_name: parsed.customer.fullName.slice(0, 50),
        cus_email: parsed.customer.email!.slice(0, 50),
        cus_add1: parsed.shippingAddress.street.slice(0, 50),
        cus_city: parsed.shippingAddress.city.slice(0, 50),
        cus_state: parsed.shippingAddress.district.slice(0, 50),
        cus_postcode: (parsed.shippingAddress.postalCode || '0000').slice(0, 30),
        cus_country: 'Bangladesh',
        cus_phone: phone.slice(0, 20),
        shipping_method: 'Courier',
        num_of_item: String(order.items.reduce((count, item) => count + item.quantity, 0)),
        product_name: 'Soplol store products',
        product_category: 'General goods',
        product_profile: 'physical-goods',
      });
      try {
        const gatewayResponse = await fetch(`${getSslcommerzBaseUrl(gatewayConfig.live)}/gwprocess/v4/api.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: gatewayPayload,
          cache: 'no-store',
          signal: AbortSignal.timeout(20_000),
        });
        const gatewayResult = await gatewayResponse.json() as { status?: string; GatewayPageURL?: string };
        const gatewayUrl = gatewayResult.GatewayPageURL ? new URL(gatewayResult.GatewayPageURL) : null;
        const allowedHosts = gatewayConfig.live ? ['securepay.sslcommerz.com'] : ['sandbox.sslcommerz.com'];
        if (!gatewayResponse.ok || gatewayResult.status !== 'SUCCESS' || !gatewayUrl || gatewayUrl.protocol !== 'https:' || !allowedHosts.includes(gatewayUrl.hostname)) {
          throw new Error('SSLCommerz did not return a valid payment page.');
        }
        await prisma.order.update({
          where: { orderNumber: order.orderNumber },
          data: { paymentMethod: 'sslcommerz', paymentProvider: 'sslcommerz', gatewayTransactionId: order.orderNumber },
        });
        return Response.json({ orderNumber: order.orderNumber, total: Number(order.total), currency: order.currency, gatewayUrl: gatewayUrl.toString() }, { status: 201 });
      } catch (error) {
        await prisma.$transaction(async (tx) => {
          const savedOrder = await tx.order.findUnique({ where: { orderNumber: order.orderNumber }, include: { items: true } });
          if (!savedOrder || savedOrder.paymentStatus !== 'PENDING') return;
          await tx.order.update({ where: { id: savedOrder.id }, data: { paymentStatus: 'FAILED', orderStatus: 'CANCELLED', paymentProvider: 'sslcommerz' } });
          for (const item of savedOrder.items) {
            await tx.product.update({ where: { id: item.productId }, data: { stockQuantity: { increment: item.quantity }, inStock: true } });
          }
        });
        console.error('SSLCommerz payment session could not be started.', error);
        return Response.json({ error: 'The payment service could not start. No payment was taken; please try Cash on Delivery.' }, { status: 502 });
      }
    }

    return Response.json({
      orderNumber: order.orderNumber,
      total: Number(order.total),
      currency: order.currency,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return Response.json({ error: error.message }, { status: error.status });
    }
    console.error('Order creation failed.');
    return Response.json({ error: 'We could not save your order. Please try again.' }, { status: 500 });
  }
}
