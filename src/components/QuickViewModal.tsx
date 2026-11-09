'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import {
  X,
  ShoppingBag,
  Heart,
  ArrowRight,
  Check,
} from 'lucide-react';

export default function QuickViewModal() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    isWishlisted,
    toggleWishlist,
    formatPrice,
  } = useShop();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>({});
  const [variantsForProductId, setVariantsForProductId] = useState<string | null>(null);
  const [personalizationText, setPersonalizationText] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isCustomizable =
    product.category === 'gifts' ||
    product.title.toLowerCase().includes('personalized') ||
    product.title.toLowerCase().includes('pot') ||
    product.title.toLowerCase().includes('custom');

  const wishlisted = isWishlisted(product.id);
  const defaultVariants = Object.fromEntries((product.variants ?? []).map((variant) => [variant.name, variant.options[0] ?? '']));
  const activeVariants = variantsForProductId === product.id ? selectedVariants : defaultVariants;
  const maxQuantity = Math.max(1, Math.min(product.stockQuantity, 20));

  const handleAddToCart = () => {
    addToCart(
      product,
      Math.min(quantity, maxQuantity),
      activeVariants,
      personalizationText.trim() || undefined
    );
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setQuickViewProduct(null);
    }, 800);
  };

  const close = () => {
    setQuickViewProduct(null);
    setPersonalizationText('');
    setSelectedImageIndex(0);
    setQuantity(1);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/60 backdrop-blur-md">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={close} />

      {/* Modal Dialog Box */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200/90 overflow-hidden flex flex-col md:flex-row max-h-[92vh] z-10 animate-appleScaleIn">
        {/* Close Button */}
        <button
          onClick={close}
          className="absolute top-3.5 right-3.5 z-20 w-8 h-8 rounded-full bg-stone-100/90 hover:bg-stone-200 text-stone-700 hover:text-stone-950 flex items-center justify-center transition-all active:scale-90"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Product gallery */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 bg-[#FAF9F6] border-b md:border-b-0 md:border-r border-stone-200/80 flex flex-col justify-between">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-stone-200 shadow-inner group">
            <img
              src={product.images[selectedImageIndex] || product.images[0]}
              alt={product.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-stone-700 flex items-center justify-center shadow-md transition-all active:scale-75"
            >
              <Heart className={`w-4 h-4 ${wishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`w-14 h-14 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    selectedImageIndex === i
                      ? 'border-[#D9531E] shadow-sm scale-105'
                      : 'border-stone-200 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details & Buy Box */}
        <div className="w-full md:w-1/2 p-5 sm:p-7 overflow-y-auto space-y-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <span className="uppercase font-bold tracking-wider text-[#D9531E]">
                {product.category}
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 leading-tight">
              {product.title}
            </h2>

            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-stone-900 font-serif">
                {formatPrice(product.priceBDT, product.priceUSD)}
              </span>

            </div>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed line-clamp-3">
            {product.description}
          </p>

          {/* Sizing Selector (If Apparel) */}
          {product.variants?.map((variant) => (
            <fieldset key={variant.name} className="space-y-2">
              <legend className="text-xs font-bold text-stone-800">Select {variant.name}</legend>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button key={option} type="button" aria-pressed={activeVariants[variant.name] === option}
                    onClick={() => { setVariantsForProductId(product.id); setSelectedVariants({ ...activeVariants, [variant.name]: option }); }}
                    className={`rounded-xl border px-3 py-2 text-xs font-bold transition-all ${activeVariants[variant.name] === option ? 'border-stone-900 bg-stone-900 text-white' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {/* Live Personalization Input */}
          {isCustomizable && (
            <div className="space-y-1.5 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
              <label className="text-xs font-bold text-stone-800 flex items-center justify-between">
                <span>✍️ Add Your Personalization</span>
                <span className="text-[10px] text-amber-700 font-medium">Optional</span>
              </label>
              <input
                type="text"
                placeholder="Enter custom name (e.g. Liam & Maya 2026)"
                value={personalizationText}
                onChange={(e) => setPersonalizationText(e.target.value)}
                maxLength={500}
                className="w-full text-xs px-3 py-2 bg-white rounded-xl border border-stone-200 focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
              />
              <p className="text-[10px] text-stone-400">
                This note is saved with your cart and order.
              </p>
            </div>
          )}

          {/* Quantity & Add to Cart */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-2xs text-stone-700 font-bold flex items-center justify-center hover:bg-stone-100"
              >
                -
              </button>
              <span className="w-9 text-center text-xs font-bold text-stone-900">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => Math.min(maxQuantity, q + 1))}
                className="w-8 h-8 rounded-lg bg-white shadow-2xs text-stone-700 font-bold flex items-center justify-center hover:bg-stone-100"
              >
                +
              </button>
            </div>

            <button
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className={`flex-1 py-3 px-6 rounded-full text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-md ${
                addedAnimation
                  ? 'bg-emerald-600 text-white'
                  : 'bg-[#D9531E] hover:bg-[#BA4113] text-white active:scale-95'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-4 h-4" /> Added to Bag!
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" /> Add to Cart
                </>
              )}
            </button>
          </div>

          {/* Full Page Link */}
          <div className="pt-2 text-center">
            <Link
              href={`/product/${product.id}`}
              onClick={close}
              className="text-xs font-bold text-stone-600 hover:text-[#D9531E] inline-flex items-center gap-1 group transition-colors"
            >
              View product details{' '}
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
