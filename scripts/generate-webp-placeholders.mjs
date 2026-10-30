import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public', 'images')

const items = [
  // Hero
  { svg: 'hero/hero-1.svg', webp: 'hero/hero-1.webp' },
  { svg: 'hero/hero-2.svg', webp: 'hero/hero-2.webp' },
  { svg: 'hero/hero-3.svg', webp: 'hero/hero-3.webp' },
  // Categories
  { svg: 'categories/shirts.svg', webp: 'categories/shirts.webp' },
  { svg: 'categories/tops-blouses.svg', webp: 'categories/tops-blouses.webp' },
  { svg: 'categories/tshirts-jerseys.svg', webp: 'categories/tshirts-jerseys.webp' },
  { svg: 'categories/dresses.svg', webp: 'categories/dresses.webp' },
  { svg: 'categories/jeans-trousers.svg', webp: 'categories/jeans-trousers.webp' },
  { svg: 'categories/coord-sets.svg', webp: 'categories/coord-sets.webp' },
  // Products
  { svg: 'products/linen-shirt.svg', webp: 'products/linen-shirt.webp' },
  { svg: 'products/floral-maxi-dress.svg', webp: 'products/floral-maxi-dress.webp' },
  { svg: 'products/striped-jersey-tee.svg', webp: 'products/striped-jersey-tee.webp' },
  { svg: 'products/ribbed-crop-top.svg', webp: 'products/ribbed-crop-top.webp' },
  { svg: 'products/relaxed-fit-jeans.svg', webp: 'products/relaxed-fit-jeans.webp' },
  { svg: 'products/printed-coord-set.svg', webp: 'products/printed-coord-set.webp' },
  // Banners
  { svg: 'banners/men-banner.svg', webp: 'banners/men-banner.webp' },
  { svg: 'banners/women-banner.svg', webp: 'banners/women-banner.webp' },
  // Instagram
  { svg: 'instagram/post-1.svg', webp: 'instagram/post-1.webp' },
  { svg: 'instagram/post-2.svg', webp: 'instagram/post-2.webp' },
  { svg: 'instagram/post-3.svg', webp: 'instagram/post-3.webp' },
  { svg: 'instagram/post-4.svg', webp: 'instagram/post-4.webp' },
  { svg: 'instagram/post-5.svg', webp: 'instagram/post-5.webp' },
]

async function generate() {
  console.log('Generating WebP placeholders from SVG templates...')
  for (const item of items) {
    const svgPath = path.join(publicDir, item.svg)
    const webpPath = path.join(publicDir, item.webp)
    if (fs.existsSync(svgPath)) {
      const svgBuffer = fs.readFileSync(svgPath)
      await sharp(svgBuffer).webp({ quality: 90 }).toFile(webpPath)
      console.log(`Converted: ${item.svg} -> ${item.webp}`)
    } else {
      console.warn(`File missing: ${svgPath}`)
    }
  }
  console.log('Done generating WebP placeholders!')
}

generate().catch(console.error)
