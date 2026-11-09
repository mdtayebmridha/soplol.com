import Link from 'next/link';

export default function TermsPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-neutral-900">
      <header className="border-b border-neutral-200 pb-6">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-amber-600">Store Information</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Terms of Service</h1>
      </header>
      <section className="space-y-5 rounded-2xl border border-neutral-200 bg-white p-6 text-sm leading-relaxed text-neutral-700 shadow-xs sm:p-8">
        <p>Submitting an order sends the items and checkout details you selected to the soplol order system. The order number and current status are shown after it is saved. Product availability and final charges are checked at checkout.</p>
        <p>Cash on Delivery is available for Bangladesh checkout. SSLCommerz hosted payment is offered only when the merchant integration is configured; an order is not treated as paid until the provider confirms it.</p>
        <p>International checkout is currently unavailable. Delivery charges for Bangladesh are displayed before order confirmation.</p>
        <p>Return or exchange eligibility has not been finalized. Contact soplol before sending an item back; do not ship anything without confirmed instructions.</p>
        <p>Seller, corporate gifting, and contact forms save inquiries only. They do not create seller access, confirm a bulk order, or establish commercial terms.</p>
        <Link href="/contact" className="inline-block font-semibold text-[#D9531E] underline">Contact soplol</Link>
      </section>
    </main>
  );
}
