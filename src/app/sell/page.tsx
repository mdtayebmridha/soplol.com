'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { submitInquiry } from '@/lib/submit-inquiry';
import {
  Store,
  Globe,
  Truck,
  CheckCircle2,
  Send,
  DollarSign,
} from 'lucide-react';

export default function SellOnSoplolPage() {
  const { showToast } = useShop();

  const [sellerName, setSellerName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [category, setCategory] = useState('fashion');
  const [portfolioUrl, setPortfolioUrl] = useState('');
  const [description, setDescription] = useState('');
  const [applied, setApplied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sellerName || !storeName || !phone || !email) {
      showToast('Please fill in all required seller details');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitInquiry({
        type: 'SELLER_APPLICATION',
        name: sellerName,
        email,
        phone,
        subject: 'Seller application',
        details: { storeName, category, portfolioUrl, description },
      });
      setReference(saved.reference);
      setApplied(true);
      showToast('Your seller application was saved.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'The application could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F4EE] text-stone-900 pb-20 space-y-16">
      {/* Hero Banner */}
      <section className="bg-[#E7DED0] border-b border-stone-200/80 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#242735]">
            <Store className="w-3.5 h-3.5 text-[#242735]" />
            Seller applications
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
            Apply to list your products in the soplol catalog.
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Share information about your products and business. We will review your application and contact you using the details you provide.
          </p>
        </div>
      </section>

      {/* 3 Pillars of Why Sell on soplol */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl font-serif font-bold text-stone-900">
            Seller application information
          </h2>
          <p className="text-xs text-stone-500">Review current onboarding details before submitting an application.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-[#242735] flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Application intake</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Applications are stored for review. Submission does not activate a seller account or publish products.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-slate-900 flex items-center justify-center">
              <DollarSign className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Seller terms</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Seller fees, commissions, payment collection, and payouts have not been configured. These terms must be confirmed before any seller partnership begins.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-slate-800 flex items-center justify-center">
              <Truck className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-base text-stone-900">Fulfillment arrangements</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Courier partners, delivery coverage, and dispatch automation have not been configured. Shipping arrangements must be confirmed before onboarding.
            </p>
          </div>
        </div>
      </section>

      {/* Seller Application Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2 border-b border-stone-100 pb-5">
            <h2 className="text-2xl font-serif font-black text-stone-900">
              Submit a Seller Application
            </h2>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Share a few details about your products and business. The form will save your application and provide a reference number.
            </p>
          </div>

          {applied ? (
            <div className="p-8 text-center bg-amber-50 border border-slate-200 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-slate-800 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">
                Application Received for &quot;{storeName}&quot;!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you, <strong>{sellerName}</strong>. Your application has been saved for review. Reference: <strong>{reference}</strong>.
              </p>
              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-[#242735] text-white rounded-full text-xs font-bold uppercase tracking-wider"
                >
                  Return to Storefront
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleApply} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahfuzur Rahman"
                    value={sellerName}
                    onChange={(e) => setSellerName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Proposed Store / Brand Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bengal Leather Craft"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Direct Phone Number (WhatsApp Enabled) *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="017XXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Business Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="store@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Primary Product Craft Category *
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735] font-medium"
                  >
                    <option value="fashion">Fashion & Apparel (Men/Women/Kids)</option>
                    <option value="gifts">Bespoke Gifts & Personalized Sets</option>
                    <option value="home">Home Decor, Ceramics & Rugs</option>
                    <option value="office">Office Accessories & Stationery</option>
                    <option value="jewelry">Jewelry & Craft Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Instagram, Facebook Page or Portfolio URL
                  </label>
                  <input
                    type="url"
                    placeholder="https://instagram.com/yourbrand"
                    value={portfolioUrl}
                    onChange={(e) => setPortfolioUrl(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Tell us about your craft, production capacity & materials used
                </label>
                <textarea
                  rows={4}
                  placeholder="Where is your workshop based? What materials do you use (e.g. 100% cotton, vegetable-tanned leather, terracotta)? How many pieces can you produce monthly?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#242735] hover:bg-[#191C28] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Saving Application…' : 'Submit Seller Application'}
              </button>

              <p className="text-[11px] text-stone-400 text-center pt-1">
                Submitting saves an inquiry. It does not create a seller account or accept commercial terms.
              </p>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
