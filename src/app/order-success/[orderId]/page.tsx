'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2, PackageCheck, ArrowRight } from 'lucide-react';
import { useShop } from '@/context/ShopContext';
import { useEffect, useRef, useState, Suspense } from 'react';

function OrderSuccessContent() {
  const params = useParams<{ orderId: string }>();
  const orderNumber = params?.orderId ?? '';
  const { clearCart } = useShop();
  const [paymentResult, setPaymentResult] = useState<'paid' | 'failed' | 'pending' | null>(null);
  const handledCallback = useRef(false);

  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get('payment');
    if (!handledCallback.current && (status === 'paid' || status === 'failed' || status === 'pending')) {
      handledCallback.current = true;
      setPaymentResult(status);
      if (status === 'paid') clearCart();
    }
  }, [clearCart]);

  const isPaid = paymentResult === 'paid';

  return (
    <main className="mx-auto max-w-2xl px-4 py-16 text-center text-neutral-900 sm:py-24">
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
        <CheckCircle2 className="h-9 w-9" aria-hidden="true" />
      </div>
      <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
        {paymentResult === 'failed' ? 'Payment not confirmed' : isPaid ? 'Payment confirmed' : 'Order received'}
      </p>
      <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
        {paymentResult === 'failed' ? 'Payment could not be verified' : isPaid ? 'Thank you for your payment' : 'Thank you for your order'}
      </h1>
      <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-neutral-600">
        {paymentResult === 'failed'
          ? 'The payment provider did not confirm this transaction. Check its status before trying again; your order has not been marked paid.'
          : paymentResult === 'pending'
            ? 'Payment status is still being checked. This order will only be marked paid after provider validation.'
            : isPaid
              ? 'Your online payment was verified and your order has been saved.'
              : 'Your Cash on Delivery order has been saved and is awaiting confirmation.'}
      </p>

      <section className="mx-auto mt-8 max-w-md rounded-2xl border border-neutral-200 bg-white p-5 text-left shadow-xs">
        <div className="flex items-start gap-3">
          <PackageCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#D9531E]" aria-hidden="true" />
          <div>
            <p className="text-[11px] font-bold uppercase tracking-wider text-neutral-500">
              Order number
            </p>
            <p className="mt-1 font-mono text-lg font-bold text-neutral-900">{orderNumber}</p>
            <p className="mt-2 text-xs text-neutral-500">
              Keep this number and your checkout phone number to check the order status.
            </p>
          </div>
        </div>
      </section>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/track-order"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 py-3 text-xs font-bold text-white transition hover:bg-neutral-800"
        >
          Track order <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </Link>
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-5 py-3 text-xs font-bold text-neutral-800 transition hover:bg-neutral-50"
        >
          Continue shopping
        </Link>
      </div>
    </main>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-24 text-center text-xs">Loading order details...</div>}>
      <OrderSuccessContent />
    </Suspense>
  );
}
