'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, RefreshCw, Truck, Globe } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#F3F0E9] text-stone-600 pt-16 pb-8 border-t border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Value Propositions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-12 border-b border-stone-200 text-stone-600">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D9531E]">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Bangladesh Checkout</h4>
              <p className="text-xs">Cash on Delivery available</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D9531E]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Product Catalog</h4>
              <p className="text-xs">Browse all listed items</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D9531E]">
              <RefreshCw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Order Status</h4>
              <p className="text-xs">Look up orders with your details</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 text-[#D9531E]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">Customer Account</h4>
              <Link href="/account/orders" className="text-xs hover:text-[#D9531E]">Sign in and view account orders</Link>
            </div>
          </div>
        </div>

        {/* Links & Brand Description */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-stone-200">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-block group">
              <Image
                src="/brand-text.png"
                alt="soplol"
                width={130}
                height={44}
                className="h-8 w-auto object-contain transition-opacity group-hover:opacity-90"
              />
            </Link>
            <p className="text-xs text-stone-600 leading-relaxed max-w-sm">
              Explore fashion, gifts, home accents, and office accessories in the soplol catalog. Current order and payment options are shown during checkout.
            </p>
            <Link href="/contact" className="text-xs font-semibold text-[#D9531E] hover:underline">Contact us</Link>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">Categories</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/shop?category=fashion&sub=men" className="hover:text-[#D9531E] transition-colors">
                  Men&apos;s Fashion
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fashion&sub=women" className="hover:text-[#D9531E] transition-colors">
                  Women&apos;s Ethnic & Modern
                </Link>
              </li>
              <li>
                <Link href="/shop?category=fashion&sub=boys" className="hover:text-[#D9531E] transition-colors">
                  Boys & Girls Collection
                </Link>
              </li>
              <li>
                <Link href="/shop?category=gifts" className="hover:text-[#D9531E] transition-colors">
                  Personalized Gifts & Hampers
                </Link>
              </li>
              <li>
                <Link href="/shop?category=home" className="hover:text-[#D9531E] transition-colors">
                  Home Decor & Living
                </Link>
              </li>
              <li>
                <Link href="/shop?category=office" className="hover:text-[#D9531E] transition-colors">
                  Desk & Office Accessories
                </Link>
              </li>
            </ul>
          </div>

          {/* About & Partners */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">About & Growth</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/about" className="hover:text-[#D9531E] transition-colors">
                  About soplol
                </Link>
              </li>
              <li>
                <Link href="/sell" className="hover:text-[#D9531E] transition-colors font-semibold">
                  Sell on soplol (Vendor Portal)
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifting" className="hover:text-[#D9531E] transition-colors">
                  Corporate & Wedding Bulk
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="hover:text-[#D9531E] transition-colors">
                  Size & Measurement Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-4">Customer Care</h4>
            <ul className="space-y-2 text-xs text-stone-600">
              <li>
                <Link href="/track-order" className="hover:text-[#D9531E] transition-colors">
                  Track Your Shipment
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-[#D9531E] transition-colors">
                  Contact Customer Support
                </Link>
              </li>
              <li>
                <Link href="/shipping-policy" className="hover:text-[#D9531E] transition-colors">
                  Shipping Rates (Bangladesh)
                </Link>
              </li>
              <li>
                <Link href="/returns-exchange" className="hover:text-[#D9531E] transition-colors">
                  Returns & Exchange Policy
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[#D9531E] transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Legal Policies, Payment Badges & Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <div className="flex flex-wrap items-center gap-4">
            <p>© 2026 soplol.com. All rights reserved.</p>
            <span className="text-stone-300">•</span>
            <Link href="/privacy-policy" className="hover:text-[#D9531E] transition-colors">
              Privacy Policy
            </Link>
            <span className="text-stone-300">•</span>
            <Link href="/terms" className="hover:text-[#D9531E] transition-colors">
              Terms of Service
            </Link>
          </div>

          <p className="text-[11px] text-stone-600">Cash on Delivery in Bangladesh. Current payment options appear at checkout.</p>
        </div>
      </div>
    </footer>
  );
}
