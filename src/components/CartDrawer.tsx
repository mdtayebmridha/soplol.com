'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Truck } from 'lucide-react';

export default function CartDrawer() {
  const {
    isCartOpen,
    setIsCartOpen,
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    currency,
    formatPrice,
  } = useShop();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-fade-in"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white text-neutral-900 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-lg font-semibold tracking-tight">Your Shopping Cart</h2>
              <span className="text-xs font-semibold bg-neutral-100 text-neutral-700 px-2.5 py-0.5 rounded-full">
                {cart.length}
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-amber-100/60 bg-amber-50/70 p-4 text-xs text-slate-950">
            <Truck className="h-4 w-4 shrink-0 text-slate-800" />
            Delivery charge depends on the selected area and is shown at checkout.
          </div>
          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 divide-y divide-neutral-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-4 text-neutral-400">
                  <ShoppingBag className="w-9 h-9" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">Your cart is empty</h3>
                <p className="text-sm text-neutral-500 max-w-xs mb-6">
                  Looks like you haven&apos;t added any items to your cart yet. Explore our latest fashion and lifestyle collections.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-neutral-900 text-white rounded-lg text-sm font-medium hover:bg-neutral-800 transition-colors"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="py-4 flex gap-4">
                  <div className="relative w-20 h-24 bg-neutral-100 rounded-lg overflow-hidden shrink-0 border border-neutral-200/60">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium text-neutral-900 line-clamp-1">
                          {item.product.title}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Selected Variants */}
                      {Object.keys(item.selectedVariants).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-1">
                          {Object.entries(item.selectedVariants).map(([key, val]) => (
                            <span
                              key={key}
                              className="text-[11px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded font-medium"
                            >
                              {key}: {val}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Etsy-Style Personalization */}
                      {item.personalizationText && (
                        <div className="text-[11px] text-[#191C28] bg-[#DDE2E3] px-2 py-0.5 rounded font-medium mt-1 inline-block">
                          Custom: &quot;{item.personalizationText}&quot;
                        </div>
                      )}

                      <div className="text-sm font-semibold text-neutral-900 mt-1.5">
                        {formatPrice(item.product.priceBDT, item.product.priceUSD)}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-3 text-xs font-semibold text-neutral-800">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1.5 hover:bg-neutral-200 text-neutral-600 transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-xs font-medium text-neutral-500">
                        Total:{' '}
                        <strong className="text-neutral-900 font-semibold">
                          {formatPrice(
                            item.product.priceBDT * item.quantity,
                            item.product.priceUSD * item.quantity
                          )}
                        </strong>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout CTA */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50/70 space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-sm text-neutral-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-neutral-900 text-base">
                    {currency === 'BDT' ? `৳${cartSubtotal.toLocaleString()}` : `$${cartSubtotal.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-neutral-500">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#242735] hover:bg-[#191C28] text-white rounded-full font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-[0.99]"
              >
                Proceed to Checkout
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-1">
                <ShieldCheck className="w-4 h-4 text-slate-800" />
                <span>Cash on Delivery available for Bangladesh orders.</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
