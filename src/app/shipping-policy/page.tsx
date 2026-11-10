import { Truck } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-neutral-900">
      <header className="border-b border-neutral-200 pb-6">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-slate-800">Delivery Guide</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Shipping &amp; Delivery</h1>
        <p className="mt-2 text-sm text-neutral-500">Current delivery charges and checkout coverage.</p>
      </header>
      <section className="space-y-4 rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs sm:p-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-slate-800"><Truck className="h-5 w-5" /></div>
          <div>
            <h2 className="text-lg font-bold">Bangladesh delivery</h2>
            <p className="text-xs text-neutral-500">Choose the delivery area at checkout. The charge is included in the total before confirmation.</p>
          </div>
        </div>
        <div className="grid gap-4 pt-2 sm:grid-cols-2">
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="text-sm font-bold">Dhaka</h3>
            <p className="mt-1 text-xs text-neutral-600">Delivery charge: <strong>BDT 70</strong></p>
          </div>
          <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="text-sm font-bold">Outside Dhaka</h3>
            <p className="mt-1 text-xs text-neutral-600">Delivery charge: <strong>BDT 130</strong></p>
          </div>
        </div>
        <p className="text-xs leading-relaxed text-neutral-600">A delivery-time estimate and courier assignment are not currently shown on this site. International checkout is unavailable.</p>
      </section>
    </main>
  );
}
