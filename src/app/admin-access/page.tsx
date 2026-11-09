import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import AdminAccessForm from './AdminAccessForm';

export const metadata: Metadata = {
  title: 'Admin Access | soplol',
  robots: { index: false, follow: false },
};

export default function AdminAccessPage() {
  return (
    <main className="min-h-screen bg-[#FAF9F6] px-4 py-16 flex items-center justify-center">
      <section className="w-full max-w-md rounded-3xl border border-stone-200 bg-white p-8 shadow-sm sm:p-10">
        <Link href="/" className="mb-8 inline-block">
          <Image src="/brand-text.png" alt="soplol" width={130} height={44} className="h-8 w-auto" />
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-stone-950">Admin access</h1>
        <p className="mt-2 mb-7 text-sm leading-relaxed text-stone-600">
          Enter the private access key to continue to the store management panel.
        </p>
        <AdminAccessForm />
      </section>
    </main>
  );
}
