'use client'
import Image from 'next/image'

const shopLinks = ['New Arrivals', 'Men', 'Women', 'Collections', 'Accessories', 'Sale']
const helpLinks = ['Custom Orders', 'Bulk Enquiries', 'Size Guide', 'FAQs', 'Contact Us']
const companyLinks = ['About Varna', 'Custom Wear', 'Careers', 'Press', 'Sustainability']

const WHATSAPP_ENQUIRY_URL =
  "https://wa.me/916363145972?text=Hi%20Varna!%20I'm%20interested%20in%20your%20styles%20and%20would%20like%20to%20place%20an%20enquiry."

export default function Footer() {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
  }

  return (
    <footer className="bg-[#111] text-gray-400 py-12 px-4 text-xs sm:text-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-12 gap-8 mb-10">
        {/* Brand Description with Emblem */}
        <div className="col-span-2 md:col-span-4 pr-0 md:pr-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault()
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
            className="flex items-center gap-3 mb-4 group cursor-pointer"
          >
            <div className="relative w-12 h-12 flex-shrink-0">
              <Image
                src="/images/logo/varna-emblem.webp"
                alt="Varna Custom Wear & Prints"
                fill
                sizes="48px"
                className="object-contain"
              />
            </div>
            <div>
              <span className="font-display italic text-white text-2xl font-bold tracking-tight block leading-tight">
                Varna
              </span>
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">
                Custom Wear &amp; Prints
              </span>
            </div>
          </a>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm mb-4">
            Custom wear, prints, t-shirts, jerseys &amp; hoodies. Crafted for comfort, curated to impress. Wear Your Colors with Varna.
          </p>
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span>Enquiries:</span>
            <a
              href={WHATSAPP_ENQUIRY_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-semibold flex items-center gap-1"
            >
              +91 6363145972
            </a>
          </div>
        </div>

        {/* Shop Links */}
        <div className="col-span-1 md:col-span-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Shop</h5>
          <ul className="space-y-2 text-xs">
            {shopLinks.map((l) => (
              <li key={l}>
                <a
                  href={`#${l.toLowerCase().replace(/\s+/g, '-')}`}
                  onClick={handleClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Help Links */}
        <div className="col-span-1 md:col-span-3">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Help &amp; Enquiries</h5>
          <ul className="space-y-2 text-xs">
            {helpLinks.map((l) => (
              <li key={l}>
                <a
                  href="#help"
                  onClick={handleClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {l}
                </a>
              </li>
            ))}
            <li>
              <a
                href={WHATSAPP_ENQUIRY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#25D366] hover:text-white transition-colors font-medium flex items-center gap-1"
              >
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>

        {/* Company Links */}
        <div className="col-span-2 md:col-span-2">
          <h5 className="text-white font-bold text-xs uppercase tracking-wider mb-3">Company</h5>
          <ul className="space-y-2 text-xs">
            {companyLinks.map((l) => (
              <li key={l}>
                <a
                  href="#company"
                  onClick={handleClick}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {l}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Copyright & Legal */}
      <div className="max-w-7xl mx-auto border-t border-gray-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <p>© 2026 Varna – Custom Wear &amp; Prints. All rights reserved.</p>
        <div className="flex gap-4 sm:gap-6 flex-wrap justify-center">
          <a href="#privacy" onClick={handleClick} className="hover:text-gray-300 transition-colors cursor-pointer">
            Privacy Policy
          </a>
          <a href="#terms" onClick={handleClick} className="hover:text-gray-300 transition-colors cursor-pointer">
            Terms of Use
          </a>
          <a href="#shipping" onClick={handleClick} className="hover:text-gray-300 transition-colors cursor-pointer">
            Shipping Policy
          </a>
        </div>
      </div>
    </footer>
  )
}
