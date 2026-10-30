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
  { id: 1, image: '/images/instagram/post-1.webp', alt: 'Community style 1' },
  { id: 2, image: '/images/instagram/post-2.webp', alt: 'Community style 2' },
  { id: 3, image: '/images/instagram/post-3.webp', alt: 'Community style 3' },
  { id: 4, image: '/images/instagram/post-4.webp', alt: 'Community style 4' },
  { id: 5, image: '/images/instagram/post-5.webp', alt: 'Community style 5' },
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
            <p className="text-xs text-gray-500">Real people. Real style. Tag us to get featured.</p>
          </div>
        </div>

        {/* Carousel with Working Arrows */}
        <div className="relative group/insta">
          {/* Left Arrow */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200/80 active:scale-90 transition-all cursor-pointer"
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
                className="relative flex-shrink-0 w-36 sm:w-44 md:w-52 aspect-square rounded-2xl overflow-hidden bg-[#e8d5b7] shadow-sm hover:shadow-md group cursor-pointer select-none"
              >
                <Image
                  src={p.image}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 640px) 144px, 208px"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Instagram Overlay on Hover/Tap */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
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
            className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
