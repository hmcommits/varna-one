import { Truck, Sparkles, Shield, Star, Headphones } from 'lucide-react'

const badges = [
  { icon: Truck, title: 'Free Shipping', sub: 'On orders above ₹999' },
  { icon: Sparkles, title: 'Custom Wear & Fits', sub: 'Crafted as you like' },
  { icon: Shield, title: 'Secure Payments', sub: 'UPI, Cards, Net Banking' },
  { icon: Star, title: 'Quality Assured', sub: 'Style you can trust' },
  { icon: Headphones, title: '24/7 Support', sub: "We're here for you" },
]

export default function TrustBadges() {
  return (
    <section className="bg-white border-y border-[#e8d5b7]/50 py-3.5 md:py-5 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto px-4">
        {/* On mobile (< md): continuous smooth auto-moving marquee */}
        <div className="md:hidden overflow-hidden relative">
          {/* Subtle edge fades for soft transition */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-6 bg-gradient-to-r from-white to-transparent z-10" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-6 bg-gradient-to-l from-white to-transparent z-10" />

          <div className="badges-marquee py-1">
            {[...badges, ...badges].map((b, idx) => (
              <div
                key={`${b.title}-${idx}`}
                className="flex items-center gap-2.5 flex-shrink-0 px-4"
              >
                <div className="w-8 h-8 rounded-full bg-[#f0ece4] border border-[#e8d5b7]/40 flex items-center justify-center flex-shrink-0 text-[#1a2e1a]">
                  <b.icon size={15} />
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#1a1a1a] whitespace-nowrap">{b.title}</p>
                  <p className="text-[10px] text-[#7d7062] whitespace-nowrap">{b.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* On desktop (md:): clean 5-column grid */}
        <div className="hidden md:grid md:grid-cols-5 gap-6 py-1">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#f0ece4] border border-[#e8d5b7]/40 flex items-center justify-center flex-shrink-0 text-[#1a2e1a]">
                <b.icon size={18} />
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-[#1a1a1a]">{b.title}</p>
                <p className="text-[11px] md:text-xs text-[#7d7062]">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
