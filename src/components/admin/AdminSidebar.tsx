'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { logoutAdmin } from '@/app/admin-access/actions';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Layout,
  ShoppingCart,
  Boxes,
  Users,
  CreditCard,
  Truck,
  Tag,
  Globe,
  BarChart3,
  FileText,
  HelpCircle,
  ShieldCheck,
  Cpu,
  Settings,
  Store,
  ChevronRight,
  Menu,
  X,
} from 'lucide-react';

export default function AdminSidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const menuGroups = [
    {
      title: 'Main',
      items: [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products & Catalog', href: '/admin/products', icon: Package },
        { name: 'Categories & Collections', href: '/admin/categories', icon: FolderTree },
        { name: 'Store Design', href: '/admin/store-design', icon: Layout },
      ],
    },
    {
      title: 'Operations',
      items: [
        { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
        { name: 'Inventory', href: '/admin/inventory', icon: Boxes },
        { name: 'Customers', href: '/admin/customers', icon: Users },
        { name: 'Payments & Finance', href: '/admin/payments', icon: CreditCard },
        { name: 'Shipping & Delivery', href: '/admin/shipping', icon: Truck },
      ],
    },
    {
      title: 'Growth & Management',
      items: [
        { name: 'Marketing', href: '/admin/marketing', icon: Tag },
        { name: 'Markets & Localization', href: '/admin/markets', icon: Globe },
        { name: 'Analytics & Reports', href: '/admin/analytics', icon: BarChart3 },
        { name: 'Content & Pages', href: '/admin/content', icon: FileText },
        { name: 'Support', href: '/admin/support', icon: HelpCircle },
      ],
    },
    {
      title: 'System & Security',
      items: [
        { name: 'Staff & Permissions', href: '/admin/staff', icon: ShieldCheck },
        { name: 'Integrations', href: '/admin/integrations', icon: Cpu },
        { name: 'Settings & Security', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  return (
    <div className="h-screen bg-stone-100 flex overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`bg-[#242735] text-white w-72 shrink-0 flex flex-col shadow-xl transition-all h-screen overflow-hidden border-r border-stone-800 ${
          sidebarOpen ? 'flex' : 'hidden lg:flex'
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-20 px-5 flex items-center justify-between border-b border-stone-800 bg-[#191C28]">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="bg-white p-1.5 rounded-xl shadow-md flex items-center justify-center shrink-0">
              <Image
                src="/brand-text.png"
                alt="soplol logo"
                width={85}
                height={26}
                className="h-5 w-auto object-contain"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-black tracking-wider text-white">
                SOPLOL
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-stone-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Nav Items */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6 scrollbar-none text-xs">
          {menuGroups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              <span className="px-3 text-[10px] font-bold uppercase tracking-widest text-stone-400">
                {group.title}
              </span>
              <div className="space-y-0.5 mt-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-medium transition-all ${
                        isActive
                          ? 'bg-[#242735] text-white font-bold shadow-md'
                          : 'text-stone-300 hover:bg-stone-800/70 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 shrink-0" />
                        <span>{item.name}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-900/50">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold text-white block">Admin Session</span>
              <span className="text-[10px] text-stone-400">Private access</span>
            </div>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/shop"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[10px] font-bold text-center transition-colors"
              >
                Storefront
              </Link>
              <form action={logoutAdmin}>
                <button
                  type="submit"
                  className="w-full px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-lg text-[10px] font-bold transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden h-screen">
        {/* Top Navbar */}
        <header className="h-20 bg-white border-b border-stone-200 px-8 flex items-center justify-between shrink-0 z-30">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-stone-700 hover:bg-stone-100 rounded-xl"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-sm sm:text-base font-bold text-stone-900">
              SOPLOL Enterprise Control Center
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-slate-800 text-xs font-semibold border border-slate-200">
              <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
              Live Server
            </span>
            <Link
              href="/shop"
              className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-xl transition-colors"
            >
              View Store
            </Link>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
