import Link from 'next/link';
import { ArrowRight, ShoppingBag } from 'lucide-react';

export default function AboutPage() {
  return (
    <main className="mx-auto max-w-4xl space-y-12 px-4 py-16 text-stone-900">
      <header className="space-y-4 border-b border-stone-200 pb-8 text-center">
        <span className="text-xs font-bold uppercase tracking-widest text-[#D9531E]">About soplol</span>
        <h1 className="font-serif text-3xl font-black tracking-tight sm:text-5xl">A catalog for everyday finds and thoughtful gifts.</h1>
        <p className="mx-auto max-w-2xl text-sm leading-relaxed text-stone-600">Explore fashion, gifts, home accents, and office accessories. Product details are shown on each listing; delivery coverage and payment options are shown at checkout.</p>
      </header>
      <section className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
          <ShoppingBag className="h-6 w-6 text-[#D9531E]" />
          <h2 className="font-bold">Browse the catalog</h2>
          <p className="text-sm leading-relaxed text-stone-600">Review product descriptions, prices, and available options before adding an item to your cart.</p>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#D9531E]">Shop products <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="space-y-3 rounded-2xl border border-stone-200 bg-white p-6">
          <h2 className="font-bold">Questions or seller application?</h2>
          <p className="text-sm leading-relaxed text-stone-600">Use the contact form for questions, or send a seller application for review.</p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold text-[#D9531E]">
            <Link href="/contact">Contact soplol</Link>
            <Link href="/sell">Sell on soplol</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
