'use client';

import React from 'react';
import Link from 'next/link';
import { useShop, DEFAULT_PAGE_BLOCKS } from '@/context/ShopContext';
import ProductCard from '@/components/ProductCard';
import { PageBlock } from '@/types';
import {
  ArrowRight,
  Sparkles,
  Gift,
  ShieldCheck,
  Truck,
  ShoppingBag,
} from 'lucide-react';

export default function HomePage() {
  const { products, themeSettings, catalogStatus } = useShop();

  const globalCardShape = themeSettings?.cardShape || 'rounded';
  const activeBlocks: PageBlock[] =
    themeSettings?.blocks && themeSettings.blocks.length > 0
      ? themeSettings.blocks
      : DEFAULT_PAGE_BLOCKS;

  // Category Bubbles
  const circularCategories = [
    {
      title: 'Personalized Gifts',
      link: '/shop?category=gifts',
      image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: "Men's Apparel",
      link: '/shop?category=fashion&sub=men',
      image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: "Women's Ethnic",
      link: '/shop?category=fashion&sub=women',
      image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Boys & Girls',
      link: '/shop?category=fashion&sub=boys',
      image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Ceramics & Decor',
      link: '/shop?category=home',
      image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop',
    },
    {
      title: 'Office & Desk',
      link: '/shop?category=office',
      image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop',
    },
  ];

  // Dynamic Block Renderer with Scroll Reveal & Stagger
  const renderBlock = (block: PageBlock) => {
    if (!block.visible) return null;

    const effectiveShape = block.cardShape || globalCardShape;
    const shapeClass =
      effectiveShape === 'circle'
        ? 'rounded-full'
        : effectiveShape === 'square'
        ? 'rounded-none'
        : 'rounded-2xl';

    switch (block.type) {
      case 'category_bubbles':
        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9531E] bg-[#D9531E]/10 px-3 py-1 rounded-full inline-block mb-2">
                Departments
              </span>
              <h2 className="text-xl sm:text-3xl font-serif font-bold text-stone-900">
                {block.title}
              </h2>
              {block.subtitle && (
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">{block.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 sm:gap-6">
              {circularCategories.map((item, idx) => (
                <Link
                  key={idx}
                  href={item.link}
                  style={{ transitionDelay: `${(idx % 6) * 55}ms` }}
                  className="reveal group flex flex-col items-center text-center space-y-2.5"
                >
                  <div
                    className={`relative w-20 h-20 sm:w-28 sm:h-28 ${shapeClass} overflow-hidden border-2 border-stone-200 group-hover:border-[#D9531E] shadow-2xs group-hover:shadow-xl transition-all duration-500 ease-out`}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />
                  </div>
                  <span className="text-xs font-bold text-stone-800 group-hover:text-[#D9531E] transition-colors leading-tight max-w-[100px]">
                    {item.title}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        );

      case 'product_grid': {
        const filtered = products
          .filter((p) =>
            block.categoryFilter && block.categoryFilter !== 'all'
              ? p.category === block.categoryFilter
              : true
          )
          .slice(0, block.itemCount || 4);

        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal flex flex-col sm:flex-row sm:items-end justify-between gap-2 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-extrabold text-[#D9531E] uppercase tracking-wider mb-1">
                  <Gift className="w-3.5 h-3.5 text-[#D9531E]" />
                  Product catalog
                </div>
                <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">
                  {block.title}
                </h2>
                {block.subtitle && (
                  <p className="text-xs text-stone-500 mt-0.5">{block.subtitle}</p>
                )}
              </div>
              <Link
                href={block.categoryFilter && block.categoryFilter !== 'all' ? `/shop?category=${block.categoryFilter}` : '/shop'}
                className="text-xs font-bold text-[#D9531E] hover:underline flex items-center gap-1 group"
              >
                View department <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((p, idx) => (
                <div
                  key={p.id}
                  className="reveal"
                  style={{ transitionDelay: `${(idx % 4) * 40}ms` }}
                >
                  <ProductCard product={p} shapeOverride={block.cardShape || globalCardShape} />
                </div>
              ))}
            </div>
          </section>
        );
      }

      case 'promo_banner':
        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal-s p-8 sm:p-14 rounded-3xl bg-linear-to-r from-amber-600 via-orange-600 to-[#D9531E] text-white text-center space-y-4 shadow-xl relative overflow-hidden group">
              {/* Subtle ambient light */}
              <div className="absolute inset-0 bg-radial from-white/20 via-transparent to-transparent pointer-events-none group-hover:scale-110 transition-transform duration-1000" />

              <div className="relative z-10 space-y-3 max-w-2xl mx-auto">
                {block.badgeText && (
                  <span className="inline-block px-4 py-1 rounded-full bg-white/20 text-white text-xs font-black tracking-widest uppercase backdrop-blur-md apple-shimmer-sweep">
                    {block.badgeText}
                  </span>
                )}
                <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight leading-tight">
                  {block.title}
                </h2>
                {block.subtitle && (
                  <p className="text-sm text-white/90 leading-relaxed font-light">
                    {block.subtitle}
                  </p>
                )}
                {block.buttonText && (
                  <div className="pt-2">
                    <Link
                      href={block.buttonLink || '/shop'}
                      className="apple-btn px-7 py-3.5 bg-stone-950 hover:bg-stone-900 text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-xl"
                    >
                      {block.buttonText}
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </section>
        );

      case 'single_product_spotlight': {
        const spotProduct = products[0];
        if (!spotProduct) return null;

        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal p-6 sm:p-10 rounded-3xl bg-stone-900 text-white flex flex-col lg:flex-row items-center gap-8 shadow-2xl border border-stone-800">
              <div className="w-full lg:w-1/2 aspect-4/3 rounded-2xl overflow-hidden bg-stone-800 group relative">
                <img
                  src={spotProduct.images[0]}
                  alt={spotProduct.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
              <div className="w-full lg:w-1/2 space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 fill-stone-950" />
                  {block.badgeText || 'Featured item'}
                </span>
                <h3 className="text-2xl sm:text-4xl font-serif font-black leading-tight">{block.title}</h3>
                <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
                  {block.subtitle || spotProduct.description}
                </p>
                <div className="pt-2 flex items-center gap-4">
                  <Link
                    href={`/product/${spotProduct.id}`}
                    className="apple-btn px-6 py-3 bg-[#D9531E] hover:bg-[#BA4113] text-white rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-2 shadow-lg"
                  >
                    {block.buttonText || 'Discover Listing'}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      }

      case 'recipient_grid':
        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal text-center mb-8">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9531E] bg-[#D9531E]/10 px-3 py-1 rounded-full inline-block mb-2">
                Browse by department
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
                {block.title}
              </h2>
              {block.subtitle && (
                <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-lg mx-auto">{block.subtitle}</p>
              )}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: 'Gifts for Her', desc: 'Women’s apparel', link: '/shop?category=fashion&sub=women', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=600&auto=format&fit=crop', delay: 'delay-1' },
                { title: 'Gifts for Him', desc: 'Men’s apparel', link: '/shop?category=fashion&sub=men', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=600&auto=format&fit=crop', delay: 'delay-2' },
                { title: 'Gifts for Kids', desc: 'Browse kids’ apparel', link: '/shop?category=fashion&sub=boys', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=600&auto=format&fit=crop', delay: 'delay-3' },
                { title: 'Gifts for Home', desc: 'Home & living products', link: '/shop?category=home', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=600&auto=format&fit=crop', delay: 'delay-4' },
              ].map((r, i) => (
                <Link
                  key={i}
                  href={r.link}
                  className={`reveal-s ${r.delay} group relative ${shapeClass} overflow-hidden aspect-4/5 bg-stone-100 shadow-2xs hover:shadow-2xl transition-all duration-500 card-3d`}
                >
                  <img
                    src={r.img}
                    alt={r.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-950/25 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <span className="text-[10px] font-bold text-amber-300 uppercase tracking-widest block mb-0.5">
                      Catalog
                    </span>
                    <h3 className="text-base sm:text-lg font-serif font-bold group-hover:text-amber-200 transition-colors">
                      {r.title}
                    </h3>
                    <p className="text-[11px] text-stone-300">{r.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        );

      case 'customer_reviews':
        return null;
      case 'trust_badges':
        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal bg-[#FAF3EA] rounded-3xl p-8 sm:p-14 border border-[#EEDBCA]/80">
              <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#D9531E] bg-[#D9531E]/10 px-3 py-1 rounded-full inline-block">Shopping at soplol</span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-stone-900">{block.title}</h3>
                {block.subtitle && <p className="text-xs sm:text-sm text-stone-600">{block.subtitle}</p>}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 space-y-2 text-center">
                  <ShieldCheck className="w-6 h-6 mx-auto text-emerald-700" />
                  <h4 className="font-bold text-stone-900 text-sm">Payment options shown at checkout</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Cash on Delivery is available for Bangladesh orders. Online payment appears only when configured.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 space-y-2 text-center">
                  <Truck className="w-6 h-6 mx-auto text-blue-700" />
                  <h4 className="font-bold text-stone-900 text-sm">Order status lookup</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Check the status saved for an order using its order number and checkout phone.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-stone-200/80 space-y-2 text-center">
                  <ShoppingBag className="w-6 h-6 mx-auto text-amber-700" />
                  <h4 className="font-bold text-stone-900 text-sm">Guest or customer account</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">Place an order as a guest or sign in to link it to your account.</p>
                </div>
              </div>
            </div>
          </section>
        );
      case 'rich_text':
        return (
          <section key={block.id} className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="reveal p-8 sm:p-14 rounded-3xl bg-amber-50/70 border border-amber-200/80 text-center space-y-3.5 card-3d">
              <span className="text-[10px] font-bold text-amber-900 uppercase tracking-widest bg-amber-200/60 px-3.5 py-1 rounded-full">
                Store information
              </span>
              <h3 className="text-2xl sm:text-4xl font-serif font-black text-stone-950">{block.title}</h3>
              {block.subtitle && <p className="text-xs font-bold text-amber-800">{block.subtitle}</p>}
              <p className="text-xs sm:text-sm text-stone-700 max-w-2xl mx-auto leading-relaxed">
                {block.content}
              </p>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen space-y-12 sm:space-y-16 pb-20">
      {catalogStatus === 'unavailable' && (
        <div role="status" className="mx-auto max-w-7xl px-4 pt-4 text-center text-sm text-stone-700">
          The live catalog could not be reached. Please refresh to try again.
        </div>
      )}
      {/* Warm Hero Banner with 3D Rotating Headline (from index44.html) */}
      <section className="bg-[#FAF3EA] border-b border-stone-200/80 py-14 sm:py-20 relative overflow-hidden">
        {/* Ambient subtle light blur */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#D9531E]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-[1536px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-5">
            <div className="reveal inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/80 border border-stone-200 shadow-2xs text-xs font-semibold text-stone-700">
              <span className="w-2 h-2 rounded-full bg-[#D9531E] animate-pulse" />
              Fashion, gifts &amp; everyday items
            </div>

            {/* 3D Rotating Headline from index44.html */}
            <h1 className="reveal delay-1 text-3xl sm:text-6xl font-serif font-black text-stone-900 tracking-tight leading-tight">
              Discover unique{' '}
              <span className="rot" id="rot-container">
                <span className="rot-word on">fashion and gifts</span>
                <span className="rot-word">home products</span>
                <span className="rot-word">office products</span>
                <span className="rot-word">everyday items</span>
              </span>
            </h1>

            <p className="reveal delay-2 text-stone-600 text-sm sm:text-base font-light max-w-2xl mx-auto leading-relaxed">
              {themeSettings?.heroSubheading ||
                'Browse the catalog and see current order options at checkout.'}
            </p>

            <div className="reveal delay-3 pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/shop?category=gifts"
                className="apple-btn px-7 py-3.5 bg-[#D9531E] hover:bg-[#BA4113] text-white text-xs font-bold uppercase tracking-wider rounded-full shadow-lg"
              >
                Shop Unique Gifts
              </Link>
              <Link
                href="/shop"
                className="apple-btn px-7 py-3.5 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold uppercase tracking-wider rounded-full border border-stone-300 shadow-xs"
              >
                Explore All Collections
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Dynamic Blocks Loop rendered directly in user-customized order with scroll reveal */}
      {activeBlocks.map((block) => renderBlock(block))}
    </div>
  );
}
