'use client';

import React, { Suspense } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { usePathname } from 'next/navigation';
import { Wrench } from 'lucide-react';

function AdminPlaceholderContent() {
  const pathname = usePathname();
  const segments = pathname.split('/');
  const rawTitle = segments[segments.length - 1] || 'Dashboard';
  const title = rawTitle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  return (
    <AdminSidebar>
      <div className="max-w-4xl mx-auto py-16 px-4 text-center space-y-6">
        <div className="w-16 h-16 bg-orange-100 text-[#D9531E] rounded-2xl flex items-center justify-center mx-auto shadow-inner">
          <Wrench className="w-8 h-8 animate-pulse" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900">
            {title} Module
          </h1>
          <p className="text-sm text-neutral-500 max-w-md mx-auto">
            This module is part of the SOPLOL Enterprise Admin Architecture and is ready for customized implementation or data hookup.
          </p>
        </div>
        <div className="pt-4">
          <a
            href="/admin"
            className="inline-flex items-center justify-center px-6 py-3 bg-[#D9531E] hover:bg-[#BA4113] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all"
          >
            Back to Dashboard
          </a>
        </div>
      </div>
    </AdminSidebar>
  );
}

export default function AdminPlaceholderPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs">Loading Admin Module...</div>}>
      <AdminPlaceholderContent />
    </Suspense>
  );
}
