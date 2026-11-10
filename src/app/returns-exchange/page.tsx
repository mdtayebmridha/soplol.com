import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export default function ReturnsExchangePage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-neutral-900">
      <header className="border-b border-neutral-200 pb-6">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-800">Order Support</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Returns &amp; Exchanges</h1>
        <p className="mt-2 text-sm text-neutral-500">Contact us before sending an item back.</p>
      </header>
      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed text-neutral-700 shadow-xs sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-slate-800"><RefreshCw className="h-5 w-5" /></div>
          <h2 className="font-bold text-neutral-900">Request review</h2>
        </div>
        <p>Return and exchange eligibility, time limits, and courier arrangements have not been confirmed for this storefront. Use the contact form with your order number and a description of the issue to request next steps.</p>
        <p>Do not ship an item until you have received a confirmed return address and instructions.</p>
        <Link href="/contact" className="inline-flex rounded-xl bg-neutral-900 px-5 py-3 text-xs font-semibold text-white hover:bg-neutral-800">Contact soplol</Link>
      </section>
    </main>
  );
}
