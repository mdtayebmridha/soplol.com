'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Truck, CheckCircle2, AlertCircle } from 'lucide-react';

type TrackedOrder = {
  orderNumber: string;
  createdAt: string;
  orderStatus: string;
  currency: 'BDT' | 'USD';
  total: number;
  deliveryArea: string;
  country: string;
  paymentMethod: string;
  items: { title: string; quantity: number }[];
};

export default function TrackOrderPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [phone, setPhone] = useState('');
  const [searched, setSearched] = useState(false);
  const [matchedOrder, setMatchedOrder] = useState<TrackedOrder | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setSearched(false);
    setMatchedOrder(null);
    setErrorMessage('');
    try {
      const response = await fetch('/api/orders/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderNumber: searchQuery, phone }),
      });
      const result = await response.json();
      if (!response.ok) {
        setErrorMessage(result.error || 'No matching order was found.');
      } else {
        setMatchedOrder(result.order as TrackedOrder);
      }
    } catch {
      setErrorMessage('Order tracking is temporarily unavailable. Please try again.');
    } finally {
      setSearched(true);
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="text-center space-y-3 mb-10">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
          Order Status
        </span>
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight">
          Track Your Shipment
        </h1>
        <p className="text-sm text-neutral-500 max-w-md mx-auto">
          Enter your order number and the phone number used at checkout.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2 pt-4">
          <div className="relative flex-1">
            <input
              type="text"
              required
              placeholder="Order number (SPL-2026-12345678)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-neutral-900 shadow-xs"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-3.5" />
          </div>
          <input
            type="tel"
            required
            autoComplete="tel"
            placeholder="Checkout phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-neutral-900 shadow-xs"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs disabled:opacity-60"
          >
            {isSearching ? 'Checking…' : 'Track'}
          </button>
        </form>
      </div>

      {searched && (
        <div>
          {matchedOrder ? (
            <div className="bg-white rounded-2xl border border-neutral-200/90 shadow-sm p-6 sm:p-8 space-y-8">
              {/* Order Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-100">
                <div>
                  <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">
                    Order Reference
                  </span>
                  <h3 className="text-xl font-black text-neutral-900">
                    {matchedOrder.orderNumber}
                  </h3>
                  <p className="text-xs text-neutral-500">
                    Placed on {new Date(matchedOrder.createdAt).toLocaleDateString()}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-amber-50 text-slate-900 border border-slate-200 rounded-full text-xs font-bold uppercase tracking-wider">
                    Status: {matchedOrder.orderStatus}
                  </span>
                </div>
              </div>

              {/* Step Progress Tracker */}
              <div className="relative">
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Step 1 */}
                  <div className="space-y-2">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center mx-auto shadow-xs">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 block">Order Placed</span>
                    <span className="text-[10px] text-neutral-400">Order saved</span>
                  </div>

                  {/* Step 2 */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-xs ${
                        ['confirmed', 'processing', 'shipped', 'delivered'].includes(matchedOrder.orderStatus)
                          ? 'bg-slate-800 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <Package className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 block">Packaging</span>
                    <span className="text-[10px] text-neutral-400">
                      {['confirmed', 'processing', 'shipped', 'delivered'].includes(matchedOrder.orderStatus)
                        ? 'Processing'
                        : 'Awaiting confirmation'}
                    </span>
                  </div>

                  {/* Step 3 */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-xs ${
                        ['shipped', 'delivered'].includes(matchedOrder.orderStatus)
                          ? 'bg-slate-800 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <Truck className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 block">In Transit</span>
                    <span className="text-[10px] text-neutral-400">
                      {['shipped', 'delivered'].includes(matchedOrder.orderStatus) ? 'Shipped' : 'Not shipped'}
                    </span>
                  </div>

                  {/* Step 4 */}
                  <div className="space-y-2">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center mx-auto shadow-xs ${
                        matchedOrder.orderStatus === 'delivered'
                          ? 'bg-slate-800 text-white'
                          : 'bg-neutral-100 text-neutral-400'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-neutral-900 block">Delivered</span>
                    <span className="text-[10px] text-neutral-400">
                      {matchedOrder.orderStatus === 'delivered' ? 'Completed' : 'Pending'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Delivery Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100 text-xs">
                <div>
                  <h5 className="font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Delivery destination
                  </h5>
                  <p className="text-neutral-900 font-semibold">{matchedOrder.deliveryArea}</p>
                  <p className="text-neutral-600">{matchedOrder.country}</p>
                  <p className="text-neutral-500 pt-1">Full address is kept private.</p>
                </div>

                <div>
                  <h5 className="font-bold text-neutral-700 uppercase tracking-wider mb-1">
                    Items & Billing
                  </h5>
                  <p className="text-neutral-600">{matchedOrder.items.length} product line(s)</p>
                  <ul className="mt-2 space-y-1 text-neutral-600">
                    {matchedOrder.items.map((item, index) => (
                      <li key={`${item.title}-${index}`}>{item.title} × {item.quantity}</li>
                    ))}
                  </ul>
                  <p className="text-neutral-900 font-bold text-sm pt-1">
                    Total: {matchedOrder.currency === 'BDT' ? `৳${matchedOrder.total.toLocaleString()}` : `$${matchedOrder.total.toFixed(2)}`}
                  </p>
                  <p className="text-neutral-500 capitalize">Payment: {matchedOrder.paymentMethod.replace('_', ' ')}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-neutral-200 p-10 text-center max-w-md mx-auto">
              <AlertCircle className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h4 className="text-base font-bold text-neutral-900 mb-1">
                {errorMessage.includes('unavailable') || errorMessage.includes('Too many')
                  ? 'Tracking Unavailable'
                  : 'No Order Found'}
              </h4>
              <p className="text-xs text-neutral-500 mb-4">
                {errorMessage || 'Check the order number and checkout phone number, then try again.'}
              </p>
              <Link
                href="/shop"
                className="text-xs font-semibold text-neutral-900 underline"
              >
                Go to Shop
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
