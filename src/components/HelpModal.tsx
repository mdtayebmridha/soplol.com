'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, HelpCircle, Mail, FileText, ArrowRight, CheckCircle2 } from 'lucide-react';
import { submitInquiry } from '@/lib/submit-inquiry';

export default function HelpModal() {
  const { isHelpModalOpen, setIsHelpModalOpen, showToast } = useShop();
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactName, setContactName] = useState('');
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  if (!isHelpModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const saved = await submitInquiry({
        type: 'CONTACT',
        name: contactName,
        email: contactEmail,
        subject,
        details: { message },
      });
      setReference(saved.reference);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setIsHelpModalOpen(false);
        setSubject('');
        setMessage('');
        setContactEmail('');
        setContactName('');
        setReference('');
      }, 2500);
      showToast('Your support request was saved.');
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'The support request could not be saved.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsHelpModalOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => setIsHelpModalOpen(false)}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-amber-100 text-[#242735] rounded-full flex items-center justify-center mx-auto mb-3">
              <HelpCircle className="w-6 h-6" />
            </div>
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">How can we help you?</h3>
            <p className="text-xs text-stone-500 mt-1">
              Get in touch with soplol support or check our quick resources below.
            </p>
          </div>

          {submitted ? (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-14 h-14 bg-amber-100 text-slate-800 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h4 className="text-base font-bold text-stone-900">Message Received!</h4>
              <p className="text-xs text-stone-500">Your message is saved. Reference: <strong>{reference}</strong></p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3.5 border-t border-stone-100 pt-4">
              <h4 className="text-xs font-bold text-stone-800 uppercase tracking-wider">Send us a message</h4>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your name"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#242735] focus:bg-white focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Your Email</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#242735] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">Subject / Order ID</label>
                <div className="relative flex items-center">
                  <FileText className="absolute left-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Question about order #SPL-1002"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#242735] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-1">How can we help?</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your issue or question..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#242735] focus:bg-white focus:outline-none transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-[#242735] hover:bg-[#191C28] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Submit Request
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
