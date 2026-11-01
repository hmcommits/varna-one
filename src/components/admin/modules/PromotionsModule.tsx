'use client'
import React, { useState } from 'react'
import { useStore } from '@/context/StoreContext'
import { Promotion } from '@/types/store'
import { Plus, Trash2, Edit2, Eye, X } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'

export default function PromotionsModule() {
  const { draft, updateDraft } = useStore()
  const [editingPromo, setEditingPromo] = useState<Promotion | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [previewOpen, setPreviewOpen] = useState(false)

  const promotions = draft.promotions || []

  function createEmptyPromotion(): Promotion {
    return {
      id: `promo-${Date.now()}`,
      title: '',
      discountText: 'FLAT 30% OFF',
      displayOptions: {
        topBar: true,
        floatingToast: true,
        productBadge: true,
      },
      active: true,
    }
  }

  const handleSavePromo = () => {
    if (!editingPromo) return
    if (!editingPromo.title.trim()) {
      alert('Please enter a promotion title.')
      return
    }

    updateDraft((prev) => {
      const list = prev.promotions || []
      const idx = list.findIndex((p) => p.id === editingPromo.id)
      if (idx >= 0) {
        const nextList = [...list]
        nextList[idx] = editingPromo
        return { ...prev, promotions: nextList }
      } else {
        return { ...prev, promotions: [editingPromo, ...list] }
      }
    })

    setEditingPromo(null)
    setIsCreating(false)
  }

  const handleDeletePromo = (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      updateDraft((prev) => ({
        ...prev,
        promotions: (prev.promotions || []).filter((p) => p.id !== id),
      }))
    }
  }

  const handleToggleActive = (id: string) => {
    updateDraft((prev) => ({
      ...prev,
      promotions: (prev.promotions || []).map((p) =>
        p.id === id ? { ...p, active: !p.active } : p
      ),
    }))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            OFFERS &amp; FLASH DROPS
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Storewide Promotions Engine
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Create, edit, and toggle promotional discounts across the top bar, floating toasts, and product cards
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-[#c4a675]" />
            <span>Preview Promo Badges</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPromo(createEmptyPromotion())
              setIsCreating(true)
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-black font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Create Promotion</span>
          </button>
        </div>
      </div>

      {/* Promotions Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {promotions.length === 0 ? (
          <div className="md:col-span-2 bg-[#111a13] border border-white/10 rounded-3xl p-8 text-center text-xs text-[#a89d8f]">
            No promotions active. Click &ldquo;+ Create Promotion&rdquo; above to launch a flash drop or offer!
          </div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className={`bg-[#111a13] border rounded-3xl p-5 flex flex-col justify-between transition-all ${
                promo.active
                  ? 'border-[#c4a675]/40 shadow-lg'
                  : 'border-white/10 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      promo.active
                        ? 'bg-[#1a2e1a] text-[#25D366] border border-[#25D366]/40'
                        : 'bg-white/10 text-[#a89d8f]'
                    }`}
                  >
                    {promo.active ? '● Active Live' : 'Paused / Inactive'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(promo.id)}
                    className="text-xs text-[#c4a675] hover:underline font-semibold cursor-pointer"
                  >
                    {promo.active ? 'Pause Offer' : 'Activate Now'}
                  </button>
                </div>

                <h3 className="font-display text-lg font-bold text-white mb-1">
                  {promo.title}
                </h3>
                <div className="inline-block bg-[#c85a44] text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs mb-3">
                  {promo.discountText}
                </div>

                {/* Display Locations */}
                <div className="text-xs text-[#a89d8f] space-y-1 pt-2 border-t border-white/10">
                  <span className="text-[10px] uppercase font-bold text-[#e8d5b7] block">
                    Displays on:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {promo.displayOptions.topBar && (
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[#f4efe6]">
                        ✓ Top Bar
                      </span>
                    )}
                    {promo.displayOptions.floatingToast && (
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[#f4efe6]">
                        ✓ Floating Toast
                      </span>
                    )}
                    {promo.displayOptions.productBadge && (
                      <span className="bg-white/5 border border-white/10 px-2 py-0.5 rounded-md text-[#f4efe6]">
                        ✓ Product Cards
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPromo(promo)
                    setIsCreating(false)
                  }}
                  className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#c4a675] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 size={12} />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePromo(promo.id, promo.title)}
                  className="py-1.5 px-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 text-xs transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* PROMO EDITOR MODAL */}
      {editingPromo && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111a13] border border-[#c4a675]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#f4efe6] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-display text-lg font-bold text-white">
                {isCreating ? 'Create New Promotion' : `Edit: ${editingPromo.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="text-[#a89d8f] hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={editingPromo.title}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, title: e.target.value })
                  }
                  placeholder="e.g., Summer Festive Drop, End of Season Sale"
                  className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Discount Badge / Text *
                </label>
                <input
                  type="text"
                  value={editingPromo.discountText}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, discountText: e.target.value })
                  }
                  placeholder="e.g., FLAT 30% OFF, Use Code VARNA15 on WhatsApp"
                  className="w-full bg-[#0b120c] border border-white/10 focus:border-[#c4a675] rounded-xl px-3 py-2 text-xs text-white outline-none font-bold"
                />
              </div>

              {/* Display Options Checkboxes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-2">
                  Where Should This Promotion Appear?
                </label>
                <div className="space-y-2 bg-[#0b120c] p-3 rounded-xl border border-white/10">
                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPromo.displayOptions.topBar}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          displayOptions: {
                            ...editingPromo.displayOptions,
                            topBar: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-[#25D366] focus:ring-[#25D366] w-4 h-4"
                    />
                    <span>Top Green Announcement Bar</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPromo.displayOptions.floatingToast}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          displayOptions: {
                            ...editingPromo.displayOptions,
                            floatingToast: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-[#25D366] focus:ring-[#25D366] w-4 h-4"
                    />
                    <span>Floating Bottom Toast Alert for Visitors</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs cursor-pointer">
                    <input
                      type="checkbox"
                      checked={editingPromo.displayOptions.productBadge}
                      onChange={(e) =>
                        setEditingPromo({
                          ...editingPromo,
                          displayOptions: {
                            ...editingPromo.displayOptions,
                            productBadge: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-[#25D366] focus:ring-[#25D366] w-4 h-4"
                    />
                    <span>Product Cards Highlight Tag</span>
                  </label>
                </div>
              </div>

              {/* Status */}
              <div className="pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPromo.active}
                    onChange={(e) =>
                      setEditingPromo({ ...editingPromo, active: e.target.checked })
                    }
                    className="rounded text-[#25D366] focus:ring-[#25D366] w-4 h-4"
                  />
                  <span className="text-xs font-semibold text-white">
                    Set Promotion as Active Immediately
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a89d8f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePromo}
                className="px-5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1fb355] text-black font-bold text-xs shadow-md"
              >
                Done (Save into Staging)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PREVIEW DRAWER */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Promotions Live Preview"
      >
        <div className="p-6 space-y-6 bg-[#faf8f4]">
          <div>
            <h4 className="font-display text-lg font-bold text-[#1a1a1a] mb-2">
              Floating Toast Notification Simulation
            </h4>
            <div className="bg-[#1a2e1a] text-white p-4 rounded-2xl shadow-xl flex items-center justify-between max-w-md border border-[#c4a675]/40">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#c4a675]">Flash Drop Alert</p>
                <p className="text-sm font-bold">{promotions[0]?.title || 'Special Promotion'}</p>
                <p className="text-xs text-[#e8d5b7]">{promotions[0]?.discountText || 'FLAT 30% OFF'}</p>
              </div>
              <button type="button" className="py-1.5 px-3 bg-[#25D366] text-black font-bold text-xs rounded-xl shadow-xs">
                Enquire
              </button>
            </div>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
