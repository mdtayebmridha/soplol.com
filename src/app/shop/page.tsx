'use client';

import React, { useState, useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useShop } from '@/context/ShopContext';
import { ProductCategory, ProductSubcategory } from '@/types';
import ProductCard from '@/components/ProductCard';
import { Search } from 'lucide-react';

function ShopContent() {
  const searchParams = useSearchParams();
  return <ShopCatalog key={searchParams.toString()} searchParams={searchParams} />;
}

function ShopCatalog({ searchParams }: { searchParams: ReturnType<typeof useSearchParams> }) {
  const initialCategory = searchParams.get('category') as ProductCategory | null;
  const initialSubcategory = searchParams.get('sub') as ProductSubcategory | null;
  const initialSearch = searchParams.get('search') || '';
  const sort = searchParams.get('sort');
  const initialSort = sort === 'price-low' || sort === 'price-high' || sort === 'new' ? sort : 'featured';

  const { products, currency, catalogStatus } = useShop();

  const [selectedCategory, setSelectedCategory] = useState<ProductCategory | 'all'>(
    initialCategory || 'all'
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState<ProductSubcategory | 'all'>(
    initialSubcategory || 'all'
  );
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'new'>(initialSort);

  // Filtered & sorted products
  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        // Category filter
        if (selectedCategory !== 'all' && product.category !== selectedCategory) {
          return false;
        }
        // Subcategory filter
        if (selectedSubcategory !== 'all') {
          const matchesSubcategory = selectedSubcategory === ('kids' as ProductSubcategory)
            ? product.subcategory === 'boys' || product.subcategory === 'girls'
            : product.subcategory === selectedSubcategory;
          if (!matchesSubcategory) return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = product.title.toLowerCase().includes(q);
          const matchesDesc = product.description.toLowerCase().includes(q);
          const matchesTags = product.tags.some((t) => t.toLowerCase().includes(q));
          if (!matchesTitle && !matchesDesc && !matchesTags) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        const priceA = currency === 'BDT' ? a.priceBDT : a.priceUSD;
        const priceB = currency === 'BDT' ? b.priceBDT : b.priceUSD;

        if (sortBy === 'price-low') return priceA - priceB;
        if (sortBy === 'price-high') return priceB - priceA;
        if (sortBy === 'new') return Number(b.isNewArrival) - Number(a.isNewArrival);
        return Number(b.isFeatured) - Number(a.isFeatured);
      });
  }, [products, selectedCategory, selectedSubcategory, searchQuery, sortBy, currency]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSortBy('featured');
  };

  return (
    <div className="w-full bg-[#FAF9F6] min-h-screen text-stone-900">
      <div className="w-full max-w-[1536px] mx-auto px-4 sm:px-8 lg:px-12 py-6 sm:py-10 space-y-8">
        {/* Product Catalog */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Right Product Grid Area */}
          <div className="lg:col-span-12 space-y-6">
            {/* Top Results Bar */}
            <div className="bg-white px-5 py-3.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span className="text-xs text-stone-600 font-medium">
                Showing <strong className="text-stone-950 font-bold">{filteredProducts.length}</strong> catalog items
              </span>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-stone-500 font-semibold">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'featured' | 'price-low' | 'price-high' | 'new')}
                  className="bg-stone-50 border border-stone-200 text-stone-900 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-hidden focus:ring-2 focus:ring-[#D9531E]"
                >
                  <option value="featured">Featured Picks</option>
                  <option value="new">New Arrivals</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>
              </div>
            </div>

            {/* Products Grid */}
            {catalogStatus === 'loading' ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center text-sm text-stone-600">Loading the catalog…</div>
            ) : catalogStatus === 'unavailable' ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                <h3 className="text-xl font-serif font-bold text-stone-900">Catalog temporarily unavailable</h3>
                <p className="text-xs text-stone-500">We could not load current product and stock information. Please refresh this page and try again.</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 mx-auto flex items-center justify-center">
                  <Search className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  No listings found matching your filters
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try clearing your search query or switching to another category.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-full text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <div
                    key={product.id}
                    className="reveal"
                    style={{ transitionDelay: `${(idx % 4) * 40}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-[1536px] mx-auto p-12 text-center text-xs text-stone-500">
          Loading catalog items...
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
