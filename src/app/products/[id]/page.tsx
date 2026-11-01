import type { Metadata } from 'next'
import ProductDetailsView from '@/components/product/ProductDetailsView'

export const dynamicParams = true

export const metadata: Metadata = {
  title: 'Product Details | Varna Custom Wear & Prints',
  description:
    'Curated premium apparel, custom prints, embroidery & direct WhatsApp concierge ordering.',
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: 'linen-shirt' }]
}

interface ProductPageProps {
  params: {
    id: string
  }
}

export default function ProductPage({ params }: ProductPageProps) {
  return <ProductDetailsView productId={params.id} />
}
