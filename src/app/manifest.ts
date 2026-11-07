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
        sizes: '48x48 32x32 16x16',
        type: 'image/x-icon',
      },
      {
        src: '/images/logo/icon-48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/images/logo/icon-96.png',
        sizes: '96x96',
        type: 'image/png',
      },
      {
        src: '/images/logo/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/images/logo/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  }
}
