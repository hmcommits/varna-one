'use client'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const categories = [
  { label: 'Shirts', image: '/images/categories/shirts.webp' },
  { label: 'Tops & Blouses', image: '/images/categories/tops-blouses.webp' },
  { label: 'T-Shirts & Jerseys', image: '/images/categories/tshirts-jerseys.webp' },
  { label: 'Dresses', image: '/images/categories/dresses.webp' },
  { label: 'Jeans & Trousers', image: '/images/categories/jeans-trousers.webp' },
  { label: 'Co-ord Sets', image: '/images/categories/coord-sets.webp' },
]

export default function CategoryGrid() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <section className="bg-[#faf8f4] py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex items-end justify-between mb-6 md:mb-8">
          <div>
            <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#1a2e1a] mb-1">
              SHOP BY CATEGORY
            </p>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a]">
              Find Your Style
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClick}
            className="text-xs sm:text-sm text-[#1a2e1a] font-semibold hover:underline flex items-center gap-1 group cursor-pointer"
          >
            View all categories{' '}
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 6 Arch-shaped Category Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 sm:gap-4">
          {categories.map((cat) => (
            <div
              key={cat.label}
              onClick={handleClick}
              className="group block cursor-pointer select-none"
            >
              {/* Arch Shaped Container */}
              <div className="relative overflow-hidden bg-[#e8d5b7] rounded-t-[50%] rounded-b-2xl aspect-[3/4] mb-2.5 shadow-sm group-hover:shadow-md transition-all">
                <Image
                  src={cat.image}
                  alt={cat.label}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 16vw"
                  className="object-cover object-top group-hover:scale-105 transition-transform duration-500"
                />
                {/* Arrow Action Pill Button */}
                <div className="absolute bottom-2.5 right-2.5 w-7 h-7 bg-white/90 group-hover:bg-white text-[#1a2e1a] rounded-full flex items-center justify-center shadow-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <ArrowRight size={13} />
                </div>
              </div>
              <p className="text-xs sm:text-sm font-semibold text-center text-[#1a1a1a] group-hover:text-[#1a2e1a] transition-colors">
                {cat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
