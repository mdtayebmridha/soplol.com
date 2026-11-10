'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { submitInquiry } from '@/lib/submit-inquiry';
import { Gift, CheckCircle2, Send } from 'lucide-react';

export default function CorporateGiftingPage() {
  const { showToast } = useShop();

  const [companyName, setCompanyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [quantity, setQuantity] = useState('50-100');
  const [occasion, setOccasion] = useState('corporate_appreciation');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName || !contactName || !email || !phone) {
      showToast('Please fill in required contact information');
      return;
    }
    setIsSubmitting(true);
    try {
      const saved = await submitInquiry({
        type: 'CORPORATE_GIFTING',
        name: contactName,
        email,
        phone,
        subject: 'Corporate gifting quote request',
        details: { companyName, quantity, occasion, message: details },
      });
      setReference(saved.reference);
      setSubmitted(true);
      showToast('Your corporate inquiry was saved.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'The inquiry could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F4EE] text-stone-900 pb-20 space-y-16">
      {/* Header */}
      <section className="bg-[#E7DED0] border-b border-stone-200/80 py-16 sm:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-[#242735]">
            <Gift className="w-3.5 h-3.5 text-[#242735]" />
            Bespoke Bulk Services
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight leading-tight">
            Corporate Gifting & Wedding Celebration Hampers
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Share your corporate or event gifting requirements. Product availability, customization, pricing, and delivery details must be confirmed before an order is accepted.
          </p>
        </div>
      </section>

      {/* Why Choose Us for Bulk Orders */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h3 className="font-serif font-bold text-base text-stone-900">Gift requirements</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Use the inquiry form to describe the items, quantities, and any requested personalization.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h3 className="font-serif font-bold text-base text-stone-900">Pricing confirmation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Bulk pricing, minimum quantities, and order availability are not configured. They must be confirmed before a quote is accepted.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-2">
            <h3 className="font-serif font-bold text-base text-stone-900">Delivery confirmation</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Delivery coverage and timelines must be confirmed for the requested destination before an order is placed.
            </p>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-10 shadow-sm space-y-6">
          <div className="text-center space-y-2 border-b border-stone-100 pb-5">
            <h2 className="text-2xl font-serif font-black text-stone-900">
              Request a Bespoke Quotation
            </h2>
            <p className="text-xs text-stone-500">
              Tell us about your estimated quantity and timeline. We will prepare custom mockups and pricing samples.
            </p>
          </div>

          {submitted ? (
            <div className="p-8 text-center bg-amber-50 border border-slate-200 rounded-2xl space-y-3">
              <CheckCircle2 className="w-12 h-12 text-slate-800 mx-auto" />
              <h3 className="text-base font-bold text-stone-900">
                Inquiry Received for {companyName}!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Thank you, <strong>{contactName}</strong>. Your request is saved. Reference: <strong>{reference}</strong>.
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
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Company / Event / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Grameenphone / Rahman Wedding"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Contact Person Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Farhan Chowdhury"
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="farhan@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Phone Number (WhatsApp) *
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
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Estimated Quantity *
                  </label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735] font-medium"
                  >
                    <option value="25-50">25 – 50 Gift Sets</option>
                    <option value="50-100">50 – 100 Gift Sets</option>
                    <option value="100-300">100 – 300 Gift Sets</option>
                    <option value="300-1000">300 – 1,000 Gift Sets</option>
                    <option value="1000+">1,000+ Large Corporate Rollout</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Occasion / Event Type *
                  </label>
                  <select
                    value={occasion}
                    onChange={(e) => setOccasion(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735] font-medium"
                  >
                    <option value="corporate_appreciation">Corporate Client & Employee Appreciation</option>
                    <option value="new_year_eid">Eid / New Year Festive Gifting</option>
                    <option value="wedding_souvenirs">Wedding & Celebration Keepsakes</option>
                    <option value="conference_swag">Conference & Executive VIP Kits</option>
                    <option value="other">Other Bespoke Requirement</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Customization Details & Delivery Deadline
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us what items you're interested in (e.g. Leather wallet sets, scented candles, brass pens), your branding needs, and target delivery date..."
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-[#242735] hover:bg-[#191C28] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Saving…' : 'Submit Bulk Quote Request'}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
}
