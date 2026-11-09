'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, Order, Currency, OrderStatus, ThemeSettings, PageBlock } from '@/types';
import { INITIAL_PRODUCTS } from '@/lib/data';

export const DEFAULT_PAGE_BLOCKS: PageBlock[] = [
  {
    id: 'block-cat-1',
    type: 'category_bubbles',
    title: "Find things you'll love",
    subtitle: 'Browse the current catalog by department',
    visible: true,
    cardShape: 'circle',
  },
  {
    id: 'block-promo-1',
    type: 'promo_banner',
    title: 'Save 10% on your order',
    subtitle: 'Use code SOPLOL10 at checkout.',
    badgeText: 'Catalog promotion',
    buttonText: 'Shop Special Edit',
    buttonLink: '/shop?category=gifts',
    bgStyle: 'accent',
    visible: true,
  },
  {
    id: 'block-gifts-1',
    type: 'product_grid',
    title: 'Gifts & Celebrations',
    subtitle: 'Products currently listed in this department',
    categoryFilter: 'gifts',
    itemCount: 4,
    cardShape: 'rounded',
    visible: true,
  },
  {
    id: 'block-recip-1',
    type: 'recipient_grid',
    title: 'Browse Departments',
    subtitle: 'Explore the current product catalog by category',
    visible: false,
  },
  {
    id: 'block-best-1',
    type: 'product_grid',
    title: 'Featured Items',
    subtitle: 'Products currently listed in the catalog',
    categoryFilter: 'all',
    itemCount: 4,
    cardShape: 'rounded',
    visible: true,
  },
  {
    id: 'block-reviews-1',
    type: 'customer_reviews',
    title: 'Customer Reviews',
    subtitle: 'Verified customer reviews will appear here when available',
    visible: true,
  },
  {
    id: 'block-trust-1',
    type: 'trust_badges',
    title: 'Shopping at soplol',
    subtitle: 'See current delivery and payment options at checkout',
    visible: true,
  },
];

export const DEFAULT_THEME_SETTINGS: ThemeSettings = {
  cardShape: 'rounded',
  showAnnouncement: true,
  announcementText: 'Cash on Delivery available for Bangladesh orders | Delivery charge shown at checkout',
  heroHeading: 'Explore fashion, gifts, home and office products.',
  heroSubheading: 'Browse the catalog and see current order options at checkout.',
  sectionsOrder: ['categories', 'popular_gifts', 'featured_bestsellers', 'trust_banner'],
  visibleSections: {
    categories: true,
    popular_gifts: true,
    recipient_grid: false,
    featured_bestsellers: true,
    trust_banner: true,
  },
  blocks: DEFAULT_PAGE_BLOCKS,
};

interface ShopContextType {
  // Currency
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  formatPrice: (priceBDT: number, priceUSD: number) => string;
  getAmount: (priceBDT: number, priceUSD: number) => number;

