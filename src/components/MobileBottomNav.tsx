'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  Home,
  Compass,
  Heart,
  ShoppingBag,
  User,
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const {
    cartCount,
    wishlist,
    setIsCartOpen,
    setIsAuthModalOpen,
    currentUser,
  } = useShop();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isWishlist = pathname.startsWith('/wishlist');

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/85 backdrop-blur-2xl border-t border-stone-200/80 shadow-[0_-8px_25px_rgba(0,0,0,0.06)] px-2 py-2">
      <nav className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
            isHome ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
            isShop ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Shop</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 ${
            isWishlist ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlist ? 'stroke-[2.5] fill-[#D9531E]/20' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-appleScaleIn">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart Trigger */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-stone-900 transition-all duration-200 active:scale-90"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold mt-0.5">Bag</span>
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[#D9531E] text-white text-[9px] font-black flex items-center justify-center shadow-xs animate-appleScaleIn">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile / Account */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-stone-900 transition-all duration-200 active:scale-90"
        >
          <div className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center bg-stone-100">
            {currentUser ? (
              <span className="text-[10px] font-bold text-stone-800">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <User className="w-3.5 h-3.5 text-stone-600" />
            )}
          </div>
          <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
            {currentUser ? currentUser.name.split(' ')[0] : 'Sign In'}
          </span>
        </button>
      </nav>
    </div>
  );
}
