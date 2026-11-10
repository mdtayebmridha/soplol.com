'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { Package, LogIn } from 'lucide-react';

type CustomerOrder = {
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: 'cod' | 'sslcommerz';
  currency: string;
  total: number;
  items: { title: string; quantity: number }[];
};

export default function CustomerOrdersPage() {
  const router = useRouter();
  const { currentUser, setCurrentUser, setAuthMode, setIsAuthModalOpen } = useShop();
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    fetch('/api/account/orders', { cache: 'no-store' })
      .then(async (response) => {
        const result = await response.json() as { orders?: CustomerOrder[]; error?: string };
        if (!response.ok) throw new Error(result.error || 'Your orders could not be loaded.');
        if (active) setOrders(result.orders ?? []);
      })
      .catch((cause: unknown) => {
        if (active) setError(cause instanceof Error ? cause.message : 'Your orders could not be loaded.');
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [currentUser]);

  const signOut = async () => {
    const response = await fetch('/api/auth/signout', { method: 'POST' });
    if (!response.ok) {
      setError('We could not sign you out. Please try again.');
      return;
    }
    setCurrentUser(null);
    router.push('/');
  };

  return (
    <main className="min-h-[60vh] bg-[#F3EDE3] px-4 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#242735]">Customer account</p>
            <h1 className="mt-1 text-3xl font-serif font-bold text-stone-900">Your orders</h1>
            {currentUser && <p className="mt-2 text-sm text-stone-600">Signed in as {currentUser.email}</p>}
          </div>
          {currentUser && <button onClick={() => void signOut()} className="text-sm font-semibold text-stone-600 hover:text-[#242735]">Sign out</button>}
        </header>

        {loading ? (
          <div className="rounded-2xl border border-stone-200 bg-white p-8 text-sm text-stone-600">Loading your orders…</div>
        ) : error ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <p className="text-sm text-stone-700">{error}</p>
            {!currentUser && (
              <button
                onClick={() => { setAuthMode('signin'); setIsAuthModalOpen(true); }}
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-[#242735] px-5 py-2.5 text-sm font-bold text-white"
              >
                <LogIn className="h-4 w-4" /> Sign in
              </button>
            )}
          </section>
        ) : orders.length === 0 ? (
          <section className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
            <Package className="mx-auto h-8 w-8 text-stone-400" />
            <p className="mt-3 font-semibold text-stone-800">No account orders yet</p>
            <p className="mt-1 text-sm text-stone-600">Orders placed while signed in will appear here.</p>
            <Link href="/shop" className="mt-5 inline-block rounded-full bg-[#242735] px-5 py-2.5 text-sm font-bold text-white">Browse the catalog</Link>
          </section>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.orderNumber} className="rounded-2xl border border-stone-200 bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-start justify-between gap-3 border-b border-stone-100 pb-4">
                  <div>
                    <h2 className="font-bold text-stone-900">{order.orderNumber}</h2>
                    <p className="mt-1 text-xs text-stone-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-stone-900">{order.currency} {order.total.toLocaleString()}</p>
                    <p className="mt-1 text-xs capitalize text-stone-600">{order.orderStatus} · {order.paymentStatus}</p>
                  </div>
                </div>
                <ul className="mt-4 space-y-2 text-sm text-stone-700">
                  {order.items.map((item, index) => <li key={`${order.orderNumber}-${index}`}>{item.title} <span className="text-stone-500">× {item.quantity}</span></li>)}
                </ul>
                <Link href={`/track-order`} className="mt-4 inline-block text-xs font-semibold text-[#242735] hover:underline">Track this order</Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
