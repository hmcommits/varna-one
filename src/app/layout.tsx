import type { Metadata, Viewport } from 'next'
import { Playfair_Display, Inter, Alex_Brush } from 'next/font/google'
import './globals.css'
import { StoreProvider } from '@/context/StoreContext'
import { CartProvider } from '@/context/CartContext'
import AppShell from '@/components/layout/AppShell'
import { getSiteUrl } from '@/lib/serverStore'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const alexBrush = Alex_Brush({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-script',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#1a2e1a',
}

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Varna – Custom Wear & Prints | Premium Everyday Apparel',
    template: '%s | Varna',
  },
  description:
    'T-Shirts, Jerseys, Hoodies, Linen Shirts and Elevated Everyday Styles. Handcrafted with custom embroidery, DTF prints and direct WhatsApp concierge in Bengaluru, India.',
  keywords: [
    'Varna',
    'Varna prints',
    'custom t-shirts',
    'linen shirts',
    'oversized tees',
    'custom jerseys',
    'streetwear India',
    'Bengaluru apparel',
    'personalized clothing',
    'print on demand Bangalore',
    'custom hoodies',
    'cotton shirts',
    'Varna store',
    'shop varna',
  ],
  authors: [{ name: 'Varna Studio', url: siteUrl }],
  creator: 'Varna',
  publisher: 'Varna Custom Wear & Prints',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: siteUrl,
    siteName: 'Varna – Custom Wear & Prints',
    title: 'Varna – Wear Your Colors | Custom Wear & Premium Prints',
    description:
      'T-Shirts, Jerseys, Hoodies, Linen Shirts and Elevated Everyday Styles. Handcrafted with custom embroidery, DTF prints and direct WhatsApp concierge.',
    images: [
      {
        url: '/images/banners/men-banner.webp',
        width: 1200,
        height: 630,
        alt: 'Varna Custom Wear and Prints Collection',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Varna – Custom Wear & Prints',
    description:
      'T-Shirts, Jerseys, Hoodies and Elevated Everyday Styles. Wear Your Colors with Varna.',
    images: ['/images/banners/men-banner.webp'],
    creator: '@varna_prints_',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/images/logo/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/images/logo/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
}

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Varna',
  alternateName: 'Varna Prints',
  url: siteUrl,
  logo: `${siteUrl}/images/logo/varna-emblem.webp`,
  sameAs: ['https://www.instagram.com/varna_prints_/'],
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: '+91 6363145972',
    contactType: 'customer service',
    areaServed: 'IN',
    availableLanguage: ['English', 'Kannada', 'Hindi'],
  },
}

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Varna – Custom Wear & Prints',
  url: siteUrl,
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/products?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
}

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'ClothingStore',
  name: 'Varna Custom Wear & Prints',
  image: `${siteUrl}/images/banners/men-banner.webp`,
  telephone: '+91 6363145972',
  email: 'varnaprints2026@gmail.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Karkala',
    addressLocality: 'Karkala, Udupi',
    addressRegion: 'Karnataka',
    postalCode: '574104',
    addressCountry: 'IN',
  },
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, Credit Card, UPI, Net Banking',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} ${alexBrush.variable}`}>
      <head>
        {/* Preconnect to Cloudinary CDN — saves 120-250ms on first image load */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* JSON-LD Structured Data for Google Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
      </head>
      <body className="min-h-screen bg-[#faf8f4] text-[#1a1a1a] antialiased selection:bg-[#1a2e1a] selection:text-white">
        <StoreProvider>
          <CartProvider>
            <AppShell>{children}</AppShell>
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  )
}
