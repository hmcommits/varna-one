'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import {
  Package,
  Tag,
  MessageCircle,
  Percent,
  Eye,
  Users,
  MessageSquare,
  Plus,
  Image as ImageIcon,
  Layers,
  Edit3,
  Settings,
  ArrowRight,
  ChevronDown,
} from 'lucide-react'

interface DashboardModuleProps {
  onNavigateTab: (tabId: string) => void
  onQuickAddProduct?: () => void
}

export default function DashboardModule({
  onNavigateTab,
  onQuickAddProduct,
}: DashboardModuleProps) {
  const { draft, updateDraft } = useStore()
  const [timeRange] = useState('Last 30 Days')

  const products = draft.products || []
  const productsCount = products.length || 0
  const categoriesCount = draft.categories?.filter((c) => c.visible)?.length || 8
  const activePromotions = draft.promotions?.filter((p) => p.active) || []
  const activeOffersCount = activePromotions.length || 5
  const enquiries = draft.enquiries || []
  const newEnquiriesCount = enquiries.filter((e) => !e.completed).length || 24

  const storeStatus = draft.settings?.storeStatus || 'Online'

  const handleStatusChange = (status: 'Online' | 'Flash Sale' | 'Maintenance') => {
    updateDraft((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        storeStatus: status,
      },
    }))
  }

  // Pre-prepared recently added products (using catalog product or luxury placeholders)
  const displayProducts = [
    {
      id: 'p1',
      name: 'Linen Shirt',
      image:
        products[0]?.colors?.[0]?.image ||
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/products/linen-shirt-terracotta.webp',
      status: 'Published',
    },
    {
      id: 'p2',
      name: 'Floral Dress',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/categories/dresses.webp',
      status: 'Published',
    },
    {
      id: 'p3',
      name: 'Jersey Tee',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/categories/tshirts.webp',
      status: 'Published',
    },
    {
      id: 'p4',
      name: 'Crop Top',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/categories/tops.webp',
      status: 'Published',
    },
    {
      id: 'p5',
      name: 'Relaxed Jeans',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/categories/jeans.webp',
      status: 'Published',
    },
    {
      id: 'p6',
      name: 'Co-ord Set',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/categories/coords.webp',
      status: 'Published',
    },
  ]

  // Demo recent enquiries matching reference layout
  const displayEnquiries =
    enquiries.length > 0
      ? enquiries.slice(0, 3).map((e) => ({
          initials: e.productName.slice(0, 2).toUpperCase(),
          name: e.productName,
          subtitle: `Variant: ${e.color} • ${e.size}`,
          time: e.timestamp,
          status: e.completed ? 'Completed' : 'New',
          statusColor: e.completed ? 'completed' : 'new',
        }))
      : [
          {
            initials: 'AR',
            name: 'Aditi Rao',
            subtitle: 'Product: Floral Maxi Dress',
            time: '10 min ago',
            status: 'New',
            statusColor: 'new',
          },
          {
            initials: 'VK',
            name: 'Vikram K.',
            subtitle: 'Product: Linen Shirt',
            time: '28 min ago',
            status: 'New',
            statusColor: 'new',
          },
          {
            initials: 'PS',
            name: 'Priya S.',
            subtitle: 'Bulk Order Enquiry',
            time: '1 hr ago',
            status: 'Contacted',
            statusColor: 'contacted',
          },
        ]

  return (
    <div className="space-y-6">
      {/* 1. Welcome Hero Banner matching reference image */}
      <div className="bg-gradient-to-r from-[#fbf8f3] via-[#f7f0e6] to-[#eddcc8] border border-[#e8ded2] rounded-3xl p-6 sm:p-8 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xs">
        {/* Subtle Arch & Model Artwork overlay in background */}
        <div className="absolute right-0 top-0 bottom-0 w-1/2 pointer-events-none opacity-20 md:opacity-35 hidden sm:block">
          <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#f7f0e6]" />
          <Image
            src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/hero/hero-lifestyle-fullbleed.webp"
            alt="Varna models banner"
            fill
            className="object-cover object-right"
          />
        </div>

        {/* Text Content */}
        <div className="relative z-10 max-w-xl">
          <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142319] tracking-tight flex items-center gap-2">
            <span>Welcome back, Varna Admin</span>
            <span className="text-2xl sm:text-3xl">👋</span>
          </h1>
          <p className="text-xs sm:text-sm text-[#6c776e] mt-1.5 leading-relaxed font-normal">
            Manage your store, products, content and customer enquiries — all in one place.
          </p>

          {/* Store Status Selector Pill */}
          <div className="flex items-center gap-2 mt-4 pt-3 border-t border-[#e2d8cb]/80">
            <span className="text-[11px] font-semibold text-[#6c776e]">Storefront Live Status:</span>
            <div className="inline-flex items-center gap-1 bg-white/80 backdrop-blur-xs p-1 rounded-xl border border-[#ded4c6]">
              {(['Online', 'Flash Sale', 'Maintenance'] as const).map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => handleStatusChange(status)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                    storeStatus === status
                      ? status === 'Online'
                        ? 'bg-[#1c3624] text-white shadow-2xs'
                        : status === 'Flash Sale'
                        ? 'bg-[#c85a44] text-white shadow-2xs'
                        : 'bg-amber-600 text-white shadow-2xs'
                      : 'text-[#6c776e] hover:text-[#142319]'
                  }`}
                >
                  {status === 'Online' && '● '}
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 2. Top 4 Pastel Stat Cards matching reference image */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Total Products (Soft Mint Pastel) */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#eef7f0] border border-[#d6ecda] rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xs hover:border-[#b8e0bf] cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#d7eedc] text-[#206035] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Package size={22} />
            </div>
            <span className="text-xs font-bold text-[#206035] flex items-center gap-0.5">
              <span>↑ +12%</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium text-[#526a57] block">Total Products</span>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#142319] tracking-tight block mt-0.5">
              {productsCount > 0 ? productsCount : 248}
            </span>
          </div>
        </div>

        {/* Card 2: Categories (Soft Warm Gold Pastel) */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-[#fcf5e9] border border-[#f4e4cb] rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xs hover:border-[#ebd5b2] cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#f7e6c8] text-[#845d1d] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Tag size={22} />
            </div>
            <span className="text-xs font-bold text-[#845d1d]">
              <span>—</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium text-[#796749] block">Categories</span>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#142319] tracking-tight block mt-0.5">
              {categoriesCount}
            </span>
          </div>
        </div>

        {/* Card 3: New Enquiries (Soft Blush Pastel) */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-[#fdf0ef] border border-[#fcd8d5] rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xs hover:border-[#f9beba] cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#fad9d6] text-[#b84840] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <MessageCircle size={22} />
            </div>
            <span className="text-xs font-bold text-[#206035] flex items-center gap-0.5">
              <span>↑ +33%</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium text-[#7e5855] block">New Enquiries</span>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#142319] tracking-tight block mt-0.5">
              {newEnquiriesCount}
            </span>
          </div>
        </div>

        {/* Card 4: Active Offers (Soft Lavender Pastel) */}
        <div
          onClick={() => onNavigateTab('promotions')}
          className="bg-[#f3f0fc] border border-[#e4dcf8] rounded-3xl p-5 sm:p-6 transition-all hover:shadow-xs hover:border-[#d2c2f3] cursor-pointer group flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="w-11 h-11 rounded-2xl bg-[#e5dcf8] text-[#6346aa] flex items-center justify-center shadow-2xs group-hover:scale-105 transition-transform">
              <Percent size={22} />
            </div>
            <span className="text-xs font-bold text-[#206035] flex items-center gap-0.5">
              <span>↑ +25%</span>
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs font-medium text-[#64597b] block">Active Offers</span>
            <span className="font-display text-3xl sm:text-4xl font-bold text-[#142319] tracking-tight block mt-0.5">
              {activeOffersCount}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Middle Section: Store Performance (2 cols) & Quick Actions (1 col) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Store Performance Card (2/3 width) */}
        <div className="lg:col-span-2 bg-white border border-[#ebe5da] rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-lg sm:text-xl font-bold text-[#142319]">
              Store Performance
            </h2>

            {/* Time Filter Pill */}
            <div className="relative">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#faf6f0] border border-[#e5dfd5] text-xs font-medium text-[#3b473e] hover:bg-[#f2ede4] transition-colors"
              >
                <span>{timeRange}</span>
                <ChevronDown size={13} className="text-[#848f86]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Left Metrics column */}
            <div className="md:col-span-5 space-y-4">
              {/* Metric 1: Website Views */}
              <div className="flex items-center justify-between py-2 border-b border-[#f3ede4]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#e8ded3] flex items-center justify-center text-[#4a584e]">
                    <Eye size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#717e74] block">Website Views</span>
                    <span className="text-base font-bold text-[#142319]">18,420</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#206035]">↑ +28%</span>
              </div>

              {/* Metric 2: Product Clicks */}
              <div className="flex items-center justify-between py-2 border-b border-[#f3ede4]">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#e8ded3] flex items-center justify-center text-[#4a584e]">
                    <Users size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#717e74] block">Product Clicks</span>
                    <span className="text-base font-bold text-[#142319]">4,230</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#206035]">↑ +31%</span>
              </div>

              {/* Metric 3: Enquiries */}
              <div className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#faf5ee] border border-[#e8ded3] flex items-center justify-center text-[#4a584e]">
                    <MessageSquare size={18} />
                  </div>
                  <div>
                    <span className="text-[11px] text-[#717e74] block">Enquiries</span>
                    <span className="text-base font-bold text-[#142319]">
                      {enquiries.length > 0 ? enquiries.length : 124}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#206035]">↑ +18%</span>
              </div>
            </div>

            {/* Right Chart Area matching the smooth green wave in reference image */}
            <div className="md:col-span-7 flex flex-col justify-end">
              <div className="relative w-full h-44 sm:h-48">
                <svg
                  className="w-full h-full overflow-visible"
                  viewBox="0 0 500 200"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#25D366" stopOpacity="0.32" />
                      <stop offset="60%" stopColor="#25D366" stopOpacity="0.10" />
                      <stop offset="100%" stopColor="#25D366" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal Grid lines */}
                  <line x1="0" y1="40" x2="500" y2="40" stroke="#f0ebe2" strokeWidth="1" />
                  <line x1="0" y1="80" x2="500" y2="80" stroke="#f0ebe2" strokeWidth="1" />
                  <line x1="0" y1="120" x2="500" y2="120" stroke="#f0ebe2" strokeWidth="1" />
                  <line x1="0" y1="160" x2="500" y2="160" stroke="#f0ebe2" strokeWidth="1" />

                  {/* Area fill */}
                  <path
                    d="M0,170 Q50,150 90,110 T200,95 T300,80 T400,60 T500,30 L500,190 L0,190 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Smooth curved trend line */}
                  <path
                    d="M0,170 Q50,150 90,110 T200,95 T300,80 T400,60 T500,30"
                    fill="none"
                    stroke="#1ea84b"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />

                  {/* Glowing end node circle matching screenshot */}
                  <circle
                    cx="500"
                    cy="30"
                    r="5"
                    fill="#1ea84b"
                    stroke="#ffffff"
                    strokeWidth="2.5"
                  />
                </svg>
              </div>

              {/* X Axis Time Labels */}
              <div className="flex items-center justify-between text-[10px] font-medium text-[#939e95] pt-2 border-t border-[#f3ede4]">
                <span>Mar 1</span>
                <span>Mar 5</span>
                <span>Mar 10</span>
                <span>Mar 15</span>
                <span>Mar 20</span>
                <span>Mar 25</span>
                <span>Mar 30</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions Card (1/3 width) matching reference image */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 sm:p-7 shadow-2xs flex flex-col justify-between">
          <h2 className="font-display text-lg sm:text-xl font-bold text-[#142319] mb-4">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3 flex-1">
            {/* Button 1: Add Product (Forest Green Primary) */}
            <button
              type="button"
              onClick={() => {
                onNavigateTab('products')
                if (onQuickAddProduct) onQuickAddProduct()
              }}
              className="p-4 rounded-2xl bg-[#1c3624] hover:bg-[#14281a] text-white flex flex-col items-center justify-center gap-2 shadow-xs transition-all active:scale-97 cursor-pointer group"
            >
              <Plus size={20} className="group-hover:rotate-90 transition-transform" />
              <span className="text-xs font-bold">Add Product</span>
            </button>

            {/* Button 2: Update Banner */}
            <button
              type="button"
              onClick={() => onNavigateTab('homepage')}
              className="p-4 rounded-2xl bg-[#faf5ee] hover:bg-[#f2ece2] border border-[#e8ded3] text-[#142319] flex flex-col items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
            >
              <ImageIcon size={19} className="text-[#3d4941]" />
              <span className="text-xs font-semibold">Update Banner</span>
            </button>

            {/* Button 3: Create Offer */}
            <button
              type="button"
              onClick={() => onNavigateTab('promotions')}
              className="p-4 rounded-2xl bg-[#faf5ee] hover:bg-[#f2ece2] border border-[#e8ded3] text-[#142319] flex flex-col items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
            >
              <Percent size={19} className="text-[#3d4941]" />
              <span className="text-xs font-semibold">Create Offer</span>
            </button>

            {/* Button 4: Manage Categories */}
            <button
              type="button"
              onClick={() => onNavigateTab('categories')}
              className="p-4 rounded-2xl bg-[#faf5ee] hover:bg-[#f2ece2] border border-[#e8ded3] text-[#142319] flex flex-col items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
            >
              <Layers size={19} className="text-[#3d4941]" />
              <span className="text-xs font-semibold">Manage Categories</span>
            </button>

            {/* Button 5: Edit Homepage */}
            <button
              type="button"
              onClick={() => onNavigateTab('homepage')}
              className="p-4 rounded-2xl bg-[#faf5ee] hover:bg-[#f2ece2] border border-[#e8ded3] text-[#142319] flex flex-col items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
            >
              <Edit3 size={19} className="text-[#3d4941]" />
              <span className="text-xs font-semibold">Edit Homepage</span>
            </button>

            {/* Button 6: Store Settings */}
            <button
              type="button"
              onClick={() => onNavigateTab('settings')}
              className="p-4 rounded-2xl bg-[#faf5ee] hover:bg-[#f2ece2] border border-[#e8ded3] text-[#142319] flex flex-col items-center justify-center gap-2 transition-all active:scale-97 cursor-pointer"
            >
              <Settings size={19} className="text-[#3d4941]" />
              <span className="text-xs font-semibold">Store Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4. Bottom Section: Recent Enquiries & Recently Added Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Enquiries Card matching reference image */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-[#142319]">
              Recent Enquiries
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('enquiries')}
              className="text-xs font-bold text-[#142319] hover:text-[#1c3624] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="space-y-3.5">
            {displayEnquiries.map((enq, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3 rounded-2xl hover:bg-[#faf7f2] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-full bg-[#f4eee6] border border-[#ded5c7] text-[#142319] font-bold text-xs flex items-center justify-center shrink-0">
                    {enq.initials}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[#142319] leading-tight">
                      {enq.name}
                    </h3>
                    <p className="text-[11px] text-[#717e74] mt-0.5 leading-tight">
                      {enq.subtitle}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[10px] text-[#939e95]">{enq.time}</span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      enq.status === 'New'
                        ? 'bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1]'
                        : 'bg-[#fef6e7] text-[#975a16] border border-[#fae4ba]'
                    }`}
                  >
                    {enq.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recently Added Products Card matching reference image */}
        <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 sm:p-7 shadow-2xs">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display text-lg font-bold text-[#142319]">
              Recently Added Products
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('products')}
              className="text-xs font-bold text-[#142319] hover:text-[#1c3624] flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {/* Row of product thumbnail cards matching screenshot */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {displayProducts.map((p) => (
              <div
                key={p.id}
                onClick={() => onNavigateTab('products')}
                className="group cursor-pointer flex flex-col items-center"
              >
                <div className="relative w-full aspect-3/4 rounded-2xl overflow-hidden bg-[#faf5ee] border border-[#e8ded3] group-hover:border-[#1c3624] transition-all mb-2">
                  <Image
                    src={p.image}
                    alt={p.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <span className="text-[11px] font-bold text-[#142319] truncate max-w-full block text-center">
                  {p.name}
                </span>
                <span className="text-[9px] font-bold text-[#246b38] bg-[#eaf6ec] border border-[#cbe8d1] px-2 py-0.2 rounded-full mt-1">
                  {p.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
