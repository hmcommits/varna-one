import type { Metadata } from 'next'
import HeroSlider from '@/components/sections/HeroSlider'
import TrustBadges from '@/components/sections/TrustBadges'
import TrendingTicker from '@/components/sections/TrendingTicker'
import CategoryGrid from '@/components/sections/CategoryGrid'
import NewArrivals from '@/components/sections/NewArrivals'
import SaleSection from '@/components/sections/SaleSection'
import PromoBanners from '@/components/sections/PromoBanners'
import WhyVarna from '@/components/sections/WhyVarna'
import CustomerReviews from '@/components/sections/CustomerReviews'
import Newsletter from '@/components/sections/Newsletter'
import { getSiteUrl } from '@/lib/serverStore'

const siteUrl = getSiteUrl()

export const metadata: Metadata = {
  title: 'Varna – Wear Your Colors | Custom Wear, Linen Shirts & Drops',
  description:
    'Shop handcrafted linen shirts, oversized tees, custom jerseys & streetwear. Tailored comfort, personalized prints, and direct WhatsApp concierge ordering in India.',
  alternates: {
    canonical: siteUrl,
  },
}

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <TrustBadges />
      <TrendingTicker />
      <CategoryGrid />
      <NewArrivals />
      <SaleSection />
      <PromoBanners />
      <WhyVarna />
      <CustomerReviews />
      <Newsletter />
    </>
  )
}
