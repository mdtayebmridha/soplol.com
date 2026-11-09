'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useShop } from '@/context/ShopContext';
import { Product, Order, OrderStatus, ProductCategory, ProductSubcategory } from '@/types';
import AdminSidebar from '@/components/admin/AdminSidebar';
import {
  Package,
  ShoppingBag,
  TrendingUp,
  DollarSign,
  Users,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Truck,
  SlidersHorizontal,
  Store,
  Layers,
  Search,
  X,
} from 'lucide-react';

export default function AdminPage() {
  const {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    formatPrice,
    showToast,
  } = useShop();

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'products' | 'marketplace'>('overview');
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [productSearch, setProductSearch] = useState('');

  // Add Product Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('fashion');
  const [newSubcategory, setNewSubcategory] = useState<ProductSubcategory>('men');
  const [newPriceBDT, setNewPriceBDT] = useState<number>(1500);
  const [newPriceUSD, setNewPriceUSD] = useState<number>(15);
  const [newCompareBDT, setNewCompareBDT] = useState<number>(2000);
  const [newCompareUSD, setNewCompareUSD] = useState<number>(20);
  const [newStock, setNewStock] = useState<number>(25);
  const [newDescription, setNewDescription] = useState('');
  const [newImageUrl, setNewImageUrl] = useState('');
  const [newSizes, setNewSizes] = useState('S, M, L, XL');
  const [newColors, setNewColors] = useState('Black, Navy, Olive');

  // Multi-vendor mode toggle
  const [multiVendorEnabled, setMultiVendorEnabled] = useState(false);

  // Metrics
  const totalRevenueBDT = orders.reduce((sum, o) => sum + (o.currency === 'BDT' ? o.total : o.total * 120), 0);
  const totalRevenueUSD = orders.reduce((sum, o) => sum + (o.currency === 'USD' ? o.total : o.total / 120), 0);
  const pendingOrders = orders.filter((o) => o.orderStatus === 'pending' || o.orderStatus === 'confirmed');

  // Handle Add Product Submit
  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newImageUrl) {
      showToast('Please provide a title and image URL');
      return;
    }

    const variants = [];
    if (newSizes.trim()) {
      variants.push({
        name: 'Size',
        options: newSizes.split(',').map((s) => s.trim()),
      });
    }
    if (newColors.trim()) {
      variants.push({
        name: 'Color',
        options: newColors.split(',').map((c) => c.trim()),
      });
    }

    const createdProduct: Product = {
      id: `sp-${Date.now()}`,
      title: newTitle,
      slug: newTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: newDescription || newTitle,
      shortDescription: newDescription.slice(0, 80) || newTitle,
      category: newCategory,
      subcategory: newSubcategory,
      priceBDT: Number(newPriceBDT),
      priceUSD: Number(newPriceUSD),
      compareAtPriceBDT: Number(newCompareBDT) || undefined,
      compareAtPriceUSD: Number(newCompareUSD) || undefined,
      images: [newImageUrl],
      inStock: true,
      stockQuantity: Number(newStock),
      rating: 5.0,
      reviewCount: 1,
      variants,
      tags: [newCategory, newSubcategory],
      isNewArrival: true,
      vendorId: 'soplol-official',
      vendorName: 'soplol Official',
    };

    addProduct(createdProduct);
    setShowAddModal(false);

    // Reset Form
    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
  };

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'all') return true;
    return o.orderStatus === orderFilter;
  });

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  return (
    <AdminSidebar>
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <h1 className="text-xl font-black tracking-tight text-neutral-900">
            Admin Dashboard & Operations
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500">
            Manage your store inventory, catalog orders, and fulfillment pipelines.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/shop"
            className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors"
          >
            View Live Store
          </Link>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            Add New Product
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-neutral-200 gap-6 text-sm font-medium">
        <button
          onClick={() => setActiveTab('overview')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 ${
            activeTab === 'overview'
              ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          Orders ({orders.length})
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 ${
            activeTab === 'products'
              ? 'border-b-2 border-neutral-900 text-neutral-900 font-bold'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Package className="w-4 h-4" />
          Products ({products.length})
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`pb-3 px-1 transition-colors flex items-center gap-2 ${
            activeTab === 'marketplace'
              ? 'border-b-2 border-amber-600 text-amber-700 font-bold'
              : 'text-neutral-500 hover:text-neutral-700'
          }`}
        >
          <Store className="w-4 h-4 text-amber-600" />
          Marketplace / Multi-Seller
        </button>
      </div>

      {/* Tab 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Key Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-400 block mb-1">
                Estimated Gross Revenue
              </span>
              <div className="text-2xl font-black text-neutral-900">
                ৳{Math.round(totalRevenueBDT).toLocaleString()}
              </div>
              <span className="text-xs text-neutral-500 block mt-1">
                ≈ ${Math.round(totalRevenueUSD).toLocaleString()} USD
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-400 block mb-1">
                Total Orders Placed
              </span>
              <div className="text-2xl font-black text-neutral-900">{orders.length}</div>
              <span className="text-xs text-emerald-600 font-medium block mt-1">
                {orders.length === 0 ? 'Awaiting first order' : 'Active transactions'}
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-400 block mb-1">
                Pending Fulfillment
              </span>
              <div className="text-2xl font-black text-amber-600">{pendingOrders.length}</div>
              <span className="text-xs text-neutral-500 block mt-1">
                Ready for packaging & dispatch
              </span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
              <span className="text-xs font-semibold text-neutral-400 block mb-1">
                Catalog Items
              </span>
              <div className="text-2xl font-black text-neutral-900">{products.length}</div>
              <span className="text-xs text-neutral-500 block mt-1">
                Across 4 core categories
              </span>
            </div>
          </div>

          {/* Visual Customizer Quick Access Banner */}
          <div className="bg-linear-to-r from-amber-500/10 via-orange-500/10 to-stone-100 rounded-2xl border border-amber-200/80 p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Live Visual Storefront Customizer
              </div>
              <h3 className="text-base font-bold text-stone-950">
                Visual Theme & Photo Card Shape Customizer
              </h3>
              <p className="text-xs text-stone-600 max-w-xl">
                Change public product card styles (Circle, Square, Rounded), reorder homepage sections, edit hero slogans, and preview live on Desktop and Mobile before publishing!
              </p>
            </div>
            <Link
              href="/admin/store-design"
              className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold rounded-xl flex items-center gap-2 shrink-0 shadow-md transition-all hover:scale-[1.02]"
            >
              Open Visual Designer →
            </Link>
          </div>

          {/* Recent Orders Overview */}
          <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="font-bold text-base text-neutral-900">Recent Customer Orders</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-amber-600 hover:text-amber-700"
              >
                View all orders →
              </button>
            </div>

            {orders.length === 0 ? (
              <div className="text-center py-8 text-neutral-400 text-xs">
                No orders placed yet. Test the store by adding items to cart and checking out!
              </div>
            ) : (
              <div className="divide-y divide-neutral-100">
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-neutral-900">{order.orderNumber}</span>
                      <p className="text-neutral-500">
                        {order.customer.fullName} • {order.shippingAddress.city}, {order.shippingAddress.country}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-neutral-900">
                        {order.currency === 'BDT' ? `৳${order.total.toLocaleString()}` : `$${order.total.toFixed(2)}`}
                      </span>
                      <span className="block text-[10px] font-semibold uppercase text-amber-700">
                        {order.orderStatus}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Orders Management */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Orders List</h3>
              <p className="text-xs text-neutral-500">
                Update customer order status and track fulfillment.
              </p>
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-1.5 text-xs">
              {['all', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setOrderFilter(status)}
                  className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-colors ${
                    orderFilter === status
                      ? 'bg-neutral-900 text-white font-semibold'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-xs">
              No orders found matching this filter.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div
                  key={order.id}
                  className="p-5 rounded-xl border border-neutral-200/80 bg-neutral-50/50 space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200/60 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-extrabold text-neutral-900">
                          {order.orderNumber}
                        </strong>
                        <span className="text-[10px] bg-neutral-200 text-neutral-800 font-bold px-2 py-0.5 rounded">
                          {order.paymentMethod.replace('_', ' ').toUpperCase()}
                        </span>
                      </div>
                      <span className="text-neutral-500 text-[11px]">
                        Placed: {new Date(order.createdAt).toLocaleString()}
                      </span>
                    </div>

                    {/* Status updater */}
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-neutral-600">Change Status:</span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                        className="bg-white border border-neutral-300 rounded-lg px-2.5 py-1 text-xs font-bold text-neutral-800 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and shipping details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-[10px] block">
                        Customer
                      </span>
                      <p className="font-bold text-neutral-900">{order.customer.fullName}</p>
                      <p className="text-neutral-600">{order.customer.phone}</p>
                      <p className="text-neutral-600">{order.customer.email || 'No email'}</p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-[10px] block">
                        Shipping Address
                      </span>
                      <p className="text-neutral-900">{order.shippingAddress.street}</p>
                      <p className="text-neutral-600">
                        {order.shippingAddress.city},{' '}
                        {order.shippingAddress.district ? `${order.shippingAddress.district}, ` : ''}
                        {order.shippingAddress.country}
                      </p>
                    </div>

                    <div>
                      <span className="font-bold text-neutral-500 uppercase text-[10px] block">
                        Financials
                      </span>
                      <p className="font-bold text-neutral-900 text-sm">
                        Total: {order.currency === 'BDT' ? `৳${order.total.toLocaleString()}` : `$${order.total.toFixed(2)}`}
                      </p>
                      <p className="text-neutral-500">Payment: {order.paymentStatus}</p>
                      {order.notes && <p className="text-amber-800 font-medium">{order.notes}</p>}
                    </div>
                  </div>

                  {/* Ordered items preview */}
                  <div className="pt-2 border-t border-neutral-200/60 flex flex-wrap gap-2">
                    {order.items.map((i) => (
                      <span
                        key={i.id}
                        className="bg-white border border-neutral-200 px-2.5 py-1 rounded text-[11px] text-neutral-700"
                      >
                        {i.quantity}x {i.product.title}{' '}
                        {Object.keys(i.selectedVariants).length > 0 &&
                          `(${Object.values(i.selectedVariants).join(', ')})`}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Products Management */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
            <div>
              <h3 className="text-base font-bold text-neutral-900">Manage Catalog</h3>
              <p className="text-xs text-neutral-500">
                Add, edit prices, manage variants and stock status.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="pl-8 pr-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:bg-white"
                />
                <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              </div>

              <button
                onClick={() => setShowAddModal(true)}
                className="px-3.5 py-1.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Product
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-neutral-700">
              <thead className="bg-neutral-50 text-[11px] uppercase tracking-wider text-neutral-500 border-b border-neutral-200">
                <tr>
                  <th className="py-3 px-4">Item</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price (BDT / USD)</th>
                  <th className="py-3 px-4">Stock</th>
                  <th className="py-3 px-4">Vendor</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-50/60 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-12 rounded bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200">
                          <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="font-semibold text-neutral-900 max-w-xs truncate">
                          {p.title}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 capitalize">
                      {p.category} / {p.subcategory}
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">
                      ৳{p.priceBDT.toLocaleString()} / ${p.priceUSD}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => updateProduct(p.id, { inStock: !p.inStock })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          p.inStock
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {p.inStock ? 'In Stock' : 'Out of Stock'}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-neutral-500">
                      {p.vendorName || 'soplol Official'}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="text-neutral-400 hover:text-rose-600 transition-colors p-1"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 4: Marketplace / Multi-Seller Settings */}
      {activeTab === 'marketplace' && (
        <div className="bg-white rounded-2xl border border-neutral-200 shadow-xs p-6 space-y-6">
          <div className="flex items-start justify-between pb-6 border-b border-neutral-100">
            <div className="max-w-xl space-y-1">
              <div className="flex items-center gap-2">
                <Store className="w-5 h-5 text-amber-600" />
                <h3 className="text-base font-bold text-neutral-900">
                  Marketplace Architecture & Multi-Vendor Readiness
                </h3>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                soplol is designed with native multi-seller schema support. You can start by selling your own products under the <strong>soplol Official</strong> brand, and whenever you choose, activate external sellers with zero database migrations.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-neutral-700">Multi-Vendor Mode:</span>
              <button
                onClick={() => {
                  setMultiVendorEnabled(!multiVendorEnabled);
                  showToast(
                    !multiVendorEnabled
                      ? 'Marketplace seller registration mode enabled!'
                      : 'Switched to Single Brand mode.'
                  );
                }}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  multiVendorEnabled ? 'bg-amber-600' : 'bg-neutral-300'
                }`}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                    multiVendorEnabled ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-900">1. Vendor Onboarding</h4>
              <p className="text-neutral-600">
                When enabled, an external registration page (<code>/seller/join</code>) lets artisans and suppliers submit their trade license, NID/Passport, and store profile for admin approval.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-900">2. Commission & Split Payments</h4>
              <p className="text-neutral-600">
                Default commission is configured at 10% per sale. Payments collected via bKash or Stripe are credited to your master account, and vendor payout ledger is maintained automatically.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-neutral-200 bg-neutral-50 space-y-2 text-xs">
              <h4 className="font-bold text-neutral-900">3. Brand Quality Gate</h4>
              <p className="text-neutral-600">
                Products uploaded by third-party sellers remain in &quot;Pending Review&quot; status until approved by the soplol admin team, safeguarding customer trust.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-5 text-neutral-900">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
              <h3 className="text-base font-bold">Add New Product to soplol</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 text-neutral-400 hover:text-neutral-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Handcrafted Leather Laptop Sleeve"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Category *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  >
                    <option value="fashion">Fashion & Apparel</option>
                    <option value="gifts">Gifts & Celebrations</option>
                    <option value="home">Home & Living</option>
                    <option value="office">Office & Desk</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Sub-Category *</label>
                  <select
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value as ProductSubcategory)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  >
                    <option value="men">Men</option>
                    <option value="women">Women</option>
                    <option value="boys">Boys</option>
                    <option value="girls">Girls</option>
                    <option value="personalized">Personalized</option>
                    <option value="living">Living Room</option>
                    <option value="decor">Decor Accents</option>
                    <option value="desk">Desk Accessories</option>
                    <option value="stationery">Stationery</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Price (৳ BDT) *</label>
                  <input
                    type="number"
                    required
                    value={newPriceBDT}
                    onChange={(e) => setNewPriceBDT(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Price ($ USD) *</label>
                  <input
                    type="number"
                    required
                    value={newPriceUSD}
                    onChange={(e) => setNewPriceUSD(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Compare ৳</label>
                  <input
                    type="number"
                    value={newCompareBDT}
                    onChange={(e) => setNewCompareBDT(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Stock Qty *</label>
                  <input
                    type="number"
                    required
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Image URL (Unsplash or CDN) *</label>
                <input
                  type="url"
                  required
                  placeholder="https://images.unsplash.com/..."
                  value={newImageUrl}
                  onChange={(e) => setNewImageUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl focus:outline-none focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Sizes (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="S, M, L, XL"
                    value={newSizes}
                    onChange={(e) => setNewSizes(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Colors (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="Black, Navy, Tan"
                    value={newColors}
                    onChange={(e) => setNewColors(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold block mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Crafted from premium materials..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl"
                />
              </div>

              <div className="pt-3 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-neutral-300 rounded-xl hover:bg-neutral-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-900 text-white rounded-xl font-semibold hover:bg-neutral-800"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
    </AdminSidebar>
  );
}
