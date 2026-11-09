'use client';

import React, { useState } from 'react';
import { useShop } from '@/context/ShopContext';
import { X, Mail, Lock, User, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export default function AuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, authMode, setAuthMode, showToast, setCurrentUser } = useShop();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`/api/auth/${authMode === 'signup' ? 'signup' : 'signin'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authMode === 'signup' ? { name, email, password } : { email, password }),
      });
      const data = await response.json().catch(() => ({})) as { user?: { name: string; email: string }; error?: string };
      if (!response.ok || !data.user) throw new Error(data.error ?? 'Authentication failed.');
      setCurrentUser(data.user);
      setSuccess(true);
      showToast(authMode === 'signup' ? 'Account created successfully! Welcome to soplol.' : 'Signed in successfully!');
      setTimeout(() => {
        setSuccess(false);
        setIsAuthModalOpen(false);
        setEmail('');
        setPassword('');
        setName('');
      }, 900);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsAuthModalOpen(false)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-in">
        {/* Close Button */}
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute right-4 top-4 p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-stone-900 tracking-tight">
              {authMode === 'signup' ? 'Create your soplol account' : 'Welcome back to soplol'}
            </h3>
            <p className="text-xs text-stone-500 mt-1">
              {authMode === 'signup'
                ? 'Create an account to view orders placed while signed in.'
                : 'Sign in to view orders linked to your account.'}
            </p>
          </div>

          {success ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center animate-bounce">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-stone-900">
                {authMode === 'signup' ? 'Account Created!' : 'Signed In Successfully!'}
              </h4>
              <p className="text-xs text-stone-500">Redirecting you to soplol...</p>
            </div>
          ) : (
            <>
              {/* Demo Quick Login Banner */}
              <div className="mb-4 p-3 bg-amber-50/90 border border-amber-200 rounded-xl flex items-center justify-between gap-2">
                <div className="text-left">
                  <span className="inline-block px-1.5 py-0.5 bg-amber-200 text-amber-900 font-bold rounded text-[10px] uppercase tracking-wider mb-0.5">
                    Demo Review Account
                  </span>
                  <p className="text-[11px] text-stone-600 font-mono">
                    demo@soplol.com &bull; demo1234
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setAuthMode('signin');
                    setEmail('demo@soplol.com');
                    setPassword('demo1234');
                  }}
                  className="shrink-0 px-3 py-1.5 bg-[#D9531E] hover:bg-[#BA4113] text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer shadow-xs"
                >
                  Auto-fill
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
              {authMode === 'signup' && (
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Full Name</label>
                  <div className="relative flex items-center">
                    <User className="absolute left-3.5 w-4 h-4 text-stone-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Tanvir Ahmed"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#D9531E] focus:bg-white focus:outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#D9531E] focus:bg-white focus:outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Password</label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3.5 w-4 h-4 text-stone-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 bg-stone-50 text-xs sm:text-sm text-stone-900 rounded-xl border border-stone-200 focus:border-[#D9531E] focus:bg-white focus:outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-stone-400 hover:text-stone-700 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-[#D9531E] hover:bg-[#BA4113] text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md active:scale-[0.99] disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    {authMode === 'signup' ? 'Create Account' : 'Sign In'}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Mode switch */}
              <div className="text-center pt-3">
                {authMode === 'signup' ? (
                  <p className="text-xs text-stone-600">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signin')}
                      className="text-[#D9531E] font-bold hover:underline"
                    >
                      Sign In
                    </button>
                  </p>
                ) : (
                  <p className="text-xs text-stone-600">
                    Don&apos;t have a soplol account?{' '}
                    <button
                      type="button"
                      onClick={() => setAuthMode('signup')}
                      className="text-[#D9531E] font-bold hover:underline"
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </form>
          </>
        )}
        </div>
      </div>
    </div>
  );
}
