import Link from 'next/link';

export default function PrivacyPolicyPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-16 text-stone-900">
      <header className="border-b border-stone-200 pb-6">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-[#D9531E]">Data Protection</span>
        <h1 className="text-3xl font-extrabold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-stone-500">Information the storefront uses to process accounts, orders, and inquiries.</p>
      </header>
      <div className="space-y-8 rounded-2xl border border-stone-200 bg-white p-6 text-sm leading-relaxed text-stone-700 shadow-xs sm:p-10">
        <section className="space-y-3">
          <h2 className="font-bold text-stone-900">Information saved by the storefront</h2>
          <p>When you create an account, the app saves your name, email address, a password hash, and a hashed session token. Checkout saves the details you provide, delivery address, ordered items, selected options, order total, and payment status. Contact, seller, and corporate inquiry forms save the details entered in those forms.</p>
          <p>The browser stores cart, wishlist, currency, and display preferences in local storage. The server also uses request IP information for short-lived rate limits on sensitive endpoints.</p>
        </section>
        <section className="space-y-3 border-t border-stone-100 pt-6">
          <h2 className="font-bold text-stone-900">Payments</h2>
          <p>Cash on Delivery is currently available for Bangladesh checkout. If SSLCommerz is configured, payment details are entered on its hosted checkout; soplol stores the order and provider transaction references, not card numbers or mobile banking PINs. An order is marked paid only after server-side provider validation.</p>
        </section>
        <section className="space-y-3 border-t border-stone-100 pt-6">
          <h2 className="font-bold text-stone-900">Service providers and use</h2>
          <p>Order and inquiry data is stored in the soplol storefront database. Payment information needed to complete a hosted payment is sent to SSLCommerz when that payment option is active. Information may also be disclosed when required to respond to a valid legal request.</p>
          <p>Data is used to maintain accounts, process and track orders, and review submitted inquiries. The storefront does not currently send automatic email or SMS notifications.</p>
        </section>
        <section className="space-y-3 border-t border-stone-100 pt-6">
          <h2 className="font-bold text-stone-900">Privacy questions</h2>
          <p>For questions or a request about your data, use the contact form. Include the account email or order number needed to identify the record.</p>
          <Link href="/contact" className="inline-block font-semibold text-[#D9531E] underline">Contact soplol</Link>
        </section>
      </div>
    </main>
  );
}
