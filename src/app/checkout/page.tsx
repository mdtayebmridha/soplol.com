'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import { CHECKOUT_RULES, getCouponRate } from '@/lib/checkout-rules';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  Tag,
} from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const {
    cart,
    currency,
    cartSubtotalBDT,
    cartSubtotalUSD,
    formatPrice,
    clearCart,
    setCurrency,
    showToast,
  } = useShop();

  // Form states
  const [marketType, setMarketType] = useState<'bd' | 'intl'>('bd');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('Dhaka');
  const [country, setCountry] = useState('Bangladesh');
  const [postalCode, setPostalCode] = useState('');
  const [bdRegion, setBdRegion] = useState<'dhaka' | 'outside_dhaka'>('dhaka');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'sslcommerz'>('cod');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCouponCode, setAppliedCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sslcommerzEnabled, setSslcommerzEnabled] = useState(false);

  // Luxury Gift Wrap State
  const [addGiftWrap, setAddGiftWrap] = useState(false);
  const [giftWrapNote, setGiftWrapNote] = useState('');

  useEffect(() => {
    if (marketType === 'bd' && currency !== 'BDT') setCurrency('BDT');
  }, [marketType, currency, setCurrency]);

  useEffect(() => {
    fetch('/api/payments/sslcommerz/status', { cache: 'no-store' })
      .then(async (response) => response.ok ? response.json() as Promise<{ enabled: boolean }> : null)
      .then((status) => { if (status) setSslcommerzEnabled(status.enabled); })
      .catch(() => setSslcommerzEnabled(false));
  }, []);


  // International country list
  const intlCountries = [
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'United Arab Emirates',
    'Saudi Arabia',
    'Singapore',
    'Malaysia',
    'Germany',
    'Other International',
  ];

  // BD Districts list
  const bdDistricts = [
    'Dhaka',
    'Chattogram',
    'Sylhet',
    'Rajshahi',
    'Khulna',
    'Barishal',
    'Rangpur',
    'Mymensingh',
    'Cumilla',
    'Gazipur',
    'Narayanganj',
    'Bogura',
    'Other District',
  ];

  // Calculate Shipping
  const shippingFeeBDT = useMemo(() => {
    if (marketType === 'intl') {
      return 0;
    }
    return bdRegion === 'dhaka'
      ? CHECKOUT_RULES.shippingBDT.dhaka
      : CHECKOUT_RULES.shippingBDT.outside_dhaka;
  }, [marketType, bdRegion]);

  const shippingFeeUSD = useMemo(() => {
    if (marketType === 'intl') {
      return 0;
    }
    return bdRegion === 'dhaka' ? 1 : 2;
  }, [marketType, bdRegion]);

  const subtotal = currency === 'BDT' ? cartSubtotalBDT : cartSubtotalUSD;
  const shippingFee = currency === 'BDT' ? shippingFeeBDT : shippingFeeUSD;
  const giftWrapFee = addGiftWrap
    ? (currency === 'BDT' ? CHECKOUT_RULES.giftWrapFeeBDT : 1)
    : 0;
  const discountAmount = Math.round(subtotal * appliedDiscount);
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + giftWrapFee);

  // Switch market type handler
  const handleMarketTypeChange = (type: 'bd') => {
    setMarketType(type);
    setCountry('Bangladesh');
    setPaymentMethod('cod');
    setCurrency('BDT');
  };

  // Apply coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const normalizedCode = couponCode.trim().toUpperCase();
    const rate = getCouponRate(normalizedCode);
    if (rate > 0) {
      setAppliedDiscount(rate);
      setAppliedCouponCode(normalizedCode);
      showToast(`${Math.round(rate * 100)}% discount applied.`);
    } else {
      setAppliedDiscount(0);
      setAppliedCouponCode('');
      showToast('Invalid promo code. Try "SOPLOL10"');
    }
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (marketType !== 'bd' || currency !== 'BDT') {
      showToast('Checkout is currently available for Bangladesh orders in BDT only.');
      return;
    }
    if (paymentMethod === 'sslcommerz' && !sslcommerzEnabled) {
      showToast('Online payment is not enabled yet. Choose Cash on Delivery.');
      return;
    }
    if (paymentMethod === 'sslcommerz' && !email.trim()) {
      showToast('Enter your email address for the payment receipt.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !street.trim() || !city.trim()) {
      showToast('Please fill in all required shipping fields');
      return;
    }

    if (cart.length === 0) {
      showToast('Your cart is empty');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: { fullName, email: email.trim(), phone },
          shippingAddress: {
            street,
            city,
            district,
            country: 'Bangladesh',
            postalCode,
            region: bdRegion,
          },
          items: cart.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            selectedVariants: item.selectedVariants,
            personalizationText: item.personalizationText,
          })),
          currency: 'BDT',
          paymentMethod,
          couponCode: appliedCouponCode || undefined,
          addGiftWrap,
          giftWrapNote,
        }),
      });
      const result: { error?: string; orderNumber?: string; gatewayUrl?: string } = await response.json();
      if (!response.ok || !result.orderNumber) {
        showToast(result.error || 'We could not place your order. Please try again.');
        return;
      }

      if (paymentMethod === 'sslcommerz') {
        if (!result.gatewayUrl) {
          showToast('Payment session was not created. No payment was taken.');
          return;
        }
        window.location.assign(result.gatewayUrl);
        return;
      }
      clearCart();
      router.push(`/order-success/${encodeURIComponent(result.orderNumber)}`);
    } catch {
      showToast('We could not connect to the order service. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Cart is Empty</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Add items to your cart before proceeding to checkout.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Checkout Title */}
      <div className="mb-8 border-b border-neutral-200/80 pb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
            Secure Checkout
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Bangladesh checkout. Delivery charges are shown before order confirmation.
          </p>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-stone-600 bg-white px-3 py-1.5 rounded-full border border-stone-200">
          <ShieldCheck className="w-3.5 h-3.5 text-[#D9531E]" />
          <span>{sslcommerzEnabled ? 'SSLCommerz online payment is available' : 'Online payment is not available'}</span>
        </div>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Column: Shipping & Payment Details */}
        <div className="lg:col-span-7 space-y-8">
          {/* Market Selection Tab: Bangladesh vs International */}
          <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs space-y-3">
            <label className="text-xs font-bold text-neutral-700 uppercase tracking-wider block">
              Destination Market / গন্তব্য নির্বাচন করুন
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleMarketTypeChange('bd')}
                className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                  marketType === 'bd'
                    ? 'border-emerald-600 bg-emerald-50/80 text-emerald-950 ring-2 ring-emerald-600/20'
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span className="text-base">🇧🇩</span>
                <span>Bangladesh (লোকাল ডেলিভারি)</span>
              </button>

              <button
                type="button"
                disabled
                aria-label="International checkout is unavailable"
                className="py-3 px-4 rounded-xl border border-neutral-200 text-xs font-bold flex items-center justify-center gap-2 opacity-50 cursor-not-allowed"
              >
                <span className="text-base">🌐</span>
                <span>International (Unavailable)</span>
              </button>
            </div>
          </div>

          {/* Customer & Shipping Information */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <Truck className="w-4 h-4 text-amber-600" />
              1. Delivery Address & Contact
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tanvir Ahmed"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  Phone Number (For Delivery Rider) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder={marketType === 'bd' ? '017XXXXXXXX' : '+1 555-0192'}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="font-semibold text-neutral-700 block mb-1">
                  Email Address {paymentMethod === 'sslcommerz' ? '*' : '(Optional)'}
                </label>
                <input
                  type="email"
                  required={paymentMethod === 'sslcommerz'}
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              {/* Bangladesh Specific: Region selection */}
              {marketType === 'bd' ? (
                <>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Delivery Zone in Bangladesh *
                    </label>
                    <select
                      value={bdRegion}
                      onChange={(e) => setBdRegion(e.target.value as 'dhaka' | 'outside_dhaka')}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400 font-medium"
                    >
                      <option value="dhaka">Inside Dhaka City (৳70 - 2-3 Days)</option>
                      <option value="outside_dhaka">Outside Dhaka / All Districts (৳130 - 3-5 Days)</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      District (জেলা) *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400 font-medium"
                    >
                      {bdDistricts.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Destination Country *
                    </label>
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400 font-medium"
                    >
                      {intlCountries.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-neutral-700 block mb-1">
                      Postal / ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 10001"
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                    />
                  </div>
                </>
              )}

              <div className="sm:col-span-2">
                <label className="font-semibold text-neutral-700 block mb-1">
                  Full Street Address (House, Road, Area) *
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder="e.g. House 42, Road 11, Block D, Banani"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                />
              </div>

              <div>
                <label className="font-semibold text-neutral-700 block mb-1">
                  City / Thana *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Banani / Gulshan"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-none focus:border-neutral-400"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-[#D9531E]" />
              2. Payment Method
            </h3>

            {marketType === 'bd' ? (
              <div className="space-y-3">
                <label className={`flex cursor-pointer items-start gap-3 rounded-xl border p-4 ${paymentMethod === 'cod' ? 'border-[#D9531E]/40 bg-[#FAF3EA]' : 'border-neutral-200'}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} />
                  <span>
                    <span className="flex items-center gap-2 text-xs font-bold text-neutral-900"><Banknote className="h-4 w-4 text-[#D9531E]" />Cash on Delivery</span>
                    <span className="mt-1 block text-[11px] text-neutral-600">Pay the courier when your order arrives.</span>
                  </span>
                </label>
                <label className={`flex items-start gap-3 rounded-xl border p-4 ${sslcommerzEnabled ? 'cursor-pointer' : 'cursor-not-allowed opacity-60'} ${paymentMethod === 'sslcommerz' ? 'border-[#D9531E]/40 bg-[#FAF3EA]' : 'border-neutral-200'}`}>
                  <input type="radio" name="paymentMethod" checked={paymentMethod === 'sslcommerz'} disabled={!sslcommerzEnabled} onChange={() => setPaymentMethod('sslcommerz')} />
                  <span>
                    <span className="flex items-center gap-2 text-xs font-bold text-neutral-900"><CreditCard className="h-4 w-4 text-[#D9531E]" />SSLCommerz hosted checkout</span>
                    <span className="mt-1 block text-[11px] text-neutral-600">{sslcommerzEnabled ? 'Pay securely through SSLCommerz.' : 'Online payments are unavailable until merchant credentials are configured.'}</span>
                  </span>
                </label>
              </div>
            ) : (
              <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs leading-relaxed text-amber-900">
                International checkout is not currently available.
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs space-y-5 sticky top-24">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider pb-3 border-b border-neutral-100">
              Order Summary ({cart.length} items)
            </h3>

            {/* Cart Items List */}
            <div className="max-h-60 overflow-y-auto divide-y divide-neutral-100 space-y-2 pr-1">
              {cart.map((item) => (
                <div key={item.id} className="pt-2 flex items-center gap-3">
                  <div className="w-14 h-16 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                    <img src={item.product.images[0]} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 text-xs">
                    <h5 className="font-medium text-neutral-900 line-clamp-1">{item.product.title}</h5>
                    <div className="text-[11px] text-neutral-500">
                      Qty: {item.quantity}{' '}
                      {Object.keys(item.selectedVariants).length > 0 &&
                        `• ${Object.values(item.selectedVariants).join(', ')}`}
                    </div>
                    {item.personalizationText && (
                      <div className="text-[10px] text-[#803B00] bg-[#FDEBD2] px-1.5 py-0.5 rounded font-medium mt-0.5 inline-block">
                        Note: &quot;{item.personalizationText}&quot;
                      </div>
                    )}
                    <div className="font-semibold text-neutral-900 mt-0.5">
                      {formatPrice(
                        item.product.priceBDT * item.quantity,
                        item.product.priceUSD * item.quantity
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Luxury Gift Wrapping Option */}
            <div className="pt-3 border-t border-neutral-100">
              <label className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 cursor-pointer hover:bg-amber-50 transition-colors">
                <input
                  type="checkbox"
                  checked={addGiftWrap}
                  onChange={(e) => setAddGiftWrap(e.target.checked)}
                  className="mt-0.5 rounded text-[#D9531E] focus:ring-[#D9531E]"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900 flex items-center gap-1.5">
                      🎁 Add Luxury Jute Gift Wrap
                    </span>
                    <span className="text-[10px] text-[#803B00] bg-[#FDEBD2] px-2 py-0.5 rounded-full font-extrabold">
                      +{currency === 'BDT' ? '৳৫০' : '$1.00'}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 mt-0.5 leading-snug">
                    Golden handwoven jute box tied with satin ribbon & calligraphy greeting card.
                  </p>
                </div>
              </label>

              {addGiftWrap && (
                <div className="mt-2.5 space-y-1 animate-appleScaleIn">
                  <label className="text-[11px] font-bold text-stone-700 block">
                    ✍️ Greeting Message for Recipient:
                  </label>
                  <textarea
                    rows={2}
                    value={giftWrapNote}
                    onChange={(e) => setGiftWrapNote(e.target.value)}
                    placeholder="e.g. Wishing you a very Happy Birthday! From Fahim & Family."
                    className="w-full text-xs p-2.5 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:outline-hidden focus:border-[#D9531E]"
                  />
                </div>
              )}
            </div>

            {/* Promo Code Input */}
            <div className="pt-3 border-t border-neutral-100">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Coupon: SOPLOL10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs uppercase font-medium focus:bg-white focus:outline-none focus:border-neutral-400"
                  />
                  <Tag className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
                </div>
                <button
                  type="button"
                  onClick={handleApplyCoupon}
                  className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-semibold transition-colors shrink-0"
                >
                  Apply
                </button>
              </div>
              {appliedDiscount > 0 && (
                <span className="text-[11px] text-emerald-600 font-semibold block mt-1">
                  ✓ {appliedDiscount * 100}% Discount Applied
                </span>
              )}
            </div>

            {/* Financial Calculations */}
            <div className="pt-3 border-t border-neutral-100 space-y-2 text-xs">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {currency === 'BDT' ? `৳${subtotal.toLocaleString()}` : `$${subtotal.toFixed(2)}`}
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-emerald-600">
                  <span>Discount</span>
                  <span>
                    -{currency === 'BDT' ? `৳${discountAmount.toLocaleString()}` : `$${discountAmount.toFixed(2)}`}
                  </span>
                </div>
              )}

              {addGiftWrap && (
                <div className="flex justify-between text-stone-700">
                  <span>🎁 Luxury Gift Wrapping</span>
                  <span className="font-semibold text-stone-900">
                    +{currency === 'BDT' ? '৳৫০' : '$1.00'}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping</span>
                <span className="font-semibold text-neutral-900">
                  {currency === 'BDT' ? `৳${shippingFee.toLocaleString()}` : `$${shippingFee.toFixed(2)}`}
                </span>
              </div>

              <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-100">
                <span>Total Amount</span>
                <span>
                  {currency === 'BDT' ? `৳${grandTotal.toLocaleString()}` : `$${grandTotal.toFixed(2)}`}
                </span>
              </div>
            </div>

            {/* Place Order CTA Button */}
            <button
              type="submit"
              disabled={isSubmitting || (paymentMethod === 'sslcommerz' && !sslcommerzEnabled)}
              className="w-full py-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <span>{paymentMethod === 'cod' ? 'Confirm Cash on Delivery Order' : 'Continue to Secure Payment'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400 pt-1">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Use your order number and checkout phone to check order status.</span>
            </div>
          </div>
        </div>
      </form>

    </div>
  );
}
