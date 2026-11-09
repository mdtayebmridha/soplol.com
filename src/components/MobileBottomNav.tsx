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
    setAuthMode,
    currentUser,
  } = useShop();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const isHome = pathname === '/';
  const isShop = pathname.startsWith('/shop');
  const isWishlist = pathname.startsWith('/wishlist');
  const isAccount = pathname.startsWith('/account');

  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-2xl border-t border-stone-200/90 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-2 pt-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] touch-manipulation select-none">
      <nav className="flex items-center justify-around">
        {/* Home */}
        <Link
          href="/"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer ${
            isHome ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Home className={`w-5 h-5 ${isHome ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Home</span>
        </Link>

        {/* Shop */}
        <Link
          href="/shop"
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer ${
            isShop ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Compass className={`w-5 h-5 ${isShop ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Shop</span>
        </Link>

        {/* Wishlist */}
        <Link
          href="/wishlist"
          className={`relative flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer ${
            isWishlist ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Heart className={`w-5 h-5 ${isWishlist ? 'stroke-[2.5] fill-[#D9531E]/20 text-[#D9531E]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] font-semibold mt-0.5">Wishlist</span>
          {wishlist.length > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {wishlist.length}
            </span>
          )}
        </Link>

        {/* Cart Trigger */}
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          className="relative flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-stone-900 transition-all duration-200 active:scale-90 cursor-pointer"
        >
          <ShoppingBag className="w-5 h-5 stroke-[1.8]" />
          <span className="text-[10px] font-semibold mt-0.5">Bag</span>
          {cartCount > 0 && (
            <span className="absolute top-0.5 right-2 w-4 h-4 rounded-full bg-[#D9531E] text-white text-[9px] font-black flex items-center justify-center shadow-xs">
              {cartCount}
            </span>
          )}
        </button>

        {/* Profile / Account */}
        {currentUser ? (
          <Link
            href="/account/orders"
            className={`flex flex-col items-center justify-center py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 cursor-pointer ${
              isAccount ? 'text-[#D9531E]' : 'text-stone-500 hover:text-stone-900'
            }`}
          >
            <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${
              isAccount ? 'border-[#D9531E] bg-[#D9531E] text-white' : 'border-stone-300 bg-stone-100 text-stone-800'
            }`}>
              <span className="text-[10px] font-bold">
                {currentUser.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
              Orders
            </span>
          </Link>
        ) : (
          <button
            type="button"
            onClick={() => {
              setAuthMode('signin');
              setIsAuthModalOpen(true);
            }}
            className="flex flex-col items-center justify-center py-1 px-3 rounded-xl text-stone-500 hover:text-stone-900 transition-all duration-200 active:scale-90 cursor-pointer"
          >
            <div className="w-5 h-5 rounded-full border border-stone-300 flex items-center justify-center bg-stone-100">
              <User className="w-3.5 h-3.5 text-stone-600" />
            </div>
            <span className="text-[10px] font-semibold mt-0.5 truncate max-w-[50px]">
              Sign In
            </span>
          </button>
        )}
      </nav>
    </div>
  );
}
