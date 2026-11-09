'use client';

import React from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { useShop } from '@/context/ShopContext';
import { Heart, ShoppingBag, Eye } from 'lucide-react';
import { CardShape } from '@/types';

interface ProductCardProps {
  product: Product;
  shapeOverride?: CardShape;
}

export default function ProductCard({ product, shapeOverride }: ProductCardProps) {
  const { formatPrice, addToCart, isWishlisted, toggleWishlist, themeSettings, setQuickViewProduct } = useShop();
  const wishlisted = isWishlisted(product.id);

  const cardShape = shapeOverride || themeSettings?.cardShape || 'rounded';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const initialVariants: Record<string, string> = {};
    if (product.variants && product.variants.length > 0) {
      product.variants.forEach((v) => {
        initialVariants[v.name] = v.options[0];
      });
    }
    addToCart(product, 1, initialVariants);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };


  // Determine card container & image classes based on cardShape
  const outerWrapperClass =
    cardShape === 'circle'
      ? 'group relative bg-white rounded-3xl border border-stone-200/90 card-3d flex flex-col p-3.5 items-center text-center overflow-hidden'
      : cardShape === 'square'
      ? 'group relative bg-white rounded-none border border-stone-300/80 card-3d flex flex-col overflow-hidden'
      : 'group relative bg-white rounded-2xl border border-stone-200/80 card-3d flex flex-col overflow-hidden';

  const imageContainerClass =
    cardShape === 'circle'
      ? 'relative aspect-square w-full max-w-[200px] mx-auto rounded-full overflow-hidden bg-stone-100 block'
      : cardShape === 'square'
      ? 'relative aspect-square overflow-hidden bg-stone-100 block'
      : 'relative aspect-4/5 overflow-hidden bg-stone-100 block';

  return (
    <div className={outerWrapperClass}>
      {/* Thumbnail Container */}
      <Link href={`/product/${product.id}`} className={imageContainerClass}>
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        />

        {/* Wishlist Button (Apple spring micro-interaction) */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 active:scale-75 hover:scale-110 duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            wishlisted
              ? 'bg-white text-rose-500 shadow-md'
              : 'bg-white/90 hover:bg-white text-stone-600 hover:text-rose-500 shadow-xs'
          } backdrop-blur-xs`}
          title="Add to Favorites"
        >
          <Heart className={`w-4 h-4 transition-transform duration-200 ${wishlisted ? 'fill-rose-500 scale-110' : ''}`} />
        </button>

        {/* Quick View Button (Apple slide-in eye) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setQuickViewProduct(product);
          }}
          className="absolute top-12 right-2.5 w-8 h-8 rounded-full bg-white/95 hover:bg-white text-stone-700 hover:text-[#D9531E] flex items-center justify-center shadow-md transition-all z-10 opacity-90 sm:opacity-0 sm:group-hover:opacity-100 sm:translate-x-1 sm:group-hover:translate-x-0 duration-200 active:scale-75"
          title="Quick View"
          aria-label="Quick View"
        >
          <Eye className="w-3.5 h-3.5" />
        </button>

        {/* Quick Add Hover Bar (Apple slide-up spring) */}
        <div className="absolute inset-x-2.5 bottom-2.5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hidden sm:block">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-stone-900/90 hover:bg-stone-950 text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 backdrop-blur-md active:scale-95 transition-all"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            Quick Add
          </button>
        </div>
      </Link>

      {/* Product Details (Etsy Marketplace Card Format) */}
      <div className="p-3.5 flex flex-col flex-1 justify-between gap-2">
        <div>
          <div className="mb-1 flex items-center text-[11px] text-stone-500">
            <span className="truncate font-medium capitalize text-stone-600">{product.category}</span>
          </div>
          {/* Product Title */}
          <Link href={`/product/${product.id}`} className="block group-hover:text-amber-800 transition-colors">
            <h3 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-2 leading-snug">
              {product.title}
            </h3>
          </Link>

          <div className="mt-1.5 text-[11px] text-stone-500">{product.inStock ? 'In stock' : 'Out of stock'}</div>
        </div>
        {/* Price and availability */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between gap-1">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-extrabold text-stone-900">
                {formatPrice(product.priceBDT, product.priceUSD)}
              </span>
            </div>

            {/* Mobile quick add button */}
            <button
              onClick={handleQuickAdd}
              className="sm:hidden p-1.5 rounded-lg bg-stone-900 text-white hover:bg-[#D9531E] transition-colors active:scale-90"
              title="Add to Cart"
              aria-label="Add to Cart"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center justify-end"><span className="text-[9px] text-stone-400">Delivery charge at checkout</span></div>
        </div>
      </div>
    </div>
  );
}
