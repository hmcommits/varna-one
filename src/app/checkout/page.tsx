import type { Metadata } from 'next'
import CheckoutView from '@/components/checkout/CheckoutView'

export const metadata: Metadata = {
  title: 'Secure Delivery & Checkout | Varna – Custom Wear & Prints',
  description:
    'Enter your Indian delivery address and complete your order with direct WhatsApp concierge assistance and verified Pan-India delivery.',
}

export default function CheckoutPage() {
  return <CheckoutView />
}
