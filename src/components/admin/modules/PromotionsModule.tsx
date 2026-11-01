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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            OFFERS &amp; FLASH DROPS
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            Storewide Promotions Engine
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Create, edit, and toggle promotional discounts across the top bar, floating toasts, and product cards
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-[#845d1d]" />
            <span>Preview Promo Badges</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingPromo(createEmptyPromotion())
              setIsCreating(true)
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer"
          >
            <Plus size={14} />
            <span>+ Create Promotion</span>
          </button>
        </div>
      </div>

      {/* Promotions Cards List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {promotions.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-[#ebe5da] rounded-3xl p-8 text-center text-xs text-[#6b7770] shadow-2xs">
            No promotions active. Click &ldquo;+ Create Promotion&rdquo; above to launch a flash drop or offer!
          </div>
        ) : (
          promotions.map((promo) => (
            <div
              key={promo.id}
              className={`bg-white border rounded-3xl p-6 flex flex-col justify-between transition-all shadow-2xs ${
                promo.active
                  ? 'border-[#cbe8d1] bg-gradient-to-br from-white to-[#f7fbf8] shadow-xs'
                  : 'border-[#ebe5da] opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      promo.active
                        ? 'bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1]'
                        : 'bg-[#faf6f0] text-[#717e74] border border-[#ded7cb]'
                    }`}
                  >
                    {promo.active ? '● Active Live' : 'Paused / Inactive'}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleActive(promo.id)}
                    className="text-xs text-[#1c3624] hover:underline font-bold cursor-pointer"
                  >
                    {promo.active ? 'Pause Offer' : 'Activate Now'}
                  </button>
                </div>

                <h3 className="font-display text-lg font-bold text-[#142319] mb-1.5">
                  {promo.title}
                </h3>
                <div className="inline-block bg-[#f3f0fc] text-[#6346aa] border border-[#e4dcf8] text-xs font-bold px-3 py-1 rounded-full shadow-2xs mb-3">
                  {promo.discountText}
                </div>

                {/* Display Locations */}
                <div className="text-xs text-[#6b7770] space-y-1.5 pt-3 border-t border-[#ebe5da]">
                  <span className="text-[10px] uppercase font-bold text-[#142319] block">
                    Displays on:
                  </span>
                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {promo.displayOptions.topBar && (
                      <span className="bg-[#faf6f0] border border-[#ded7cb] px-2.5 py-0.5 rounded-md text-[#3d4941] font-medium">
                        ✓ Top Bar
                      </span>
                    )}
                    {promo.displayOptions.floatingToast && (
                      <span className="bg-[#faf6f0] border border-[#ded7cb] px-2.5 py-0.5 rounded-md text-[#3d4941] font-medium">
                        ✓ Floating Toast
                      </span>
                    )}
                    {promo.displayOptions.productBadge && (
                      <span className="bg-[#faf6f0] border border-[#ded7cb] px-2.5 py-0.5 rounded-md text-[#3d4941] font-medium">
                        ✓ Product Cards
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 mt-4 border-t border-[#ebe5da] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPromo(promo)
                    setIsCreating(false)
                  }}
                  className="py-1.5 px-3 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Edit2 size={12} className="text-[#845d1d]" />
                  <span>Edit</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeletePromo(promo.id, promo.title)}
                  className="py-1.5 px-2.5 rounded-xl bg-[#fdf0ef] hover:bg-[#fadcd9] text-[#b84840] border border-[#fcd8d5] text-xs transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#ebe5da] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#142319] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebe5da]">
              <h3 className="font-display text-lg font-bold text-[#142319]">
                {isCreating ? 'Create New Promotion' : `Edit: ${editingPromo.title}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="w-7 h-7 rounded-full bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-[#6b7770] hover:text-[#142319] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Offer Title *
                </label>
                <input
                  type="text"
                  value={editingPromo.title}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, title: e.target.value })
                  }
                  placeholder="e.g., Summer Festive Drop, End of Season Sale"
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Discount Badge / Text *
                </label>
                <input
                  type="text"
                  value={editingPromo.discountText}
                  onChange={(e) =>
                    setEditingPromo({ ...editingPromo, discountText: e.target.value })
                  }
                  placeholder="e.g., FLAT 30% OFF, Use Code VARNA15 on WhatsApp"
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2 text-xs text-[#142319] outline-hidden font-bold"
                />
              </div>

              {/* Display Options Checkboxes */}
              <div className="pt-2">
                <label className="block text-xs font-semibold text-[#142319] mb-2">
                  Where Should This Promotion Appear?
                </label>
                <div className="space-y-2 bg-[#faf8f5] p-3.5 rounded-xl border border-[#ded7cb]">
                  <label className="flex items-center gap-2 text-xs text-[#142319] cursor-pointer font-medium">
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
                      className="rounded text-[#1c3624] focus:ring-[#1c3624] w-4 h-4 cursor-pointer"
                    />
                    <span>Top Green Announcement Bar</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#142319] cursor-pointer font-medium">
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
                      className="rounded text-[#1c3624] focus:ring-[#1c3624] w-4 h-4 cursor-pointer"
                    />
                    <span>Floating Bottom Toast Alert for Visitors</span>
                  </label>

                  <label className="flex items-center gap-2 text-xs text-[#142319] cursor-pointer font-medium">
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
                      className="rounded text-[#1c3624] focus:ring-[#1c3624] w-4 h-4 cursor-pointer"
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
                    className="rounded text-[#1c3624] focus:ring-[#1c3624] w-4 h-4 cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-[#142319]">
                    Set Promotion as Active Immediately
                  </span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ebe5da]">
              <button
                type="button"
                onClick={() => setEditingPromo(null)}
                className="px-4 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#556358] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePromo}
                className="px-5 py-2 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer"
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
        <div className="p-6 space-y-6 bg-[#faf8f5]">
          <div>
            <h4 className="font-display text-lg font-bold text-[#142319] mb-2">
              Floating Toast Notification Simulation
            </h4>
            <div className="bg-white text-[#142319] p-4 rounded-2xl shadow-xl flex items-center justify-between max-w-md border border-[#ebe5da]">
              <div>
                <p className="text-[10px] uppercase font-bold text-[#845d1d]">Flash Drop Alert</p>
                <p className="text-sm font-bold text-[#142319]">{promotions[0]?.title || 'Special Promotion'}</p>
                <p className="text-xs text-[#206035] font-semibold">{promotions[0]?.discountText || 'FLAT 30% OFF'}</p>
              </div>
              <button type="button" className="py-1.5 px-3 bg-[#1c3624] text-white font-bold text-xs rounded-xl shadow-xs">
                Enquire
              </button>
            </div>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
