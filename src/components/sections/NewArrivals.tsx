'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight, Sparkles, X, Search } from 'lucide-react'
import ProductCard from '@/components/ui/ProductCard'
import { useStore } from '@/context/StoreContext'
import { Product } from '@/types/store'

export default function NewArrivals() {
  const {
    activeStore,
    catalogFilter,
    setCatalogFilter,
    searchQuery,
    setSearchQuery,
  } = useStore()
  const scrollRef = useRef<HTMLDivElement>(null)

  const products: Product[] = activeStore.products || []

  // Dynamic filter buttons from active store plus core filters
  const categoryTitles = Array.from(
    new Set([
      'All',
      'Men',
      'Women',
      ...((activeStore.categories || [])
        .filter((c) => c.visible !== false)
        .map((c) => {
          if (c.title.includes('T-Shirt')) return 'T-Shirts'
          if (c.title.includes('Shirt')) return 'Shirts'
          if (c.title.includes('Jeans')) return 'Jeans'
          if (c.title.includes('Dress')) return 'Dresses'
          if (c.title.includes('Top')) return 'Tops'
          if (c.title.includes('Co-ord')) return 'Co-ord Sets'
          return c.title
        })),
      'Shirts',
      'T-Shirts',
      'Jeans',
    ])
  )

  const filteredProducts = products.filter((p) => {
    // 1. Live Search Query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      const matchesSearch =
        p.name.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.gender?.toLowerCase().includes(q)
      if (!matchesSearch) return false
    }

    // 2. Gender or Category Filter
    if (catalogFilter === 'All') return true
    if (catalogFilter === 'Men') return p.gender === 'Men' || p.gender === 'Unisex'
    if (catalogFilter === 'Women') return p.gender === 'Women' || p.gender === 'Unisex'

    // Match category
    return (
      p.category?.toLowerCase() === catalogFilter.toLowerCase() ||
      p.category?.toLowerCase().includes(catalogFilter.toLowerCase())
    )
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

  const showScrollButtons = filteredProducts.length > 3

  return (
    <section id="new-arrivals" className="bg-[#faf8f4] py-10 md:py-16 px-4 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        {/* Section Header with Filter Pills */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-8 gap-4">
          <div>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.25em] uppercase text-[#1a2e1a] mb-1">
              CURATED COLLECTION
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              {catalogFilter === 'All' ? 'New Arrivals & Drops' : `${catalogFilter} Collection`}
            </h2>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            {categoryTitles.map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setCatalogFilter(f)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  f === catalogFilter
                    ? 'bg-[#1a2e1a] text-white shadow-sm'
                    : 'bg-white text-[#63574a] border border-[#e8d5b7]/70 hover:border-[#1a2e1a] hover:text-[#1a2e1a]'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {/* Live Search Indicator Banner */}
        {searchQuery.trim() && (
          <div className="mb-6 bg-white p-3.5 rounded-2xl border border-[#e8d5b7] flex items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-center gap-2 text-xs text-[#1a1a1a]">
              <Search size={14} className="text-[#845d1d]" />
              <span>
                Showing results matching &ldquo;<strong>{searchQuery}</strong>&rdquo;
              </span>
              <span className="text-[10px] bg-[#eef7f0] text-[#206035] font-bold px-2 py-0.5 rounded-full border border-[#d6ecda]">
                {filteredProducts.length} items found
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="flex items-center gap-1 text-[11px] text-[#7d7062] hover:text-[#1a1a1a] font-semibold cursor-pointer"
            >
              <span>Clear search</span>
              <X size={13} />
            </button>
          </div>
        )}

        {/* Content Area */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white rounded-3xl border border-[#e8d5b7]/70 p-8 sm:p-14 text-center max-w-lg mx-auto shadow-xs animate-in fade-in">
            <div className="w-14 h-14 rounded-full bg-[#1a2e1a]/10 text-[#1a2e1a] flex items-center justify-center mx-auto mb-3.5">
              <Sparkles size={22} className="text-[#c4a675]" />
            </div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-[#1a1a1a]">
              {searchQuery.trim()
                ? `No styles found matching "${searchQuery}"`
                : `Coming Soon: ${catalogFilter} Collection`}
            </h3>
            <p className="text-xs text-[#7d7062] mt-2 max-w-sm mx-auto leading-relaxed">
              {searchQuery.trim()
                ? "We couldn't find any designs matching your search term. Try another keyword or browse our full catalogue."
                : `Our studio artisans are currently tailoring fresh ${catalogFilter} designs for our upcoming drop. In the meantime, browse active items or enquire via WhatsApp.`}
            </p>
            <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
              <button
                type="button"
                onClick={() => {
                  setCatalogFilter('All')
                  setSearchQuery('')
                }}
                className="px-5 py-2.5 rounded-xl bg-[#1a2e1a] hover:bg-[#142414] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                View All Active Styles
              </button>
              <a
                href={`https://wa.me/${activeStore.whatsapp?.phoneNumber || '916363145972'}?text=${encodeURIComponent(
                  `Hi Varna! I'm interested in ${catalogFilter} styles. Can you share custom catalogue photos and sizing?`
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all shadow-md cursor-pointer inline-flex items-center gap-1.5"
              >
                <span>WhatsApp Concierge</span>
              </a>
            </div>
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
                  image={
                    p.colors?.[0]?.image ||
                    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'
                  }
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
