'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Heart,
  Star,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Ruler,
  ChevronRight,
  Minus,
  Plus,
  Share2,
  Check,
  Scissors,
  HelpCircle,
  X,
  ArrowLeft,
  CheckCircle2,
} from 'lucide-react'
import { useStore } from '@/context/StoreContext'
import { defaultStoreData } from '@/data/defaultStoreData'
import { ProductColor } from '@/types/store'


const sizeChartData = [
  { size: 'S', chestIn: '38', chestCm: '96.5', shoulderIn: '17.5', lengthIn: '28.5' },
  { size: 'M', chestIn: '40', chestCm: '101.5', shoulderIn: '18.0', lengthIn: '29.0' },
  { size: 'L', chestIn: '42', chestCm: '106.5', shoulderIn: '18.7', lengthIn: '29.5' },
  { size: 'XL', chestIn: '44', chestCm: '111.5', shoulderIn: '19.5', lengthIn: '30.0' },
  { size: 'XXL', chestIn: '46', chestCm: '117.0', shoulderIn: '20.2', lengthIn: '30.5' },
]

interface ProductDetailsViewProps {
  productId?: string
}

export default function ProductDetailsView({ productId }: ProductDetailsViewProps = {}) {
  const { activeStore, logEnquiry } = useStore()

  // Find product by id (or fallback to linen-shirt / first product)
  const product =
    activeStore.products?.find(
      (p) => p.id === productId || (productId === 'linen-shirt' && p.id === '1')
    ) ||
    activeStore.products?.[0] ||
    defaultStoreData.products[0]

  const colors: ProductColor[] =
    product.colors?.length > 0 ? product.colors : defaultStoreData.products[0].colors

  const availableSizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : ['S', 'M', 'L', 'XL', 'XXL']

  const [selectedColor, setSelectedColor] = useState<ProductColor>(colors[0] || { id: 'c1', name: 'Default', hex: '#111', image: '' })
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [selectedSize, setSelectedSize] = useState(availableSizes[0] || 'M')
  const [quantity, setQuantity] = useState(1)
  const [wishlisted, setWishlisted] = useState(false)
  const [showSizeModal, setShowSizeModal] = useState(false)

  // Customization state
  const hasCustomization = product.customization?.enabled ?? false
  const customOptions = product.customization?.options || []
  const [customEmbroidery, setCustomEmbroidery] = useState(false)
  const [selectedCustomOptionIdx, setSelectedCustomOptionIdx] = useState(0)
  const [customNotes, setCustomNotes] = useState('')

  const [activeTab, setActiveTab] = useState<'details' | 'fabric' | 'shipping' | 'custom'>('details')
  const [copiedLink, setCopiedLink] = useState(false)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Build gallery dynamically from product colors
  const galleryImages = colors.map((c, i) => ({
    src:
      c.image ||
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
    alt: `${product.name} - ${c.name}`,
    label: c.name,
    badge: i === 0 ? 'Front Look' : i === 1 ? 'Fabric & Collar' : 'Editorial Drape',
    colorId: c.id,
  }))

  // Sync color selection -> auto-switch main image
  const handleColorSelect = (c: ProductColor) => {
    setSelectedColor(c)
    const idx = galleryImages.findIndex((g) => g.colorId === c.id)
    if (idx !== -1) {
      setSelectedImageIndex(idx)
    }
  }

  // Sync thumbnail click -> auto-select color
  const handleThumbnailClick = (idx: number) => {
    setSelectedImageIndex(idx)
    const matchedColor = colors.find((c) => c.id === galleryImages[idx]?.colorId)
    if (matchedColor) {
      setSelectedColor(matchedColor)
    }
  }

  // Mobile Touch Gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    if (distance > 45) {
      const nextIdx = (selectedImageIndex + 1) % galleryImages.length
      handleThumbnailClick(nextIdx)
    } else if (distance < -45) {
      const prevIdx = (selectedImageIndex - 1 + galleryImages.length) % galleryImages.length
      handleThumbnailClick(prevIdx)
    }
  }

  const price = product.price || 999
  const originalPrice = product.originalPrice || 1499
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  const activeCustomOption = customOptions[selectedCustomOptionIdx] || customOptions[0]
  const customCost = customEmbroidery ? activeCustomOption?.price || 150 : 0
  const totalPrice = (price + customCost) * quantity

  const whatsappPhone = activeStore.whatsapp?.phoneNumber || '916363145972'

  // Dynamic WhatsApp Concierge Order Link
  const buildWhatsAppMessage = () => {
    const currentUrl =
      typeof window !== 'undefined'
        ? `${window.location.origin}/products/${product.id}`
        : `https://varna.store/products/${product.id}`

    let msg = `Hi Varna! I'd like to order the *${product.name}*:\n\n`
    msg += `• *Color:* ${selectedColor.name}\n`
    msg += `• *Size:* ${selectedSize}\n`
    msg += `• *Quantity:* ${quantity}\n`
    msg += `• *Total Amount:* ₹${totalPrice.toLocaleString('en-IN')}\n`
    msg += `• *Product Link:* ${currentUrl}\n`

    if (customEmbroidery) {
      msg += `• *Custom Request:* ${activeCustomOption?.type || 'Custom Print'} (+₹${activeCustomOption?.price || 150})`
      if (customNotes.trim()) {
        msg += ` — "${customNotes.trim()}"`
      }
      msg += `\n`
    }

    msg += `\nPlease confirm product availability & dispatch timeline!`
    return msg
  }

  const handleOrderClick = () => {
    logEnquiry({
      productName: product.name,
      color: selectedColor.name,
      size: selectedSize,
      quantity,
      customNotes: customEmbroidery
        ? `${activeCustomOption?.type}: ${customNotes || 'Requested'}`
        : undefined,
      source: 'Product Details Page',
      completed: false,
    })
  }

  const productShareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${product.id}`
      : `https://varna.store/products/${product.id}`

  const whatsappOrderUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    buildWhatsAppMessage()
  )}`
  const whatsappQuestionUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
    `Hi Varna! I have a question about the ${product.name} (Size ${selectedSize}, ${selectedColor.name}).\n• Product Link: ${productShareUrl}\nCan you help me with sizing & fabric photos?`
  )}`

  const handleShare = async () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(window.location.href)
        setCopiedLink(true)
        setTimeout(() => setCopiedLink(false), 2500)
      } catch {
        // Fallback
      }
    }
  }

  const safeImageIndex =
    selectedImageIndex < galleryImages.length ? selectedImageIndex : 0
  const currentImage = galleryImages[safeImageIndex] || galleryImages[0]

  return (
    <div className="bg-[#faf8f4] min-h-screen pt-4 sm:pt-8 pb-32 sm:pb-20">
      {/* Breadcrumbs Navigation */}
      <div className="max-w-7xl mx-auto px-4 mb-4 sm:mb-6">
        <nav className="flex items-center gap-1.5 text-xs text-[#7d7062]">
          <Link
            href="/"
            className="hover:text-[#1a2e1a] flex items-center gap-1 transition-colors font-medium"
          >
            <ArrowLeft size={13} />
            <span>Home</span>
          </Link>
          <ChevronRight size={13} className="text-[#c4a675]" />
          <Link href="/#men" className="hover:text-[#1a2e1a] transition-colors font-medium">
            {product.gender || 'Men'}
          </Link>
          <ChevronRight size={13} className="text-[#c4a675]" />
          <Link
            href="/#new-arrivals"
            className="hover:text-[#1a2e1a] transition-colors font-medium"
          >
            {product.category || 'Shirts'}
          </Link>
          <ChevronRight size={13} className="text-[#c4a675]" />
          <span className="text-[#1a1a1a] font-semibold truncate">
            {product.name}
          </span>
        </nav>
      </div>

      {/* Main Product Stage */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* LEFT COLUMN: Multi-angle Product Gallery (lg:col-span-7) */}
          <div className="lg:col-span-7 flex flex-col md:flex-row gap-4">
            {/* Thumbnail Strip: Rock-solid non-collapsing dimensions on all devices */}
            <div className="order-2 md:order-1 flex md:flex-col gap-3 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar shrink-0 max-w-full">
              {galleryImages.map((img, idx) => (
                <button
                  key={`${img.src}-${idx}`}
                  type="button"
                  onClick={() => handleThumbnailClick(idx)}
                  className={`relative w-[76px] min-w-[76px] h-[98px] sm:w-[86px] sm:min-w-[86px] sm:h-[110px] md:w-[92px] md:min-w-[92px] md:h-[118px] rounded-xl sm:rounded-2xl overflow-hidden border-2 transition-all shrink-0 cursor-pointer bg-[#f0ece4] ${
                    safeImageIndex === idx
                      ? 'border-[#1a2e1a] shadow-md ring-2 ring-[#1a2e1a]/25 scale-[1.02]'
                      : 'border-[#e8d5b7]/80 hover:border-[#1a2e1a]/50 opacity-75 hover:opacity-100'
                  }`}
                  aria-label={`View ${img.label}`}
                >
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    sizes="96px"
                    className="object-cover object-top"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-black/65 backdrop-blur-xs text-white text-[9px] text-center py-0.5 font-medium truncate px-1">
                    {img.badge}
                  </div>
                </button>
              ))}
            </div>

            {/* Main Featured Photo Frame */}
            <div
              className="order-1 md:order-2 relative flex-1 aspect-[3/4] sm:aspect-[4/5] md:aspect-[3/4] rounded-2xl sm:rounded-3xl overflow-hidden bg-[#f0ece4] border border-[#e8d5b7]/60 shadow-lg group select-none touch-pan-y"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <Image
                src={currentImage.src}
                alt={currentImage.alt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Badges Over Image */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <span className="bg-[#1a2e1a] text-[#faf8f4] text-xs font-bold px-3 py-1 rounded-full shadow-md tracking-wide">
                  {product.badge || 'New Arrival'}
                </span>
                {discount > 0 && (
                  <span className="bg-[#c85a44] text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full shadow-md">
                    {discount}% OFF
                  </span>
                )}
                {hasCustomization && (
                  <span className="bg-white/90 backdrop-blur-md text-[#1a2e1a] text-[10px] font-semibold px-2.5 py-0.5 rounded-full shadow-sm border border-[#e8d5b7] flex items-center gap-1">
                    <Scissors size={11} className="text-[#c4a675]" />
                    <span>Customization Available</span>
                  </span>
                )}
              </div>

              {/* Wishlist & Share Floating Buttons */}
              <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                <button
                  type="button"
                  onClick={() => setWishlisted(!wishlisted)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
                  className="w-10 h-10 bg-white/90 hover:bg-white text-[#7d7062] rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer backdrop-blur-md"
                >
                  <Heart
                    size={18}
                    className={
                      wishlisted
                        ? 'fill-[#c85a44] text-[#c85a44] transition-colors'
                        : 'text-[#7d7062] transition-colors'
                    }
                  />
                </button>
                <button
                  type="button"
                  onClick={handleShare}
                  aria-label="Share product"
                  className="w-10 h-10 bg-white/90 hover:bg-white text-[#7d7062] rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer backdrop-blur-md relative"
                >
                  {copiedLink ? (
                    <Check size={18} className="text-[#1a2e1a]" />
                  ) : (
                    <Share2 size={18} />
                  )}
                  {copiedLink && (
                    <span className="absolute -bottom-8 right-0 bg-[#1a2e1a] text-white text-[10px] px-2 py-0.5 rounded whitespace-nowrap shadow-lg">
                      Link copied!
                    </span>
                  )}
                </button>
              </div>

              {/* Subtle visual caption footer */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-4 sm:p-6 text-white flex items-end justify-between pointer-events-none">
                <div>
                  <p className="text-xs uppercase tracking-widest text-[#e8d5b7] font-semibold">
                    {currentImage.label}
                  </p>
                  <p className="text-sm font-medium opacity-90 hidden sm:block">
                    Natural Breathable Weave • Enzyme Softened
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex sm:hidden items-center gap-1.5 bg-black/40 backdrop-blur-md px-2 py-1 rounded-full">
                    {galleryImages.map((_, dotIdx) => (
                      <span
                        key={dotIdx}
                        className={`h-1.5 rounded-full transition-all ${
                          safeImageIndex === dotIdx ? 'w-4 bg-white' : 'w-1.5 bg-white/50'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-medium">
                    {safeImageIndex + 1} of {galleryImages.length}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Product Configurator & Concierge Actions (lg:col-span-5) */}
          <div className="lg:col-span-5 flex flex-col">
            {/* Brand & Category Tag */}
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#1a2e1a]">
                {product.category || 'VARNA LUXURY'} • {product.gender || 'UNISEX'}
              </span>
              <span className="text-xs font-medium text-[#7d7062]">
                Ref: <span className="font-mono text-[#1a1a1a]">VAR-{product.id.slice(-6).toUpperCase()}</span>
              </span>
            </div>

            {/* Product Title */}
            <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1a1a1a] leading-tight mb-2">
              {product.name}
            </h1>

            {/* Tagline / Subtitle */}
            <p className="text-xs sm:text-sm text-[#7d7062] mb-3 leading-relaxed">
              {product.description || 'Crafted with premium materials. Relaxed modern fit tailored for all-day comfort.'}
            </p>

            {/* Star Rating & Review Count */}
            <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#e8d5b7]/50">
              <div className="flex items-center gap-1 bg-[#1a2e1a]/10 px-2.5 py-1 rounded-full">
                <Star size={13} className="fill-[#c47d2b] text-[#c47d2b]" />
                <span className="text-xs font-bold text-[#1a2e1a]">{product.rating || 4.6}</span>
              </div>
              <span className="text-xs text-[#7d7062]">
                <strong className="text-[#1a1a1a] font-semibold">
                  {product.reviewCount || 120} verified reviews
                </strong>{' '}
                • 96% fit as expected
              </span>
            </div>

            {/* Price Showcase */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8d5b7]/60 shadow-xs mb-5">
              <div className="flex items-baseline gap-3 mb-1">
                <span className="font-display text-3xl sm:text-4xl font-bold text-[#1a1a1a]">
                  ₹{price.toLocaleString('en-IN')}
                </span>
                {originalPrice > price && (
                  <>
                    <span className="text-base sm:text-lg text-[#8a7d6e] line-through">
                      ₹{originalPrice.toLocaleString('en-IN')}
                    </span>
                    <span className="bg-[#c85a44]/10 text-[#c85a44] text-xs font-bold px-2 py-0.5 rounded-full">
                      Save ₹{(originalPrice - price).toLocaleString('en-IN')} ({discount}%)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-[#7d7062] flex items-center gap-1.5">
                <span className="text-[#1a2e1a] font-semibold">✓ Inclusive of all taxes</span>
                <span>•</span>
                <span>Free express door delivery across India</span>
              </p>
            </div>

            {/* COLOR SELECTOR (Clicking updates color & auto-switches main image!) */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">
                  Select Color:{' '}
                  <span className="text-[#1a2e1a] font-bold">{selectedColor.name}</span>
                </label>
                <span className="text-[11px] text-[#7d7062]">
                  {colors.length} shades available
                </span>
              </div>
              <div className="flex items-center gap-2.5 flex-wrap">
                {colors.map((c) => (
                  <button
                    key={c.id || c.name}
                    type="button"
                    onClick={() => handleColorSelect(c)}
                    className={`group relative flex items-center gap-2 px-3 py-2 rounded-xl border text-xs font-medium transition-all cursor-pointer ${
                      selectedColor.id === c.id || selectedColor.name === c.name
                        ? 'border-[#1a2e1a] bg-[#1a2e1a]/5 text-[#1a2e1a] shadow-xs ring-1 ring-[#1a2e1a]'
                        : 'border-[#e8d5b7]/80 bg-white text-[#63574a] hover:border-[#1a2e1a]/40'
                    }`}
                  >
                    <span
                      className="w-4 h-4 rounded-full border border-black/15 shadow-inner"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="mb-5">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">
                  Select Size:{' '}
                  <span className="text-[#1a2e1a] font-bold">{selectedSize}</span>
                </label>
                <button
                  type="button"
                  onClick={() => setShowSizeModal(true)}
                  className="text-xs text-[#1a2e1a] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <Ruler size={13} />
                  <span>Size Guide</span>
                </button>
              </div>

              {/* Size Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {availableSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`py-2 px-3.5 rounded-xl text-xs sm:text-sm font-bold border transition-all text-center flex items-center justify-center cursor-pointer min-w-[44px] ${
                      selectedSize === sz
                        ? 'bg-[#1a2e1a] text-white border-[#1a2e1a] shadow-md scale-[1.02]'
                        : 'bg-white text-[#1a1a1a] border-[#e8d5b7]/80 hover:border-[#1a2e1a] hover:text-[#1a2e1a]'
                    }`}
                  >
                    <span>{sz}</span>
                  </button>
                ))}
              </div>

              {/* Stock status indicator */}
              <div className="flex items-center justify-between text-[11px] text-[#7d7062] pt-1">
                <p className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#25D366] inline-block animate-pulse" />
                  <span>
                    Stock urgency:{' '}
                    <span className="text-[#1a2e1a] font-semibold">
                      {product.stockUrgency || 'In Stock'}
                    </span>
                  </span>
                </p>
              </div>
            </div>

            {/* QUANTITY & CUSTOMIZATION OPTION */}
            <div className="space-y-4 mb-6">
              {/* Quantity row */}
              <div className="flex items-center justify-between bg-white rounded-xl p-3 border border-[#e8d5b7]/60">
                <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">
                  Quantity
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    disabled={quantity <= 1}
                    className="w-8 h-8 rounded-lg bg-[#faf8f4] hover:bg-[#e8d5b7]/40 text-[#1a1a1a] flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="font-display font-bold text-base text-[#1a1a1a] min-w-[20px] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(10, quantity + 1))}
                    disabled={quantity >= 10}
                    className="w-8 h-8 rounded-lg bg-[#faf8f4] hover:bg-[#e8d5b7]/40 text-[#1a1a1a] flex items-center justify-center transition-colors disabled:opacity-40 cursor-pointer"
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Varna Custom Print / Embroidery Add-On */}
              {hasCustomization && (
                <div className="bg-[#faf8f4] border border-[#e8d5b7] rounded-xl p-3.5 space-y-2.5">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={customEmbroidery}
                      onChange={(e) => setCustomEmbroidery(e.target.checked)}
                      className="mt-0.5 rounded text-[#1a2e1a] focus:ring-[#1a2e1a] w-4 h-4 cursor-pointer accent-[#1a2e1a]"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs sm:text-sm font-semibold text-[#1a1a1a]">
                          {activeCustomOption?.type || 'Add Custom Print / Embroidery'}
                        </span>
                        <span className="text-[10px] bg-[#1a2e1a] text-white px-2 py-0.5 rounded-full font-bold">
                          +₹{activeCustomOption?.price || 150}
                        </span>
                      </div>
                      <p className="text-[11px] text-[#7d7062] mt-0.5">
                        Get custom initials on cuff, pocket emblem, or DTF high-density graphic.
                      </p>
                    </div>
                  </label>

                  {customEmbroidery && (
                    <div className="pt-2 border-t border-[#e8d5b7]/60 space-y-2">
                      {customOptions.length > 1 && (
                        <div className="flex items-center gap-2 flex-wrap">
                          {customOptions.map((opt, idx) => (
                            <button
                              key={opt.id}
                              type="button"
                              onClick={() => setSelectedCustomOptionIdx(idx)}
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                                selectedCustomOptionIdx === idx
                                  ? 'bg-[#1a2e1a] text-white border-[#1a2e1a]'
                                  : 'bg-white text-[#63574a] border-[#e8d5b7]'
                              }`}
                            >
                              <span>{opt.type}</span>
                              <span className="ml-1 opacity-80">(+₹{opt.price})</span>
                            </button>
                          ))}
                        </div>
                      )}
                      <input
                        type="text"
                        value={customNotes}
                        onChange={(e) => setCustomNotes(e.target.value)}
                        placeholder="e.g., Initials 'HB' on left cuff (Thread: Champagne Gold)"
                        className="w-full bg-white border border-[#e8d5b7] rounded-lg px-3 py-2 text-xs text-[#1a1a1a] placeholder-[#9e9080] focus:outline-hidden focus:border-[#1a2e1a]"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS (WHATSAPP DIRECT ORDER FLOW) */}
            <div className="space-y-3 mb-6">
              {/* Primary Direct WhatsApp Order CTA */}
              <a
                href={whatsappOrderUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="group relative w-full flex items-center justify-center gap-3 py-3.5 sm:py-4 px-6 bg-[#1a2e1a] hover:bg-[#25D366] text-white rounded-2xl text-sm sm:text-base font-bold shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300 cursor-pointer overflow-hidden"
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  <Image
                    src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/icons/whatsapp-icon.webp"
                    alt="WhatsApp"
                    fill
                    className="object-contain"
                  />
                </div>
                <span>Order via WhatsApp • ₹{totalPrice.toLocaleString('en-IN')}</span>
                <Sparkles size={16} className="text-[#e8d5b7] group-hover:text-white transition-colors" />
              </a>

              {/* Secondary Instant Query CTA */}
              <a
                href={whatsappQuestionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={handleOrderClick}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-[#faf8f4] text-[#1a2e1a] rounded-xl text-xs sm:text-sm font-semibold border border-[#e8d5b7] hover:border-[#1a2e1a] shadow-xs transition-all cursor-pointer"
              >
                <HelpCircle size={15} />
                <span>Ask a Question / Request Fabric Video Sample</span>
              </a>
            </div>

            {/* Trust Badges 4-Grid */}
            <div className="grid grid-cols-2 gap-3 py-4 border-t border-b border-[#e8d5b7]/50 mb-6 bg-white/60 rounded-xl p-3">
              <div className="flex items-center gap-2.5">
                <Truck size={17} className="text-[#1a2e1a] flex-shrink-0" />
                <span className="text-[11px] text-[#63574a] leading-tight">
                  <strong className="text-[#1a1a1a] block">Free Express Delivery</strong> Across India
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <RotateCcw size={17} className="text-[#1a2e1a] flex-shrink-0" />
                <span className="text-[11px] text-[#63574a] leading-tight">
                  <strong className="text-[#1a1a1a] block">7-Day Easy Exchange</strong> Size swaps at your door
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Scissors size={17} className="text-[#1a2e1a] flex-shrink-0" />
                <span className="text-[11px] text-[#63574a] leading-tight">
                  <strong className="text-[#1a1a1a] block">Custom Tailoring</strong> Prints &amp; monograms
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <ShieldCheck size={17} className="text-[#1a2e1a] flex-shrink-0" />
                <span className="text-[11px] text-[#63574a] leading-tight">
                  <strong className="text-[#1a1a1a] block">100% Pure Flax Linen</strong> Pre-washed &amp; softened
                </span>
              </div>
            </div>

            {/* DETAILED TABS SECTION */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#e8d5b7]/60 shadow-xs">
              <div className="flex items-center gap-2 border-b border-[#e8d5b7]/50 pb-2 mb-4 overflow-x-auto no-scrollbar">
                {[
                  { key: 'details', label: 'Details & Fit' },
                  { key: 'fabric', label: 'Fabric & Care' },
                  { key: 'custom', label: 'Custom Prints' },
                  { key: 'shipping', label: 'Shipping & Returns' },
                ].map((t) => (
                  <button
                    key={t.key}
                    type="button"
                    onClick={() => setActiveTab(t.key as typeof activeTab)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                      activeTab === t.key
                        ? 'bg-[#1a2e1a] text-white shadow-xs'
                        : 'text-[#63574a] hover:text-[#1a2e1a] hover:bg-[#faf8f4]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="text-xs sm:text-sm text-[#63574a] space-y-2.5 leading-relaxed">
                {activeTab === 'details' && (
                  <div className="space-y-3">
                    {product.description && (
                      <p className="text-xs sm:text-sm text-[#1a1a1a] leading-relaxed bg-[#faf8f4] p-3 rounded-xl border border-[#e8d5b7]/60">
                        {product.description}
                      </p>
                    )}
                    <ul className="space-y-1.5 list-disc list-inside">
                      <li>
                        <strong className="text-[#1a1a1a]">Fit:</strong> Relaxed regular fit crafted to drape cleanly without restricting mobility.
                      </li>
                      <li>
                        <strong className="text-[#1a1a1a]">Category:</strong> {product.category || 'Apparel'} • {product.gender || 'Unisex'}
                      </li>
                      <li>
                        <strong className="text-[#1a1a1a]">Stock Urgency:</strong> {product.stockUrgency || 'In Stock'}
                      </li>
                    </ul>
                  </div>
                )}

                {activeTab === 'fabric' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-[#1a1a1a]">Composition:</strong> 100% natural European flax linen fibers.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Weight:</strong> 160 GSM lightweight summer weave for maximum breathability.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Finish:</strong> Pre-washed and enzyme softened to prevent shrinking and itchiness.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Care:</strong> Gentle cold machine wash or hand wash with mild detergent. Line dry in shade. Warm iron while slightly damp.
                    </li>
                  </ul>
                )}

                {activeTab === 'custom' && (
                  <div className="space-y-2">
                    <p>
                      At <strong className="text-[#1a1a1a]">Varna</strong>, we specialize in personalized wear. You can order this shirt as is, or customize it:
                    </p>
                    <ul className="space-y-1 list-disc list-inside text-[11px] sm:text-xs">
                      <li>Pocket or cuff monogram embroidery (names, initials, motifs).</li>
                      <li>High-density DTF prints for startup founder wear, college reunions, or destination weddings.</li>
                      <li>Special bulk discounts starting from 5+ units.</li>
                    </ul>
                    <a
                      href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                        "Hi Varna! I'm interested in custom printing / embroidery for the Linen Shirt. Can we discuss options and bulk pricing?"
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-[#1a2e1a] font-bold hover:underline pt-1"
                    >
                      Chat with our custom printing specialist →
                    </a>
                  </div>
                )}

                {activeTab === 'shipping' && (
                  <ul className="space-y-1.5 list-disc list-inside">
                    <li>
                      <strong className="text-[#1a1a1a]">Dispatch:</strong> Ready stock dispatches within 24–48 hours from our studio.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Delivery:</strong> 2–4 business days for metro cities; 3–6 days rest of India via Delhivery / Bluedart.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Exchanges:</strong> Easy 7-day doorstep size swap if the fit isn&apos;t 100% perfect.
                    </li>
                    <li>
                      <strong className="text-[#1a1a1a]">Payment:</strong> UPI, Credit/Debit cards, Net Banking, or Cash on Delivery (COD) supported upon WhatsApp order confirmation.
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* VERIFIED CUSTOMER REVIEWS SECTION */}
        <section className="mt-14 sm:mt-20 pt-10 border-t border-[#e8d5b7]/60">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#1a2e1a] mb-1">
                  COMMUNITY FEEDBACK
                </p>
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#1a1a1a]">
                  Customer Reviews
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 bg-[#1a2e1a] text-white px-3 py-1.5 rounded-xl font-bold text-sm shadow-sm">
                  <Star size={14} className="fill-[#e8d5b7] text-[#e8d5b7]" />
                  <span>{activeStore.reviews?.averageRating || 4.6} / 5.0</span>
                </div>
                <span className="text-xs text-[#7d7062]">
                  Based on {activeStore.reviews?.totalReviewsCount || 120} verified orders
                </span>
              </div>
            </div>

            {/* Review Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {(activeStore.reviews?.items || []).slice(0, 3).map((rev) => (
                <div
                  key={rev.id}
                  className="bg-white rounded-2xl p-5 border border-[#e8d5b7]/60 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex text-amber-500">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            size={12}
                            className={
                              s <= rev.rating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                            }
                          />
                        ))}
                      </div>
                      {rev.verified && (
                        <span className="inline-flex items-center gap-1 text-[9px] font-bold text-emerald-800 bg-emerald-100/70 border border-emerald-300 px-2 py-0.5 rounded-full">
                          <CheckCircle2 size={10} />
                          <span>Verified</span>
                        </span>
                      )}
                    </div>
                    {rev.title && (
                      <h4 className="font-display font-bold text-xs text-[#1a1a1a] mb-1">
                        &quot;{rev.title}&quot;
                      </h4>
                    )}
                    <p className="text-xs text-[#63574a] leading-relaxed mb-3">
                      &quot;{rev.comment}&quot;
                    </p>
                  </div>
                  <div className="pt-2 border-t border-[#f0ece4] text-[11px] text-[#7d7062] flex items-center justify-between">
                    <span className="font-bold text-[#1a1a1a]">{rev.name}</span>
                    <span>{rev.city}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PAIR IT WITH SECTION */}
        {activeStore.products?.filter((p) => p.id !== product.id).length > 0 ? (
          <section className="mt-14 sm:mt-20 pt-10 border-t border-[#e8d5b7]/60">
            <div className="flex items-end justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#1a2e1a] mb-1">
                  COMPLETE THE LOOK
                </p>
                <h2 className="font-display text-xl sm:text-2xl font-bold text-[#1a1a1a]">
                  Pairs Naturally With
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {activeStore.products
                .filter((p) => p.id !== product.id)
                .slice(0, 3)
                .map((p) => (
                  <div
                    key={p.id}
                    className="bg-white rounded-2xl p-3 border border-[#e8d5b7]/60 flex items-center gap-3 shadow-xs hover:shadow-md transition-shadow"
                  >
                    <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-[#f0ece4] shrink-0">
                      <Image
                        src={
                          p.colors?.[0]?.image ||
                          'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'
                        }
                        alt={p.name}
                        fill
                        sizes="64px"
                        className="object-cover object-top"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] text-[#c4a675] font-bold uppercase tracking-wider block truncate">
                        {p.category}
                      </span>
                      <h4 className="font-display text-xs sm:text-sm font-bold text-[#1a1a1a] truncate">
                        {p.name}
                      </h4>
                      <div className="flex items-baseline gap-1.5 mt-0.5">
                        <span className="text-xs font-bold text-[#1a1a1a]">
                          ₹{p.price.toLocaleString('en-IN')}
                        </span>
                        {p.originalPrice > p.price && (
                          <span className="text-[10px] text-[#8a7d6e] line-through">
                            ₹{p.originalPrice.toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                      <a
                        href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                          `Hi Varna! I'm interested in ordering the ${p.name} alongside the ${product.name}.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] text-[#1a2e1a] font-bold hover:underline mt-1"
                      >
                        Enquire Pair →
                      </a>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        ) : (
          <section className="mt-14 sm:mt-20 pt-10 border-t border-[#e8d5b7]/60">
            <div className="bg-white rounded-3xl border border-[#e8d5b7]/60 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-2xl bg-[#1a2e1a] text-white flex items-center justify-center flex-shrink-0">
                  <Sparkles size={22} className="text-[#e8d5b7]" />
                </div>
                <div>
                  <h3 className="font-display text-base sm:text-lg font-bold text-[#1a1a1a]">
                    Looking for styling advice or custom pair recommendations?
                  </h3>
                  <p className="text-xs text-[#7d7062] mt-0.5">
                    Our studio stylists are online daily on WhatsApp to help with fabric swatches, sizing, and personalized matching.
                  </p>
                </div>
              </div>
              <a
                href={whatsappQuestionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-full bg-[#1a2e1a] hover:bg-[#25D366] text-white text-xs font-bold transition-all shadow-md whitespace-nowrap cursor-pointer flex-shrink-0"
              >
                Chat with Stylist →
              </a>
            </div>
          </section>
        )}
      </div>

      {/* SIZE CHART MODAL POPUP */}
      {showSizeModal && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setShowSizeModal(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-[#e8d5b7] relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#e8d5b7]/60">
              <div className="flex items-center gap-2">
                <Ruler size={18} className="text-[#1a2e1a]" />
                <h3 className="font-display text-lg font-bold text-[#1a1a1a]">
                  Linen Shirt Size Guide
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowSizeModal(false)}
                className="w-8 h-8 rounded-full bg-[#faf8f4] hover:bg-[#e8d5b7]/40 text-[#7d7062] flex items-center justify-center cursor-pointer transition-colors"
                aria-label="Close size guide"
              >
                <X size={18} />
              </button>
            </div>

            {/* Measurement Chart Table */}
            <div className="overflow-x-auto mb-4">
              <table className="w-full text-xs text-left">
                <thead className="bg-[#faf8f4] text-[#1a1a1a] font-bold border-b border-[#e8d5b7]">
                  <tr>
                    <th className="py-2.5 px-3">Size</th>
                    <th className="py-2.5 px-3">Chest (In)</th>
                    <th className="py-2.5 px-3">Chest (Cm)</th>
                    <th className="py-2.5 px-3">Shoulder (In)</th>
                    <th className="py-2.5 px-3">Length (In)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e8d5b7]/50 text-[#63574a]">
                  {sizeChartData.map((row) => (
                    <tr
                      key={row.size}
                      className={
                        row.size === selectedSize
                          ? 'bg-[#1a2e1a]/5 font-semibold text-[#1a2e1a]'
                          : ''
                      }
                    >
                      <td className="py-2 px-3 font-bold">{row.size}</td>
                      <td className="py-2 px-3">{row.chestIn}&quot;</td>
                      <td className="py-2 px-3">{row.chestCm} cm</td>
                      <td className="py-2 px-3">{row.shoulderIn}&quot;</td>
                      <td className="py-2 px-3">{row.lengthIn}&quot;</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Sizing Tips */}
            <div className="bg-[#faf8f4] p-3.5 rounded-xl text-[11px] text-[#63574a] space-y-1 mb-5 border border-[#e8d5b7]/50">
              <p className="font-semibold text-[#1a1a1a]">How to Measure:</p>
              <p>• <strong>Chest:</strong> Measure around fullest part of chest under arms.</p>
              <p>• <strong>Length:</strong> Measure from highest point of shoulder to hem.</p>
              <p>• <strong>Fit:</strong> Standard regular fit. For relaxed oversized streetwear, choose one size up.</p>
            </div>

            {/* WhatsApp direct size help */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#7d7062]">Confused about your size?</span>
              <a
                href={`https://wa.me/${whatsappPhone}?text=${encodeURIComponent(
                  "Hi Varna! I'm not sure which size of the Linen Shirt to choose. My chest is around __ inches. Can you guide me?"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#1a2e1a] font-bold hover:underline flex items-center gap-1"
              >
                Ask our stylist on WhatsApp →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
