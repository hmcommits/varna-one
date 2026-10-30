'use client'
import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Heart, Star, ArrowUpRight } from 'lucide-react'

export interface ProductCardProps {
  id: string
  name: string
  image: string
  price: number
  originalPrice: number
  rating: number
  reviewCount: number
  colors: string[]
  badge?: 'New' | 'Trending' | 'Bestseller'
  category?: string
  gender?: string
}

const badgeStyles = {
  New: 'bg-[#1e4a36] text-[#faf8f4]',
  Trending: 'bg-[#c85a44] text-white',
  Bestseller: 'bg-[#c47d2b] text-white',
}

const WHATSAPP_NUMBER = '916363145972'

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
}: ProductCardProps) {
  const router = useRouter()
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  const isLinenShirt = id === '1'
  const enquiryMessage = `Hi Varna! I'd like to enquire about the ${name} (₹${price.toLocaleString('en-IN')}).`
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(enquiryMessage)}`

  const handleCardClick = () => {
    if (isLinenShirt) {
      router.push('/products/linen-shirt')
    }
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setWishlisted(!wishlisted)
  }

  return (
    <div
      onClick={handleCardClick}
      className={`group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex-shrink-0 w-44 sm:w-48 md:w-52 border flex flex-col select-none ${
        isLinenShirt
          ? 'cursor-pointer border-[#1a2e1a]/40 ring-1 ring-[#1a2e1a]/15 hover:border-[#1a2e1a]'
          : 'cursor-default border-[#e8d5b7]/50 hover:border-[#c4a675]/80'
      }`}
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-[#f0ece4] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 176px, 208px"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Status Badge */}
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-sm tracking-wide ${badgeStyles[badge]}`}
          >
            {badge}
          </span>
        )}

        {/* Demo Indicator Pill for First Product */}
        {isLinenShirt && (
          <span className="absolute bottom-2.5 left-2.5 bg-[#1a2e1a]/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full backdrop-blur-xs flex items-center gap-0.5 shadow-sm sm:opacity-90 group-hover:opacity-100 transition-opacity">
            <span>Demo Page</span>
            <ArrowUpRight size={10} />
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-7 sm:w-8 h-7 sm:h-8 bg-white/90 hover:bg-white text-[#7d7062] rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer backdrop-blur-sm z-10"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-[#c85a44] text-[#c85a44] transition-colors' : 'text-[#7d7062] transition-colors'}
          />
        </button>

        {/* Desktop Quick Enquiry Hover Button */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:flex absolute inset-x-3 bottom-3 items-center justify-center gap-1.5 py-2 px-3 bg-[#1a2e1a]/95 hover:bg-[#25D366] text-white rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 cursor-pointer z-10"
        >
          <div className="relative w-3.5 h-3.5 flex-shrink-0">
            <Image src="/images/icons/whatsapp.webp" alt="WhatsApp" fill className="object-contain" />
          </div>
          <span>Enquire on WhatsApp</span>
        </a>
      </div>

      {/* Product Info */}
      <div className="p-3 sm:p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          <div className="flex items-center justify-between gap-1 mb-1">
            <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] line-clamp-1 group-hover:text-[#1a2e1a] transition-colors flex items-center gap-1">
              <span>{name}</span>
            </h3>
            {isLinenShirt && (
              <span className="text-[10px] text-[#1a2e1a] font-bold group-hover:translate-x-0.5 transition-transform hidden sm:inline-block">
                →
              </span>
            )}
          </div>

          <div className="flex items-baseline gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-[#8a7d6e] line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-bold text-[#c85a44]">
              {discount}% OFF
            </span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-[#c47d2b] text-[#c47d2b] flex-shrink-0" />
            <span className="text-[10px] font-medium text-[#63574a]">
              {rating} <span className="text-[#9e9080]">({reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center justify-between pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1.5">
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedColor(c)}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all cursor-pointer ${
                  selectedColor === c ? 'ring-2 ring-[#1a2e1a] ring-offset-1 scale-110' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
                title={c}
              />
            ))}
          </div>

          <span className="text-[10px] text-[#8a7d6e] font-medium">
            {colors.length} {colors.length === 1 ? 'color' : 'colors'}
          </span>
        </div>

        {/* Mobile Action Buttons */}
        <div className="sm:hidden mt-2.5 flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
          {isLinenShirt ? (
            <>
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
                className="py-1.5 px-2.5 bg-[#25D366]/15 text-[#0f6b3e] rounded-xl text-[11px] font-semibold border border-[#25D366]/35 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
                aria-label="Enquire on WhatsApp"
              >
                <div className="relative w-3.5 h-3.5">
                  <Image src="/images/icons/whatsapp.webp" alt="WhatsApp" fill className="object-contain" />
                </div>
              </a>
            </>
          ) : (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#25D366]/15 hover:bg-[#25D366] text-[#0f6b3e] hover:text-white rounded-xl text-[11px] font-semibold border border-[#25D366]/35 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <div className="relative w-3.5 h-3.5 flex-shrink-0">
                <Image src="/images/icons/whatsapp.webp" alt="WhatsApp" fill className="object-contain" />
              </div>
              <span>Enquire</span>
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
