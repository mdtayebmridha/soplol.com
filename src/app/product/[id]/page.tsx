'use client';

import React, { useState, Suspense } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import {
  Heart,
  ShoppingBag,
  Share2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

function ProductDetailContent() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;

  const {
    products,
    formatPrice,
    currency,
    addToCart,
    isWishlisted,
    toggleWishlist,
    showToast,
  } = useShop();

  const product = products.find((p) => p.id === productId || p.slug === productId);

  // Gallery state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Variant selections
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string>>(() => {
    if (!product?.variants) return {};
    const initial: Record<string, string> = {};
    product.variants.forEach((v) => {
      initial[v.name] = v.options[0];
    });
    return initial;
  });

  // Etsy Personalization State
  const [personalizationText, setPersonalizationText] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [detailsOpen, setDetailsOpen] = useState(true);
  const [shippingPolicyOpen, setShippingPolicyOpen] = useState(true);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif font-bold text-stone-900 mb-2">Listing Not Found</h2>
        <p className="text-sm text-stone-500 mb-6">
          The listing you are looking for may have been removed or is temporarily unavailable.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-[#D9531E] text-white rounded-full text-xs font-bold uppercase tracking-wider hover:bg-[#BA4113] transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const wishlisted = isWishlisted(product.id);

  // Pricing & Discount
  const currentPrice = currency === 'BDT' ? product.priceBDT : product.priceUSD;
  const comparePrice = currency === 'BDT' ? product.compareAtPriceBDT : product.compareAtPriceUSD;
  const discountPercent =
    comparePrice && comparePrice > currentPrice
      ? Math.round(((comparePrice - currentPrice) / comparePrice) * 100)
      : null;

  const isCustomizable =
    product.category === 'gifts' ||
    product.title.toLowerCase().includes('personalized') ||
    product.title.toLowerCase().includes('pot') ||
    product.title.toLowerCase().includes('custom');

  // Related products
  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const handleVariantSelect = (variantName: string, optionValue: string) => {
    setSelectedVariants((prev) => ({
      ...prev,
      [variantName]: optionValue,
    }));
  };

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariants, personalizationText.trim() || undefined);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariants, personalizationText.trim() || undefined);
    router.push('/checkout');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.shortDescription,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Listing URL copied to clipboard!');
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-6 sm:py-10 space-y-12 sm:space-y-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-stone-500 overflow-x-auto whitespace-nowrap pb-1">
        <Link href="/" className="hover:text-stone-900">
          Home
        </Link>
        <span>/</span>
        <Link href="/shop" className="hover:text-stone-900">
          Shop
        </Link>
        <span>/</span>
        <Link href={`/shop?category=${product.category}`} className="hover:text-stone-900 capitalize">
          {product.category}
        </Link>
        <span>/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.title}</span>
      </nav>

      {/* Main Etsy 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
        {/* Left Column: Visual Gallery + Detailed Accordions */}
        <div className="lg:col-span-7 space-y-10">
          {/* Gallery with Vertical Thumbnails */}
          <div className="flex flex-col-reverse sm:flex-row gap-4">
            {/* Vertical Thumbnail Rail (Etsy style) */}
            {product.images.length > 1 && (
              <div className="flex sm:flex-col gap-2.5 shrink-0 overflow-x-auto sm:overflow-y-auto sm:max-h-[550px]">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#D9531E] ring-2 ring-[#D9531E]/20'
                        : 'border-stone-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Primary Hero Image */}
            <div className="relative flex-1 aspect-4/5 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/90 shadow-2xs group">
              <img
                src={product.images[selectedImageIndex] || product.images[0]}
                alt={product.title}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />

            </div>
          </div>

          {/* Product description */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
            <button onClick={() => setDetailsOpen(!detailsOpen)} className="flex w-full items-center justify-between p-6 text-left font-serif text-base font-bold text-stone-900 hover:bg-stone-50">
              <span>Item Details</span>
              {detailsOpen ? <ChevronUp className="h-5 w-5 text-stone-500" /> : <ChevronDown className="h-5 w-5 text-stone-500" />}
            </button>
            {detailsOpen && <div className="border-t border-stone-100 px-6 pb-6 pt-4 text-xs leading-relaxed text-stone-600 sm:text-sm"><p>{product.description}</p></div>}
          </div>
          {/* Shipping and returns information */}
          <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
            <button onClick={() => setShippingPolicyOpen(!shippingPolicyOpen)} className="flex w-full items-center justify-between p-6 text-left font-serif text-base font-bold text-stone-900 hover:bg-stone-50">
              <span>Shipping &amp; Returns</span>
              {shippingPolicyOpen ? <ChevronUp className="h-5 w-5 text-stone-500" /> : <ChevronDown className="h-5 w-5 text-stone-500" />}
            </button>
            {shippingPolicyOpen && <div className="space-y-3 border-t border-stone-100 px-6 pb-6 pt-4 text-xs leading-relaxed text-stone-600">
              <p>Delivery charge: &#2547;70 for Dhaka or &#2547;130 outside Dhaka. The final charge appears at checkout.</p>
              <p>International checkout is currently unavailable. Return and exchange eligibility has not been confirmed; use the contact form before sending any item back.</p>
            </div>}
          </div>
          </div>
        <div className="lg:col-span-5 space-y-6">
          <div className="space-y-3">
            <p className="text-xs font-bold uppercase tracking-wider text-[#D9531E]">{product.category}</p>
            <h1 className="font-serif text-3xl font-black leading-tight text-stone-900 sm:text-4xl">{product.title}</h1>
            {product.shortDescription && <p className="text-sm leading-relaxed text-stone-600">{product.shortDescription}</p>}
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-stone-900">{formatPrice(product.priceBDT, product.priceUSD)}</span>
                {comparePrice && comparePrice > currentPrice && <span className="text-sm text-stone-400 line-through">{formatPrice(product.compareAtPriceBDT ?? 0, product.compareAtPriceUSD ?? 0)}</span>}
                {discountPercent && <span className="rounded-full bg-orange-100 px-2 py-1 text-[10px] font-bold text-[#D9531E]">{discountPercent}% off</span>}
              </div>
              <span className={`text-xs font-semibold ${product.inStock ? 'text-emerald-700' : 'text-red-600'}`}>{product.inStock ? 'In stock' : 'Out of stock'}</span>
            </div>
          </div>

          {product.variants?.map((variant) => (
            <fieldset key={variant.name} className="space-y-2">
              <legend className="text-xs font-bold text-stone-800">{variant.name}</legend>
              <div className="flex flex-wrap gap-2">
                {variant.options.map((option) => (
                  <button key={option} type="button" onClick={() => handleVariantSelect(variant.name, option)} aria-pressed={selectedVariants[variant.name] === option}
                    className={`rounded-full border px-3 py-2 text-xs font-medium transition-colors ${selectedVariants[variant.name] === option ? 'border-[#D9531E] bg-[#FAF3EA] text-[#8F3415]' : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'}`}>
                    {option}
                  </button>
                ))}
              </div>
            </fieldset>
          ))}

          {isCustomizable && <label className="block space-y-2 text-xs font-bold text-stone-800">
            Personalization note (optional)
            <textarea value={personalizationText} onChange={(event) => setPersonalizationText(event.target.value)} maxLength={500} rows={3} placeholder="Add a name or note for this item"
              className="w-full rounded-xl border border-stone-200 bg-white p-3 text-xs font-normal text-stone-900 focus:border-[#D9531E] focus:outline-none" />
          </label>}

          <div className="flex items-center gap-3">
            <label className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-4 py-3 text-xs font-semibold text-stone-700">
              Qty
              <input aria-label="Quantity" type="number" min={1} max={Math.min(product.stockQuantity, 20)} value={quantity} disabled={!product.inStock}
                onChange={(event) => setQuantity(Math.max(1, Math.min(Number(event.target.value) || 1, Math.min(product.stockQuantity, 20))))}
                className="w-14 bg-transparent text-center outline-none" />
            </label>
            <button type="button" aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'} onClick={() => toggleWishlist(product.id)}
              className={`flex h-11 w-11 items-center justify-center rounded-xl border ${wishlisted ? 'border-rose-200 bg-rose-50 text-rose-600' : 'border-stone-200 bg-white text-stone-600'}`}>
              <Heart className={`h-5 w-5 ${wishlisted ? 'fill-current' : ''}`} />
            </button>
            <button type="button" onClick={handleShare} className="flex h-11 w-11 items-center justify-center rounded-xl border border-stone-200 bg-white text-stone-600" aria-label="Share product">
              <Share2 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-3">
            <button type="button" onClick={handleAddToCart} disabled={!product.inStock} className="flex w-full items-center justify-center gap-2 rounded-xl border border-stone-300 bg-white py-4 text-xs font-bold uppercase tracking-wider text-stone-900 transition hover:bg-stone-50 disabled:opacity-50">
              <ShoppingBag className="h-4 w-4" /> Add to cart
            </button>
            <button type="button" onClick={handleBuyNow} disabled={!product.inStock} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#D9531E] py-4 text-xs font-bold uppercase tracking-wider text-white shadow-md transition hover:bg-[#BA4113] disabled:opacity-50">
              Buy now <ArrowRight className="h-4 w-4" />
            </button>
          </div>
          <p className="text-center text-[11px] text-stone-500">Bangladesh orders only. Delivery charge is shown at checkout.</p>
        </div>
      </div>


      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-stone-200">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-serif font-bold text-stone-900">
              You May Also Like
            </h3>
            <Link
              href={`/shop?category=${product.category}`}
              className="text-xs font-bold text-[#D9531E] hover:underline flex items-center gap-1"
            >
              Explore {product.category} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="pt-8 border-t border-stone-200">
        <Link href={`/shop?category=${product.category}`} className="text-sm font-semibold text-[#D9531E] hover:underline">
          Browse more in {product.category === 'home' ? 'Home & Living' : product.category === 'office' ? 'Desk & Office' : product.category === 'gifts' ? 'Gifts & Celebrations' : 'Fashion & Apparel'}
        </Link>
      </section>
    </div>
  </div>
  );
}

export default function ProductDetailPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto p-12 text-center text-xs">Loading item...</div>}>
      <ProductDetailContent />
    </Suspense>
  );
}
