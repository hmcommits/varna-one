'use client'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useStore } from '@/context/StoreContext'

export default function WhatsAppButton() {
  const { activeStore, logEnquiry, activeViewingProduct } = useStore()
  const pathname = usePathname()

  const wa = activeStore.whatsapp || {
    phoneNumber: '916363145972',
    floatingButtonVisible: true,
    floatingButtonText: 'Enquire',
    luminousGlow: true,
    templateGeneral:
      "Hi Varna! I'm browsing your storefront and would like to ask a few questions about your collections and custom printing.",
    templateCard:
      "Hi Varna! I'd like to enquire about the {product_name} ({price}). Please share availability and delivery timeframe.",
    templatePdp:
      "Hi Varna! I'd like to order the *{product_name}*:\n\n• *Color:* {color}\n• *Size:* {size}\n• *Quantity:* {quantity} unit(s)\n• *Total Amount:* {price}\n• *Product Link:* {product_url}{custom_notes}\n\nPlease confirm product availability & dispatch timeline!",
  }

  if (wa.floatingButtonVisible === false) {
    return null
  }

  const phone = wa.phoneNumber || '916363145972'

  // Detect whether a particular product is currently open
  const isProductRoute = Boolean(pathname?.startsWith('/products/'))
  const routeProductId = isProductRoute
    ? pathname?.replace(/^\/products\//, '').split('/')[0]
    : null

  const routeProduct = routeProductId
    ? (activeStore.products || []).find(
        (p) => p.id === routeProductId || (routeProductId === 'linen-shirt' && p.id === '1')
      )
    : null

  const isProductOpen = Boolean(activeViewingProduct || routeProduct)

  let whatsappUrl = ''
  let enquiryLogData: any = {}

  if (isProductOpen) {
    // When a particular product is open, tailor the enquiry button directly to that product
    const prodName = activeViewingProduct?.name || routeProduct?.name || 'Varna Collection Item'
    const colorName =
      activeViewingProduct?.color || routeProduct?.colors?.[0]?.name || 'Standard'
    const sizeName = activeViewingProduct?.size || routeProduct?.sizes?.[0] || 'Standard'
    const qty = activeViewingProduct?.quantity || 1
    const priceVal = activeViewingProduct?.price ?? routeProduct?.price ?? 0
    const priceFormatted = `₹${priceVal.toLocaleString('en-IN')}`
    const prodUrl =
      activeViewingProduct?.url ||
      (typeof window !== 'undefined'
        ? window.location.href
        : `https://varna.store/products/${activeViewingProduct?.productId || routeProduct?.id}`)

    const customNotesStr =
      activeViewingProduct?.customOptions && activeViewingProduct.customOptions.length > 0
        ? `\n• *Customization:* ${activeViewingProduct.customOptions.join(', ')}${
            activeViewingProduct.customNotes ? ` ("${activeViewingProduct.customNotes}")` : ''
          }`
        : activeViewingProduct?.customNotes
        ? `\n• *Custom Notes:* "${activeViewingProduct.customNotes}"`
        : ''

    let message = ''
    if (wa.templatePdp) {
      message = wa.templatePdp
        .replace('{product_name}', prodName)
        .replace('{color}', colorName)
        .replace('{size}', sizeName)
        .replace('{quantity}', String(qty))
        .replace('{price}', priceFormatted)
        .replace('{product_url}', prodUrl)
        .replace('{custom_notes}', customNotesStr)
    } else {
      message = `Hi Varna! I'd like to enquire about the *${prodName}*:\n\n• *Color:* ${colorName}\n• *Size:* ${sizeName}\n• *Quantity:* ${qty} unit(s)\n• *Price:* ${priceFormatted}\n• *Product Link:* ${prodUrl}${customNotesStr}\n\nPlease confirm product availability & dispatch timeline!`
    }

    whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    enquiryLogData = {
      productName: prodName,
      color: colorName,
      size: sizeName,
      quantity: qty,
      customNotes:
        activeViewingProduct?.customOptions && activeViewingProduct.customOptions.length > 0
          ? `${activeViewingProduct.customOptions.join(', ')}${
              activeViewingProduct.customNotes ? ` — ${activeViewingProduct.customNotes}` : ''
            }`
          : activeViewingProduct?.customNotes || undefined,
      source: 'Product Details Page',
      completed: false,
    }
  } else {
    // General storefront concierge message
    const message =
      wa.templateGeneral ||
      "Hi Varna! I'm browsing your storefront and would like to ask a few questions about your collections and custom printing."
    whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`

    enquiryLogData = {
      productName: 'General Floating Concierge',
      color: 'N/A',
      size: 'N/A',
      quantity: 1,
      source: 'Floating Concierge',
      completed: false,
    }
  }

  const handleClick = () => {
    logEnquiry(enquiryLogData)
  }

  return (
    <div
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-[9999] pointer-events-auto select-none"
      style={{ zIndex: 9999 }}
    >
      <div className="relative">
        {/* Ambient breathing luminous glow */}
        {wa.luminousGlow !== false && (
          <span className="absolute -inset-1.5 sm:-inset-2 rounded-full bg-[#25D366] whatsapp-gentle-glow -z-10 pointer-events-none blur-[2px]" />
        )}

        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleClick}
          aria-label="Enquire on WhatsApp"
          className="inline-flex items-center gap-2.5 sm:gap-3 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-sm sm:text-base px-4 sm:px-5 py-2.5 sm:py-3 rounded-full shadow-[0_8px_24px_rgba(37,211,102,0.45)] hover:shadow-[0_12px_32px_rgba(37,211,102,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 ring-4 ring-white/95 cursor-pointer group"
        >
          {/* WhatsApp Logo Icon */}
          <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-full overflow-hidden flex-shrink-0 group-hover:rotate-12 transition-transform duration-300">
            <Image
              src="https://res.cloudinary.com/o6jv6xte/image/upload/v1793532654/varna_store/icons/whatsapp-icon.webp"
              alt="WhatsApp"
              fill
              sizes="32px"
              quality={95}
              priority
              unoptimized={true}
              className="object-cover"
            />
          </div>

          {/* Text */}
          <span className="tracking-wide font-bold drop-shadow-xs pr-0.5">
            {wa.floatingButtonText || 'Enquire'}
          </span>
        </a>
      </div>
    </div>
  )
}
