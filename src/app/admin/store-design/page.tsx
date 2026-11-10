'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useShop, DEFAULT_PAGE_BLOCKS } from '@/context/ShopContext';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { CardShape, PageBlock, BlockType } from '@/types';
import ProductCard from '@/components/ProductCard';
import {
  Layout,
  Save,
  RotateCcw,
  Smartphone,
  Tablet,
  Monitor,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Layers,
  Circle,
  Square,
  SquareDashedBottom,
  ExternalLink,
  Plus,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  GripVertical,
  Edit3,
  CheckCircle2,
  Gift,
  ShoppingBag,
  Star,
  ShieldCheck,
  Megaphone,
  X,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function StoreDesignPage() {
  const {
    themeSettings,
    updateThemeSettings,
    resetThemeSettings,
    showToast,
    products,
    addBlock,
    updateBlock,
    removeBlock,
    reorderBlocks,
    duplicateBlock,
  } = useShop();

  // Local editable draft state initialized from themeSettings
  const [draftCardShape, setDraftCardShape] = useState<CardShape>(themeSettings?.cardShape || 'rounded');
  const [draftHeroHeading, setDraftHeroHeading] = useState(
    themeSettings?.heroHeading || 'Discover unique handcrafted items, bespoke gifts & tailored fashion.'
  );
  const [draftHeroSubheading, setDraftHeroSubheading] = useState(
    themeSettings?.heroSubheading || 'Thoughtfully curated for both Bangladesh and global customers. Delivered to your doorstep with love and care.'
  );
  const [draftAnnouncement, setDraftAnnouncement] = useState(
    themeSettings?.announcementText || 'Free delivery in Bangladesh over ৳2,500 | Tracked Express Worldwide Shipping ✈️'
  );
  const [draftBlocks, setDraftBlocks] = useState<PageBlock[]>(
    themeSettings?.blocks && themeSettings.blocks.length > 0
      ? themeSettings.blocks
      : DEFAULT_PAGE_BLOCKS
  );

  const [activeTab, setActiveTab] = useState<'blocks' | 'branding'>('blocks');
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editingBlockId, setEditingBlockId] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [insertAtIndex, setInsertAtIndex] = useState<number | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetIndex: number) => {
    if (draggedIndex === null || draggedIndex === targetIndex) return;
    const updated = [...draftBlocks];
    const [movedItem] = updated.splice(draggedIndex, 1);
    updated.splice(targetIndex, 0, movedItem);
    setDraftBlocks(updated);
    setDraggedIndex(null);
  };

  // Move block up or down
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const updated = [...draftBlocks];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= updated.length) return;
    const temp = updated[index];
    updated[index] = updated[target];
    updated[target] = temp;
    setDraftBlocks(updated);
  };

  // Toggle block visibility
  const toggleVisibility = (blockId: string) => {
    setDraftBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, visible: !b.visible } : b))
    );
  };

  // Delete block
  const handleDeleteBlock = (blockId: string) => {
    setDraftBlocks((prev) => prev.filter((b) => b.id !== blockId));
    if (editingBlockId === blockId) setEditingBlockId(null);
    showToast('Block removed from layout');
  };

  // Duplicate block
  const handleDuplicateBlock = (blockId: string) => {
    const idx = draftBlocks.findIndex((b) => b.id === blockId);
    if (idx === -1) return;
    const original = draftBlocks[idx];
    const cloned: PageBlock = {
      ...original,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: `${original.title} (Copy)`,
    };
    const updated = [...draftBlocks];
    updated.splice(idx + 1, 0, cloned);
    setDraftBlocks(updated);
    showToast('Block duplicated');
  };

  // Add new block preset
  const handleAddNewBlock = (type: BlockType) => {
    const newId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: PageBlock;

    switch (type) {
      case 'product_grid':
        newBlock = {
          id: newId,
          type: 'product_grid',
          title: 'Special Handcrafted Finds',
          subtitle: 'Hand-picked artisanal goods with verified buyer reviews',
          categoryFilter: 'all',
          itemCount: 4,
          cardShape: draftCardShape,
          visible: true,
        };
        break;
      case 'single_product_spotlight':
        newBlock = {
          id: newId,
          type: 'single_product_spotlight',
          title: 'Artisan Spotlight Item',
          subtitle: 'Featured showcase crafted with passion in Dhaka',
          badgeText: 'Limited Release',
          visible: true,
          buttonText: 'Order Now',
        };
        break;
      case 'category_bubbles':
        newBlock = {
          id: newId,
          type: 'category_bubbles',
          title: 'Browse Popular Departments',
          subtitle: 'Explore curated categories with fast dispatch',
          visible: true,
          cardShape: 'circle',
        };
        break;
      case 'promo_banner':
        newBlock = {
          id: newId,
          type: 'promo_banner',
          title: 'Seasonal Artisanal Offer — Flat 20% Off',
          subtitle: 'Enjoy instant savings on all custom gifts & home decor.',
          badgeText: 'Limited Time Deal',
          buttonText: 'Claim Offer',
          buttonLink: '/shop',
          bgStyle: 'accent',
          visible: true,
        };
        break;
      case 'recipient_grid':
        newBlock = {
          id: newId,
          type: 'recipient_grid',
          title: 'Gift Finder by Recipient',
          subtitle: 'Find the perfect match for everyone special',
          visible: true,
        };
        break;
      case 'customer_reviews':
        newBlock = {
          id: newId,
          type: 'customer_reviews',
          title: 'Buyer Reviews & Experiences',
          subtitle: 'Real customer feedback from Dhaka, London, and New York',
          visible: true,
        };
        break;
      case 'trust_badges':
        newBlock = {
          id: newId,
          type: 'trust_badges',
          title: 'Why Buy From SOPLOL',
          subtitle: 'Genuine artisan ethics, buyer protection & dual delivery',
          visible: true,
        };
        break;
      case 'rich_text':
        newBlock = {
          id: newId,
          type: 'rich_text',
          title: 'The SOPLOL Craftsmanship Story',
          subtitle: 'Preserving Bengali heritage while serving homes worldwide.',
          content: 'Every stitch, clay mold, and brass casting is brought to life by generational artisans in Bangladesh. We bring you ethically sourced, world-class craftsmanship with doorstep delivery.',
          visible: true,
        };
        break;
      default:
        newBlock = {
          id: newId,
          type: 'product_grid',
          title: 'New Section',
          subtitle: 'Section description',
          visible: true,
        };
    }

    const updated = [...draftBlocks];
    if (insertAtIndex !== null && insertAtIndex >= 0 && insertAtIndex <= updated.length) {
      updated.splice(insertAtIndex, 0, newBlock);
    } else {
      updated.push(newBlock);
    }

    setDraftBlocks(updated);
    setShowAddModal(false);
    setInsertAtIndex(null);
    setEditingBlockId(newBlock.id);
    showToast(`Added section: ${newBlock.title}`);
  };

  // Save and publish live
  const handleSaveAndPublish = () => {
    updateThemeSettings({
      cardShape: draftCardShape,
      heroHeading: draftHeroHeading,
      heroSubheading: draftHeroSubheading,
      announcementText: draftAnnouncement,
      blocks: draftBlocks,
    });
    showToast('🎉 All layout changes published live to storefront!');
  };

  // Reset to default layout
  const handleReset = () => {
    resetThemeSettings();
    setDraftCardShape('rounded');
    setDraftHeroHeading('Discover unique handcrafted items, bespoke gifts & tailored fashion.');
    setDraftHeroSubheading('Thoughtfully curated for both Bangladesh and global customers. Delivered to your doorstep with love and care.');
    setDraftAnnouncement('Free delivery in Bangladesh over ৳2,500 | Tracked Express Worldwide Shipping ✈️');
    setDraftBlocks(DEFAULT_PAGE_BLOCKS);
    setEditingBlockId(null);
  };

  // Circular Categories Mock
  const circularCategories = [
    { title: 'Personalized Gifts', link: '/shop?category=gifts', image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=400&auto=format&fit=crop' },
    { title: "Men's Apparel", link: '/shop?category=fashion&sub=men', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400&auto=format&fit=crop' },
    { title: "Women's Ethnic", link: '/shop?category=fashion&sub=women', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400&auto=format&fit=crop' },
    { title: 'Boys & Girls', link: '/shop?category=fashion&sub=boys', image: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400&auto=format&fit=crop' },
    { title: 'Ceramics & Decor', link: '/shop?category=home', image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400&auto=format&fit=crop' },
    { title: 'Office & Desk', link: '/shop?category=office', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?q=80&w=400&auto=format&fit=crop' },
  ];

  // Helper to render block preview
  const renderPreviewBlock = (block: PageBlock, index: number) => {
    if (!block.visible) {
      return (
        <div key={block.id} className="p-4 bg-stone-100/70 border border-dashed border-stone-300 rounded-2xl text-center text-xs text-stone-400">
          Hidden Section: <span className="font-bold text-stone-600">{block.title}</span> (Visible: Off)
        </div>
      );
    }

    const effectiveShape = block.cardShape || draftCardShape;
    const shapeClass =
      effectiveShape === 'circle'
        ? 'rounded-full'
        : effectiveShape === 'square'
        ? 'rounded-none'
        : 'rounded-2xl';

    return (
      <div
        key={block.id}
        className={`group relative rounded-2xl transition-all duration-200 ${
          editingBlockId === block.id ? 'ring-2 ring-[#242735] bg-[#242735]/5 p-2' : ''
        }`}
      >
        {/* On-Hover Live Floating Control Strip */}
        <div className="absolute top-2 right-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900/90 backdrop-blur-md text-white px-2.5 py-1.5 rounded-xl flex items-center gap-2 text-xs shadow-lg">
          <span className="text-[10px] text-stone-300 font-bold uppercase tracking-wider">{block.type.replace('_', ' ')}</span>
          <div className="h-3 w-px bg-stone-700" />
          <button
            onClick={() => moveBlock(index, 'up')}
            disabled={index === 0}
            className="hover:text-slate-500 disabled:opacity-30"
            title="Move Up"
          >
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => moveBlock(index, 'down')}
            disabled={index === draftBlocks.length - 1}
            className="hover:text-slate-500 disabled:opacity-30"
            title="Move Down"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setEditingBlockId(editingBlockId === block.id ? null : block.id)}
            className="hover:text-slate-500 text-stone-200"
            title="Edit Section Settings"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDuplicateBlock(block.id)}
            className="hover:text-slate-500 text-stone-200"
            title="Duplicate Block"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => handleDeleteBlock(block.id)}
            className="hover:text-rose-400 text-stone-200"
            title="Delete Block"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Block Specific Content Preview */}
        {block.type === 'category_bubbles' && (
          <section className="space-y-4">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">{block.title}</h3>
              {block.subtitle && <p className="text-[11px] text-stone-500 mt-0.5">{block.subtitle}</p>}
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
              {circularCategories.map((item, idx) => (
                <div key={idx} className="flex flex-col items-center text-center space-y-1.5">
                  <div className={`relative w-14 h-14 sm:w-16 sm:h-16 ${shapeClass} overflow-hidden border border-stone-200 bg-stone-100`}>
                    <img src={item.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-[10px] font-bold text-stone-800 truncate max-w-[80px]">{item.title}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {block.type === 'product_grid' && (
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">{block.title}</h3>
                {block.subtitle && <p className="text-[11px] text-stone-500">{block.subtitle}</p>}
              </div>
              <span className="text-[10px] font-bold text-[#242735] uppercase tracking-wider">
                Category: {block.categoryFilter || 'All'}
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {products
                .filter((p) => (block.categoryFilter && block.categoryFilter !== 'all' ? p.category === block.categoryFilter : true))
                .slice(0, block.itemCount || 4)
                .map((p) => (
                  <ProductCard key={p.id} product={p} shapeOverride={block.cardShape || draftCardShape} />
                ))}
            </div>
          </section>
        )}

        {block.type === 'single_product_spotlight' && (
          <section className="p-5 rounded-2xl bg-stone-900 text-white flex flex-col sm:flex-row items-center gap-5">
            <div className="w-full sm:w-1/3 aspect-4/3 rounded-xl overflow-hidden bg-stone-800">
              <img
                src={products[0]?.images[0] || 'https://images.unsplash.com/photo-1627123424574-724758594e93?q=80&w=600'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-full sm:w-2/3 space-y-2">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider">
                {block.badgeText || 'Special Highlight'}
              </span>
              <h3 className="text-lg font-serif font-black">{block.title}</h3>
              <p className="text-xs text-stone-300">{block.subtitle || products[0]?.description}</p>
              <div className="pt-2">
                <span className="px-4 py-2 bg-[#242735] text-white rounded-xl text-xs font-bold inline-block">
                  {block.buttonText || 'View Listing'}
                </span>
              </div>
            </div>
          </section>
        )}

        {block.type === 'promo_banner' && (
          <section className="p-6 rounded-2xl bg-linear-to-r from-slate-600 via-slate-600 to-[#242735] text-white text-center space-y-2 shadow-sm">
            {block.badgeText && (
              <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-[10px] font-black tracking-widest uppercase backdrop-blur-xs">
                {block.badgeText}
              </span>
            )}
            <h3 className="text-xl font-serif font-black">{block.title}</h3>
            {block.subtitle && <p className="text-xs text-white/90 max-w-xl mx-auto">{block.subtitle}</p>}
            {block.buttonText && (
              <div className="pt-2">
                <span className="px-5 py-2 bg-stone-950 text-white hover:bg-stone-900 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                  {block.buttonText}
                </span>
              </div>
            )}
          </section>
        )}

        {block.type === 'recipient_grid' && (
          <section className="space-y-4">
            <div className="text-center">
              <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900">{block.title}</h3>
              {block.subtitle && <p className="text-[11px] text-stone-500">{block.subtitle}</p>}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { title: 'For Her', desc: 'Georgette & accessories', img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?q=80&w=400' },
                { title: 'For Him', desc: 'Oxford shirts & leather', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?q=80&w=400' },
                { title: 'For Kids', desc: 'Playful organic cotton', img: 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?q=80&w=400' },
                { title: 'For Home', desc: 'Ceramics & brassware', img: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?q=80&w=400' },
              ].map((r, i) => (
                <div key={i} className={`relative aspect-4/5 ${shapeClass} overflow-hidden bg-stone-100 shadow-2xs`}>
                  <img src={r.img} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-950/80 via-transparent" />
                  <div className="absolute bottom-2 left-2 right-2 text-white">
                    <span className="text-xs font-bold block">{r.title}</span>
                    <span className="text-[9px] text-stone-300 block">{r.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {block.type === 'customer_reviews' && (
          <section className="p-5 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-4">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-slate-600 mb-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-slate-500 text-slate-500" />
                ))}
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900">{block.title}</h3>
              {block.subtitle && <p className="text-[11px] text-stone-500">{block.subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {[
                { name: 'Nabila K. (Dhaka)', quote: 'The personalized embroidery is exquisite! Arrived in 2 days.' },
                { name: 'Tanvir H. (Chittagong)', quote: 'Pure Oxford cotton fabric quality is world class. True to size.' },
                { name: 'Samantha R. (London)', quote: 'Shipped to UK with express tracking. The clay pot is a true masterpiece.' },
              ].map((rev, i) => (
                <div key={i} className="p-3 bg-white rounded-xl border border-stone-200/60 shadow-2xs space-y-1">
                  <span className="font-bold text-stone-900 block text-[11px]">{rev.name}</span>
                  <p className="text-stone-600 text-[11px] italic">&quot;{rev.quote}&quot;</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {block.type === 'trust_badges' && (
          <section className="p-4 rounded-2xl bg-stone-900 text-white">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div>
                <ShieldCheck className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                <span className="text-xs font-bold block">100% Artisanal</span>
                <span className="text-[10px] text-stone-400">Direct from Dhaka</span>
              </div>
              <div>
                <Sparkles className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                <span className="text-xs font-bold block">Personalized</span>
                <span className="text-[10px] text-stone-400">Custom names & gift sets</span>
              </div>
              <div>
                <ShoppingBag className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                <span className="text-xs font-bold block">Dual Delivery</span>
                <span className="text-[10px] text-stone-400">BD COD & Global Express</span>
              </div>
              <div>
                <Star className="w-5 h-5 text-slate-500 mx-auto mb-1" />
                <span className="text-xs font-bold block">Star Seller Trust</span>
                <span className="text-[10px] text-stone-400">12,000+ happy buyers</span>
              </div>
            </div>
          </section>
        )}

        {block.type === 'rich_text' && (
          <section className="p-6 rounded-2xl bg-amber-50/60 border border-slate-200/80 text-center space-y-2">
            <h3 className="text-lg font-serif font-black text-stone-950">{block.title}</h3>
            {block.subtitle && <p className="text-xs font-bold text-slate-900">{block.subtitle}</p>}
            <p className="text-xs text-stone-700 max-w-xl mx-auto leading-relaxed">{block.content}</p>
          </section>
        )}

        {/* Inline Insert Button Divider */}
        <div className="pt-2 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => {
              setInsertAtIndex(index + 1);
              setShowAddModal(true);
            }}
            className="px-3 py-1 bg-white hover:bg-stone-50 border border-stone-300 hover:border-[#242735] text-stone-700 hover:text-[#242735] rounded-full text-[10px] font-bold flex items-center gap-1 shadow-xs transition-all"
          >
            <Plus className="w-3 h-3" />
            Add Section Here
          </button>
        </div>
      </div>
    );
  };

  return (
    <AdminSidebar>
      <div className="max-w-[1700px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 text-neutral-900">
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-stone-200 bg-white">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Layout className="w-5 h-5 text-[#242735]" />
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
                Visual Store Builder & Section Customizer
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-slate-950 text-xs font-bold">
                {draftBlocks.length} Sections
              </span>
            </div>
            <p className="text-xs text-stone-500">
              Drag-and-drop to reorder, add custom product cards & promo blocks, configure photo card styles, and preview live!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Viewport Switcher */}
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setPreviewViewport('desktop')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewViewport === 'desktop' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
                <span className="hidden sm:inline">Desktop</span>
              </button>
              <button
                onClick={() => setPreviewViewport('tablet')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewViewport === 'tablet' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
                <span className="hidden sm:inline">Tablet</span>
              </button>
              <button
                onClick={() => setPreviewViewport('mobile')}
                className={`p-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-all ${
                  previewViewport === 'mobile' ? 'bg-white text-stone-900 shadow-xs font-bold' : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
                <span className="hidden sm:inline">Mobile</span>
              </button>
            </div>

            <button
              onClick={handleReset}
              className="px-3 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset
            </button>

            <Link
              href="/"
              target="_blank"
              className="px-3 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              View Live Store
            </Link>

            <button
              onClick={handleSaveAndPublish}
              className="px-5 py-2 bg-[#242735] hover:bg-[#191C28] text-white text-xs font-bold rounded-xl flex items-center gap-2 transition-all shadow-md active:scale-95"
            >
              <Save className="w-4 h-4" />
              Save & Publish
            </button>
          </div>
        </div>

        {/* 2-Column Builder Layout: Left Controls Dock & Right Live Preview Canvas */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Controls Dock */}
          <div className="lg:col-span-5 xl:col-span-4 space-y-5">
            {/* Nav Tabs between Sections & Branding */}
            <div className="flex bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setActiveTab('blocks')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'blocks' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Layers className="w-4 h-4 text-[#242735]" />
                Sections & Cards ({draftBlocks.length})
              </button>
              <button
                onClick={() => setActiveTab('branding')}
                className={`flex-1 py-2 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                  activeTab === 'branding' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-800'
                }`}
              >
                <Sparkles className="w-4 h-4 text-slate-600" />
                Global Appearance
              </button>
            </div>

            {/* TAB 1: Sections & Blocks Reorder & Add */}
            {activeTab === 'blocks' && (
              <div className="space-y-4">
                {/* Big Prominent Add Section Button */}
                <button
                  onClick={() => {
                    setInsertAtIndex(null);
                    setShowAddModal(true);
                  }}
                  className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all hover:scale-[1.01] active:scale-[0.99]"
                >
                  <Plus className="w-4 h-4 text-slate-500" />
                  Add New Section / Product Card
                </button>

                {/* Draggable Block Tree */}
                <div className="space-y-2.5">
                  {draftBlocks.map((block, index) => {
                    const isEditing = editingBlockId === block.id;

                    return (
                      <div
                        key={block.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(index)}
                        className={`bg-white rounded-2xl border transition-all shadow-2xs ${
                          isEditing
                            ? 'border-[#242735] ring-2 ring-[#242735]/20'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        {/* Block Item Header */}
                        <div className="p-3.5 flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2.5 flex-1 min-w-0">
                            {/* Drag handle */}
                            <div className="cursor-grab active:cursor-grabbing text-stone-400 hover:text-stone-700 p-0.5">
                              <GripVertical className="w-4 h-4" />
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-bold text-stone-900 truncate">
                                  {block.title}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 uppercase tracking-wider shrink-0">
                                  {block.type.replace('_', ' ')}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-400 truncate block">
                                {block.subtitle || `${block.type} block`}
                              </span>
                            </div>
                          </div>

                          {/* Quick Action Icons */}
                          <div className="flex items-center gap-1 shrink-0">
                            <button
                              onClick={() => moveBlock(index, 'up')}
                              disabled={index === 0}
                              className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20"
                              title="Move Up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => moveBlock(index, 'down')}
                              disabled={index === draftBlocks.length - 1}
                              className="p-1 text-stone-400 hover:text-stone-800 disabled:opacity-20"
                              title="Move Down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => toggleVisibility(block.id)}
                              className={`p-1 ${block.visible ? 'text-slate-800' : 'text-stone-300'}`}
                              title={block.visible ? 'Visible' : 'Hidden'}
                            >
                              {block.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                            </button>
                            <button
                              onClick={() => setEditingBlockId(isEditing ? null : block.id)}
                              className={`p-1 rounded-md transition-colors ${
                                isEditing ? 'bg-[#242735] text-white' : 'text-stone-500 hover:bg-stone-100'
                              }`}
                              title="Edit Settings"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteBlock(block.id)}
                              className="p-1 text-stone-400 hover:text-rose-600"
                              title="Delete"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Inline Edit Drawer for Selected Block */}
                        {isEditing && (
                          <div className="p-4 bg-stone-50/80 border-t border-stone-200 rounded-b-2xl space-y-3.5 text-xs">
                            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                              <span className="font-bold text-stone-900">Customize Section</span>
                              <button
                                onClick={() => setEditingBlockId(null)}
                                className="text-stone-400 hover:text-stone-700"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                Section Title
                              </label>
                              <input
                                type="text"
                                value={block.title}
                                onChange={(e) => {
                                  const updated = draftBlocks.map((b) =>
                                    b.id === block.id ? { ...b, title: e.target.value } : b
                                  );
                                  setDraftBlocks(updated);
                                }}
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                              />
                            </div>

                            <div>
                              <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                Subtitle / Supporting Slogan
                              </label>
                              <input
                                type="text"
                                value={block.subtitle || ''}
                                onChange={(e) => {
                                  const updated = draftBlocks.map((b) =>
                                    b.id === block.id ? { ...b, subtitle: e.target.value } : b
                                  );
                                  setDraftBlocks(updated);
                                }}
                                className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                              />
                            </div>

                            {/* Block Specific Controls */}
                            {block.type === 'product_grid' && (
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                    Category Filter
                                  </label>
                                  <select
                                    value={block.categoryFilter || 'all'}
                                    onChange={(e) => {
                                      const updated = draftBlocks.map((b) =>
                                        b.id === block.id ? { ...b, categoryFilter: e.target.value } : b
                                      );
                                      setDraftBlocks(updated);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                                  >
                                    <option value="all">All Catalog Items</option>
                                    <option value="fashion">Fashion Apparel</option>
                                    <option value="gifts">Personalized Gifts</option>
                                    <option value="home">Home Decor & Clay</option>
                                    <option value="office">Desk & Stationery</option>
                                  </select>
                                </div>

                                <div>
                                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                    Number of Items
                                  </label>
                                  <select
                                    value={block.itemCount || 4}
                                    onChange={(e) => {
                                      const updated = draftBlocks.map((b) =>
                                        b.id === block.id ? { ...b, itemCount: Number(e.target.value) } : b
                                      );
                                      setDraftBlocks(updated);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                                  >
                                    <option value={2}>2 Items</option>
                                    <option value={4}>4 Items (Recommended)</option>
                                    <option value={6}>6 Items</option>
                                    <option value={8}>8 Items</option>
                                  </select>
                                </div>
                              </div>
                            )}

                            {/* Card Shape Override */}
                            {(block.type === 'product_grid' || block.type === 'category_bubbles') && (
                              <div>
                                <label className="block text-[11px] font-bold text-stone-700 mb-1.5">
                                  Card Shape for this section
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                  {(['rounded', 'circle', 'square'] as CardShape[]).map((shape) => (
                                    <button
                                      key={shape}
                                      type="button"
                                      onClick={() => {
                                        const updated = draftBlocks.map((b) =>
                                          b.id === block.id ? { ...b, cardShape: shape } : b
                                        );
                                        setDraftBlocks(updated);
                                      }}
                                      className={`py-2 px-2 rounded-xl text-[11px] font-bold capitalize flex items-center justify-center gap-1.5 border transition-all ${
                                        (block.cardShape || draftCardShape) === shape
                                          ? 'border-[#242735] bg-[#242735]/10 text-[#242735]'
                                          : 'border-stone-200 bg-white text-stone-600 hover:bg-stone-50'
                                      }`}
                                    >
                                      {shape === 'circle' && <Circle className="w-3.5 h-3.5" />}
                                      {shape === 'square' && <Square className="w-3.5 h-3.5" />}
                                      {shape === 'rounded' && <SquareDashedBottom className="w-3.5 h-3.5" />}
                                      {shape}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}

                            {block.type === 'promo_banner' && (
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                    Badge Slogan
                                  </label>
                                  <input
                                    type="text"
                                    value={block.badgeText || ''}
                                    onChange={(e) => {
                                      const updated = draftBlocks.map((b) =>
                                        b.id === block.id ? { ...b, badgeText: e.target.value } : b
                                      );
                                      setDraftBlocks(updated);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                                    Button Call-to-Action
                                  </label>
                                  <input
                                    type="text"
                                    value={block.buttonText || ''}
                                    onChange={(e) => {
                                      const updated = draftBlocks.map((b) =>
                                        b.id === block.id ? { ...b, buttonText: e.target.value } : b
                                      );
                                      setDraftBlocks(updated);
                                    }}
                                    className="w-full px-3 py-2 bg-white border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                                  />
                                </div>
                              </div>
                            )}

                            <div className="pt-2 flex items-center justify-between">
                              <button
                                type="button"
                                onClick={() => handleDuplicateBlock(block.id)}
                                className="text-stone-600 hover:text-stone-900 font-bold text-[11px] flex items-center gap-1"
                              >
                                <Copy className="w-3.5 h-3.5" /> Duplicate
                              </button>
                              <button
                                type="button"
                                onClick={() => setEditingBlockId(null)}
                                className="px-3 py-1.5 bg-stone-900 text-white rounded-lg font-bold text-[11px]"
                              >
                                Done
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: Global Branding & Appearance */}
            {activeTab === 'branding' && (
              <div className="bg-white rounded-2xl border border-stone-200 p-5 space-y-5">
                {/* Global Card Shape */}
                <div>
                  <label className="block text-xs font-bold text-stone-900 mb-2">
                    Default Photo Card Shape (Global Storefront)
                  </label>
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'rounded', label: 'Rounded', icon: SquareDashedBottom, desc: 'Curved Soft Corners' },
                      { id: 'circle', label: 'Circle', icon: Circle, desc: 'Etsy Modern Bubbles' },
                      { id: 'square', label: 'Square', icon: Square, desc: 'Classic Clean Cut' },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setDraftCardShape(item.id as CardShape)}
                        className={`p-3 rounded-2xl border text-center transition-all ${
                          draftCardShape === item.id
                            ? 'border-[#242735] bg-[#242735]/5 ring-2 ring-[#242735]/20 text-[#242735]'
                            : 'border-stone-200 hover:border-stone-300 text-stone-700 bg-white'
                        }`}
                      >
                        <item.icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs font-bold block">{item.label}</span>
                        <span className="text-[10px] text-stone-400 block mt-0.5">{item.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hero Headlines */}
                <div className="space-y-3 pt-3 border-t border-stone-100">
                  <h3 className="text-xs font-bold text-stone-900">Hero Section Slogans</h3>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Main Hero Heading
                    </label>
                    <textarea
                      rows={2}
                      value={draftHeroHeading}
                      onChange={(e) => setDraftHeroHeading(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                      Hero Subheading / Philosophy
                    </label>
                    <textarea
                      rows={2}
                      value={draftHeroSubheading}
                      onChange={(e) => setDraftHeroSubheading(e.target.value)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                    />
                  </div>
                </div>

                {/* Announcement Bar */}
                <div className="pt-3 border-t border-stone-100">
                  <label className="block text-xs font-bold text-stone-900 mb-1">
                    Top Announcement Bar Slogan
                  </label>
                  <input
                    type="text"
                    value={draftAnnouncement}
                    onChange={(e) => setDraftAnnouncement(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-[#242735] focus:outline-hidden"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Live Preview Canvas */}
          <div className="lg:col-span-7 xl:col-span-8 space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-500 px-1">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-600 animate-pulse" />
                Live Real-Time Storefront Preview ({previewViewport.toUpperCase()})
              </span>
              <span className="text-[11px] text-stone-400">Changes update instantly below</span>
            </div>

            {/* Viewport Frame */}
            <div className="bg-stone-200/70 p-3 sm:p-6 rounded-3xl border border-stone-300 flex justify-center min-h-[800px] overflow-x-auto">
              <div
                className={`bg-[#F3EDE3] rounded-2xl shadow-xl transition-all duration-300 overflow-hidden flex flex-col ${
                  previewViewport === 'desktop'
                    ? 'w-full'
                    : previewViewport === 'tablet'
                    ? 'w-[768px]'
                    : 'w-[390px] border-8 border-stone-900 rounded-[40px]'
                }`}
              >
                {/* Mock Browser Header (or Phone Notch) */}
                {previewViewport === 'mobile' ? (
                  <div className="h-6 bg-stone-900 flex items-center justify-center">
                    <div className="w-24 h-4 bg-black rounded-b-xl" />
                  </div>
                ) : (
                  <div className="h-8 bg-stone-100 border-b border-stone-200 px-4 flex items-center gap-2 shrink-0">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-500" />
                    </div>
                    <div className="flex-1 max-w-sm mx-auto bg-white rounded-md text-[10px] text-stone-400 py-0.5 px-3 text-center truncate border border-stone-200">
                      soplol.com • Preview Mode
                    </div>
                  </div>
                )}

                {/* Announcement Strip */}
                <div className="bg-[#242735] text-white text-[10px] font-bold text-center py-1.5 px-3 truncate">
                  {draftAnnouncement}
                </div>

                {/* Preview Content Body */}
                <div className="p-4 sm:p-8 space-y-10 sm:space-y-14 overflow-y-auto">
                  {/* Hero Slogan */}
                  <div className="text-center max-w-2xl mx-auto space-y-2 pt-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#242735] bg-[#242735]/10 px-3 py-1 rounded-full">
                      Handcrafted in Bangladesh • Shipped Globally
                    </span>
                    <h2 className="text-xl sm:text-3xl font-serif font-black text-stone-900 leading-tight">
                      {draftHeroHeading}
                    </h2>
                    <p className="text-xs text-stone-600">{draftHeroSubheading}</p>
                  </div>

                  {/* Render Blocks dynamically in current draft order */}
                  {draftBlocks.map((block, index) => renderPreviewBlock(block, index))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal: Add New Section / Card */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 space-y-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <h3 className="text-lg font-bold text-stone-900">Add New Section to Storefront</h3>
                  <p className="text-xs text-stone-500">
                    Choose from modern e-commerce block presets to enhance your public pages.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-1 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {[
                  {
                    type: 'product_grid',
                    title: 'Product Grid (Custom Category)',
                    desc: 'Display a row of products from any department with custom card shape.',
                    icon: ShoppingBag,
                    badge: 'Core E-Commerce',
                  },
                  {
                    type: 'category_bubbles',
                    title: 'Category Bubbles Rail',
                    desc: 'Etsy-style circular or rounded avatars for fast department exploration.',
                    icon: Circle,
                    badge: 'Discovery',
                  },
                  {
                    type: 'promo_banner',
                    title: 'Seasonal Promo Banner',
                    desc: 'Eye-catching discount banner with call-to-action button and voucher alert.',
                    icon: Megaphone,
                    badge: 'Marketing',
                  },
                  {
                    type: 'single_product_spotlight',
                    title: 'Single Product Spotlight Card',
                    desc: 'Large highlight banner focusing on one star artisanal product.',
                    icon: Sparkles,
                    badge: 'Conversion',
                  },
                  {
                    type: 'recipient_grid',
                    title: 'Shop by Recipient Showcase',
                    desc: '4 visual photo cards: For Her, For Him, For Kids, and For Home.',
                    icon: Gift,
                    badge: 'Gift Finder',
                  },
                  {
                    type: 'customer_reviews',
                    title: 'Customer Reviews & Social Proof',
                    desc: 'Real verified testimonials with 5-star badges and buyer comments.',
                    icon: Star,
                    badge: 'Trust',
                  },
                  {
                    type: 'trust_badges',
                    title: 'Trust & Guarantees Strip',
                    desc: 'Badges highlighting artisanal authenticity, COD in BD, and global delivery.',
                    icon: ShieldCheck,
                    badge: 'Assurances',
                  },
                  {
                    type: 'rich_text',
                    title: 'Artisan Story / Manifesto',
                    desc: 'Rich text card sharing your brand heritage, ethics, and workshop story.',
                    icon: Edit3,
                    badge: 'Brand Story',
                  },
                ].map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => handleAddNewBlock(item.type as BlockType)}
                    className="p-4 rounded-2xl border border-stone-200 hover:border-[#242735] bg-white hover:bg-stone-50 text-left transition-all group flex flex-col justify-between space-y-2 hover:shadow-md"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="p-2 rounded-xl bg-stone-100 group-hover:bg-[#242735]/10 text-stone-700 group-hover:text-[#242735] transition-colors">
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 uppercase">
                          {item.badge}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#242735] transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-[11px] text-stone-500 leading-relaxed mt-0.5">
                        {item.desc}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#242735] pt-1 block group-hover:translate-x-1 transition-transform">
                      + Insert this section →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminSidebar>
  );
}
