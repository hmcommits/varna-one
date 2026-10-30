'use client'
import { useState, useEffect, useCallback, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

const slides = [
  {
    id: 1,
    image: '/images/hero/hero-1.webp',
    badge: 'NEW SEASON',
    title: 'Everyday Style,\nElevated',
    subtitle: 'Modern fits for every mood. From workdays to weekends.',
    scriptText: 'Looks for every you',
    ctaPrimary: 'Shop Men →',
    ctaSecondary: 'Shop Women',
    mobilePosition: 'object-[72%_center]',
  },
  {
    id: 2,
    image: '/images/hero/hero-2.webp',
    badge: 'NEW COLLECTION',
    title: 'Festive Looks,\nRedefined',
    subtitle: 'Celebrate every occasion with style and grace.',
    scriptText: 'Dress to impress',
    ctaPrimary: 'Shop Women →',
    ctaSecondary: 'Shop Men',
    mobilePosition: 'object-[78%_center]',
  },
  {
    id: 3,
    image: '/images/hero/hero-3.webp',
    badge: 'LINEN EDIT',
    title: 'Breathe Easy,\nLook Effortless',
    subtitle: 'Premium linen collection for every season.',
    scriptText: 'Comfort meets class',
    ctaPrimary: 'Shop Now →',
    ctaSecondary: 'View All',
    mobilePosition: 'object-[65%_center]',
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide()
    }, 6500)
    return () => clearInterval(timer)
  }, [nextSlide])

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return
    const distance = touchStartX.current - touchEndX.current
    const isLeftSwipe = distance > 45
    const isRightSwipe = distance < -45

    if (isLeftSwipe) {
      nextSlide()
    } else if (isRightSwipe) {
      prevSlide()
    }
  }

  const handleActionClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <section
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative w-full h-[320px] sm:h-[400px] md:h-[540px] lg:h-[600px] overflow-hidden bg-[#1a2e1a] select-none"
    >
      {/* High-Resolution Background Slides with smooth crossfade */}
      {slides.map((s, idx) => (
        <div
          key={s.id}
          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
            idx === current ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
          }`}
        >
          <Image
            src={s.image}
            alt={s.badge}
            fill
            sizes="100vw"
            quality={95}
            unoptimized={true}
            priority={idx === 0}
            className={`object-cover ${s.mobilePosition} md:object-center transition-all duration-700`}
          />
          {/* Mobile Gradient: darker at the bottom for text legibility, clear top half for models */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent md:hidden" />

          {/* Desktop Gradient: side-gradient from left to right */}
          <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-black/65 via-black/25 to-transparent" />
        </div>
      ))}

      {/* Slide Content */}
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 flex flex-col justify-end md:justify-center pb-12 sm:pb-14 md:pb-0">
        <div className="max-w-md md:max-w-lg text-white">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.2em] sm:tracking-[0.25em] uppercase mb-1 md:mb-2 text-[#e8d5b7]">
            {slides[current].badge}
          </p>
          <h1 className="font-display text-2xl sm:text-3xl md:text-5xl lg:text-6xl font-bold leading-[1.15] mb-1.5 sm:mb-2 md:mb-4 whitespace-pre-line drop-shadow-md">
            {slides[current].title}
          </h1>
          <p className="text-[11px] sm:text-xs md:text-sm lg:text-base text-gray-200 mb-3 sm:mb-4 md:mb-6 leading-relaxed line-clamp-2 md:line-clamp-none max-w-sm md:max-w-md drop-shadow">
            {slides[current].subtitle}
          </p>
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <button
              type="button"
              onClick={handleActionClick}
              className="bg-[#1a2e1a] text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-[#2d4a2d] active:scale-95 transition-all shadow-md cursor-pointer border border-white/10"
            >
              {slides[current].ctaPrimary}
            </button>
            <button
              type="button"
              onClick={handleActionClick}
              className="border border-white/80 backdrop-blur-md bg-black/20 text-white px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 rounded-full text-xs sm:text-sm font-semibold hover:bg-white hover:text-[#1a2e1a] active:scale-95 transition-all cursor-pointer shadow-md"
            >
              {slides[current].ctaSecondary}
            </button>
          </div>
        </div>
      </div>

      {/* Decorative Script text on right (desktop only) */}
      <div className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-10 hidden md:block pointer-events-none select-none">
        <p className="font-display italic text-white text-3xl lg:text-4xl leading-tight text-right opacity-90 drop-shadow">
          {slides[current].scriptText}
        </p>
        <div className="mt-2 flex justify-end">
          <svg width="70" height="20" viewBox="0 0 70 20" className="text-white opacity-70">
            <path d="M0 10 Q35 0 70 10" stroke="currentColor" strokeWidth="1.5" fill="none" />
          </svg>
        </div>
      </div>

      {/* Desktop Navigation Arrows (Far left and far right, cleanly positioned) */}
      <button
        type="button"
        onClick={prevSlide}
        aria-label="Previous slide"
        className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full items-center justify-center backdrop-blur-md border border-white/20 shadow-md active:scale-90 transition-all cursor-pointer"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        type="button"
        onClick={nextSlide}
        aria-label="Next slide"
        className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 bg-black/30 hover:bg-black/50 text-white rounded-full items-center justify-center backdrop-blur-md border border-white/20 shadow-md active:scale-90 transition-all cursor-pointer"
      >
        <ChevronRight size={22} />
      </button>

      {/* Bottom Bar: Slide Indicator Dots + Mobile Navigation Controls */}
      <div className="absolute bottom-3 md:bottom-6 left-4 md:left-10 right-4 md:right-auto z-30 flex items-center justify-between md:justify-start gap-3">
        {/* Dots */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full cursor-pointer ${
                i === current ? 'w-6 sm:w-8 h-1.5 sm:h-2 bg-white' : 'w-1.5 sm:w-2 h-1.5 sm:h-2 bg-white/50 hover:bg-white/80'
              }`}
            />
          ))}
        </div>

        {/* Mobile-only compact arrow buttons in bottom-right corner (never covering text) */}
        <div className="flex md:hidden items-center gap-1.5">
          <button
            type="button"
            onClick={prevSlide}
            aria-label="Previous slide"
            className="w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90 border border-white/20"
          >
            <ChevronLeft size={15} />
          </button>
          <button
            type="button"
            onClick={nextSlide}
            aria-label="Next slide"
            className="w-7 h-7 bg-black/40 text-white rounded-full flex items-center justify-center backdrop-blur-sm active:scale-90 border border-white/20"
          >
            <ChevronRight size={15} />
          </button>
        </div>
      </div>
    </section>
  )
}
