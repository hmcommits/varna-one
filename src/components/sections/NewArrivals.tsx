'use client'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import ProductCard, { ProductCardProps } from '@/components/ui/ProductCard'

const filters = ['All', 'Men', 'Women', 'Shirts', 'T-Shirts', 'Jeans']

const allProducts: ProductCardProps[] = [
  {
    id: '1',
    name: 'Linen Shirt',
    image: '/images/products/linen-shirt.webp',
    price: 999,
    originalPrice: 1499,
    rating: 4.6,
    reviewCount: 120,
    colors: ['#c4855a', '#4A121A', '#2c4a6e'],
    badge: 'New',
    category: 'Shirts',
    gender: 'Men',
  },
  {
    id: '2',
    name: 'Floral Maxi Dress',
    image: '/images/products/floral-maxi-dress.webp',
    price: 1599,
    originalPrice: 2499,
    rating: 4.6,
    reviewCount: 98,
    colors: ['#d4655a', '#e8a090', '#5a3a5a'],
    badge: 'Trending',
    category: 'Dresses',
    gender: 'Women',
  },
  {
    id: '3',
    name: 'Striped Jersey Tee',
    image: '/images/products/striped-jersey-tee.webp',
    price: 799,
    originalPrice: 1299,
    rating: 4.3,
    reviewCount: 210,
    colors: ['#2c4a6e', '#ffffff', '#1a1a1a'],
    badge: 'Bestseller',
    category: 'T-Shirts',
    gender: 'Men',
  },
  {
    id: '4',
    name: 'Ribbed Crop Top',
    image: '/images/products/ribbed-crop-top.webp',
    price: 699,
    originalPrice: 999,
    rating: 4.5,
    reviewCount: 87,
    colors: ['#e8c4a0', '#c4855a', '#8c6a4a'],
    badge: 'New',
    category: 'Tops',
    gender: 'Women',
  },
  {
    id: '5',
    name: 'Relaxed Fit Jeans',
    image: '/images/products/relaxed-fit-jeans.webp',
    price: 1489,
    originalPrice: 2299,
    rating: 4.8,
    reviewCount: 180,
    colors: ['#2c4a6e', '#4a6a8c', '#1a1a1a'],
    badge: 'Trending',
    category: 'Jeans',
    gender: 'Men',
  },
  {
    id: '6',
    name: 'Printed Co-ord Set',
    image: '/images/products/printed-coord-set.webp',
    price: 1799,
    originalPrice: 2999,
    rating: 4.7,
    reviewCount: 65,
    colors: ['#5a3a2a', '#c4855a', '#4A121A'],
    badge: 'Bestseller',
    category: 'Co-ord Sets',
    gender: 'Women',
  },
]

export default function NewArrivals() {
  const [activeFilter, setActiveFilter] = useState('All')
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredProducts = allProducts.filter((p) => {
    if (activeFilter === 'All') return true
    if (activeFilter === 'Men') return p.gender === 'Men'
    if (activeFilter === 'Women') return p.gender === 'Women'
    if (activeFilter === 'Shirts') return p.category === 'Shirts'
    if (activeFilter === 'T-Shirts') return p.category === 'T-Shirts'
    if (activeFilter === 'Jeans') return p.category === 'Jeans'
    return true
  })

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const clientWidth = scrollRef.current.clientWidth
    const scrollStep = clientWidth > 500 ? clientWidth * 0.75 : 220
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    })
  }

  const handleAction = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <section className="bg-[#faf8f4] py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#4A121A] mb-1">
              JUST IN
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              New Arrivals
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setActiveFilter(f)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  f === activeFilter
                    ? 'bg-[#4A121A] text-white shadow-sm'
                    : 'bg-white text-[#63574a] border border-[#e8d5b7]/70 hover:border-[#4A121A] hover:text-[#4A121A]'
                }`}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAction}
              className="text-xs sm:text-sm text-[#4A121A] font-semibold hover:underline flex items-center gap-1 ml-2 whitespace-nowrap cursor-pointer"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Product Carousel with Smooth Responsive Controls */}
        <div className="relative group/carousel">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#4A121A] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Product Items Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} {...p} />
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#4A121A] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
