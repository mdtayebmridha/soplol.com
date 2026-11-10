'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { submitInquiry } from '@/lib/submit-inquiry';
import {
  Send,
  CheckCircle2,
} from 'lucide-react';

export default function ContactPage() {
  const { showToast } = useShop();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('order_inquiry');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reference, setReference] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      showToast('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    try {
      const saved = await submitInquiry({
        type: 'CONTACT',
        name,
        email,
        phone,
        subject,
        details: { message },
      });
      setReference(saved.reference);
      setSubmitted(true);
      showToast('Your message was saved.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'The message could not be saved.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F4EE] text-stone-900 pb-20 space-y-12">
      {/* Header */}
      <section className="bg-[#E7DED0] border-b border-stone-200/80 py-12 sm:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[#242735]">
            We&apos;re Here to Help
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-stone-900 tracking-tight">
            Contact soplol Customer Care
          </h1>
          <p className="text-stone-600 text-xs sm:text-sm font-light max-w-xl mx-auto leading-relaxed">
            Send a question about an order or an item in the catalog.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Contact information */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3 text-xs text-stone-600">
              <h3 className="text-sm font-serif font-bold text-stone-900">Contact soplol</h3>
              <p>Use the form to send an order or product question. Your request will be saved with a reference number.</p>
            </div>
            <div className="p-5 bg-stone-100 rounded-2xl border border-stone-200 text-xs flex items-center justify-between">
              <div>
                <strong className="text-stone-900 block font-semibold">Looking for quick answers?</strong>
                <span className="text-stone-500">See current order and checkout information.</span>
              </div>
              <Link href="/faq" className="px-3.5 py-1.5 bg-stone-900 text-white rounded-lg font-bold text-[11px] hover:bg-stone-800 transition-colors shrink-0">
                View FAQ
              </Link>
            </div>
          </div>
          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-2xs">
              <h2 className="text-xl font-serif font-bold text-stone-900 mb-1">
                Send Us a Message
              </h2>
              <p className="text-xs text-stone-500 mb-6">
                Fill in the form below. We will show a reference number when your message has been saved.
              </p>

              {submitted ? (
                <div className="p-8 text-center bg-amber-50 border border-slate-200 rounded-2xl space-y-3">
                  <CheckCircle2 className="w-12 h-12 text-slate-800 mx-auto" />
                  <h3 className="text-base font-bold text-stone-900">Thank You, {name}!</h3>
                  <p className="text-xs text-stone-600 max-w-sm mx-auto">
                    Your message about &quot;{subject}&quot; is saved. Reference: <strong>{reference}</strong>.
                  </p>
                  <button
                    onClick={() => { setSubmitted(false); setReference(''); }}
                    className="text-xs font-bold text-[#242735] underline pt-2"
                  >
                    Send another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ayesha Rahman"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        placeholder="ayesha@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Phone Number (Optional)
                      </label>
                      <input
                        type="tel"
                        placeholder="017XXXXXXXX"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-stone-700 block mb-1">
                        Subject / Inquiry Type *
                      </label>
                      <select
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735] font-medium"
                      >
                        <option value="order_inquiry">Order Status & Tracking</option>
                        <option value="personalized_gifting">Custom Personalized Gift Set</option>
                        <option value="exchange_return">Size Exchange or Return</option>
                        <option value="corporate_bulk">Corporate & Wedding Bulk Order</option>
                        <option value="artisan_partnership">Artisan & Seller Collaboration</option>
                        <option value="other">General Question</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-700 block mb-1">
                      Your Message or Order Details *
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Please share details such as your Order Number (SPL-2026-XXXX) or specific customization requests..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:outline-none focus:border-[#242735]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-[#242735] hover:bg-[#191C28] text-white rounded-full font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
                  >
                    <Send className="w-4 h-4" />
                    {isSubmitting ? 'Saving…' : 'Submit Inquiry'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
