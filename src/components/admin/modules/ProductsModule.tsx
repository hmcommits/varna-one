'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import { useStore } from '@/context/StoreContext'
import { Product, ProductColor, CustomizationOption } from '@/types/store'
import {
  Plus,
  Trash2,
  Edit2,
  Upload,
  Pipette,
  Check,
  Eye,
  Scissors,
  X,
} from 'lucide-react'
import ModulePreviewDrawer from '../ModulePreviewDrawer'
import ProductCard from '@/components/ui/ProductCard'
import ProductDetailsView from '@/components/product/ProductDetailsView'

interface ProductsModuleProps {
  initialCategoryFilter?: string | null
  openCreateOnMount?: boolean
}

const CATEGORIES = [
  'Shirts',
  'T-Shirts',
  'Dresses',
  'Jeans',
  'Tops',
  'Co-ord Sets',
]

const BADGES = ['None', 'New', 'Trending', 'Bestseller', 'Flash Sale'] as const
const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '30', '32', '34', '36', '38']

export default function ProductsModule({
  initialCategoryFilter,
  openCreateOnMount,
}: ProductsModuleProps) {
  const { draft, updateDraft } = useStore()
  const [editingProduct, setEditingProduct] = useState<Product | null>(
    openCreateOnMount
      ? createEmptyProduct(initialCategoryFilter || 'Shirts')
      : null
  )
  const [isCreating, setIsCreating] = useState(Boolean(openCreateOnMount))
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(
    initialCategoryFilter || 'All'
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [uploading, setUploading] = useState(false)

  // Temporary state for the color currently being assigned to an uploaded image
  const [activeColorMode, setActiveColorMode] = useState<'existing' | 'new'>('new')
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#c4855a')
  const [selectedExistingColorId, setSelectedExistingColorId] = useState('')

  function createEmptyProduct(category = 'Shirts'): Product {
    return {
      id: `prod-${Date.now()}`,
      name: '',
      category,
      gender: 'Men',
      price: 999,
      originalPrice: 1499,
      rating: 4.5,
      reviewCount: 10,
      stockUrgency: 'In Stock',
      badge: 'New',
      sizes: ['S', 'M', 'L', 'XL', 'XXL'],
      colors: [],
      customization: {
        enabled: false,
        options: [],
      },
      description: '',
      fabricCare: '',
      shippingPolicy: '',
    }
  }

  // Filter products
  const products = draft.products || []
  const filteredProducts = products.filter((p) => {
    if (activeCategoryFilter === 'All') return true
    return p.category === activeCategoryFilter
  })

  // Handle Image Upload via API (auto WebP conversion)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProduct) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Image upload failed')
      }

      const data = await res.json()
      const uploadedWebpUrl = data.url

      // Determine color assignment
      if (activeColorMode === 'new' || editingProduct.colors.length === 0) {
        const colorName = newColorName.trim() || `Variant ${editingProduct.colors.length + 1}`
        const newColor: ProductColor = {
          id: `col-${Date.now()}`,
          name: colorName,
          hex: newColorHex,
          image: uploadedWebpUrl,
        }

        setEditingProduct({
          ...editingProduct,
          colors: [...editingProduct.colors, newColor],
        })

        // Reset temporary color inputs
        setNewColorName('')
      } else {
        // Assign to existing color
        const updatedColors = editingProduct.colors.map((c) =>
          c.id === selectedExistingColorId ? { ...c, image: uploadedWebpUrl } : c
        )
        setEditingProduct({
          ...editingProduct,
          colors: updatedColors,
        })
      }
    } catch (err) {
      console.error(err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Native EyeDropper API (Chromium browsers)
  const handlePickColorFromImage = async () => {
    if (typeof window !== 'undefined' && 'EyeDropper' in window) {
      try {
        const eyeDropper = new (window as any).EyeDropper()
        const result = await eyeDropper.open()
        if (result?.sRGBHex) {
          setNewColorHex(result.sRGBHex)
        }
      } catch {
        // User canceled eyedropper selection
      }
    } else {
      alert('EyeDropper is supported on modern desktop browsers (Chrome, Edge). You can also click the color box to pick manually.')
    }
  }

  // Save Product (in draft state)
  const handleSaveProductForm = () => {
    if (!editingProduct) return

    if (!editingProduct.name.trim()) {
      alert('Please enter a product title.')
      return
    }

    if (editingProduct.colors.length === 0) {
      alert('Please add at least one color variant with an image.')
      return
    }

    updateDraft((prev) => {
      const existing = prev.products || []
      const index = existing.findIndex((p) => p.id === editingProduct.id)

      if (index >= 0) {
        const nextList = [...existing]
        nextList[index] = editingProduct
        return { ...prev, products: nextList }
      } else {
        return { ...prev, products: [editingProduct, ...existing] }
      }
    })

    setEditingProduct(null)
    setIsCreating(false)
  }

  // Delete product
  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      updateDraft((prev) => ({
        ...prev,
        products: (prev.products || []).filter((p) => p.id !== id),
      }))
    }
  }

  // Add Customization Option
  const handleAddCustomization = () => {
    if (!editingProduct) return
    const newOption: CustomizationOption = {
      id: `cust-${Date.now()}`,
      type: '',
      price: 150,
    }
    setEditingProduct({
      ...editingProduct,
      customization: {
        ...editingProduct.customization,
        options: [...editingProduct.customization.options, newOption],
      },
    })
  }

  // Remove Customization Option
  const handleRemoveCustomization = (optionId: string) => {
    if (!editingProduct) return
    setEditingProduct({
      ...editingProduct,
      customization: {
        ...editingProduct.customization,
        options: editingProduct.customization.options.filter((o) => o.id !== optionId),
      },
    })
  }

  return (
    <div className="space-y-6">
      {/* Module Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-[#ebe5da] rounded-3xl p-6 shadow-2xs">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-[#845d1d] font-mono">
            CATALOG &amp; INVENTORY STUDIO
          </span>
          <h2 className="font-display text-xl sm:text-2xl font-bold text-[#142319] mt-0.5">
            Products &amp; Variants Management
          </h2>
          <p className="text-xs text-[#6b7770] mt-0.5">
            Color-to-image mapping, prices, status badges &amp; customization add-ons
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPreviewOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-colors cursor-pointer"
          >
            <Eye size={14} className="text-[#845d1d]" />
            <span>Preview Cards &amp; PDP</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setEditingProduct(createEmptyProduct(activeCategoryFilter === 'All' ? 'Shirts' : activeCategoryFilter))
              setIsCreating(true)
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Product Drop</span>
          </button>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        {['All', ...CATEGORIES].map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setActiveCategoryFilter(cat)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              activeCategoryFilter === cat
                ? 'bg-[#1c3624] text-white shadow-2xs'
                : 'bg-white text-[#556358] border border-[#ded7cb] hover:border-[#1c3624] hover:text-[#142319]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product List Table / Grid */}
      <div className="bg-white border border-[#ebe5da] rounded-3xl overflow-hidden shadow-2xs">
        <div className="p-4 sm:p-5 border-b border-[#ebe5da] flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-[#142319]">
            Active Catalog ({filteredProducts.length} items)
          </span>
          <span className="text-xs text-[#6b7770]">
            Click Edit to manage colors, photos, and customization options
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="p-10 text-center text-xs text-[#6b7770]">
            No products found in category &ldquo;{activeCategoryFilter}&rdquo;.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#faf7f2] text-[#4a4740] uppercase text-[10px] tracking-wider border-b border-[#ebe5da]">
                <tr>
                  <th className="py-3 px-4 font-bold">Product</th>
                  <th className="py-3 px-4 font-bold">Price</th>
                  <th className="py-3 px-4 font-bold">Badge</th>
                  <th className="py-3 px-4 font-bold">Colors &amp; Photos</th>
                  <th className="py-3 px-4 font-bold">Customization</th>
                  <th className="py-3 px-4 text-right font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebe5da] text-[#142319]">
                {filteredProducts.map((p) => {
                  const discount = Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)
                  const primaryImage =
                    p.colors[0]?.image ||
                    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'

                  return (
                    <tr key={p.id} className="hover:bg-[#faf8f4] transition-colors">
                      {/* Product Name & Category */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-14 rounded-xl overflow-hidden bg-[#faf5ee] border border-[#e8ded3] flex-shrink-0">
                            <Image
                              src={primaryImage}
                              alt={p.name}
                              fill
                              className="object-cover object-top"
                            />
                          </div>
                          <div>
                            <span className="font-semibold text-[#142319] block text-sm">
                              {p.name}
                            </span>
                            <span className="text-[10px] text-[#6b7770]">
                              {p.category} • {p.gender} • {p.stockUrgency}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Pricing */}
                      <td className="py-3 px-4">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-[#142319] text-sm">
                            ₹{p.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[11px] text-[#8c978f] line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-[#c85a44]">
                            {discount}% OFF
                          </span>
                        </div>
                      </td>

                      {/* Badge */}
                      <td className="py-3 px-4">
                        {p.badge && p.badge !== 'None' ? (
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              p.badge === 'New'
                                ? 'bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1]'
                                : p.badge === 'Trending'
                                ? 'bg-[#fdf0ef] text-[#b84840] border border-[#fcd8d5]'
                                : 'bg-[#fef6e7] text-[#975a16] border border-[#fae4ba]'
                            }`}
                          >
                            {p.badge}
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8c978f]">Standard</span>
                        )}
                      </td>

                      {/* Color Swatches */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {p.colors.map((c) => (
                            <span
                              key={c.id}
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                          <span className="text-[10px] text-[#6b7770] ml-1">
                            ({p.colors.length} color{p.colors.length === 1 ? '' : 's'})
                          </span>
                        </div>
                      </td>

                      {/* Customization Available Badge */}
                      <td className="py-3 px-4">
                        {p.customization?.enabled ? (
                          <span className="inline-flex items-center gap-1 text-[10px] bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1] px-2.5 py-0.5 rounded-full font-bold">
                            <Scissors size={10} />
                            <span>Customization Available</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-[#8c978f]">No</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(p)
                              setIsCreating(false)
                              if (p.colors.length > 0) {
                                setActiveColorMode('existing')
                                setSelectedExistingColorId(p.colors[0].id)
                              }
                            }}
                            className="p-1.5 rounded-lg bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-[#142319] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-1.5 rounded-lg bg-[#fdf0ef] hover:bg-[#fadcd9] text-[#b84840] border border-[#fcd8d5] transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PRODUCT EDITOR MODAL (CREATE / EDIT) */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
          <div className="bg-white border border-[#ebe5da] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-5 sm:p-7 shadow-2xl relative text-[#142319] space-y-6">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#ebe5da]">
              <div>
                <h3 className="font-display text-xl font-bold text-[#142319]">
                  {isCreating ? 'Add New Product Drop' : `Edit: ${editingProduct.name}`}
                </h3>
                <p className="text-xs text-[#6b7770]">
                  Configure title, pricing, color-to-image photo assignments, and customizations
                </p>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-[#6b7770] hover:text-[#142319] flex items-center justify-center cursor-pointer transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Basic Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, name: e.target.value })
                  }
                  placeholder="e.g., Premium Pure Linen Casual Shirt"
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2.5 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Category *
                </label>
                <select
                  value={editingProduct.category}
                  onChange={(e) =>
                    setEditingProduct({ ...editingProduct, category: e.target.value })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2.5 text-xs text-[#142319] outline-hidden"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Gender Target
                </label>
                <select
                  value={editingProduct.gender}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      gender: e.target.value as 'Men' | 'Women' | 'Unisex',
                    })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2.5 text-xs text-[#142319] outline-hidden"
                >
                  <option value="Men">Men</option>
                  <option value="Women">Women</option>
                  <option value="Unisex">Unisex</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Selling Price (₹) *
                </label>
                <input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2.5 text-xs text-[#142319] outline-hidden font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Original MRP (₹) *
                </label>
                <input
                  type="number"
                  value={editingProduct.originalPrice}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      originalPrice: Math.max(0, parseInt(e.target.value) || 0),
                    })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3.5 py-2.5 text-xs text-[#142319] outline-hidden"
                />
              </div>
            </div>

            {/* Stock Urgency & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ebe5da]">
              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Stock Urgency Status
                </label>
                <select
                  value={editingProduct.stockUrgency}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      stockUrgency: e.target.value as any,
                    })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2.5 text-xs text-[#142319] outline-hidden"
                >
                  <option value="In Stock">In Stock</option>
                  <option value="Only 3 left">Only 3 left (High Urgency)</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Merchandising Badge
                </label>
                <select
                  value={editingProduct.badge || 'None'}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      badge: e.target.value as any,
                    })
                  }
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2.5 text-xs text-[#142319] outline-hidden"
                >
                  {BADGES.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Available Sizes */}
            <div className="pt-2 border-t border-[#ebe5da]">
              <label className="block text-xs font-semibold text-[#142319] mb-2">
                Available Sizes
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => {
                  const hasSize = editingProduct.sizes.includes(size)
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        const updatedSizes = hasSize
                          ? editingProduct.sizes.filter((s) => s !== size)
                          : [...editingProduct.sizes, size]
                        setEditingProduct({ ...editingProduct, sizes: updatedSizes })
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        hasSize
                          ? 'bg-[#1c3624] text-white shadow-2xs'
                          : 'bg-[#faf6f0] text-[#556358] border border-[#ded7cb] hover:border-[#1c3624]'
                      }`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* COLOR & IMAGE MANAGER */}
            <div className="pt-4 border-t border-[#ebe5da] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#142319] flex items-center gap-1.5">
                    <span>Colors &amp; Product Photos</span>
                    <span className="text-[10px] bg-[#eaf6ec] text-[#246b38] border border-[#cbe8d1] px-2 py-0.5 rounded-full font-mono font-bold">
                      Color-to-Image Sync
                    </span>
                  </h4>
                  <p className="text-xs text-[#6b7770] mt-0.5">
                    Upload photos and pair each image with its color. When a customer picks that color, the main photo switches automatically!
                  </p>
                </div>
              </div>

              {/* Current Colors & Associated Photos Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {editingProduct.colors.map((color) => (
                  <div
                    key={color.id}
                    className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-3 flex items-start gap-3 relative group"
                  >
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#ded7cb]">
                      <Image
                        src={color.image}
                        alt={color.name}
                        fill
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0 pr-6">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-inner flex-shrink-0"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="text-xs font-bold text-[#142319] truncate">
                          {color.name}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-[#6b7770] block">
                        {color.hex}
                      </span>
                      <span className="text-[9px] text-[#206035] font-bold block mt-1">
                        ✓ Active Photo Linked
                      </span>
                    </div>

                    {/* Delete Color Option */}
                    <button
                      type="button"
                      onClick={() => {
                        const updated = editingProduct.colors.filter((c) => c.id !== color.id)
                        setEditingProduct({ ...editingProduct, colors: updated })
                      }}
                      className="absolute top-2.5 right-2.5 text-[#8c978f] hover:text-[#b84840] transition-colors p-1"
                      title="Remove Color"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Upload Image Section */}
              <div className="bg-[#faf8f5] border border-dashed border-[#ded7cb] rounded-2xl p-4 sm:p-5 space-y-4">
                <span className="text-xs font-bold text-[#142319] uppercase tracking-wider block">
                  Step 1: Upload Next Image (Auto-Converts to WebP)
                </span>

                {/* Color Assignment Selector */}
                <div className="space-y-3 bg-white p-3.5 rounded-xl border border-[#ebe5da]">
                  <span className="text-[11px] font-semibold text-[#6b7770] block">
                    Assign Color for this Image:
                  </span>

                  {/* Choice: Existing vs New Color */}
                  <div className="flex items-center gap-4">
                    {editingProduct.colors.length > 0 && (
                      <label className="flex items-center gap-1.5 text-xs text-[#142319] cursor-pointer font-medium">
                        <input
                          type="radio"
                          name="colorMode"
                          checked={activeColorMode === 'existing'}
                          onChange={() => setActiveColorMode('existing')}
                          className="text-[#1c3624] focus:ring-[#1c3624]"
                        />
                        <span>Assign to Existing Color</span>
                      </label>
                    )}

                    <label className="flex items-center gap-1.5 text-xs text-[#142319] cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="colorMode"
                            checked={activeColorMode === 'new' || editingProduct.colors.length === 0}
                            onChange={() => setActiveColorMode('new')}
                            className="text-[#1c3624] focus:ring-[#1c3624]"
                          />
                      <span>+ Create New Color Variant</span>
                    </label>
                  </div>

                  {/* If Existing Color selected */}
                  {activeColorMode === 'existing' && editingProduct.colors.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingProduct.colors.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setSelectedExistingColorId(c.id)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                            selectedExistingColorId === c.id
                              ? 'border-[#1c3624] bg-[#eef7f0] text-[#1c3624] font-bold shadow-2xs'
                              : 'border-[#ded7cb] bg-white text-[#556358]'
                          }`}
                        >
                          <span
                            className="w-3 h-3 rounded-full border border-black/10"
                            style={{ backgroundColor: c.hex }}
                          />
                          <span>{c.name}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* If New Color selected */}
                  {(activeColorMode === 'new' || editingProduct.colors.length === 0) && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#6b7770] mb-1">
                          New Color Name
                        </label>
                        <input
                          type="text"
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          placeholder="e.g., Desert Terracotta, Navy Blue"
                          className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-[#6b7770] mb-1">
                          Color Hex &amp; Eyedropper
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer flex-shrink-0"
                            title="Native Color Picker"
                          />
                          <input
                            type="text"
                            value={newColorHex}
                            onChange={(e) => setNewColorHex(e.target.value)}
                            className="w-24 bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-xl px-2.5 py-2 text-xs text-[#142319] outline-hidden font-mono"
                          />
                          {/* Eyedropper Button */}
                          <button
                            type="button"
                            onClick={handlePickColorFromImage}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#142319] transition-all cursor-pointer flex-shrink-0"
                            title="Pick exact color from image"
                          >
                            <Pipette size={14} className="text-[#845d1d]" />
                            <span className="hidden sm:inline">Pick from Image</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Upload Action */}
                <div className="flex items-center gap-3">
                  <label className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all cursor-pointer">
                    <Upload size={14} />
                    <span>{uploading ? 'Processing WebP...' : 'Upload Image File (PNG, JPG, HEIC)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  <span className="text-[11px] text-[#6b7770]">
                    Auto-converts to WebP with 85% compression
                  </span>
                </div>
              </div>
            </div>

            {/* MULTI-OPTION CUSTOMIZATION ADD-ON */}
            <div className="pt-4 border-t border-[#ebe5da] space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-[#142319] flex items-center gap-1.5">
                    <Scissors size={15} className="text-[#845d1d]" />
                    <span>Customization Add-On</span>
                  </h4>
                  <p className="text-xs text-[#6b7770]">
                    Allow customers to request personalized embroidery, DTF prints, or custom initials
                  </p>
                </div>

                {/* Main Toggle */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <span className="text-xs font-semibold text-[#142319]">
                    {editingProduct.customization?.enabled ? 'Customization ON' : 'Customization OFF'}
                  </span>
                  <input
                    type="checkbox"
                    checked={editingProduct.customization?.enabled || false}
                    onChange={(e) =>
                      setEditingProduct({
                        ...editingProduct,
                        customization: {
                          ...editingProduct.customization,
                          enabled: e.target.checked,
                        },
                      })
                    }
                    className="w-5 h-5 rounded text-[#1c3624] focus:ring-[#1c3624] cursor-pointer"
                  />
                </label>
              </div>

              {/* If Customization is ON */}
              {editingProduct.customization?.enabled && (
                <div className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#142319] uppercase tracking-wider">
                      Customization Options Available for this Product
                    </span>
                    <button
                      type="button"
                      onClick={handleAddCustomization}
                      className="text-xs text-[#206035] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={14} />
                      <span>Add Option</span>
                    </button>
                  </div>

                  {editingProduct.customization.options.length === 0 ? (
                    <div className="py-2 text-xs text-[#6b7770]">
                      No custom options added yet. Click &ldquo;Add Option&rdquo; above to set types and prices.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editingProduct.customization.options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-[#ebe5da]"
                        >
                          <div className="flex-1">
                            <label className="block text-[10px] text-[#6b7770] mb-0.5">
                              Customization Type (e.g. Pocket Monogram, Back DTF Print)
                            </label>
                            <input
                              type="text"
                              value={opt.type}
                              onChange={(e) => {
                                const nextOpts = [...editingProduct.customization.options]
                                nextOpts[idx].type = e.target.value
                                setEditingProduct({
                                  ...editingProduct,
                                  customization: {
                                    ...editingProduct.customization,
                                    options: nextOpts,
                                  },
                                })
                              }}
                              placeholder="e.g., Pocket Monogram Embroidery, HD DTF Back Print"
                              className="w-full bg-white border border-[#ded7cb] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden"
                            />
                          </div>

                          <div className="w-28">
                            <label className="block text-[10px] text-[#6b7770] mb-0.5">
                              Fee (₹)
                            </label>
                            <input
                              type="number"
                              value={opt.price}
                              onChange={(e) => {
                                const nextOpts = [...editingProduct.customization.options]
                                nextOpts[idx].price = parseInt(e.target.value) || 0
                                setEditingProduct({
                                  ...editingProduct,
                                  customization: {
                                    ...editingProduct.customization,
                                    options: nextOpts,
                                  },
                                })
                              }}
                              className="w-full bg-white border border-[#ded7cb] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden font-bold"
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveCustomization(opt.id)}
                            className="p-1.5 rounded-lg text-[#b84840] hover:bg-[#fdf0ef] transition-colors mt-3"
                            title="Remove"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="p-2.5 rounded-xl bg-[#eaf6ec] border border-[#cbe8d1] text-[11px] text-[#246b38] flex items-center gap-1.5 font-medium">
                    <Check size={13} />
                    <span>
                      Customers will see the <strong>&ldquo;Customization Available&rdquo;</strong> badge on product cards!
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Bottom Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#ebe5da]">
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="px-4 py-2.5 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#556358] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSaveProductForm}
                className="px-5 py-2.5 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer"
              >
                Done (Save into Staging)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODULE PREVIEW DRAWER */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Products & PDP Color-Sync Preview"
      >
        <div className="p-6 space-y-8 bg-[#faf8f5]">
          <div>
            <h3 className="font-display text-xl font-bold text-[#142319] mb-2">
              Catalog Product Cards Preview
            </h3>
            <p className="text-xs text-[#6b7770] mb-4">
              Shows badges, prices, and the &ldquo;Customization Available&rdquo; label
            </p>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
              {filteredProducts.slice(0, 4).map((p) => (
                <div key={p.id} className="w-52 flex-shrink-0">
                  <ProductCard
                    id={p.id}
                    name={p.name}
                    image={
                      p.colors[0]?.image ||
                      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'
                    }
                    price={p.price}
                    originalPrice={p.originalPrice}
                    rating={p.rating}
                    reviewCount={p.reviewCount}
                    colors={p.colors.map((c) => c.hex)}
                    badge={p.badge === 'None' ? undefined : p.badge}
                    category={p.category}
                    gender={p.gender}
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="pt-6 border-t border-[#ded7cb]">
            <h3 className="font-display text-xl font-bold text-[#142319] mb-2">
              Product Details Page (PDP) Preview
            </h3>
            <p className="text-xs text-[#6b7770] mb-4">
              Test clicking color swatches below to verify live image switching
            </p>
            <div className="rounded-2xl overflow-hidden border border-[#ded7cb] bg-white">
              <ProductDetailsView />
            </div>
          </div>
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
