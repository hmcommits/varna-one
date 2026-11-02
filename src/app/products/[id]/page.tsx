import type { Metadata } from 'next'
import ProductDetailsView from '@/components/product/ProductDetailsView'
import { defaultStoreData } from '@/data/defaultStoreData'

export const dynamicParams = true

export const metadata: Metadata = {
  title: 'Product Details | Varna Custom Wear & Prints',
  description:
    'Curated premium apparel, custom prints, embroidery & direct WhatsApp concierge ordering.',
}

export function generateStaticParams() {
  const ids = new Set(['1', 'linen-shirt', ...(defaultStoreData.products || []).map((p) => p.id)])
  return Array.from(ids).map((id) => ({ id }))
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailsView productId={params.id} />
}
