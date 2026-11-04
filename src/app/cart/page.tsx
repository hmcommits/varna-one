import type { Metadata } from 'next'
import CartView from '@/components/cart/CartView'

export const metadata: Metadata = {
  title: 'Your Shopping Bag | Varna – Custom Wear & Prints',
  description:
    'Review your selected apparel, choose sizes and colors, and proceed to direct WhatsApp checkout for Pan-India express delivery.',
}

export default function CartPage() {
  return <CartView />
}
