'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { PromoBanner } from '@/types/store'
import { Plus, Trash2, Eye } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'
import TopBar from '@/components/layout/TopBar'
import TrendingTicker from '@/components/sections/TrendingTicker'
import PromoBanners from '@/components/sections/PromoBanners'
import TrustBadges from '@/components/sections/TrustBadges'

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
      image: '/images/banners/men-banner.webp',
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            VISUAL MERCHANDISING
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Homepage Editor &amp; Banners
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Top announcement bar (max 3 texts), ticker marquee, dynamic split promo banners &amp; trust guarantees
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#c4a675]" />
          <span>Preview Homepage Sections</span>
        </button>
      </div>

      {/* 1. TOP GREEN ANNOUNCEMENT BAR (MAX 3 FIELDS) */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-[#1a2e1a] border border-[#25D366]/40" />
              <span>Top Green Announcement Bar</span>
            </h3>
            <p className="text-xs text-[#a89d8f]">
              The green bar running at the very top of the website. Enter up to 3 rotating announcements.
            </p>
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <span className="text-xs text-[#e8d5b7]">
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
              className="w-4 h-4 rounded text-[#25D366] focus:ring-[#25D366]"
            />
          </label>
        </div>

        {/* Text Fields (Max 3) */}
        <div className="space-y-3 pt-2">
          {(homepage.topBarTexts || []).map((text, idx) => (
            <div key={idx} className="flex items-center gap-2">
              <span className="text-xs font-mono text-[#c4a675] w-16">Text {idx + 1}:</span>
              <input
                type="text"
                value={text}
                onChange={(e) => handleUpdateTopBarText(idx, e.target.value)}
                placeholder="Enter announcement text..."
                className="flex-1 bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3.5 py-2 text-xs text-white outline-none"
              />
              <button
                type="button"
                onClick={() => handleRemoveTopBarText(idx)}
                className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
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
              className="mt-2 text-xs text-[#25D366] hover:underline font-bold flex items-center gap-1 cursor-pointer"
            >
              <Plus size={13} />
              <span>+ Add Field ({(homepage.topBarTexts?.length || 0)} of 3 used)</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. TRENDING TICKER MARQUEE */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Trending Ticker Chips (Marquee Bar)
          </h3>
          <p className="text-xs text-[#a89d8f]">
            The horizontal running ticker below the hero. Add or remove promotion chips.
          </p>
        </div>

        {/* Existing Chips List */}
        <div className="flex flex-wrap gap-2">
          {(homepage.tickerChips || []).map((chip, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-2 bg-[#0b120c] border border-[#c4a675]/30 text-[#e8d5b7] px-3 py-1.5 rounded-full text-xs font-semibold"
            >
              <span>{chip}</span>
              <button
                type="button"
                onClick={() => handleRemoveTickerChip(idx)}
                className="text-[#7d7062] hover:text-red-400 cursor-pointer"
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
            className="flex-1 bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
          />
          <button
            type="submit"
            className="py-2 px-3.5 bg-[#c4a675] hover:bg-[#b59560] text-black font-bold text-xs rounded-xl transition-all cursor-pointer"
          >
            + Add Chip
          </button>
        </form>
      </div>

      {/* 3. DYNAMIC SPLIT PROMO BANNERS (ADD / DELETE WITH ADAPTIVE GRID) */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center gap-2">
              <span>Split Promo Banners</span>
              <span className="text-[10px] bg-[#1a2e1a] text-[#25D366] px-2 py-0.5 rounded-full font-mono">
                Adaptive Grid Layout
              </span>
            </h3>
            <p className="text-xs text-[#a89d8f]">
              Add or delete promo banners. The storefront automatically balances 1, 2, 3, or 4 banners with perfect aesthetics!
            </p>
          </div>

          <button
            type="button"
            onClick={handleAddBanner}
            className="flex items-center gap-1 py-1.5 px-3 bg-[#25D366] hover:bg-[#1fb355] text-black font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
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
              className="bg-[#0b120c] border border-white/10 rounded-2xl p-4 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono text-[#c4a675] font-bold">
                  Banner #{idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteBanner(banner.id)}
                  className="text-[#7d7062] hover:text-red-400 p-1 transition-colors cursor-pointer"
                  title="Delete Banner"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              {/* Banner Preview Thumbnail */}
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black border border-white/10">
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
                  <label className="block text-[10px] text-[#a89d8f] mb-0.5">Headline</label>
                  <input
                    type="text"
                    value={banner.title}
                    onChange={(e) => handleUpdateBanner(banner.id, 'title', e.target.value)}
                    className="w-full bg-[#111a13] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-[#a89d8f] mb-0.5">Subtitle / Tag</label>
                  <input
                    type="text"
                    value={banner.subtitle}
                    onChange={(e) => handleUpdateBanner(banner.id, 'subtitle', e.target.value)}
                    className="w-full bg-[#111a13] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#a89d8f] mb-0.5">Button CTA</label>
                    <input
                      type="text"
                      value={banner.ctaText}
                      onChange={(e) => handleUpdateBanner(banner.id, 'ctaText', e.target.value)}
                      className="w-full bg-[#111a13] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-[#a89d8f] mb-0.5">Image Path / URL</label>
                    <input
                      type="text"
                      value={banner.image}
                      onChange={(e) => handleUpdateBanner(banner.id, 'image', e.target.value)}
                      className="w-full bg-[#111a13] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none font-mono text-[10px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. TRUST BADGES ("WHY VARNA") */}
      <div className="bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5 sm:p-6 space-y-4">
        <div>
          <h3 className="font-display text-base font-bold text-white">
            Trust Badges &amp; Guarantees (&ldquo;Why Varna&rdquo;)
          </h3>
          <p className="text-xs text-[#a89d8f]">
            The 4 service guarantees displayed to build confidence
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {(homepage.trustBadges || []).map((badge) => (
            <div
              key={badge.id}
              className="bg-[#0b120c] border border-white/10 rounded-2xl p-3.5 space-y-2"
            >
              <input
                type="text"
                value={badge.title}
                onChange={(e) => handleUpdateBadge(badge.id, 'title', e.target.value)}
                className="w-full bg-[#111a13] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white font-bold outline-none"
              />
              <textarea
                value={badge.desc}
                onChange={(e) => handleUpdateBadge(badge.id, 'desc', e.target.value)}
                rows={2}
                className="w-full bg-[#111a13] border border-white/10 rounded-lg p-2 text-[11px] text-[#a89d8f] outline-none resize-none"
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
        <div className="bg-[#faf8f4] space-y-6 pb-6">
          <TopBar />
          <TrendingTicker />
          <div className="px-4">
            <PromoBanners />
          </div>
          <div className="px-4">
            <TrustBadges />
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
