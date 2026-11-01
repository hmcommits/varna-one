'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { CategoryItem } from '@/types/store'
import { Plus, Eye, Edit2, EyeOff } from 'lucide-react'
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111a13] border border-[#c4a675]/30 rounded-3xl p-5">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#c4a675] font-mono">
            COLLECTION TILES &amp; NAVIGATION
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#f4efe6]">
            Categories Grid Merchandising
          </h2>
          <p className="text-xs text-[#a89d8f] mt-0.5">
            Manage the 6 homepage category cards and quickly add products into any collection
          </p>
        </div>

        <button
          type="button"
          onClick={() => setPreviewOpen(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-[#f4efe6] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <Eye size={14} className="text-[#c4a675]" />
          <span>Preview Category Grid</span>
        </button>
      </div>

      {/* Categories Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, idx) => (
          <div
            key={cat.id}
            className={`bg-[#111a13] border rounded-3xl p-4 flex flex-col justify-between transition-all ${
              cat.visible
                ? 'border-[#c4a675]/30 hover:border-[#c4a675]/60'
                : 'border-white/10 opacity-60'
            }`}
          >
            <div>
              {/* Category Image Frame */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-black mb-3 border border-white/10">
                <Image
                  src={cat.image}
                  alt={cat.title}
                  fill
                  className="object-cover object-top"
                />
                <span className="absolute top-2.5 left-2.5 bg-black/70 backdrop-blur-xs text-[#e8d5b7] text-[10px] font-mono px-2 py-0.5 rounded-full">
                  Slot #{idx + 1}
                </span>

                <button
                  type="button"
                  onClick={() => handleToggleVisibility(cat.id)}
                  className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-md transition-colors cursor-pointer ${
                    cat.visible
                      ? 'bg-[#1a2e1a]/90 text-[#25D366]'
                      : 'bg-red-500/80 text-white'
                  }`}
                  title={cat.visible ? 'Visible (Click to Hide)' : 'Hidden (Click to Show)'}
                >
                  {cat.visible ? <Eye size={13} /> : <EyeOff size={13} />}
                </button>
              </div>

              {/* Title & Subtitle */}
              <h3 className="font-display text-base font-bold text-white mb-0.5">
                {cat.title}
              </h3>
              <p className="text-xs text-[#c4a675] font-medium">{cat.subtitle}</p>
              <p className="text-[10px] text-[#7d7062] mt-1 font-mono truncate">
                Link: {cat.link}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-2">
              {/* Edit Tile Button */}
              <button
                type="button"
                onClick={() => setEditingCategory(cat)}
                className="py-1.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a89d8f] hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Edit2 size={12} />
                <span>Edit Tile</span>
              </button>

              {/* Quick Add Product in this Category Shortcut */}
              <button
                type="button"
                onClick={() => onAddProductForCategory(cat.title.split(' ')[0])}
                className="py-1.5 px-3 rounded-xl bg-[#1a2e1a] hover:bg-[#254225] border border-[#c4a675]/40 text-xs font-bold text-[#e8d5b7] hover:text-white flex items-center gap-1 transition-all cursor-pointer shadow-xs active:scale-95"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#111a13] border border-[#c4a675]/40 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-[#f4efe6] space-y-4">
            <h3 className="font-display text-lg font-bold text-white">
              Edit Category: {editingCategory.title}
            </h3>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Display Title
                </label>
                <input
                  type="text"
                  value={editingCategory.title}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, title: e.target.value })
                  }
                  className="w-full bg-[#0b120c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c4a675]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Subtitle / Price Hook
                </label>
                <input
                  type="text"
                  value={editingCategory.subtitle}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, subtitle: e.target.value })
                  }
                  placeholder="e.g., Starting at ₹999, 240 GSM Heavyweight"
                  className="w-full bg-[#0b120c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c4a675]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Image Path / URL
                </label>
                <input
                  type="text"
                  value={editingCategory.image}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, image: e.target.value })
                  }
                  className="w-full bg-[#0b120c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c4a675] font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#e8d5b7] mb-1">
                  Destination Anchor / Link
                </label>
                <input
                  type="text"
                  value={editingCategory.link}
                  onChange={(e) =>
                    setEditingCategory({ ...editingCategory, link: e.target.value })
                  }
                  className="w-full bg-[#0b120c] border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-[#c4a675] font-mono text-[11px]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setEditingCategory(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#a89d8f]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveCategory}
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
        title="Category Grid Layout"
      >
        <div className="p-6 bg-[#faf8f4]">
          <CategoryGrid />
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
