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

interface ProductsModuleProps {
  initialCategoryFilter?: string | null
  openCreateOnMount?: boolean
}

const DEFAULT_CATEGORIES = [
  'Shirts',
  'T-Shirts',
  'Dresses',
  'Jeans',
  'Tops',
  'Co-ord Sets',
]

const BADGES = ['None', 'New', 'Trending', 'Bestseller', 'Flash Sale'] as const

export default function ProductsModule({
  initialCategoryFilter,
  openCreateOnMount,
}: ProductsModuleProps) {
  const { draft, updateDraft } = useStore()

  // Dynamically derive categories from CategoriesModule (draft.categories)
  const categoriesList = Array.from(
    new Set([
      ...((draft.categories || []).map((c) => c.title.trim()).filter(Boolean)),
      ...DEFAULT_CATEGORIES,
    ])
  )

  const [editingProduct, setEditingProduct] = useState<Product | null>(
    openCreateOnMount
      ? createEmptyProduct(initialCategoryFilter || categoriesList[0] || 'Shirts')
      : null
  )
  const [isCreating, setIsCreating] = useState(Boolean(openCreateOnMount))
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>(
    initialCategoryFilter || 'All'
  )
  const [previewOpen, setPreviewOpen] = useState(false)
  const [previewTab, setPreviewTab] = useState<'pdp' | 'cards'>('pdp')
  const [previewProductId, setPreviewProductId] = useState<string>('')
  const [uploading, setUploading] = useState(false)
  const [uploadSuccessTick, setUploadSuccessTick] = useState(false)

  // Price input states to eliminate the "0299" leading zero bug
  const [sellingPriceInput, setSellingPriceInput] = useState<string>('')
  const [originalPriceInput, setOriginalPriceInput] = useState<string>('')

  // Sizes management - supports adding at start or end
  const [allSizes, setAllSizes] = useState<string[]>([
    'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '28', '30', '32', '34', '36', '38'
  ])
  const [newSizeStart, setNewSizeStart] = useState('')
  const [newSizeEnd, setNewSizeEnd] = useState('')

  // Urgency custom input
  const [customUrgencyText, setCustomUrgencyText] = useState('')

  // Image Upload First & Color Pairing State
  const fileInputRef = React.useRef<HTMLInputElement | null>(null)
  const [pendingImageUrl, setPendingImageUrl] = useState<string | null>(null)
  const [editingColorId, setEditingColorId] = useState<string | null>(null)
  const [newColorName, setNewColorName] = useState('')
  const [newColorHex, setNewColorHex] = useState('#c4855a')

  function createEmptyProduct(category = 'Shirts'): Product {
    return {
      id: `prod-${Date.now()}`,
      name: '',
      category,
      gender: 'Men',
      price: 0,
      originalPrice: 0,
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
      features: {
        freeDelivery: true,
        customizationAvailable: false,
        returnable: true,
        qualityAssured: true,
      },
      description: '',
      fabricCare: '',
      shippingPolicy: '',
    }
  }

  // Synchronize inputs when opening a product for edit
  React.useEffect(() => {
    if (editingProduct) {
      setSellingPriceInput(editingProduct.price ? String(editingProduct.price) : '')
      setOriginalPriceInput(editingProduct.originalPrice ? String(editingProduct.originalPrice) : '')
      setPendingImageUrl(null)
      setUploadSuccessTick(false)
      setEditingColorId(null)
      setNewColorName('')
      if (
        editingProduct.stockUrgency !== 'In Stock' &&
        editingProduct.stockUrgency !== 'Few Pieces Left' &&
        editingProduct.stockUrgency !== 'Out of Stock'
      ) {
        setCustomUrgencyText(editingProduct.stockUrgency || '')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editingProduct?.id])

  // Filter products
  const products = draft.products || []
  const filteredProducts = products.filter((p) => {
    if (activeCategoryFilter === 'All') return true
    return p.category === activeCategoryFilter
  })

  // Handle Image Upload via API (Upload Photo FIRST)
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editingProduct) return

    setUploading(true)
    setUploadSuccessTick(false)
    try {
      const adminToken =
        (typeof window !== 'undefined'
          ? sessionStorage.getItem('varna_admin_token')
          : null) ||
        draft.settings?.passcode ||
        'varna2026'

      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        headers: { 'x-admin-token': adminToken },
        body: formData,
      })

      if (!res.ok) {
        throw new Error('Image upload failed')
      }

      const data = await res.json()
      const uploadedWebpUrl = data.url
      setPendingImageUrl(uploadedWebpUrl)
      setUploadSuccessTick(true)

      // If replacing image of currently edited color variant:
      if (editingColorId) {
        setEditingProduct((prev) => {
          if (!prev) return null
          return {
            ...prev,
            colors: prev.colors.map((c) =>
              c.id === editingColorId ? { ...c, image: uploadedWebpUrl } : c
            ),
          }
        })
      }
    } catch (err) {
      console.error(err)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
      e.target.value = ''
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
          // If hex matches an already defined color, reuse that color's name!
          const match = editingProduct?.colors.find(
            (c) => c.hex.toLowerCase() === result.sRGBHex.toLowerCase()
          )
          if (match && !editingColorId) {
            setNewColorName(match.name)
          }
        }
      } catch {
        // User canceled eyedropper selection
      }
    } else {
      alert('EyeDropper is supported on modern desktop browsers (Chrome, Edge). You can also click the color box to pick manually.')
    }
  }

  // Pair Uploaded Image with Color (Prevents duplicate variant naming for same hex)
  const handleAssignColorToPendingImage = (name: string, hex: string) => {
    if (!editingProduct || !pendingImageUrl) return

    // If identical hex is already used in this product, reuse that color's name
    const existingSameHex = editingProduct.colors.find(
      (c) => c.hex.toLowerCase() === hex.toLowerCase()
    )

    const finalColorName = existingSameHex
      ? existingSameHex.name
      : name.trim() || `Variant ${editingProduct.colors.length + 1}`

    const newColor: ProductColor = {
      id: `col-${Date.now()}`,
      name: finalColorName,
      hex: hex,
      image: pendingImageUrl,
    }

    setEditingProduct({
      ...editingProduct,
      colors: [...editingProduct.colors, newColor],
    })

    // Reset upload staging
    setPendingImageUrl(null)
    setUploadSuccessTick(false)
    setNewColorName('')
  }

  // Edit existing uploaded image details
  const handleSelectColorForEdit = (color: ProductColor) => {
    setEditingColorId(color.id)
    setNewColorName(color.name)
    setNewColorHex(color.hex)
    setPendingImageUrl(color.image)
  }

  const handleUpdateCurrentColor = () => {
    if (!editingProduct || !editingColorId) return
    const updated = editingProduct.colors.map((c) =>
      c.id === editingColorId
        ? {
            ...c,
            name: newColorName.trim() || c.name,
            hex: newColorHex,
            image: pendingImageUrl || c.image,
          }
        : c
    )
    setEditingProduct({
      ...editingProduct,
      colors: updated,
    })
    setEditingColorId(null)
    setPendingImageUrl(null)
    setNewColorName('')
  }

  const handleCancelColorEdit = () => {
    setEditingColorId(null)
    setPendingImageUrl(null)
    setNewColorName('')
  }

  // Add custom size at start (smaller sizes)
  const handleAddSizeAtStart = () => {
    const trimmed = newSizeStart.trim().toUpperCase()
    if (!trimmed) return
    if (!allSizes.includes(trimmed)) {
      setAllSizes([trimmed, ...allSizes])
    }
    if (editingProduct && !editingProduct.sizes.includes(trimmed)) {
      setEditingProduct({
        ...editingProduct,
        sizes: [trimmed, ...editingProduct.sizes],
      })
    }
    setNewSizeStart('')
  }

  // Add custom size at end (larger sizes)
  const handleAddSizeAtEnd = () => {
    const trimmed = newSizeEnd.trim().toUpperCase()
    if (!trimmed) return
    if (!allSizes.includes(trimmed)) {
      setAllSizes([...allSizes, trimmed])
    }
    if (editingProduct && !editingProduct.sizes.includes(trimmed)) {
      setEditingProduct({
        ...editingProduct,
        sizes: [...editingProduct.sizes, trimmed],
      })
    }
    setNewSizeEnd('')
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
        {['All', ...categoriesList].map((cat) => (
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

                  // Deduplicate colors by hex to avoid duplicate swatch dots
                  const uniqueColors = Array.from(
                    new Map(p.colors.map((c) => [(c.hex || '').toLowerCase().trim(), c])).values()
                  )

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        setEditingProduct(p)
                        setIsCreating(false)
                      }}
                      className="hover:bg-[#faf6f0] transition-colors cursor-pointer group"
                      title="Click anywhere on product to edit"
                    >
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
                            <span className="font-semibold text-[#142319] block text-sm group-hover:text-[#1c3624] transition-colors">
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
                          <span className="text-[10px] font-bold text-[#845d1d]">
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

                      {/* Color Swatches (Accurately Deduplicated) */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {uniqueColors.map((c) => (
                            <span
                              key={c.id || c.name}
                              className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                              style={{ backgroundColor: c.hex }}
                              title={`${c.name} (${c.hex})`}
                            />
                          ))}
                          <span className="text-[10px] text-[#6b7770] ml-1">
                            ({uniqueColors.length} color{uniqueColors.length === 1 ? '' : 's'}
                            {p.colors.length > uniqueColors.length
                              ? ` • ${p.colors.length} photos`
                              : ''})
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
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingProduct(p)
                              setIsCreating(false)
                            }}
                            className="p-1.5 rounded-lg text-[#556358] hover:text-[#1c3624] hover:bg-[#faf6f0] transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDeleteProduct(p.id, p.name)
                            }}
                            className="p-1.5 rounded-lg text-[#b84840] hover:bg-[#fdf0ef] transition-colors cursor-pointer"
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
          <div className="bg-white border border-[#ebe5da] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-4 sm:p-7 shadow-2xl relative text-[#142319] space-y-6">
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
                  {categoriesList.map((cat) => (
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

              {/* Selling Price with Green Main Highlight & 0299 leading zero fix */}
              <div className="bg-[#eef7f0] p-3 rounded-2xl border border-[#b8e0bf]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-[#1e4a36]">
                    Selling Price (₹) *
                  </label>
                  <span className="text-[9px] font-bold uppercase tracking-wider bg-[#d7eedc] text-[#1e4a36] px-2 py-0.5 rounded-full border border-[#b8e0bf]">
                    Main / Customer Pays
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={sellingPriceInput}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                    setSellingPriceInput(clean)
                    setEditingProduct({
                      ...editingProduct,
                      price: clean === '' ? 0 : parseInt(clean, 10),
                    })
                  }}
                  placeholder="e.g. 299"
                  className="w-full bg-white border-2 border-[#206035] focus:border-[#14281a] focus:ring-1 focus:ring-[#14281a] rounded-xl px-3 py-2 text-sm font-bold text-[#142319] outline-hidden"
                />
              </div>

              {/* Original MRP with Red / Strikethrough Indication & 01232 leading zero fix */}
              <div className="bg-[#fdf2f0] p-3 rounded-2xl border border-[#f8cfca]">
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-[#8b1e1e]">
                    Original MRP (₹) *
                  </label>
                  <span className="text-[9px] font-medium uppercase tracking-wider bg-[#fadcd7] text-[#8b1e1e] px-2 py-0.5 rounded-full border border-[#f8cfca]">
                    Display Only
                  </span>
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={originalPriceInput}
                  onChange={(e) => {
                    const clean = e.target.value.replace(/[^0-9]/g, '').replace(/^0+(?=\d)/, '')
                    setOriginalPriceInput(clean)
                    setEditingProduct({
                      ...editingProduct,
                      originalPrice: clean === '' ? 0 : parseInt(clean, 10),
                    })
                  }}
                  placeholder="e.g. 1499"
                  className="w-full bg-white border border-[#c85a44] focus:border-[#8b1e1e] focus:ring-1 focus:ring-[#8b1e1e] rounded-xl px-3 py-2 text-sm text-[#55231c] outline-hidden"
                />
              </div>

              {/* Live Discount Percentage & Savings Indicator */}
              {(() => {
                const sPrice = parseInt(sellingPriceInput, 10) || 0
                const oPrice = parseInt(originalPriceInput, 10) || 0
                if (oPrice > sPrice && oPrice > 0) {
                  const pct = Math.round(((oPrice - sPrice) / oPrice) * 100)
                  const diff = oPrice - sPrice
                  return (
                    <div className="col-span-1 sm:col-span-2 flex items-center justify-between bg-[#fcf5e9] border border-[#f4e4cb] text-[#845d1d] px-3.5 py-2 rounded-xl text-xs font-bold animate-in fade-in">
                      <div className="flex items-center gap-2">
                        <span className="bg-[#845d1d] text-white px-2 py-0.5 rounded-full text-[10px]">
                          {pct}% OFF
                        </span>
                        <span>Customer Saves: ₹{diff.toLocaleString('en-IN')}</span>
                      </div>
                      <span className="text-[10px] text-[#796749] font-normal hidden sm:inline">
                        Selling price ₹{sPrice} is charged, Original MRP ₹{oPrice} shows crossed out
                      </span>
                    </div>
                  )
                }
                return null
              })()}
            </div>

            {/* Product Description Field */}
            <div>
              <label className="block text-xs font-semibold text-[#142319] mb-1">
                Product Description
              </label>
              <textarea
                rows={3}
                value={editingProduct.description || ''}
                onChange={(e) =>
                  setEditingProduct({ ...editingProduct, description: e.target.value })
                }
                placeholder="Describe the fabric, fit, styling drape, embroidery or unique details of this product..."
                className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl p-3 text-xs text-[#142319] outline-hidden placeholder-[#8c978f] leading-relaxed"
              />
            </div>

            {/* Stock Urgency & Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-[#ebe5da]">
              <div>
                <label className="block text-xs font-semibold text-[#142319] mb-1">
                  Stock Urgency Status
                </label>
                <select
                  value={
                    editingProduct.stockUrgency === 'In Stock' ||
                    editingProduct.stockUrgency === 'Few Pieces Left' ||
                    editingProduct.stockUrgency === 'Out of Stock'
                      ? editingProduct.stockUrgency
                      : 'Custom'
                  }
                  onChange={(e) => {
                    const val = e.target.value
                    if (val === 'Custom') {
                      setEditingProduct({
                        ...editingProduct,
                        stockUrgency: customUrgencyText || 'Few Pieces Left',
                      })
                    } else {
                      setEditingProduct({
                        ...editingProduct,
                        stockUrgency: val as any,
                      })
                    }
                  }}
                  className="w-full bg-white border border-[#ded7cb] focus:border-[#1c3624] focus:ring-1 focus:ring-[#1c3624] rounded-xl px-3 py-2.5 text-xs text-[#142319] outline-hidden"
                >
                  <option value="In Stock">In Stock (Normal)</option>
                  <option value="Few Pieces Left">Few Pieces Left (Urgency without hardcoded number)</option>
                  <option value="Custom">Custom Urgency Text...</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>

                {editingProduct.stockUrgency !== 'In Stock' &&
                  editingProduct.stockUrgency !== 'Few Pieces Left' &&
                  editingProduct.stockUrgency !== 'Out of Stock' && (
                    <input
                      type="text"
                      value={customUrgencyText}
                      onChange={(e) => {
                        setCustomUrgencyText(e.target.value)
                        setEditingProduct({
                          ...editingProduct,
                          stockUrgency: e.target.value || 'Few Pieces Left',
                        })
                      }}
                      placeholder="e.g., Only 5 Pieces Left or Limited Drop"
                      className="mt-2 w-full bg-white border border-[#ded7cb] rounded-xl px-3 py-1.5 text-xs text-[#142319] outline-hidden"
                    />
                  )}
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

            {/* Available Sizes with Custom Add Size Button on BOTH Sides */}
            <div className="pt-2 border-t border-[#ebe5da] space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-[#142319]">
                  Available Sizes
                </label>
                <span className="text-[10px] text-[#6b7770]">
                  Add smaller sizes on left or larger sizes on right
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* 1. Add Smaller Size at START */}
                <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-dashed border-[#ded7cb]">
                  <input
                    type="text"
                    value={newSizeStart}
                    onChange={(e) => setNewSizeStart(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSizeAtStart()
                      }
                    }}
                    placeholder="+ Smaller (e.g. XXS)"
                    className="w-28 bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2 py-1 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSizeAtStart}
                    className="px-2 py-1 rounded-lg bg-[#1c3624] hover:bg-[#14281a] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-0.5"
                    title="Add size to start of list"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>

                {/* 2. Existing Size Pills */}
                {allSizes.map((size) => {
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

                {/* 3. Add Larger Size at END */}
                <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-dashed border-[#ded7cb]">
                  <input
                    type="text"
                    value={newSizeEnd}
                    onChange={(e) => setNewSizeEnd(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddSizeAtEnd()
                      }
                    }}
                    placeholder="+ Larger (e.g. 4XL)"
                    className="w-28 bg-white border border-[#ded7cb] focus:border-[#1c3624] rounded-lg px-2 py-1 text-xs text-[#142319] outline-hidden placeholder-[#8c978f]"
                  />
                  <button
                    type="button"
                    onClick={handleAddSizeAtEnd}
                    className="px-2 py-1 rounded-lg bg-[#1c3624] hover:bg-[#14281a] text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-0.5"
                    title="Add size to end of list"
                  >
                    <Plus size={12} />
                    <span>Add</span>
                  </button>
                </div>
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
                    Upload photos first, then pair each image with its color. When a customer picks that color, the main photo switches automatically!
                  </p>
                </div>
              </div>

              {/* Current Colors & Associated Photos Grid (Click to Edit Details) */}
              {editingProduct.colors.length > 0 && (
                <div className="space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#6b7770] block">
                    Uploaded Photos &amp; Colors ({editingProduct.colors.length}) — Click any card to edit details:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {editingProduct.colors.map((color) => {
                      const isSelectedForEdit = editingColorId === color.id
                      return (
                        <div
                          key={color.id}
                          onClick={() => handleSelectColorForEdit(color)}
                          className={`border rounded-2xl p-3 flex items-start gap-3 relative group cursor-pointer transition-all ${
                            isSelectedForEdit
                              ? 'border-[#1c3624] ring-2 ring-[#1c3624]/20 shadow-xs bg-white'
                              : 'bg-[#faf8f5] border-[#ded7cb] hover:border-[#1c3624]'
                          }`}
                        >
                          <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-white flex-shrink-0 border border-[#ded7cb]">
                            <Image
                              src={color.image}
                              alt={color.name}
                              fill
                              className="object-cover object-top"
                              unoptimized
                            />
                          </div>
                          <div className="flex-1 min-w-0 pr-6">
                            <div className="flex items-center gap-1.5 mb-1">
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner flex-shrink-0"
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
                              {isSelectedForEdit ? '● Currently Editing' : '✓ Click to Edit'}
                            </span>
                          </div>

                          {/* Delete Color Option */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              const updated = editingProduct.colors.filter((c) => c.id !== color.id)
                              setEditingProduct({ ...editingProduct, colors: updated })
                              if (editingColorId === color.id) {
                                setEditingColorId(null)
                                setPendingImageUrl(null)
                              }
                            }}
                            className="absolute top-2.5 right-2.5 text-[#8c978f] hover:text-[#b84840] transition-colors p-1"
                            title="Remove Color"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* STEP 1: PHOTO UPLOAD FIRST */}
              <div className="bg-[#faf8f5] border border-dashed border-[#ded7cb] rounded-2xl p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#142319] uppercase tracking-wider">
                    {editingColorId
                      ? 'Edit Photo & Color Variant'
                      : 'Step 1: Upload Product Photo First'}
                  </span>
                  {uploadSuccessTick && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#206035] bg-[#eef7f0] px-2.5 py-0.5 rounded-full border border-[#d6ecda]">
                      <Check size={13} />
                      <span>Image Ready &amp; Synced!</span>
                    </span>
                  )}
                </div>

                {/* Upload Button & Preview */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  {/* Hidden File Input for triggering */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploading}
                    className="hidden"
                  />

                  {!pendingImageUrl ? (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="inline-flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                    >
                      <Upload size={15} />
                      <span>
                        {uploading
                          ? 'Uploading & Optimizing to Cloudinary WebP...'
                          : 'Upload Photo (PNG, JPG, HEIC, WEBP)'}
                      </span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-4 flex-wrap">
                      {/* Big, High-Definition Preview Thumbnail */}
                      <div className="relative w-24 h-28 sm:w-28 sm:h-32 rounded-xl overflow-hidden border-2 border-[#1c3624] bg-white shadow-md flex-shrink-0">
                        <Image
                          src={pendingImageUrl}
                          alt="Uploaded Preview"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>

                      <div className="space-y-2">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploading}
                          className="inline-flex items-center gap-2 py-2 px-3.5 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                        >
                          <Upload size={14} />
                          <span>{uploading ? 'Replacing...' : 'Change Photo'}</span>
                        </button>

                        <div className="flex items-center gap-1.5 text-xs font-semibold text-[#206035] bg-[#eef7f0] px-2.5 py-1 rounded-lg border border-[#d6ecda]">
                          <Check size={14} />
                          <span>Ready for color pairing below</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {uploading && (
                    <div className="flex items-center gap-2 text-xs text-[#845d1d] font-medium">
                      <div className="w-3.5 h-3.5 border-2 border-[#845d1d] border-t-transparent rounded-full animate-spin" />
                      <span>Converting to WebP &amp; syncing to Cloudinary CDN...</span>
                    </div>
                  )}
                </div>

                {/* STEP 2: ASSIGN COLOR FOR THIS PHOTO */}
                {(pendingImageUrl || editingColorId) && (
                  <div className="space-y-3 bg-white p-4 rounded-xl border border-[#ebe5da] animate-in fade-in">
                    <span className="text-[11px] font-bold text-[#142319] uppercase tracking-wider block">
                      {editingColorId
                        ? 'Update Color Variant Details:'
                        : 'Step 2: Choose or Add Color for this Photo:'}
                    </span>

                    {/* Existing Colors in this product */}
                    {editingProduct.colors.length > 0 && !editingColorId && (
                      <div className="space-y-1.5">
                        <span className="text-[11px] font-semibold text-[#6b7770] block">
                          Pick from existing colors in this product:
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {Array.from(
                            new Map(editingProduct.colors.map((c) => [c.hex.toLowerCase(), c])).values()
                          ).map((c) => (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => {
                                setNewColorName(c.name)
                                setNewColorHex(c.hex)
                              }}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all cursor-pointer ${
                                newColorHex.toLowerCase() === c.hex.toLowerCase()
                                  ? 'border-[#1c3624] bg-[#eef7f0] text-[#1c3624] font-bold shadow-2xs'
                                  : 'border-[#ded7cb] bg-white text-[#556358] hover:border-[#1c3624]'
                              }`}
                            >
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-black/15 shadow-inner"
                                style={{ backgroundColor: c.hex }}
                              />
                              <span>{c.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Name & Hex picker */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-[#ebe5da]">
                      <div>
                        <label className="block text-[11px] font-semibold text-[#6b7770] mb-1">
                          Color Name
                        </label>
                        <input
                          type="text"
                          value={newColorName}
                          onChange={(e) => setNewColorName(e.target.value)}
                          placeholder="e.g. Sage Green, Terracotta, Navy Blue"
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
                            onChange={(e) => {
                              const hex = e.target.value
                              setNewColorHex(hex)
                              const match = editingProduct.colors.find(
                                (c) => c.hex.toLowerCase() === hex.toLowerCase()
                              )
                              if (match && !editingColorId) {
                                setNewColorName(match.name)
                              }
                            }}
                            className="w-9 h-9 rounded-xl bg-transparent border-0 cursor-pointer flex-shrink-0"
                            title="Native Color Picker"
                          />
                          <input
                            type="text"
                            value={newColorHex}
                            onChange={(e) => {
                              const hex = e.target.value
                              setNewColorHex(hex)
                              const match = editingProduct.colors.find(
                                (c) => c.hex.toLowerCase() === hex.toLowerCase()
                              )
                              if (match && !editingColorId) {
                                setNewColorName(match.name)
                              }
                            }}
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

                    {/* Commit Color & Image Button */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                      {editingColorId && (
                        <button
                          type="button"
                          onClick={handleCancelColorEdit}
                          className="px-3.5 py-2 rounded-xl bg-[#faf6f0] hover:bg-[#f0ece4] border border-[#ded7cb] text-xs font-semibold text-[#556358] transition-colors cursor-pointer"
                        >
                          Cancel Editing
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          if (editingColorId) {
                            handleUpdateCurrentColor()
                          } else {
                            handleAssignColorToPendingImage(newColorName, newColorHex)
                          }
                        }}
                        className="px-4 py-2 rounded-xl bg-[#1c3624] hover:bg-[#14281a] text-white font-bold text-xs shadow-xs transition-all active:scale-97 cursor-pointer flex items-center gap-1.5"
                      >
                        <Check size={14} />
                        <span>
                          {editingColorId ? 'Update Color Variant' : 'Pair Photo with this Color'}
                        </span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Another Photo Button (Under Card & Above Customization) */}
              <div className="pt-1">
                <button
                  type="button"
                  disabled={Boolean(pendingImageUrl)}
                  onClick={() => {
                    setEditingColorId(null)
                    setPendingImageUrl(null)
                    fileInputRef.current?.click()
                  }}
                  className={`w-full py-3 px-4 rounded-xl border-2 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs ${
                    pendingImageUrl
                      ? 'bg-[#f4efe8] border-[#ded7cb] text-[#8c978f] cursor-not-allowed opacity-60'
                      : 'bg-[#faf6f0] hover:bg-[#1c3624] hover:text-white border-[#1c3624] text-[#1c3624]'
                  }`}
                >
                  <Plus size={16} />
                  <span>+ Upload Another Photo</span>
                </button>
                {pendingImageUrl && (
                  <p className="text-[11px] text-[#b84840] font-semibold mt-1 text-center">
                    ⚠️ Pair a color with the current photo above before uploading another photo.
                  </p>
                )}
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

                {/* Sleek iOS-Style Tactile Toggle Switch */}
                <div className="flex items-center gap-2.5">
                  <span className="text-xs font-semibold text-[#142319]">
                    {editingProduct.customization?.enabled ? 'Enabled' : 'Disabled'}
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={editingProduct.customization?.enabled}
                    onClick={() => {
                      const nextEnabled = !editingProduct.customization?.enabled
                      setEditingProduct({
                        ...editingProduct,
                        customization: {
                          ...editingProduct.customization,
                          enabled: nextEnabled,
                        },
                        features: {
                          freeDelivery: editingProduct.features?.freeDelivery ?? true,
                          customizationAvailable: nextEnabled,
                          returnable: editingProduct.features?.returnable ?? true,
                          qualityAssured: editingProduct.features?.qualityAssured ?? true,
                        },
                      })
                    }}
                    className={`relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                      editingProduct.customization?.enabled ? 'bg-[#1c3624]' : 'bg-[#ded7cb]'
                    }`}
                  >
                    <span
                      className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                        editingProduct.customization?.enabled ? 'translate-x-7' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* If Customization is Enabled */}
              {editingProduct.customization?.enabled && (
                <div className="bg-[#faf8f5] border border-[#ded7cb] rounded-2xl p-4 space-y-3">
                  <span className="text-xs font-bold text-[#142319] uppercase tracking-wider block">
                    Customization Options Available for this Product
                  </span>

                  {editingProduct.customization.options.length === 0 ? (
                    <div className="py-2 text-xs text-[#6b7770]">
                      No custom options configured yet. Click the button below to add options.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {editingProduct.customization.options.map((opt, idx) => (
                        <div
                          key={opt.id}
                          className="flex items-center gap-2 bg-white p-3 rounded-xl border border-[#ebe5da]"
                        >
                          <div className="flex-1">
                            <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">
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
                              placeholder="e.g. Pocket Monogram Embroidery, HD DTF Back Print"
                              className="w-full bg-white border border-[#ded7cb] rounded-lg px-2.5 py-1.5 text-xs text-[#142319] outline-hidden"
                            />
                          </div>

                          <div className="w-28">
                            <label className="block text-[10px] font-semibold text-[#6b7770] mb-0.5">
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
                            className="p-2 rounded-lg text-[#b84840] hover:bg-[#fdf0ef] transition-colors mt-3 cursor-pointer"
                            title="Remove Option"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add Option Button Placed Below the Last Field, Matching Field Width */}
                  <button
                    type="button"
                    onClick={handleAddCustomization}
                    className="w-full py-2.5 px-4 rounded-xl border border-dashed border-[#206035] bg-white hover:bg-[#eef7f0] text-[#206035] font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-2xs mt-2"
                  >
                    <Plus size={15} />
                    <span>+ Add Customization Option (e.g. Sleeve Monogram, DTF Print)</span>
                  </button>

                  <div className="p-2.5 rounded-xl bg-[#eaf6ec] border border-[#cbe8d1] text-[11px] text-[#246b38] flex items-center gap-1.5 font-medium">
                    <Check size={13} />
                    <span>
                      Customers browsing the storefront will see the <strong>&ldquo;Customization Available&rdquo;</strong> badge on this product card.
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* PRODUCT GUARANTEES & TRUST BADGES (Admin Configurable) */}
            <div className="pt-4 border-t border-[#ebe5da] space-y-3">
              <div>
                <h4 className="text-sm font-bold text-[#142319]">
                  Storefront Badges &amp; Guarantees
                </h4>
                <p className="text-xs text-[#6b7770]">
                  Select which assurance cards are displayed on this product&apos;s details page
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {[
                  {
                    key: 'freeDelivery',
                    label: 'Free Express Delivery',
                    sub: 'Displays "Free Express Delivery Across India"',
                  },
                  {
                    key: 'customizationAvailable',
                    label: 'Customization Available',
                    sub: 'Auto-toggled with Customization switch above, or toggle manually',
                  },
                  {
                    key: 'returnable',
                    label: 'Easy Return & Exchange',
                    sub: 'Displays "Easy Return & Exchange • Doorstep swap"',
                  },
                  {
                    key: 'qualityAssured',
                    label: '100% Quality Assured',
                    sub: 'Displays "100% Pure & Quality Assured Guarantee"',
                  },
                ].map((feat) => {
                  const isChecked =
                    editingProduct.features?.[feat.key as keyof typeof editingProduct.features] ??
                    (feat.key === 'customizationAvailable'
                      ? Boolean(editingProduct.customization?.enabled)
                      : true)

                  return (
                    <label
                      key={feat.key}
                      className={`flex items-start gap-3 p-3 rounded-xl border transition-all cursor-pointer select-none ${
                        isChecked
                          ? 'bg-[#f4f9f5] border-[#1c3624] text-[#142319]'
                          : 'bg-white border-[#ded7cb] text-[#6b7770]'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={(e) => {
                          const nextVal = e.target.checked
                          setEditingProduct({
                            ...editingProduct,
                            features: {
                              freeDelivery: editingProduct.features?.freeDelivery ?? true,
                              customizationAvailable:
                                editingProduct.features?.customizationAvailable ??
                                Boolean(editingProduct.customization?.enabled),
                              returnable: editingProduct.features?.returnable ?? true,
                              qualityAssured: editingProduct.features?.qualityAssured ?? true,
                              [feat.key]: nextVal,
                            },
                          })
                        }}
                        className="mt-0.5 rounded text-[#1c3624] focus:ring-[#1c3624] w-4 h-4 cursor-pointer accent-[#1c3624]"
                      />
                      <div>
                        <span className="text-xs font-bold block">{feat.label}</span>
                        <span className="text-[10px] text-[#6b7770]">{feat.sub}</span>
                      </div>
                    </label>
                  )
                })}
              </div>
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

      {/* MODULE PREVIEW DRAWER WITH REAL RESPONSIVE MOBILE/TABLET VIEWPORT */}
      <ModulePreviewDrawer
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        title="Products & PDP Color-Sync Preview"
        iframeSrc={
          previewTab === 'pdp'
            ? `/products/${previewProductId || filteredProducts[0]?.id || products[0]?.id || '1'}`
            : undefined
        }
      >
        <div className="p-4 sm:p-6 space-y-6 bg-[#faf8f5]">
          {/* Preview View Mode Switcher */}
          <div className="flex items-center justify-between pb-3 border-b border-[#ded7cb] flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPreviewTab('pdp')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'pdp'
                    ? 'bg-[#1c3624] text-white shadow-xs'
                    : 'bg-white border border-[#ded7cb] text-[#556358] hover:text-[#142319]'
                }`}
              >
                📱 Full Interactive PDP (Real Phone Layout)
              </button>
              <button
                type="button"
                onClick={() => setPreviewTab('cards')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  previewTab === 'cards'
                    ? 'bg-[#1c3624] text-white shadow-xs'
                    : 'bg-white border border-[#ded7cb] text-[#556358] hover:text-[#142319]'
                }`}
              >
                🛍️ Storefront Grid Cards
              </button>
            </div>

            {/* Product Selector for PDP Preview */}
            {products.length > 1 && (
              <select
                value={previewProductId || filteredProducts[0]?.id || products[0]?.id}
                onChange={(e) => setPreviewProductId(e.target.value)}
                className="bg-white border border-[#ded7cb] rounded-xl px-2.5 py-1 text-xs text-[#142319] outline-hidden font-medium"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    Preview: {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          {previewTab === 'cards' && (
            <div>
              <h3 className="font-display text-lg font-bold text-[#142319] mb-1">
                Catalog Product Cards Preview
              </h3>
              <p className="text-xs text-[#6b7770] mb-3">
                Shows badges, prices, and the &ldquo;Customization Available&rdquo; label
              </p>
              <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
                {filteredProducts.slice(0, 4).map((p) => (
                  <div key={p.id} className="w-44 sm:w-48 shrink-0">
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
                      customization={p.customization}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ModulePreviewDrawer>
    </div>
  )
}
