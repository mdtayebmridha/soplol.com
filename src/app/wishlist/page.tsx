'use client';

import React from 'react';
import Link from 'next/link';
import { useShop } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { Heart, ArrowLeft, ShoppingBag } from 'lucide-react';

export default function WishlistPage() {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
              My Saved Wishlist
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-neutral-500">
            {wishlistedProducts.length} items saved for future consideration
          </p>
        </div>

        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-700 hover:text-neutral-900"
        >
          <ArrowLeft className="w-4 h-4" />
          Continue Shopping
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-neutral-200/80 p-16 text-center max-w-md mx-auto shadow-xs">
          <div className="w-20 h-20 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto mb-4">
            <Heart className="w-9 h-9" />
          </div>
          <h2 className="text-lg font-bold text-neutral-900 mb-2">Your wishlist is empty</h2>
          <p className="text-xs text-neutral-500 mb-6 leading-relaxed">
            Save items you love by tapping the heart icon on any product. They will stay stored right here.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {wishlistedProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
