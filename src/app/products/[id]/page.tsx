import type { Metadata } from 'next'
import ProductDetailsView from '@/components/product/ProductDetailsView'

export const metadata: Metadata = {
  title: 'Premium Pure Linen Casual Shirt | Varna Custom Wear & Prints',
  description:
    'Tailored from 100% natural European flax fibers. Relaxed regular fit with spread collar and curved hem. Custom embroidery, DTF prints & WhatsApp concierge ordering.',
}

export function generateStaticParams() {
  return [{ id: '1' }, { id: 'linen-shirt' }]
}

export default function ProductPage() {
  return <ProductDetailsView />
}
