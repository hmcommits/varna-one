'use client'
import { useRef } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'

const reviews = [
  {
    id: 1,
    name: 'Rohan S., Bengaluru',
    text: 'Amazing quality and perfect fit! The fabric is so comfortable and the designs are just wow. Will definitely shop again.',
    rating: 5,
  },
  {
    id: 2,
    name: 'Priya M., Mumbai',
    text: 'Loved the linen shirt and floral maxi dress. True to Indian sizes, rich fabrics, and delivered in just 2 days!',
    rating: 5,
  },
  {
    id: 3,
    name: 'Ankit V., Delhi',
    text: 'Finally a brand that gets everyday men’s fashion right without breaking the bank. The co-ord set looks even better in person.',
    rating: 5,
  },
  {
    id: 4,
    name: 'Sneha K., Pune',
    text: 'The crop top and relaxed jeans pair so well! Super flattering cut and the colors stay vibrant even after multiple washes.',
    rating: 4,
  },
  {
    id: 5,
    name: 'Vikram D., Hyderabad',
    text: 'Breathable linen, premium stitching, and hassle-free exchange service. Highly recommend Varna for daily elevated wear.',
    rating: 5,
  },
]

export default function CustomerReviews() {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const clientWidth = scrollRef.current.clientWidth
    const scrollStep = clientWidth > 400 ? clientWidth * 0.8 : 280
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -scrollStep : scrollStep,
      behavior: 'smooth',
    })
  }

  return (
    <section className="bg-white py-10 md:py-16 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* Left Rating Summary */}
        <div className="md:col-span-4">
          <p className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#1a2e1a] mb-1">
            TESTIMONIALS
          </p>
          <h3 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-3">
            What our community says
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  size={18}
                  className="fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <span className="text-base font-bold text-gray-800">4.7 / 5</span>
          </div>
          <p className="text-xs text-gray-500">Based on 2,500+ verified customer reviews across India.</p>
        </div>

        {/* Right - Interactive Review Cards Track with Working Arrows */}
        <div className="md:col-span-8 relative">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scroll('left')}
            aria-label="Previous review"
            className="absolute left-1 sm:-left-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>

          {/* Cards Track */}
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1"
          >
            {reviews.map((r) => (
              <div
                key={r.id}
                className="flex-shrink-0 w-72 sm:w-80 bg-[#faf8f4] rounded-2xl p-5 sm:p-6 border border-gray-200/70 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <Quote size={28} className="text-[#1a2e1a]/30 mb-3" />
                  <p className="text-xs sm:text-sm text-gray-700 leading-relaxed mb-4 italic">
                    &quot;{r.text}&quot;
                  </p>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-gray-200/50">
                  <span className="text-xs sm:text-sm font-bold text-[#1a1a1a]">
                    — {r.name}
                  </span>
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={12}
                        className={
                          s <= r.rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 fill-gray-200'
                        }
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scroll('right')}
            aria-label="Next review"
            className="absolute right-1 sm:-right-3 top-1/2 -translate-y-1/2 z-20 w-8 sm:w-10 h-8 sm:h-10 bg-white hover:bg-gray-50 text-gray-800 rounded-full flex items-center justify-center shadow-lg border border-gray-200/80 active:scale-90 transition-all cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </section>
  )
}
