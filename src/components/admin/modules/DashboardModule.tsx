'use client'
import React from 'react'
import { useStore } from '@/context/StoreContext'
import {
  ShoppingBag,
  Grid,
  Star,
  MessageCircle,
  Tag,
  Activity,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Sparkles,
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

  const productsCount = draft.products?.length || 0
  const categoriesCount = draft.categories?.filter((c) => c.visible)?.length || 0
  const reviewsCount = draft.reviews?.totalReviewsCount || 0
  const averageRating = draft.reviews?.averageRating || 4.6
  const activePromotions = draft.promotions?.filter((p) => p.active) || []
  const enquiries = draft.enquiries || []
  const totalEnquiries = enquiries.length

  // Category breakdown for products
  const categoryBreakdown: Record<string, number> = {}
  draft.products?.forEach((p) => {
    categoryBreakdown[p.category] = (categoryBreakdown[p.category] || 0) + 1
  })

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

  return (
    <div className="space-y-6">
      {/* Top Welcome & Store Status Banner */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
              VARNA EXECUTIVE DASHBOARD
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] animate-pulse" />
          </div>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Storefront Overview &amp; Live Analytics
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Real-time management for Varna Custom Wear &amp; Prints
          </p>
        </div>

        {/* Store Status Toggle */}
        <div className="flex items-center gap-1.5 bg-[#0b120c] p-1.5 rounded-2xl border border-[#c4a675]/25 self-start md:self-auto">
          {(['Online', 'Flash Sale', 'Maintenance'] as const).map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => handleStatusChange(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                storeStatus === status
                  ? status === 'Online'
                    ? 'bg-[#1a2e1a] text-[#25D366] border border-[#25D366]/40 shadow-xs'
                    : status === 'Flash Sale'
                    ? 'bg-[#c85a44] text-white shadow-xs'
                    : 'bg-amber-600 text-white shadow-xs'
                  : 'text-[#a89d8f] hover:text-white'
              }`}
            >
              {status === 'Online' && '● '}
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Descriptive Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Card 1: Total Products */}
        <div
          onClick={() => onNavigateTab('products')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a2e1a] border border-[#c4a675]/30 text-[#e8d5b7] flex items-center justify-center">
              <ShoppingBag size={20} />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Manage</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            Catalog Inventory
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-display text-3xl font-bold text-[#f4efe6]">
              {productsCount}
            </span>
            <span className="text-xs text-[#a89d8f]">Active Products</span>
          </div>
          <div className="text-[11px] text-[#a89d8f] flex items-center gap-1.5 flex-wrap pt-2 border-t border-white/5">
            {Object.entries(categoryBreakdown).slice(0, 3).map(([cat, count]) => (
              <span key={cat} className="bg-white/5 px-2 py-0.5 rounded-md text-[10px]">
                {cat}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>

        {/* Card 2: Total Categories */}
        <div
          onClick={() => onNavigateTab('categories')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a2e1a] border border-[#c4a675]/30 text-[#e8d5b7] flex items-center justify-center">
              <Grid size={20} />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>View Grid</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            Storefront Categories
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-display text-3xl font-bold text-[#f4efe6]">
              {categoriesCount}
            </span>
            <span className="text-xs text-[#a89d8f]">Active Collection Tiles</span>
          </div>
          <p className="text-[11px] text-[#a89d8f] pt-2 border-t border-white/5 truncate">
            {draft.categories?.slice(0, 3).map((c) => c.title.split(' ')[0]).join(', ')}...
          </p>
        </div>

        {/* Card 3: Reviews on Website */}
        <div
          onClick={() => onNavigateTab('reviews')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Star size={20} className="fill-amber-400" />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Reviews</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            Social Proof &amp; Ratings
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-display text-3xl font-bold text-[#f4efe6]">
              {averageRating} ★
            </span>
            <span className="text-xs text-[#a89d8f]">Overall Rating</span>
          </div>
          <p className="text-[11px] text-[#a89d8f] pt-2 border-t border-white/5">
            Based on <strong className="text-white">{reviewsCount} verified orders</strong>
          </p>
        </div>

        {/* Card 4: WhatsApp Clicks & Inquiries */}
        <div
          onClick={() => onNavigateTab('enquiries')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#25D366]/15 border border-[#25D366]/35 text-[#25D366] flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Pipeline</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            WhatsApp Clicks
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-display text-3xl font-bold text-[#25D366]">
              {totalEnquiries}
            </span>
            <span className="text-xs text-[#a89d8f]">Conversations Started</span>
          </div>
          <p className="text-[11px] text-[#a89d8f] pt-2 border-t border-white/5">
            {enquiries.filter((e) => e.completed).length} completed •{' '}
            {enquiries.filter((e) => !e.completed).length} active
          </p>
        </div>

        {/* Card 5: Current Offers & Promotions */}
        <div
          onClick={() => onNavigateTab('promotions')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#c85a44]/15 border border-[#c85a44]/35 text-[#c85a44] flex items-center justify-center">
              <Tag size={20} />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Promos</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            Current Offers
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-display text-3xl font-bold text-[#f4efe6]">
              {activePromotions.length}
            </span>
            <span className="text-xs text-[#a89d8f]">Active Campaign{activePromotions.length === 1 ? '' : 's'}</span>
          </div>
          <p className="text-[11px] text-[#c4a675] pt-2 border-t border-white/5 truncate">
            {activePromotions[0]?.title || 'No active promotions running'}
          </p>
        </div>

        {/* Card 6: WhatsApp Concierge Engine */}
        <div
          onClick={() => onNavigateTab('whatsapp')}
          className="bg-[#111a13] border border-[#c4a675]/25 hover:border-[#c4a675]/60 rounded-3xl p-5 transition-all group cursor-pointer"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1a2e1a] border border-[#c4a675]/30 text-[#e8d5b7] flex items-center justify-center">
              <Activity size={20} />
            </div>
            <span className="text-xs text-[#c4a675] group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              <span>Setup</span>
              <ArrowUpRight size={12} />
            </span>
          </div>
          <span className="text-[11px] uppercase tracking-wider text-[#a89d8f] font-semibold block">
            Target Phone
          </span>
          <div className="my-1">
            <span className="font-display text-xl font-bold text-[#f4efe6]">
              +{draft.whatsapp?.phoneNumber || '916363145972'}
            </span>
          </div>
          <p className="text-[11px] text-[#25D366] pt-2 border-t border-white/5 flex items-center gap-1">
            <CheckCircle2 size={12} />
            <span>Floating Button Active (Glow ON)</span>
          </p>
        </div>
      </div>

      {/* Recent Enquiries Activity Stream */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-lg font-bold text-[#f4efe6]">
              Recent WhatsApp Enquiries
            </h3>
            <p className="text-xs text-[#a89d8f]">
              Latest customer clicks from product pages &amp; concierge touchpoints
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateTab('enquiries')}
            className="text-xs text-[#c4a675] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>View All Leads</span>
            <ArrowUpRight size={12} />
          </button>
        </div>

        {enquiries.length === 0 ? (
          <p className="text-xs text-[#a89d8f] py-4 text-center">
            No customer enquiries logged yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[#a89d8f] border-b border-white/10 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-3">Product</th>
                  <th className="py-2.5 px-3">Variant</th>
                  <th className="py-2.5 px-3">Time</th>
                  <th className="py-2.5 px-3">Source</th>
                  <th className="py-2.5 px-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-[#f4efe6]">
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-white">
                      {enq.productName}
                      {enq.customNotes && (
                        <span className="block text-[10px] text-[#c4a675] font-normal truncate max-w-xs">
                          Note: {enq.customNotes}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-[#a89d8f]">
                      {enq.color} • {enq.size} (Qty: {enq.quantity})
                    </td>
                    <td className="py-2.5 px-3 text-[#7d7062] flex items-center gap-1">
                      <Clock size={11} />
                      <span>{enq.timestamp}</span>
                    </td>
                    <td className="py-2.5 px-3 text-[#a89d8f]">{enq.source}</td>
                    <td className="py-2.5 px-3 text-right">
                      {enq.completed ? (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-[#25D366]/20 text-[#25D366] px-2 py-0.5 rounded-full font-bold">
                          <CheckCircle2 size={10} /> Completed
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full font-bold">
                          Active Lead
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => {
            onNavigateTab('products')
            if (onQuickAddProduct) onQuickAddProduct()
          }}
          className="py-3 px-4 rounded-2xl bg-[#1a2e1a] hover:bg-[#233d23] border border-[#c4a675]/40 text-[#e8d5b7] hover:text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <Sparkles size={14} />
          <span>+ Add New Product Drop</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('homepage')}
          className="py-3 px-4 rounded-2xl bg-[#111a13] hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Update Top Announcement Bar</span>
        </button>

        <button
          type="button"
          onClick={() => onNavigateTab('promotions')}
          className="py-3 px-4 rounded-2xl bg-[#111a13] hover:bg-white/10 border border-white/10 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
        >
          <span>Create Flash Sale / Promotion</span>
        </button>
      </div>
    </div>
  )
}
