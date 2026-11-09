'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  Gift,
  UserPlus,
  HelpCircle,
  ChevronDown,
  ArrowRight,
  ShoppingBag,
} from 'lucide-react';
import { CATEGORIES } from '@/lib/data';

function NavbarContent() {

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cartCount, wishlist, setIsCartOpen, setIsAuthModalOpen, setAuthMode, setIsHelpModalOpen, currentUser, products, formatPrice } = useShop();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory] = useState<string>('all');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [activeSubDropdown, setActiveSubDropdown] = useState<string | null>(null);
  const [showSubNav, setShowSubNav] = useState(true);
  const lastScrollYRef = useRef(0);
  const showSubNavRef = useRef(true);

  // Directional scroll: Hide sub-category nav on scroll down, show on scroll up (Zero-Jitter rAF)
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          const diff = currentScrollY - lastScrollYRef.current;

          // If near the top, always stay open
          if (currentScrollY <= 80) {
            if (!showSubNavRef.current) {
              showSubNavRef.current = true;
              setShowSubNav(true);
            }
          } else if (diff > 14) {
            // Scrolled DOWN past deadzone -> smoothly collapse
            if (showSubNavRef.current) {
              showSubNavRef.current = false;
              setShowSubNav(false);
              setActiveSubDropdown(null);
            }
          } else if (diff < -14) {
            // Scrolled UP past deadzone -> smoothly reveal
            if (!showSubNavRef.current) {
              showSubNavRef.current = true;
              setShowSubNav(true);
            }
          }

          lastScrollYRef.current = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('.category-dropdown-container')) {
        setCategoryDropdownOpen(false);
      }
      if (!target.closest('.subnav-item-container')) {
        setActiveSubDropdown(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);


  const filteredProducts = searchQuery.trim()
    ? products.filter(
        (p) =>
          (selectedCategory === 'all' || p.category === selectedCategory) &&
          (p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.description.toLowerCase().includes(searchQuery.toLowerCase()))
      ).slice(0, 5)
    : [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}&category=${selectedCategory}`);
      setSearchQuery('');
      setCategoryDropdownOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-stone-200/60 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.03)] transition-all">
      {/* Main Bar with Etsy-Style Search */}
      <div className="max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-14 gap-4 sm:gap-6">
          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-stone-700 hover:text-stone-900"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Wordmark */}
          <Link href="/" className="flex items-center shrink-0 group">
            <Image
              src="/brand-text.png"
              alt="soplol"
              width={150}
              height={50}
              className="h-9 sm:h-11 w-auto object-contain transition-transform group-hover:scale-102"
              priority
            />
          </Link>

          {/* Central Search Bar (Iconic Etsy pill design) */}
          <div className="flex-1 max-w-2xl hidden md:block relative">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-5 pr-14 py-2.5 bg-stone-50 hover:bg-white text-xs sm:text-sm text-stone-900 rounded-full border-2 border-stone-800/80 focus:border-[#D9531E] focus:bg-white focus:outline-none transition-all placeholder:text-stone-400"
              />
              <button
                type="submit"
                className="absolute right-1.5 top-1.5 bottom-1.5 px-4 bg-[#D9531E] hover:bg-[#BA4113] text-white rounded-full flex items-center justify-center transition-colors shadow-2xs"
                title="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Live Search Dropdown */}
            {searchQuery.trim().length > 0 && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in">
                <div className="p-3 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                  <span>Live Search Results ({filteredProducts.length})</span>
                  <button
                    onClick={() => {
                      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                      setSearchQuery('');
                    }}
                    className="text-[#D9531E] font-bold hover:underline"
                  >
                    View All
                  </button>
                </div>
                {filteredProducts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No products found matching &quot;{searchQuery}&quot;
                  </div>
                ) : (
                  <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                    {filteredProducts.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          router.push(`/product/${product.id}`);
                          setSearchQuery('');
                        }}
                        className="p-3 hover:bg-stone-50 flex items-center gap-3 cursor-pointer transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-stone-900 truncate">{product.title}</h4>
                          <span className="text-[10px] text-stone-500 capitalize bg-stone-100 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        </div>
                        <div className="text-xs font-bold text-[#D9531E] shrink-0">
                          {formatPrice(product.priceBDT, product.priceUSD)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Categories Button outside Search */}
          <div className="relative hidden lg:block category-dropdown-container">
            <button
              onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
              className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold rounded-full flex items-center gap-2 transition-colors whitespace-nowrap"
            >
              <span>Categories</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </button>

            {categoryDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 animate-fade-in max-h-96 overflow-y-auto">
                {CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <Link
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setCategoryDropdownOpen(false)}
                      className="block px-4 py-2 text-xs font-bold text-stone-900 hover:bg-stone-100 transition-colors"
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories.map((sub) => (
                      <Link
                        key={sub.id}
                        href={`/shop?category=${cat.id}&sub=${sub.id}`}
                        onClick={() => setCategoryDropdownOpen(false)}
                        className="block pl-8 pr-4 py-1.5 text-xs font-medium text-stone-500 hover:bg-stone-50 hover:text-stone-800 transition-colors"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right Action Icons (Sign Up, Help, Wishlist & Cart) with Hover Tooltips */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Sign Up / User Profile Icon with Tooltip */}
            <div className="relative group/tooltip flex flex-col items-center">
              {currentUser ? (
                <Link
                  href="/account/orders"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0D1829] text-white hover:bg-[#D9531E] flex items-center justify-center transition-colors font-bold text-xs"
                  title="Your account and orders"
                  aria-label="Your account and orders"
                >
                  {currentUser.name.charAt(0).toUpperCase()}
                </Link>
              ) : (
                <button
                  onClick={() => {
                    setAuthMode('signup');
                    setIsAuthModalOpen(true);
                  }}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  aria-label="Sign Up"
                >
                  <UserPlus className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>
              )}

              {/* Tooltip Bubble */}
              <div className="pointer-events-none absolute top-full mt-1.5 z-50 opacity-0 invisible -translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0 transition-all duration-150 ease-out">
                <div className="relative bg-[#0D1829] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D1829] rotate-45" />
                  <span className="relative z-10">{currentUser ? 'Your Account' : 'Sign Up'}</span>
                </div>
              </div>
            </div>

            {/* Help & Support Icon with Tooltip (Visible only when logged in) */}
            {currentUser && (
              <div className="relative group/tooltip flex flex-col items-center">
                <button
                  onClick={() => setIsHelpModalOpen(true)}
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 flex items-center justify-center transition-colors"
                  aria-label="Help & Support"
                >
                  <HelpCircle className="w-5 h-5 sm:w-6 sm:h-6" />
                </button>

                {/* Tooltip Bubble */}
                <div className="pointer-events-none absolute top-full mt-1.5 z-50 opacity-0 invisible -translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0 transition-all duration-150 ease-out">
                  <div className="relative bg-[#0D1829] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D1829] rotate-45" />
                    <span className="relative z-10">Help & Support</span>
                  </div>
                </div>
              </div>
            )}

            {/* Wishlist / Favorites Icon with Tooltip */}
            <div className="relative group/tooltip flex flex-col items-center">
              <Link
                href="/wishlist"
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-stone-700 hover:text-stone-950 hover:bg-stone-100 flex items-center justify-center transition-colors"
                aria-label="Favorites"
              >
                <div className="relative">
                  <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D9531E] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {wishlist.length}
                    </span>
                  )}
                </div>
              </Link>

              {/* Tooltip Bubble */}
              <div className="pointer-events-none absolute top-full mt-1.5 z-50 opacity-0 invisible -translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0 transition-all duration-150 ease-out">
                <div className="relative bg-[#0D1829] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D1829] rotate-45" />
                  <span className="relative z-10">Favorites</span>
                </div>
              </div>
            </div>

            {/* Cart Icon with Tooltip */}
            <div className="relative group/tooltip flex flex-col items-center">
              <button
                onClick={() => setIsCartOpen(true)}
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full text-stone-900 hover:bg-stone-100 flex items-center justify-center transition-colors"
                aria-label="Cart"
              >
                <div className="relative">
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#D9531E] text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
              </button>

              {/* Tooltip Bubble */}
              <div className="pointer-events-none absolute top-full mt-1.5 z-50 opacity-0 invisible -translate-y-1 group-hover/tooltip:opacity-100 group-hover/tooltip:visible group-hover/tooltip:translate-y-0 transition-all duration-150 ease-out">
                <div className="relative bg-[#0D1829] text-white text-[11px] font-medium px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0D1829] rotate-45" />
                  <span className="relative z-10">Cart</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Search Input */}
        <div className="md:hidden pb-3 relative">
          <form onSubmit={handleSearch} className="relative flex items-center">
            <input
              type="text"
              placeholder="Search unique items on soplol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-4 pr-12 py-2 bg-stone-100 text-xs rounded-full border border-stone-300 focus:bg-white focus:outline-none focus:border-[#D9531E]"
            />
            <button
              type="submit"
              className="absolute right-1 top-1 bottom-1 px-3 bg-[#D9531E] text-white rounded-full flex items-center justify-center"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Mobile Live Search Dropdown */}
          {searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden z-50 animate-fade-in">
              <div className="p-2.5 bg-stone-50 border-b border-stone-100 flex items-center justify-between text-[11px] text-stone-500 font-medium">
                <span>Live Results ({filteredProducts.length})</span>
                <button
                  onClick={() => {
                    router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
                    setSearchQuery('');
                  }}
                  className="text-[#D9531E] font-bold"
                >
                  View All
                </button>
              </div>
              {filteredProducts.length === 0 ? (
                <div className="p-4 text-center text-xs text-stone-500">
                  No items found
                </div>
              ) : (
                <div className="divide-y divide-stone-100 max-h-64 overflow-y-auto">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        router.push(`/product/${product.id}`);
                        setSearchQuery('');
                        setMobileMenuOpen(false);
                      }}
                      className="p-2.5 hover:bg-stone-50 flex items-center gap-2.5 cursor-pointer"
                    >
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-[11px] font-bold text-stone-900 truncate">{product.title}</h4>
                        <div className="text-[10px] text-[#D9531E] font-bold">
                          {formatPrice(product.priceBDT, product.priceUSD)}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Apple-Style Glassmorphism Pill Tab Bar with Dropdown Mega-Menus */}
      <nav
        className={`border-t border-stone-200/60 bg-white/70 backdrop-blur-xl relative z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          showSubNav
            ? 'max-h-16 opacity-100 translate-y-0 pointer-events-auto'
            : 'max-h-0 opacity-0 -translate-y-2 pointer-events-none border-t-transparent overflow-hidden'
        }`}
      >
        <div className="max-w-[1536px] mx-auto px-3 sm:px-8 lg:px-12">
          <ul className="flex items-center gap-1.5 sm:gap-2 lg:gap-3 text-xs font-semibold py-2 overflow-visible whitespace-nowrap scrollbar-none justify-start md:justify-center">
            {/* Apple-style Master Store Hub Pill & Mega-Menu */}
            <li className="relative group/navitem subnav-item-container">
              <div className="inline-flex items-center rounded-full bg-stone-100/90 hover:bg-[#D9531E] border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all duration-200 text-xs font-bold text-stone-900 hover:text-white">
                <Link
                  href="/shop"
                  onClick={() => setActiveSubDropdown(null)}
                  className="pl-3.5 pr-1.5 py-1.5 flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5 text-[#D9531E] group-hover/navitem:text-white transition-colors" />
                  <span>Store</span>
                </Link>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveSubDropdown(activeSubDropdown === 'store' ? null : 'store');
                  }}
                  className="pr-2.5 pl-0.5 py-1.5 cursor-pointer text-stone-400 group-hover/navitem:text-white"
                  aria-label="Toggle Store Dropdown"
                >
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${activeSubDropdown === 'store' ? 'rotate-180 text-white' : ''} group-hover/navitem:rotate-180`} />
                </button>
              </div>

              {/* Mega-hub flyout for Store */}
              <div
                className={`absolute top-full left-0 sm:left-0 pt-2 transition-all duration-200 ease-out z-50 ${
                  activeSubDropdown === 'store'
                    ? 'opacity-100 pointer-events-auto'
                    : 'opacity-0 pointer-events-none group-hover/navitem:opacity-100 group-hover/navitem:pointer-events-auto'
                }`}
              >
                <div className="w-[calc(100vw-32px)] max-w-[520px] bg-white/95 backdrop-blur-2xl border border-stone-200/90 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                    <div>
                      <h3 className="text-sm font-bold text-stone-950 font-serif flex items-center gap-1.5">
                        <ShoppingBag className="w-4 h-4 text-[#D9531E]" />
                        SOPLOL Store
                      </h3>
                      <p className="text-[11px] text-stone-500">
                        Browse the current product catalog by department
                      </p>
                    </div>
                    <Link
                      href="/shop"
                      className="text-[11px] font-bold text-[#D9531E] hover:underline flex items-center gap-0.5"
                    >
                      All Listings ({products.length}) <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>

                  {/* All Categories Visual Hub */}
                  <div>
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block mb-2">
                      All Departments & Categories
                    </span>
                    <div className="grid grid-cols-3 gap-2.5">
                      {[
                        { name: 'Personalized Gifts', href: '/shop?category=gifts', img: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=240' },
                        { name: "Men's Apparel", href: '/shop?category=fashion&sub=men', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=240' },
                        { name: "Women's Wear", href: '/shop?category=fashion&sub=women', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=240' },
                        { name: 'Boys & Girls', href: '/shop?category=fashion&sub=boys', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=240' },
                        { name: 'Home & Living', href: '/shop?category=home', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=240' },
                        { name: 'Desk & Office', href: '/shop?category=office', img: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=240' },
                      ].map((item, i) => (
                        <Link
                          key={i}
                          href={item.href}
                          className="flex items-center gap-2 p-2 rounded-2xl bg-stone-50 hover:bg-[#FAF3EA] border border-stone-200/70 hover:border-[#D9531E]/40 transition-all group/catcard"
                        >
                          <img
                            src={item.img}
                            alt={item.name}
                            className="w-10 h-10 rounded-xl object-cover shrink-0 group-hover/catcard:scale-105 transition-transform"
                          />
                          <div className="min-w-0">
                            <h4 className="text-[11px] font-bold text-stone-900 group-hover/catcard:text-[#D9531E] truncate transition-colors leading-tight">
                              {item.name}
                            </h4>
                            <span className="text-[10px] text-stone-500 block truncate">
                              {products.filter((product) => {
                                const params = new URLSearchParams(item.href.split('?')[1] || '');
                                return product.category === params.get('category')
                                  && (!params.has('sub') || product.subcategory === params.get('sub'));
                              }).length} items
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Quick Filters Footer Strip */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 text-stone-600 font-medium">
                      <span className="text-stone-400">Quick Filters:</span>
                      <Link href="/shop?sort=featured" className="hover:text-[#D9531E] transition-colors">Featured Picks</Link>
                      <span>•</span>
                      <Link href="/shop?sort=new" className="hover:text-[#D9531E] transition-colors">✨ New Drops</Link>
                      <span>•</span>
                      <Link href="/shop?sort=price-low" className="hover:text-[#D9531E] transition-colors">৳ Budget Picks</Link>
                    </div>
                    <Link
                      href="/shop"
                      className="px-3 py-1 bg-[#D9531E] text-white font-bold rounded-lg hover:bg-[#BA4113] transition-colors"
                    >
                      Visit Full Store →
                    </Link>
                  </div>
                </div>
              </div>
            </li>

            {[
              {
                name: 'Personalized Gifts',
                bnName: 'উপহার ও স্পেশাল',
                href: '/shop?category=gifts',
                icon: Gift,
                image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=400&auto=format&fit=crop',
              },
              {
                name: "Men's Apparel",
                bnName: 'পুরুষদের পোশাক',
                href: '/shop?category=fashion&sub=men',
                image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop',
              },
              {
                name: "Women's Wear",
                bnName: 'নারীদের ফ্যাশন',
                href: '/shop?category=fashion&sub=women',
                image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
              },
              {
                name: 'Boys & Girls',
                bnName: 'বাচ্চাদের পোশাক',
                href: '/shop?category=fashion&sub=kids',
                image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400&auto=format&fit=crop',
              },
              {
                name: 'Home & Living',
                bnName: 'হোম ডেকোর ও লিভিং',
                href: '/shop?category=home',
                image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop',
              },
              {
                name: 'Desk & Office',
                bnName: 'অফিস ও ওয়ার্কস্পেস',
                href: '/shop?category=office',
                image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop',
              },
            ].map((cat, idx) => {
              const Icon = cat.icon;
              const dropdownAlignClass =
                idx <= 1
                  ? 'left-0'
                  : idx >= 4
                  ? 'right-0'
                  : 'left-1/2 -translate-x-1/2';

              const isDropdownOpen = activeSubDropdown === `cat-${idx}`;
              const targetParams = new URLSearchParams(cat.href.split('?')[1] || '');
              const categoryProducts = products.filter((product) =>
                product.category === targetParams.get('category')
                && (!targetParams.has('sub') || (targetParams.get('sub') === 'kids'
                  ? product.subcategory === 'boys' || product.subcategory === 'girls'
                  : product.subcategory === targetParams.get('sub')))
              );
              const menuProducts = categoryProducts.slice(0, 4);
              const isCurrentCategory =
                pathname === '/shop' &&
                searchParams.get('category') === targetParams.get('category') &&
                (!targetParams.has('sub') || searchParams.get('sub') === targetParams.get('sub'));

              return (
                <li key={idx} className="relative group/navitem subnav-item-container">
                  <div className={`inline-flex items-center rounded-full border shadow-2xs hover:shadow-xs transition-all duration-200 pl-3.5 pr-2 py-1.5 text-xs ${isCurrentCategory ? 'bg-[#FAF3EA] border-[#D9531E]/30 font-extrabold text-[#D9531E]' : 'bg-stone-100/60 border-transparent font-semibold text-stone-700 hover:bg-white hover:border-stone-200/90 hover:text-stone-950'}`}>
                    <Link
                      href={cat.href}
                      onClick={() => setActiveSubDropdown(null)}
                      aria-current={isCurrentCategory ? 'page' : undefined}
                      className={`flex items-center gap-1.5 transition-colors ${isCurrentCategory ? 'font-extrabold text-[#D9531E]' : 'hover:text-[#D9531E]'}`}
                    >
                      {Icon && <Icon className="w-3.5 h-3.5 text-[#D9531E]" />}
                      <span>{cat.name}</span>
                    </Link>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setActiveSubDropdown(isDropdownOpen ? null : `cat-${idx}`);
                      }}
                      className="ml-1 p-0.5 text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
                      aria-label={`Toggle ${cat.name} subcategories`}
                    >
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180 text-stone-900' : ''} group-hover/navitem:rotate-180`} />
                    </button>
                  </div>

                  {/* Silky Glassmorphism Flyout Dropdown */}
                  <div
                    className={`absolute top-full ${dropdownAlignClass} pt-2 transition-all duration-200 ease-out z-50 ${
                      isDropdownOpen
                        ? 'opacity-100 pointer-events-auto'
                        : 'opacity-0 pointer-events-none group-hover/navitem:opacity-100 group-hover/navitem:pointer-events-auto'
                    }`}
                  >
                    <div className="w-[calc(100vw-32px)] max-w-[320px] bg-white/95 backdrop-blur-2xl border border-stone-200/80 rounded-2xl p-4 shadow-2xl space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                        <div>
                          <h4 className="text-xs font-bold text-stone-900">{cat.name}</h4>
                          <span className="text-[10px] text-stone-500">{cat.bnName}</span>
                        </div>
                        <span className="text-[9px] font-semibold text-stone-500">{categoryProducts.length} items</span>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          {menuProducts.map((product) => (
                            <Link
                              key={product.id}
                              href={`/product/${encodeURIComponent(product.id)}`}
                              onClick={() => setActiveSubDropdown(null)}
                              className="text-[11px] font-medium text-stone-600 hover:text-[#D9531E] hover:bg-stone-50 p-1.5 rounded-lg block transition-colors leading-tight truncate"
                            >
                              {product.title}
                            </Link>
                          ))}
                          {menuProducts.length === 0 && <span className="block p-1.5 text-[11px] text-stone-500">No items listed yet.</span>}
                        </div>
                        <div className="rounded-xl overflow-hidden relative aspect-square bg-stone-100 group/img">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-stone-950/70 via-transparent to-transparent flex items-end p-2">
                            {menuProducts[0] && <span className="text-[10px] font-bold text-white leading-tight line-clamp-2">{menuProducts[0].title}</span>}
                          </div>
                        </div>
                      </div>

                      <Link
                        href={cat.href}
                        onClick={() => setActiveSubDropdown(null)}
                        className="w-full py-1.5 bg-stone-50 hover:bg-[#D9531E] hover:text-white text-stone-700 text-[11px] font-bold rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                      >
                        Browse all in {cat.name} <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-5 py-4 space-y-3">
          <div className="pb-2 border-b border-stone-100">
            <Image
              src="/brand-text.png"
              alt="soplol"
              width={120}
              height={40}
              className="h-8 w-auto object-contain"
            />
          </div>

          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-semibold text-stone-900 py-1"
          >
            Home
          </Link>

          <div className="pt-2 border-t border-stone-100 space-y-1 text-xs">
            <span className="font-bold text-stone-400 uppercase tracking-wider block mb-2">
              Departments & Subcategories
            </span>

            {CATEGORIES.map((cat) => {
              const isExpanded = mobileExpandedCat === cat.id;
              return (
                <div key={cat.id} className="border-b border-stone-100 last:border-b-0 py-1">
                  <div className="flex items-center justify-between">
                    <Link
                      href={`/shop?category=${cat.id}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="font-bold text-stone-800 hover:text-[#D9531E] py-1.5 flex-1"
                    >
                      {cat.name}
                    </Link>
                    {cat.subcategories.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                        className="p-2 text-stone-400 hover:text-stone-900"
                        aria-label={`Expand ${cat.name}`}
                      >
                        <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180 text-[#D9531E]' : ''}`} />
                      </button>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="pl-3 py-1 space-y-1.5 border-l-2 border-[#D9531E]/30 my-1">
                      {cat.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop?category=${cat.id}&sub=${sub.id}`}
                          onClick={() => setMobileMenuOpen(false)}
                          className="block text-[11px] text-stone-600 hover:text-[#D9531E] py-1"
                        >
                          • {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            <Link
              href="/shop"
              onClick={() => setMobileMenuOpen(false)}
              className="block font-bold text-[#D9531E] pt-2"
            >
              🔥 Browse All Collections ({products.length})
            </Link>
          </div>

          <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
            {currentUser ? (
              <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="text-stone-600 font-medium flex items-center gap-1">
                <UserPlus className="w-3.5 h-3.5 text-[#D9531E]" />
                Your Orders
              </Link>
            ) : (
              <button
                onClick={() => {
                  setAuthMode('signup');
                  setIsAuthModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-stone-600 font-medium flex items-center gap-1"
              >
                <UserPlus className="w-3.5 h-3.5 text-[#D9531E]" />
                Sign Up
              </button>
            )}
            {currentUser && (
              <button
                onClick={() => {
                  setIsHelpModalOpen(true);
                  setMobileMenuOpen(false);
                }}
                className="text-stone-600 font-medium flex items-center gap-1"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#D9531E]" />
                Help & Support
              </button>
            )}
            <Link
              href="/track-order"
              onClick={() => setMobileMenuOpen(false)}
              className="text-stone-600 font-medium"
            >
              Track Order
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={<header className="sticky top-0 z-40 bg-white/85 backdrop-blur-xl border-b border-stone-200/60 h-14" />}>
      <NavbarContent />
    </Suspense>
  );
}
