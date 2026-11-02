import type { Metadata } from 'next'
import ProductsCatalogClient from './ProductsCatalogClient'
import { getSiteUrl, getAllProducts } from '@/lib/serverStore'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'All Products & Collections | Custom Apparel & Fits',
  description:
    'Browse the full Varna studio catalog: linen shirts, graphic tees, custom jerseys, hoodies & everyday elevated fits. Handcrafted in Bengaluru, delivered nationwide.',
  keywords: [
    'Varna products',
    'Varna catalog',
    'custom shirts India',
    'oversized t-shirts online',
    'customized jersey Bangalore',
    'streetwear online India',
    'linen shirts for men',
    'unisex elevated apparel',
  ],
  alternates: {
    canonical: `${siteUrl}/products`,
  },
  openGraph: {
    title: 'All Products & Collections | Varna',
    description:
      'Browse the full Varna studio catalog: linen shirts, graphic tees, custom jerseys, hoodies & everyday elevated fits.',
    url: `${siteUrl}/products`,
    images: [
      {
        url: '/images/banners/men-banner.webp',
        width: 1200,
        height: 630,
        alt: 'Varna Complete Products Catalog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'All Products & Collections | Varna',
    description:
      'Browse the full Varna studio catalog: linen shirts, graphic tees, custom jerseys, hoodies & everyday elevated fits.',
    images: ['/images/banners/men-banner.webp'],
  },
}

export default async function ProductsPage() {
  const products = await getAllProducts()

  // Schema.org ItemList schema for Google Catalog Indexing
  const itemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Varna Studio Collection',
    description: 'Complete collection of premium custom apparel & everyday wear',
    url: `${siteUrl}/products`,
    numberOfItems: products.length,
    itemListElement: products.map((p, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Product',
        name: p.name,
        url: `${siteUrl}/products/${p.id}`,
        image:
          (typeof p.colors?.[0] === 'object' && p.colors?.[0]?.image) ||
          `${siteUrl}/images/banners/men-banner.webp`,
        offers: {
          '@type': 'Offer',
          price: p.price,
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock',
        },
      },
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <ProductsCatalogClient />
    </>
  )
}
