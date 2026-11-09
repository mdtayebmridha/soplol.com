export type Currency = 'BDT' | 'USD';

export type ProductCategory = 'fashion' | 'gifts' | 'home' | 'office';

export type ProductSubcategory = 
  | 'men' 
  | 'women' 
  | 'boys' 
  | 'girls' 
  | 'living' 
  | 'decor' 
  | 'stationery' 
  | 'desk' 
  | 'personalized' 
  | 'accessories';

export interface ProductVariant {
  name: string; // e.g., 'Size', 'Color'
  options: string[]; // e.g., ['S', 'M', 'L', 'XL'] or ['Black', 'Emerald', 'Beige']
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ProductCategory;
  subcategory: ProductSubcategory;
  priceBDT: number;
  priceUSD: number;
  compareAtPriceBDT?: number;
  compareAtPriceUSD?: number;
  images: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  variants?: ProductVariant[];
  tags: string[];
  isFeatured?: boolean;
  isTrending?: boolean;
  isNewArrival?: boolean;
  
  // Future Multi-Vendor Marketplace readiness
  vendorId?: string; // default: 'soplol-official'
  vendorName?: string; // default: 'soplol Official Store'
}

export interface CartItem {
  id: string; // cart item unique key (productId + variant combo)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>; // e.g., { Size: 'M', Color: 'Black' }
  personalizationText?: string; // Custom engraving or name text (Etsy-style)
}

export type ShippingRegion = 'dhaka' | 'outside_dhaka' | 'international';

export type PaymentMethod = 'cod' | 'sslcommerz' | 'bkash_nagad' | 'card_stripe' | 'paypal';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  customer: {
    fullName: string;
    email: string;
    phone: string;
  };
  shippingAddress: {
    street: string;
    city: string;
    district?: string;
    country: string;
    postalCode: string;
    region: ShippingRegion;
  };
  items: CartItem[];
  currency: Currency;
  subtotal: number;
  shippingFee: number;
  discount: number;
  total: number;
  paymentMethod: PaymentMethod;
  paymentStatus: 'pending' | 'paid' | 'refunded';
  orderStatus: OrderStatus;
  trackingNumber?: string;
  notes?: string;
  vendorId?: string;
}

export interface Vendor {
  id: string;
  name: string;
  email: string;
  phone: string;
  storeName: string;
  status: 'active' | 'pending' | 'suspended';
  commissionRate: number; // e.g., 10%
  totalSales: number;
  joinedAt: string;
}

export type CardShape = 'rounded' | 'circle' | 'square';

export type BlockType =
  | 'product_grid'
  | 'single_product_spotlight'
  | 'category_bubbles'
  | 'promo_banner'
  | 'recipient_grid'
  | 'customer_reviews'
  | 'trust_badges'
  | 'rich_text';

export interface PageBlock {
  id: string;
  type: BlockType;
  title: string;
  subtitle?: string;
  visible: boolean;
  cardShape?: CardShape;
  categoryFilter?: string; // 'all' | 'fashion' | 'gifts' | 'home' | 'office'
  itemCount?: number;
  badgeText?: string;
  buttonText?: string;
  buttonLink?: string;
  bgStyle?: 'default' | 'accent' | 'dark' | 'glass';
  selectedProductId?: string;
  content?: string;
}

export interface ThemeSettings {
  cardShape: CardShape;
  showAnnouncement: boolean;
  announcementText: string;
  heroHeading: string;
  heroSubheading: string;
  sectionsOrder: string[];
  visibleSections: Record<string, boolean>;
  blocks: PageBlock[];
}

