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
    <section className="bg-white border-y border-gray-100 py-4 md:py-5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* On mobile: touch-scrollable row; on tablet/desktop: 5-column grid */}
        <div className="flex md:grid md:grid-cols-5 gap-4 md:gap-6 overflow-x-auto no-scrollbar py-1">
          {badges.map((b) => (
            <div
              key={b.title}
              className="flex items-center gap-3 flex-shrink-0 min-w-[200px] md:min-w-0"
            >
              <div className="w-10 h-10 rounded-full bg-[#f0ece4] flex items-center justify-center flex-shrink-0 text-[#1a2e1a]">
                <b.icon size={18} />
              </div>
              <div>
                <p className="text-xs md:text-sm font-semibold text-[#1a1a1a]">{b.title}</p>
                <p className="text-[11px] md:text-xs text-gray-500">{b.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
