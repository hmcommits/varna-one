import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Varna – Custom Wear & Prints',
    short_name: 'Varna',
    description: 'T-Shirts, Jerseys, Hoodies & Elevated Everyday Styles. Wear Your Colors with Varna.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#1a2e1a',
    icons: [
      {
        src: '/favicon.ico',
        sizes: '48x48',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo/varna-emblem.webp',
        sizes: '192x192',
        type: 'image/webp',
      },
      {
        src: '/images/logo/varna-emblem.webp',
        sizes: '512x512',
        type: 'image/webp',
      },
    ],
  }
}
