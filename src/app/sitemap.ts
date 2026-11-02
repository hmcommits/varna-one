import { MetadataRoute } from 'next'
import { getSiteUrl, getStoreDataForServer } from '@/lib/serverStore'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl()
  const store = await getStoreDataForServer()
  const products = store.products || []
  const categories = (store.categories || []).filter((c) => c.visible !== false)

  const now = new Date()

  // 1. Core primary landing pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${siteUrl}/products`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
  ]

  // 2. Category routes
  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: `${siteUrl}/products?category=${encodeURIComponent(c.title)}`,
    lastModified: now,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  // 3. Dynamic Individual Product Details Pages
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${siteUrl}/products/${p.id}`,
    lastModified: store.lastUpdated ? new Date(store.lastUpdated) : now,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
