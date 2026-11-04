import type { Metadata } from 'next'
import ProductDetailsView from '@/components/product/ProductDetailsView'
import { defaultStoreData } from '@/data/defaultStoreData'
import { getProductById, getAllProducts, getSiteUrl } from '@/lib/serverStore'

export const dynamicParams = true

interface ProductPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProductById(params.id)
  const siteUrl = getSiteUrl()

  if (!product) {
    return {
      title: 'Product Details | Varna Custom Wear & Prints',
      description:
        'Curated premium apparel, custom prints, embroidery & direct WhatsApp concierge ordering.',
    }
  }

  const primaryImage =
    (typeof product.colors?.[0] === 'object' && product.colors?.[0]?.image) ||
    'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp'

  const productUrl = `${siteUrl}/products/${product.id}`
  const description =
    product.description?.slice(0, 155) ||
    `Order ${product.name} at Varna for ₹${product.price}. Premium custom wear, tailored comfort & instant WhatsApp concierge assistance.`

  return {
    title: `${product.name} | Varna`,
    description,
    keywords: [
      product.name,
      product.category || 'Apparel',
      product.gender || 'Unisex',
      'Varna custom wear',
      'custom prints Bengaluru',
      'streetwear India',
    ],
    openGraph: {
      title: `${product.name} – ₹${product.price} | Varna`,
      description,
      url: productUrl,
      type: 'article',
      images: [
        {
          url: primaryImage,
          width: 800,
          height: 1067,
          alt: `${product.name} - Varna Custom Wear`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${product.name} – ₹${product.price} | Varna`,
      description,
      images: [primaryImage],
    },
    alternates: {
      canonical: productUrl,
    },
  }
}

export async function generateStaticParams() {
  const products = await getAllProducts()
  const ids = new Set([
    '1',
    'linen-shirt',
    ...(defaultStoreData.products || []).map((p) => p.id),
    ...products.map((p) => p.id),
  ])
  return Array.from(ids).map((id) => ({ id }))
}

export default async function ProductPage({ params }: ProductPageProps) {
  const product = await getProductById(params.id)
  const siteUrl = getSiteUrl()

  // Schema.org Product Structured Data for Google Shopping & Rich Snippets
  const productSchema = product
    ? {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: product.name,
        image: [
          (typeof product.colors?.[0] === 'object' && product.colors?.[0]?.image) ||
            'https://res.cloudinary.com/o6jv6xte/image/upload/v1793532655/varna_store/products/linen-shirt-terracotta.webp',
        ],
        description: product.description || `${product.name} crafted by Varna.`,
        sku: product.id,
        brand: {
          '@type': 'Brand',
          name: 'Varna',
        },
        offers: {
          '@type': 'Offer',
          url: `${siteUrl}/products/${product.id}`,
          priceCurrency: 'INR',
          price: product.price,
          priceValidUntil: '2027-12-31',
          itemCondition: 'https://schema.org/NewCondition',
          availability: 'https://schema.org/InStock',
          seller: {
            '@type': 'Organization',
            name: 'Varna',
          },
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: product.rating || 4.8,
          reviewCount: product.reviewCount || 10,
          bestRating: '5',
          worstRating: '1',
        },
      }
    : null

  return (
    <>
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      <ProductDetailsView key={params.id} productId={params.id} />
    </>
  )
}
