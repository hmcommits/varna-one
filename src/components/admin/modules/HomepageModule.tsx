'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { PromoBanner, WhyVarnaItem } from '@/types/store'
import { Plus, Trash2, Eye } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'
import TopBar from '@/components/layout/TopBar'
import TrendingTicker from '@/components/sections/TrendingTicker'
import PromoBanners from '@/components/sections/PromoBanners'
import TrustBadges from '@/components/sections/TrustBadges'
import WhyVarna from '@/components/sections/WhyVarna'

export default function HomepageModule() {
  const { draft, updateDraft } = useStore()
  const [previewOpen, setPreviewOpen] = useState(false)
  const [newChipText, setNewChipText] = useState('')

  const homepage = draft.homepage || {
    topBarVisible: true,
    topBarTexts: [],
    tickerChips: [],
    promoBanners: [],
    trustBadges: [],
  }

  // Top Bar Texts (Max 3)
  const handleUpdateTopBarText = (index: number, text: string) => {
    const updated = [...(homepage.topBarTexts || [])]
    updated[index] = text
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, topBarTexts: updated },
    }))
  }

  const handleAddTopBarText = () => {
    if ((homepage.topBarTexts?.length || 0) >= 3) return
    const updated = [...(homepage.topBarTexts || []), 'New announcement message']
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, topBarTexts: updated },
    }))
  }

  const handleRemoveTopBarText = (index: number) => {
    const updated = (homepage.topBarTexts || []).filter((_, i) => i !== index)
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, topBarTexts: updated },
    }))
  }

  // Ticker Chips
  const handleAddTickerChip = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChipText.trim()) return
    const updated = [...(homepage.tickerChips || []), newChipText.trim()]
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, tickerChips: updated },
    }))
    setNewChipText('')
  }

  const handleRemoveTickerChip = (index: number) => {
    const updated = (homepage.tickerChips || []).filter((_, i) => i !== index)
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, tickerChips: updated },
    }))
  }

  // Split Promo Banners (Add / Edit / Remove)
  const handleAddBanner = () => {
    const newBanner: PromoBanner = {
      id: `banner-${Date.now()}`,
      title: 'New Collection Promo',
      subtitle: 'Limited Edition Drop',
      image:
        'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532662/varna_store/banners/banner-men.webp',
      link: '#new-arrivals',
      ctaText: 'Explore Collection →',
    }
    updateDraft((prev) => ({
      ...prev,
      homepage: {
        ...prev.homepage,
        promoBanners: [...(prev.homepage.promoBanners || []), newBanner],
      },
    }))
  }

  const handleUpdateBanner = (id: string, field: keyof PromoBanner, val: string) => {
    const updated = (homepage.promoBanners || []).map((b) =>
      b.id === id ? { ...b, [field]: val } : b
    )
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, promoBanners: updated },
    }))
  }

  const handleDeleteBanner = (id: string) => {
    if ((homepage.promoBanners || []).length <= 1) {
      alert('You should keep at least one promotional banner.')
      return
    }
    const updated = (homepage.promoBanners || []).filter((b) => b.id !== id)
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, promoBanners: updated },
    }))
  }

  // Trust Badges
  const handleUpdateBadge = (id: string, field: 'title' | 'desc', val: string) => {
    const updated = (homepage.trustBadges || []).map((b) =>
      b.id === id ? { ...b, [field]: val } : b
    )
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, trustBadges: updated },
    }))
  }

  // Why Varna Pillars
  const defaultWhyVarnaItems: WhyVarnaItem[] = [
    { id: 'wv-1', iconKey: 'shield', title: 'Premium Quality', sub: 'Crafted for comfort' },
    { id: 'wv-2', iconKey: 'sparkles', title: 'Trendy Designs', sub: 'Styles for every occasion' },
    { id: 'wv-3', iconKey: 'layers', title: 'Custom Printing', sub: 'Tees, Jerseys & Hoodies' },
    { id: 'wv-4', iconKey: 'users', title: 'Loved by 1M+', sub: 'A growing community' },
  ]
  const whyVarnaItems = homepage.whyVarnaItems?.length ? homepage.whyVarnaItems : defaultWhyVarnaItems
  const whyVarnaTitle = homepage.whyVarnaTitle || 'Why Shop Varna?'

  const handleUpdateWhyVarnaTitle = (val: string) => {
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, whyVarnaTitle: val },
    }))
  }

  const handleUpdateWhyVarnaItem = (id: string, field: 'title' | 'sub', val: string) => {
    const updated = whyVarnaItems.map((item) =>
      item.id === id ? { ...item, [field]: val } : item
    )
    updateDraft((prev) => ({
      ...prev,
      homepage: { ...prev.homepage, whyVarnaItems: updated },
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            VISUAL MERCHANDISING
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            Homepage Editor &amp; Banners
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Top announcement bar (max 3 texts), ticker marquee, dynamic split promo banners &amp; trust guarantees
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#845d1d]" />
          <span>Preview Homepage Sections</span>
        </button>
      </div>

      {/* 1. TOP GREEN ANNOUNCEMENT BAR (MAX 3 FIELDS) */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1c3624] border border-[#1c3624]" />
              <span>Top Announcement Bar</span>
            </h3>
            <p className="text-xs text-[#6b7770]">
              The announcement bar running at the very top of the storefront. Enter up to 3 rotating announcements.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs font-semibold text-[#142319]">
              {homepage.topBarVisible ? 'Visible ON' : 'Hidden OFF'}
            </span>
            <input
              type="checkbox"
              checked={homepage.topBarVisible}
              onChange={(e) =>
                updateDraft((prev) => ({
                  ...prev,
                  homepage: { ...prev.homepage, topBarVisible: e.target.checked },
                }))
              }
              className="w-4 h-4 rounded text-[#1c3624] focus:ring-[#1c3624] cursor-pointer"
            />
          </label>
        </div>

        {/* Text Fields (Max 3) */}
        <div className="space-y-3 pt-2">
          {(homepage.topBarTexts || []).map((text, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-[#845d1d] w-16">Text {idx + 1}:</span>
              <input
                type="text"
                value={text}
                onChange={(e) => handleUpdateTopBarText(idx, e.target.value)}
                placeholder="Enter announcement text..."
                className="flex-1 bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
              />
              <button
                type="button"
                onClick={() => handleRemoveTopBarText(idx)}
                className="p-2 text-[#b84840] hover:bg-[#fdf0ef] rounded-lg transition-colors cursor-pointer"
                title="Remove this text"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {(homepage.topBarTexts?.length || 0) < 3 && (
            <button
              type="button"
              onClick={handleAddTopBarText}
              className="mt-2 text-xs text-[#206035] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>+ Add Field ({(homepage.topBarTexts?.length || 0)} of 3 used)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TRENDING TICKER MARQUEE */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#142319]">
            Trending Ticker Chips (Marquee Bar)
          </h3>
          <p className="text-xs text-[#6b7770]">
            The horizontal running ticker below the hero. Add or remove promotion chips.
          </p>
        </div>

        {/* Existing Chips List */}
        <div className="flex flex-wrap gap-2">
          {(homepage.tickerChips || []).map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 bg-[#faf6f0] border border-[#ded7cb] text-[#142319] px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-2xs"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleRemoveTickerChip(idx)}
                className="text-[#8c978f] hover:text-[#b84840] cursor-pointer"
                title="Delete Chip"
              >
                <Trash2 size={11} />
              </button>
            </span>
          ))}
        </div>

        {/* Add New Chip Form */}
        <form onSubmit={handleAddTickerChip} className="flex items-center gap-2 max-w-md pt-2">
          <input
            type="text"
            value={newChipText}
            onChange={(e) => setNewChipText(e.target.value)}
            placeholder="e.g., ⚡ FLAT 20% OFF FIRST CUSTOM ORDER"
            className="flex-1 bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
          />
          <button
            type="submit"
            className="py-2 px-4 bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-97 cursor-pointer"
          >
            + Add Chip
          </button>
        </form>
      </div>

      {/* 3. DYNAMIC SPLIT PROMO BANNERS */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
              <span>Split Promo Banners</span>
              <span className="text-[10px] bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1] px-2 py-0.5 rounded-full font-mono font-bold">
                Adaptive Grid Layout
              </span>
            </h3>
            <p className="text-xs text-[#6b7770]">
              Add or delete promo banners. The storefront automatically balances 1, 2, 3, or 4 banners with perfect aesthetics!
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBanner}
            className="flex items-center gap-1 py-1.5 px-3.5 bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-97 cursor-pointer"
          >
            <Plus size={13} />
            <span>+ Add Banner</span>
          </button>
        </div>

        {/* Banners List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {(homepage.promoBanners || []).map((banner, idx) => (
            <div
              key={banner.id}
              className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-4 space-y-3 relative group shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#845d1d] font-bold">
                  Banner #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="text-[#8c978f] hover:text-[#b84840] p-1 transition-colors cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Banner Preview Thumbnail */}
              <div className="relative aspect-16/9 rounded-xl overflow-hidden bg-white border border-[#ded7cb]">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover object-top"
                />
              </div>

              {/* Fields */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">Headline</label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => handleUpdateBanner(banner.id, 'title', e.target.value)}
                    className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">Subtitle / Tag</label>
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => handleUpdateBanner(banner.id, 'subtitle', e.target.value)}
                    className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">Button CTA</label>
                    <input
                      type="text"
                      value={banner.ctaText}
                      onChange={(e) => handleUpdateBanner(banner.id, 'ctaText', e.target.value)}
                      className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">Image Path / URL</label>
                    <input
                      type="text"
                      value={banner.image}
                      onChange={(e) => handleUpdateBanner(banner.id, 'image', e.target.value)}
                      className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TRUST BADGES ("WHY VARNA") */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#142319]">
            Trust Badges &amp; Guarantees (&ldquo;Why Varna&rdquo;)
          </h3>
          <p className="text-xs text-[#6b7770]">
            The 4 service guarantees displayed to build customer confidence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(homepage.trustBadges || []).map((badge) => (
            <div
              key={badge.id}
              className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-3.5 space-y-2 shadow-2xs"
            >
              <input
                type="text"
                value={badge.title}
                onChange={(e) => handleUpdateBadge(badge.id, 'title', e.target.value)}
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] font-bold outline-hidden"
              />
              <textarea
                value={badge.desc}
                onChange={(e) => handleUpdateBadge(badge.id, 'desc', e.target.value)}
                rows={2}
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg p-2 text-[11px] text-[#6b7770] outline-hidden resize-none"
              />
            </div>
          ))}
        </div>
      </div>

      {/* 5. WHY SHOP VARNA? BRAND PILLARS */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-[#142319] flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#845d1d] border border-[#845d1d]" />
            <span>Why Shop Varna? (Brand Pillars)</span>
          </h3>
          <p className="text-xs text-[#6b7770]">
            Customize the headline and core value props highlighted to customers above testimonials
          </p>
        </div>

        {/* Section Heading */}
        <div className="pt-1">
          <label className="block text-xs font-bold text-[#142319] mb-1">
            Section Title
          </label>
          <input
            type="text"
            value={whyVarnaTitle}
            onChange={(e) => handleUpdateWhyVarnaTitle(e.target.value)}
            placeholder="e.g. Why Shop Varna?"
            className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-3.5 py-2 text-xs text-[#142319] font-bold outline-hidden"
          />
        </div>

        {/* 4 Brand Pillar Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {whyVarnaItems.map((item, idx) => (
            <div
              key={item.id}
              className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-3.5 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono font-bold uppercase text-[#845d1d]">
                  Pillar {idx + 1}
                </span>
                <span className="text-[10px] text-[#6b7770] font-mono">
                  Icon: {item.iconKey || 'shield'}
                </span>
              </div>
              <input
                type="text"
                value={item.title}
                onChange={(e) => handleUpdateWhyVarnaItem(item.id, 'title', e.target.value)}
                placeholder="Pillar title..."
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] font-bold outline-hidden"
              />
              <input
                type="text"
                value={item.sub}
                onChange={(e) => handleUpdateWhyVarnaItem(item.id, 'sub', e.target.value)}
                placeholder="Pillar subtitle..."
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2.5 py-1.5 text-[11px] text-[#6b7770] outline-hidden"
              />
            </div>
          ))}
        </div>
      </div>

      {/* PREVIEW DRAWER */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Homepage Sections Preview"
      >
        <div className="bg-[#faf8f5] space-y-6 pb-6">
          <TopBar />
          <TrendingTicker />
          <div className="px-4">
            <PromoBanners />
          </div>
          <div className="px-4">
            <TrustBadges />
          </div>
          <div className="px-4">
            <WhyVarna />
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
