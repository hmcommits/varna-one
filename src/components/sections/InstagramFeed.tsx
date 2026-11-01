'use client'
import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

function InstagramIcon({ size = 20, className = '' }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  )
}

const posts = [
  {
    id: 1,
    image:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532667/varna_store/instagram/insta-post-1.webp',
    alt: 'Varna community style 1 - Minimal Black Tee',
  },
  {
    id: 2,
    image:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532668/varna_store/instagram/insta-post-2.webp',
    alt: 'Varna community style 2 - Sage Streetwear Tee',
  },
  {
    id: 3,
    image:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532669/varna_store/instagram/insta-post-3.webp',
    alt: 'Varna community style 3 - Aesthetic Cafe Streetwear',
  },
  {
    id: 4,
    image:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532669/varna_store/instagram/insta-post-4.webp',
    alt: 'Varna community style 4 - 1% Better Everyday Tee',
  },
  {
    id: 5,
    image:
      'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532672/varna_store/instagram/insta-post-5.webp',
    alt: 'Varna community style 5 - F1 Graphic Backprint',
  },
]

export default function InstagramFeed() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const clientWidth = scrollRef.current.clientWidth
    const scrollStep = clientWidth > 500 ? clientWidth * 0.75 : 200
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    })
  }

  const handlePostClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <section className="py-10 md:py-16 px-4 bg-[#faf8f4]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <InstagramIcon size={20} />
          </div>
          <div>
            <p className="font-bold text-sm sm:text-base text-[#1a1a1a]">@varnastore</p>
            <p className="text-xs text-[#7d7062]">Real people. Real style. Tag us to get featured.</p>
          </div>
        </div>

        {/* Carousel with Working Arrows */}
        <div className="relative group/insta">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#1a2e1a] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Posts Track */}
          <div
            ref={scrollRef}
            className="flex gap-3 sm:gap-4 overflow-x-auto no-scrollbar scroll-smooth py-1"
          >
            {posts.map((p) => (
              <div
                key={p.id}
                onClick={handlePostClick}
                className="relative flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-square rounded-2xl overflow-hidden bg-[#e8d5b7] shadow-sm hover:shadow-lg border border-[#e8d5b7]/40 group cursor-pointer select-none transition-all duration-300"
              >
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 288px, 416px"
                  quality={95}
                  unoptimized={true}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                {/* Instagram Overlay on Hover/Tap */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/35 transition-colors flex items-center justify-center backdrop-blur-[1px]">
                  <InstagramIcon
                    size={28}
                    className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white/95 hover:bg-white text-[#1a2e1a] rounded-full flex items-center justify-center shadow-lg border border-[#e8d5b7]/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
