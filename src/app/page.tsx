import HeroSlider from '@/components/sections/HeroSlider'
import TrustBadges from '@/components/sections/TrustBadges'
import TrendingTicker from '@/components/sections/TrendingTicker'
import CategoryGrid from '@/components/sections/CategoryGrid'
import NewArrivals from '@/components/sections/NewArrivals'
import PromoBanners from '@/components/sections/PromoBanners'
import WhyVarna from '@/components/sections/WhyVarna'
import InstagramFeed from '@/components/sections/InstagramFeed'
import CustomerReviews from '@/components/sections/CustomerReviews'
import Newsletter from '@/components/sections/Newsletter'

export default function HomePage() {
  return (
    <>
      <HeroSlider />
      <TrustBadges />
      <TrendingTicker />
      <CategoryGrid />
      <NewArrivals />
      <PromoBanners />
      <WhyVarna />
      <InstagramFeed />
      <CustomerReviews />
      <Newsletter />
    </>
  )
}
