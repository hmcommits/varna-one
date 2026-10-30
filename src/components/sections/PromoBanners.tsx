'use client'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

export default function PromoBanners() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <section className="py-6 md:py-10 px-4 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {/* Men Banner */}
        <div className="relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-[#c4a882] shadow-sm group">
          <Image
            src="/images/banners/men-banner.webp"
            alt="Effortless Everyday Fits"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white max-w-xs">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight drop-shadow-sm">
              Effortless<br />Everyday Fits
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 mb-4 sm:mb-5 leading-relaxed">
              Shirts, tees, jeans and more<br />for the modern man.
            </p>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-white text-[#1a2e1a] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-[#f0ece4] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Shop Men <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Women Banner */}
        <div className="relative h-64 sm:h-72 md:h-80 rounded-2xl overflow-hidden bg-[#d4b896] shadow-sm group">
          <Image
            src="/images/banners/women-banner.webp"
            alt="Style Without Limits"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/65 via-black/35 to-transparent" />
          <div className="absolute bottom-6 sm:bottom-8 left-6 sm:left-8 text-white max-w-xs">
            <h3 className="font-display text-2xl sm:text-3xl font-bold mb-2 leading-tight drop-shadow-sm">
              Style<br />Without Limits
            </h3>
            <p className="text-xs sm:text-sm text-gray-200 mb-4 sm:mb-5 leading-relaxed">
              Dresses, tops, co-ords<br />and more for every you.
            </p>
            <button
              type="button"
              onClick={handleClick}
              className="inline-flex items-center gap-2 bg-white text-[#1a2e1a] px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold hover:bg-[#f0ece4] active:scale-95 transition-all shadow-md cursor-pointer"
            >
              Shop Women <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
