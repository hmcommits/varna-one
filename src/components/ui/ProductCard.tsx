'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Star, Scissors, Eye } from 'lucide-react'
import { ProductColor, CustomizationConfig } from '@/types/store'
import { useStore } from '@/context/StoreContext'

export interface ProductCardProps {
  id: string
  name: string
  image?: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  colors: (string | ProductColor)[]
  badge?: 'None' | 'New' | 'Trending' | 'Bestseller' | 'Flash Sale'
  category?: string
  gender?: string
  customization?: CustomizationConfig
  hasColorPricing?: boolean
  fullWidth?: boolean
  className?: string
}

const badgeStyles: Record<string, string> = {
  New: 'bg-[#1e4a36] text-[#faf8f4]',
  Trending: 'bg-[#c85a44] text-white',
  Bestseller: 'bg-[#c47d2b] text-white',
  'Flash Sale': 'bg-[#8b1e1e] text-white',
}

export default function ProductCard({
  id,
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  colors,
  badge,
  customization,
  hasColorPricing,
  fullWidth = false,
  className = '',
}: ProductCardProps) {
  const router = useRouter()
  const { activeStore, logEnquiry } = useStore()

  // Determine the primary first uploaded image for default card thumbnail
  const firstUploadedImage =
    (typeof colors[0] === 'object' && colors[0]?.image) ||
    image ||
    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'

  // Normalize and deduplicate colors, preserving the first uploaded image for each color
  const normalizedColorsMap = new Map<
    string,
    { hex: string; image?: string; name?: string; price?: number; originalPrice?: number }
  >()
  for (const c of colors) {
    const hex = (typeof c === 'string' ? c : c.hex) || ''
    const key = hex.toLowerCase().trim()
    if (!normalizedColorsMap.has(key)) {
      normalizedColorsMap.set(key, {
        hex,
        image: typeof c === 'string' ? undefined : c.image,
        name: typeof c === 'string' ? c : c.name,
        price: typeof c === 'string' ? undefined : c.price,
        originalPrice: typeof c === 'string' ? undefined : c.originalPrice,
      })
    }
  }
  const normalizedColors = Array.from(normalizedColorsMap.values())

  const [selectedColorIdx, setSelectedColorIdx] = useState<number | null>(null)

  // Current active shown color: user-selected color if clicked, otherwise strictly the first color (index 0)
  const activeColor =
    (selectedColorIdx !== null ? normalizedColors[selectedColorIdx] : normalizedColors[0]) || null
  const displayImage = activeColor?.image || firstUploadedImage

  const isColorPricing = Boolean(hasColorPricing)
  const firstColorWithPrice = normalizedColors.find((c) => c.price && c.price > 0)

  // Dynamically resolve price of the currently shown color
  const effectivePrice =
    isColorPricing && activeColor?.price && activeColor.price > 0
      ? activeColor.price
      : price && price > 0
      ? price
      : activeColor?.price && activeColor.price > 0
      ? activeColor.price
      : firstColorWithPrice?.price || 0

  const effectiveOriginalPrice =
    isColorPricing && activeColor?.originalPrice && activeColor.originalPrice > 0
      ? activeColor.originalPrice
      : originalPrice && originalPrice > 0
      ? originalPrice
      : activeColor?.originalPrice && activeColor.originalPrice > 0
      ? activeColor.originalPrice
      : firstColorWithPrice?.originalPrice || effectivePrice

  const discount =
    effectiveOriginalPrice > effectivePrice
      ? Math.round(((effectiveOriginalPrice - effectivePrice) / effectiveOriginalPrice) * 100)
      : 0

  // Prefetch product page route for instantaneous <50ms navigation on tap/click
  useEffect(() => {
    if (id) {
      router.prefetch(`/products/${id}`)
    }
  }, [id, router])

  const handleCardClick = () => {
    router.push(`/products/${id}`)
  }

  const handleEnquiryClick = () => {
    logEnquiry({
      productName: name,
      color: activeColor?.name || activeColor?.hex || 'Default',
      size: 'Free Size',
      quantity: 1,
      source: 'Product Card',
      completed: false,
    })
  }

  const productUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/products/${id}`
      : `https://varnaclothingin.in/products/${id}`

  const phone = activeStore.whatsapp?.phoneNumber || '916363145972'
  const template =
    activeStore.whatsapp?.templateCard ||
    "Hi Varna! I'd like to enquire about the {product_name} ({price}). Please share availability and delivery timeframe."

  const enquiryMessage = `${template
    .replace('{product_name}', name)
    .replace('{price}', `₹${effectivePrice.toLocaleString('en-IN')}`)}\n• Product Link: ${productUrl}`

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(enquiryMessage)}`

  return (
    <div
      onClick={handleCardClick}
      onMouseEnter={() => router.prefetch(`/products/${id}`)}
      onTouchStart={() => router.prefetch(`/products/${id}`)}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#e8d5b7]/50 hover:border-[#1a2e1a] flex flex-col select-none cursor-pointer ${
        fullWidth ? 'w-full' : 'flex-shrink-0 w-44 sm:w-48 md:w-52'
      } ${className}`}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-[#f0ece4] overflow-hidden">
        <Image
          src={displayImage}
          alt={name}
          fill
          sizes={
            fullWidth
              ? '(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
              : '(max-width: 640px) 176px, 208px'
          }
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Status Badges top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {badge && badge !== 'None' && badgeStyles[badge] && (
            <span
              className={`text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full shadow-sm tracking-wide ${badgeStyles[badge]}`}
            >
              {badge}
            </span>
          )}

          {/* Customization Available Tag (As requested by user) */}
          {customization?.enabled && (
            <span className="inline-flex items-center gap-1 bg-[#1a2e1a]/95 text-[#f4efe6] text-[8.5px] sm:text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm backdrop-blur-xs border border-[#c4a675]/40">
              <Scissors size={9} className="text-[#c4a675]" />
              <span>Custom Available</span>
            </span>
          )}
        </div>


        {/* Quick Action Hover Bar: Details & WhatsApp Buttons */}
        <div className="hidden sm:flex absolute inset-x-2 bottom-2.5 items-center gap-1.5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              handleCardClick()
            }}
            className="flex-1 py-1.5 px-2 bg-white/95 hover:bg-white text-[#1a2e1a] rounded-lg text-[11px] font-bold shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer border border-[#ded7cb]"
            title="View Details"
          >
            <Eye size={12} className="text-[#1a2e1a]" />
            <span>Details</span>
          </button>

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              e.stopPropagation()
              handleEnquiryClick()
            }}
            className="flex-1 py-1.5 px-2 bg-[#1a2e1a]/95 hover:bg-[#25D366] text-white rounded-lg text-[11px] font-bold shadow-md transition-all flex items-center justify-center gap-1 cursor-pointer"
            title="Enquire on WhatsApp"
          >
            <div className="relative w-3 h-3 flex-shrink-0">
              <Image
                src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/icons/whatsapp-icon.webp"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] line-clamp-1 group-hover:text-[#1a2e1a] transition-colors flex items-center gap-1">
              <span>{name}</span>
            </h3>
            <span className="text-[10px] text-[#1a2e1a] font-bold group-hover:translate-x-0.5 transition-transform hidden sm:inline-block">
              →
            </span>
          </div>

          <div className="flex items-baseline gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
              ₹{effectivePrice.toLocaleString('en-IN')}
            </span>
            {effectiveOriginalPrice > effectivePrice && (
              <>
                <span className="text-[11px] text-[#8a7d6e] line-through">
                  ₹{effectiveOriginalPrice.toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] font-bold text-[#c85a44]">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-[#c47d2b] text-[#c47d2b] flex-shrink-0" />
            <span className="text-[10px] font-medium text-[#63574a]">
              {rating} <span className="text-[#9e9080]">({reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Color Swatches (Clicking changes image live!) */}
        <div
          className="flex items-center justify-between pt-1"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-1.5">
            {normalizedColors.map((c, idx) => {
              const isSelected = selectedColorIdx === null ? idx === 0 : selectedColorIdx === idx
              return (
                <button
                  key={c.hex + idx}
                  type="button"
                  onMouseEnter={() => setSelectedColorIdx(idx)}
                  onClick={(e) => {
                    e.stopPropagation()
                    setSelectedColorIdx(idx)
                  }}
                  className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-[#1a2e1a] ring-offset-1 scale-110'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.hex }}
                  title={`${c.name || c.hex}${c.price ? ` - ₹${c.price}` : ''}`}
                />
              )
            })}
          </div>

          <span className="text-[10px] text-[#8a7d6e] font-medium">
            {normalizedColors.length}{' '}
            {normalizedColors.length === 1 ? 'color' : 'colors'}
          </span>
        </div>

        {/* Mobile Action Buttons */}
        <div
          className="sm:hidden mt-2.5 flex items-center gap-1.5"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 py-1.5 px-2 bg-[#1a2e1a] text-white rounded-xl text-[11px] font-semibold active:scale-95 transition-all text-center cursor-pointer"
          >
            Details →
          </button>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleEnquiryClick}
            className="py-1.5 px-2.5 bg-[#25D366]/15 text-[#0f6b3e] rounded-xl text-[11px] font-semibold border border-[#25D366]/35 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            aria-label="Enquire on WhatsApp"
          >
            <div className="relative w-3.5 h-3.5">
              <Image
                src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/icons/whatsapp-icon.webp"
                alt="WhatsApp"
                fill
                className="object-contain"
              />
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
