'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { CategoryItem } from '@/types/store'
import { Plus, Eye, Edit2, EyeOff, X } from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'
import CategoryGrid from '@/components/sections/CategoryGrid'

interface CategoriesModuleProps {
  onAddProductForCategory: (categoryName: string) => void
}

export default function CategoriesModule({
  onAddProductForCategory,
}: CategoriesModuleProps) {
  const { draft, updateDraft } = useStore()
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null)
  const [previewOpen, setPreviewOpen] = useState(false)

  const categories = draft.categories || []

  const handleSaveCategory = () => {
    if (!editingCategory) return
    updateDraft((prev) => {
      const nextList = (prev.categories || []).map((c) =>
        c.id === editingCategory.id ? editingCategory : c
      )
      return { ...prev, categories: nextList }
    })
    setEditingCategory(null)
  }

  const handleToggleVisibility = (id: string) => {
    updateDraft((prev) => {
      const nextList = (prev.categories || []).map((c) =>
        c.id === id ? { ...c, visible: !c.visible } : c
      )
      return { ...prev, categories: nextList }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            COLLECTION TILES &amp; NAVIGATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            Categories Grid Merchandising
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Manage the 6 homepage category cards and quickly add products into any collection
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#845d1d]" />
          <span>Preview Category Grid</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`bg-white border rounded-3xl p-5 flex flex-col justify-between transition-all shadow-2xs ${
              cat.visible
                ? 'border-[#ebe5da] hover:border-[#1c3624]/40 hover:shadow-xs'
                : 'border-[#ebe5da] opacity-60'
            }`}
          >
            <div>
              {/* Category Image Frame */}
              <div className="relative aspect-4/3 rounded-2xl overflow-hidden bg-[#faf5ee] mb-3.5 border border-[#ded7cb]">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-[#142319] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full border border-[#ded7cb] shadow-2xs">
                  Slot #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(cat.id)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer border shadow-2xs ${
                    cat.visible
                      ? 'bg-white/90 text-[#206035] border-[#cbe8d1]'
                      : 'bg-[#fdf0ef] text-[#b84840] border-[#fcd8d5]'
                  }`}
                  title={cat.visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {cat.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-display text-base font-bold text-[#142319] mb-0.5">
                {cat.title}
              </h3>
              <p className="text-xs text-[#845d1d] font-semibold">{cat.subtitle}</p>
              <p className="text-[10px] text-[#6b7770] mt-1 font-mono truncate">
                Link: {cat.link}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-[#ebe5da] flex items-center justify-between gap-2">
              {/* Edit Tile Button */}
              <button
                type="button"
                onClick={() => setEditingCategory(cat)}
                className="py-1.5 px-3 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit2 size={12} className="text-[#845d1d]" />
                <span>Edit Tile</span>
              </button>

              {/* Quick Add Product in this Category Shortcut */}
              <button
                type="button"
                onClick={() => onAddProductForCategory(cat.title.split(' ')[0])}
                className="py-1.5 px-3 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-97"
                title="Directly add a new product in this category"
              >
                <Plus size={13} />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Category Modal */}
      {editingCategory && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#ebe5da] rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#142319] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#ebe5da]">
              <h3 className="font-display text-lg font-bold text-[#142319]">
                Edit Category: {editingCategory.title}
              </h3>
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="w-7 h-7 rounded-full bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-[#6b7770] hover:text-[#142319] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Display Title
                </label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, title: e.target.value })
                  }
                  className="w-full bg-white border border-[#ded7cb] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Subtitle / Price Hook
                </label>
                <input
                  type="text"
                  value={editingCategory.subtitle}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, subtitle: e.target.value })
                  }
                  placeholder="e.g., Starting at ₹999, 240 GSM Heavyweight"
                  className="w-full bg-white border border-[#ded7cb] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, image: e.target.value })
                  }
                  className="w-full bg-white border border-[#ded7cb] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Destination Anchor / Link
                </label>
                <input
                  type="text"
                  value={editingCategory.link}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, link: e.target.value })
                  }
                  className="w-full bg-white border border-[#ded7cb] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-[#ebe5da]">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#556358] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
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
        title="Category Grid Layout"
      >
        <div className="p-6 bg-[#faf8f5]">
          <CategoryGrid />
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
