'use client'
import { useState } from 'react'
import Image from 'next/image'
import { Heart, Star } from 'lucide-react'

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
  New: 'bg-[#2d6a4f] text-white',
  Trending: 'bg-[#e05c4b] text-white',
  Bestseller: 'bg-[#d4650a] text-white',
}

export default function ProductCard({
  name,
  image,
  price,
  originalPrice,
  rating,
  reviewCount,
  colors,
  badge,
}: ProductCardProps) {
  const [wishlisted, setWishlisted] = useState(false)
  const [selectedColor, setSelectedColor] = useState(colors[0])
  const discount = Math.round(((originalPrice - price) / originalPrice) * 100)

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setWishlisted(!wishlisted)
  }

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex-shrink-0 w-44 sm:w-48 md:w-52 border border-gray-100 flex flex-col cursor-pointer select-none"
    >
      {/* Product Image Frame */}
      <div className="relative aspect-[3/4] bg-[#f0ece4] overflow-hidden">
        <Image
          src={image}
          alt={name}
          fill
          sizes="(max-width: 640px) 176px, 208px"
          className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Status Badge */}
        {badge && (
          <span
            className={`absolute top-2.5 left-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm tracking-wide ${badgeStyles[badge]}`}
          >
            {badge}
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-2.5 right-2.5 w-7 sm:w-8 h-7 sm:h-8 bg-white/90 hover:bg-white text-gray-700 rounded-full flex items-center justify-center shadow-md active:scale-90 transition-all cursor-pointer"
        >
          <Heart
            size={14}
            className={wishlisted ? 'fill-red-500 text-red-500 transition-colors' : 'text-gray-600 transition-colors'}
          />
        </button>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-xs sm:text-sm font-semibold text-[#1a1a1a] mb-1 line-clamp-1 group-hover:text-[#1a2e1a] transition-colors">
            {name}
          </h3>

          <div className="flex items-baseline gap-1.5 mb-1.5 flex-wrap">
            <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
              ₹{price.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-gray-400 line-through">
              ₹{originalPrice.toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] font-bold text-[#e05c4b]">
              {discount}% OFF
            </span>
          </div>

          <div className="flex items-center gap-1 mb-2">
            <Star size={11} className="fill-amber-400 text-amber-400 flex-shrink-0" />
            <span className="text-[10px] font-medium text-gray-600">
              {rating} <span className="text-gray-400">({reviewCount})</span>
            </span>
          </div>
        </div>

        {/* Color Swatches */}
        <div className="flex items-center gap-1.5 pt-1" onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  )
}
