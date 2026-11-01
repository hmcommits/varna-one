'use client'
import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight, ArrowRight, Sparkles } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { useStore } from '@/context/StoreContext'
import { Product } from '@/types/store'

const filters = ['All', 'Men', 'Women', 'Shirts', 'T-Shirts', 'Jeans']

export default function NewArrivals() {
  const { activeStore } = useStore()
  const [activeFilter, setActiveFilter] = useState('All')
  const scrollRef = useRef<HTMLDivElement>(null)

  const products: Product[] = activeStore.products || []

  const filteredProducts = products.filter((p) => {
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

  const showScrollButtons = filteredProducts.length > 3

  return (
    <section className="bg-[#faf8f4] py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#1a2e1a] mb-1">
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
                    ? 'bg-[#1a2e1a] text-white shadow-sm'
                    : 'bg-white text-[#63574a] border border-[#e8d5b7]/70 hover:border-[#1a2e1a] hover:text-[#1a2e1a]'
                }`}
              >
                {f}
              </button>
            ))}
            <button
              type="button"
              onClick={handleAction}
              className="text-xs sm:text-sm text-[#1a2e1a] font-semibold hover:underline flex items-center gap-1 ml-2 whitespace-nowrap cursor-pointer"
            >
              View all <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Content Area */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8d5b7]/60 p-8 sm:p-12 text-center max-w-lg mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-full bg-[#1a2e1a]/10 text-[#1a2e1a] flex items-center justify-center mx-auto mb-3">
              <Sparkles size={20} />
            </div>
            <h3 className="font-display text-base sm:text-lg font-bold text-[#1a1a1a]">
              No styles currently in &ldquo;{activeFilter}&rdquo;
            </h3>
            <p className="text-xs text-[#7d7062] mt-1.5 max-w-sm mx-auto">
              Our curated pieces in this category are being updated. Switch to &ldquo;All&rdquo; or enquire via WhatsApp for custom designs.
            </p>
            <button
              type="button"
              onClick={() => setActiveFilter('All')}
              className="mt-4 px-5 py-2 rounded-xl bg-[#1a2e1a] hover:bg-[#25D366] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              View All Active Styles
            </button>
          </div>
        ) : (
          <div className="relative group/carousel">
            {/* Scroll Left Button */}
            {showScrollButtons && (
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#1a2e1a] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronLeft size={20} />
              </button>
            )}

            {/* Product Items Track */}
            <div
              ref={scrollRef}
              className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
            >
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  name={p.name}
                  image={p.colors?.[0]?.image || '/images/products/linen-shirt.webp'}
                  price={p.price}
                  originalPrice={p.originalPrice}
                  rating={p.rating}
                  reviewCount={p.reviewCount}
                  colors={p.colors}
                  badge={p.badge}
                  category={p.category}
                  gender={p.gender}
                  customization={p.customization}
                />
              ))}
            </div>

            {/* Scroll Right Button */}
            {showScrollButtons && (
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#1a2e1a] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