  // Products
  products: Product[];
  catalogStatus: 'loading' | 'ready' | 'unavailable';
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;

  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    selectedVariants?: Record<string, string>,
    personalizationText?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalBDT: number;
  cartSubtotalUSD: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>) => Order;
  getOrderById: (orderId: string) => Order | undefined;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;

  // Toast
  toastMessage: string | null;
  showToast: (message: string) => void;

  // Auth Modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'signin' | 'signup';
  setAuthMode: (mode: 'signin' | 'signup') => void;

  // Help Modal
  isHelpModalOpen: boolean;
  setIsHelpModalOpen: (open: boolean) => void;

  // Quick View Modal
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Auth
  currentUser: { name: string; email: string } | null;
  setCurrentUser: (user: { name: string; email: string } | null) => void;

  // Visual Theme Customizer
  themeSettings: ThemeSettings;
  updateThemeSettings: (settings: Partial<ThemeSettings>) => void;
  resetThemeSettings: () => void;
  addBlock: (block: Omit<PageBlock, 'id'>, insertAtIndex?: number) => void;
  updateBlock: (blockId: string, updatedFields: Partial<PageBlock>) => void;
  removeBlock: (blockId: string) => void;
  reorderBlocks: (newBlocks: PageBlock[]) => void;
  duplicateBlock: (blockId: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>('BDT');
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [catalogStatus, setCatalogStatus] = useState<'loading' | 'ready' | 'unavailable'>('loading');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [themeSettings, setThemeSettings] = useState<ThemeSettings>(DEFAULT_THEME_SETTINGS);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHelpModalOpen, setIsHelpModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [authMode, setAuthMode] = useState<'signin' | 'signup'>('signup');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Local-storage state is hydrated after mount to avoid server/client markup mismatches.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    try {
      // ব্রাউজার চেক যোগ করা হয়েছে যাতে সার্ভার সাইড রেন্ডারিংয়ে এরর না দেয়
      if (typeof window !== 'undefined') {
        const savedCurrency = localStorage.getItem('soplol_currency') as Currency;
        if (savedCurrency && (savedCurrency === 'BDT' || savedCurrency === 'USD')) {
          setCurrencyState(savedCurrency);
        }

        const savedCart = localStorage.getItem('soplol_cart');
        if (savedCart) {
          setCart(JSON.parse(savedCart));
        }

        const savedWishlist = localStorage.getItem('soplol_wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }

        const savedOrders = localStorage.getItem('soplol_orders');
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        }

        const savedTheme = localStorage.getItem('soplol_theme_settings');
        if (savedTheme) {
          const parsed = JSON.parse(savedTheme);
          setThemeSettings({
            ...DEFAULT_THEME_SETTINGS,
            ...parsed,
            blocks: parsed.blocks && Array.isArray(parsed.blocks) && parsed.blocks.length > 0
              ? parsed.blocks
              : DEFAULT_PAGE_BLOCKS,
          });
        }
      }
    } catch (e) {
      console.error('Failed to parse localStorage data', e);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' })
      .then(async (response) => response.ok ? response.json() as Promise<{ user: { name: string; email: string } | null }> : null)
      .then((session) => { if (session) setCurrentUser(session.user); })
      .catch(() => undefined);
  }, []);

  useEffect(() => {
    let isCurrent = true;
    fetch('/api/products', { cache: 'no-store' })
      .then(async (response) => {
        if (!response.ok) throw new Error('Catalog API unavailable');
        return response.json() as Promise<Product[]>;
      })
      .then((databaseProducts) => {
        if (isCurrent && Array.isArray(databaseProducts) && databaseProducts.length > 0) {
          setProducts(databaseProducts);
          setCatalogStatus('ready');
        } else if (isCurrent) {
          setProducts(INITIAL_PRODUCTS);
          setCatalogStatus('ready');
        }
      })
      .catch(() => {
        if (isCurrent) {
          setProducts(INITIAL_PRODUCTS);
          setCatalogStatus('ready');
        }
      });

    return () => {
      isCurrent = false;
    };
  }, []);

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_currency', curr);
      }
    } catch {}
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const formatPrice = (priceBDT: number, priceUSD: number) => {
    if (currency === 'BDT') {
      return `৳${priceBDT.toLocaleString('en-US')}`;
    }
    return `$${priceUSD.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`;
  };

  const getAmount = (priceBDT: number, priceUSD: number) => {
    return currency === 'BDT' ? priceBDT : priceUSD;
  };

  // Cart operations
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_cart', JSON.stringify(newCart));
      }
    } catch {}
  };

  const addToCart = (
    product: Product,
    quantity = 1,
    selectedVariants: Record<string, string> = {},
    personalizationText?: string
  ) => {
    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const customKey = personalizationText ? `custom:${personalizationText.trim()}` : '';
    const cartItemId = `${product.id}-${variantKey || 'default'}-${customKey || 'none'}`;

    const existingIndex = cart.findIndex((item) => item.id === cartItemId);
    let updatedCart: CartItem[];

    if (existingIndex > -1) {
      updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart = [
        ...cart,
        {
          id: cartItemId,
          productId: product.id,
          product,
          quantity,
          selectedVariants,
          personalizationText,
        },
      ];
    }

    saveCart(updatedCart);
    showToast(`Added "${product.title}" to your cart!`);
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    const updated = cart.filter((item) => item.id !== cartItemId);
    saveCart(updated);
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    const updated = cart.map((item) =>
      item.id === cartItemId ? { ...item, quantity } : item
    );
    saveCart(updated);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const cartSubtotalBDT = cart.reduce(
    (total, item) => total + item.product.priceBDT * item.quantity,
    0
  );

  const cartSubtotalUSD = cart.reduce(
    (total, item) => total + item.product.priceUSD * item.quantity,
    0
  );

  const cartSubtotal = currency === 'BDT' ? cartSubtotalBDT : cartSubtotalUSD;

  // Wishlist
  const toggleWishlist = (productId: string) => {
    let updated: string[];
    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      showToast('Removed from wishlist');
    } else {
      updated = [...wishlist, productId];
      showToast('Added to wishlist ❤️');
    }
    setWishlist(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_wishlist', JSON.stringify(updated));
      }
    } catch {}
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  // Orders
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt'>): Order => {
    const id = `ord_${Date.now()}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `SPL-${new Date().getFullYear()}-${randomSuffix}`;
    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      createdAt: new Date().toISOString(),
    };

    const updatedOrders = [newOrder, ...orders];
    setOrders(updatedOrders);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_orders', JSON.stringify(updatedOrders));
      }
    } catch {}

    clearCart();
    return newOrder;
  };

  const getOrderById = (orderId: string) => {
    return orders.find((o) => o.id === orderId || o.orderNumber === orderId);
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    const updated = orders.map((o) =>
      o.id === orderId || o.orderNumber === orderId ? { ...o, orderStatus: status } : o
    );
    setOrders(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_orders', JSON.stringify(updated));
      }
    } catch {}
  };

  // Products
  const addProduct = (product: Product) => {
    const updated = [product, ...products];
    setProducts(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_custom_products', JSON.stringify(updated));
      }
    } catch {}
    showToast('New product added successfully!');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    const updated = products.map((p) =>
      p.id === id ? { ...p, ...updatedFields } : p
    );
    setProducts(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_custom_products', JSON.stringify(updated));
      }
    } catch {}
    showToast('Product updated successfully!');
  };

  const deleteProduct = (id: string) => {
    const updated = products.filter((p) => p.id !== id);
    setProducts(updated);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_custom_products', JSON.stringify(updated));
      }
    } catch {}
    showToast('Product removed');
  };

  const updateThemeSettings = (newSettings: Partial<ThemeSettings>) => {
    setThemeSettings((prev) => {
      const merged = { ...prev, ...newSettings };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(merged));
        }
      } catch {}
      return merged;
    });
    showToast('Theme layout settings updated & saved!');
  };

  const resetThemeSettings = () => {
    setThemeSettings(DEFAULT_THEME_SETTINGS);
    try {
      if (typeof window !== 'undefined') {
        localStorage.setItem('soplol_theme_settings', JSON.stringify(DEFAULT_THEME_SETTINGS));
      }
    } catch {}
    showToast('Theme reset to default layout.');
  };

  const addBlock = (block: Omit<PageBlock, 'id'>, insertAtIndex?: number) => {
    const newBlock: PageBlock = {
      ...block,
      id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setThemeSettings((prev) => {
      const updatedBlocks = [...(prev.blocks || [])];
      if (insertAtIndex !== undefined && insertAtIndex >= 0 && insertAtIndex <= updatedBlocks.length) {
        updatedBlocks.splice(insertAtIndex, 0, newBlock);
      } else {
        updatedBlocks.push(newBlock);
      }
      const updated = { ...prev, blocks: updatedBlocks };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    showToast(`Added section: ${newBlock.title}`);
  };

  const updateBlock = (blockId: string, updatedFields: Partial<PageBlock>) => {
    setThemeSettings((prev) => {
      const updatedBlocks = (prev.blocks || []).map((b) =>
        b.id === blockId ? { ...b, ...updatedFields } : b
      );
      const updated = { ...prev, blocks: updatedBlocks };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
  };

  const removeBlock = (blockId: string) => {
    setThemeSettings((prev) => {
      const updatedBlocks = (prev.blocks || []).filter((b) => b.id !== blockId);
      const updated = { ...prev, blocks: updatedBlocks };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    showToast('Section removed');
  };

  const reorderBlocks = (newBlocks: PageBlock[]) => {
    setThemeSettings((prev) => {
      const updated = { ...prev, blocks: newBlocks };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
  };

  const duplicateBlock = (blockId: string) => {
    setThemeSettings((prev) => {
      const index = (prev.blocks || []).findIndex((b) => b.id === blockId);
      if (index === -1) return prev;
      const original = prev.blocks[index];
      const cloned: PageBlock = {
        ...original,
        id: `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title: `${original.title} (Copy)`,
      };
      const updatedBlocks = [...prev.blocks];
      updatedBlocks.splice(index + 1, 0, cloned);
      const updated = { ...prev, blocks: updatedBlocks };
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem('soplol_theme_settings', JSON.stringify(updated));
        }
      } catch {}
      return updated;
    });
    showToast('Section duplicated');
  };

  return (
    <ShopContext.Provider
      value={{
        currency,
        setCurrency,
        formatPrice,
        getAmount,
        products,
        catalogStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotalBDT,
        cartSubtotalUSD,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        orders,
        createOrder,
        getOrderById,
        updateOrderStatus,
        toastMessage,
        showToast,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isHelpModalOpen,
        setIsHelpModalOpen,
        authMode,
        setAuthMode,
        currentUser,
        setCurrentUser,
        quickViewProduct,
        setQuickViewProduct,
        themeSettings,
        updateThemeSettings,
        resetThemeSettings,
        addBlock,
        updateBlock,
        removeBlock,
        reorderBlocks,
        duplicateBlock,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
