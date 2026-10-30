import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const publicDir = path.join(__dirname, '..', 'public', 'images')

const placeholders = [
  // Hero
  { path: 'hero/hero-1.svg', w: 1440, h: 600, bg: '#c4a882', label: 'Hero Slide 1' },
  { path: 'hero/hero-2.svg', w: 1440, h: 600, bg: '#b8976a', label: 'Hero Slide 2' },
  { path: 'hero/hero-3.svg', w: 1440, h: 600, bg: '#9a7a52', label: 'Hero Slide 3' },
  // Categories
  { path: 'categories/shirts.svg', w: 300, h: 400, bg: '#c4855a', label: 'Shirts' },
  { path: 'categories/tops-blouses.svg', w: 300, h: 400, bg: '#d4a0a0', label: 'Tops & Blouses' },
  { path: 'categories/tshirts-jerseys.svg', w: 300, h: 400, bg: '#7a9a8a', label: 'T-Shirts & Jerseys' },
  { path: 'categories/dresses.svg', w: 300, h: 400, bg: '#c48a6a', label: 'Dresses' },
  { path: 'categories/jeans-trousers.svg', w: 300, h: 400, bg: '#4a6a8c', label: 'Jeans & Trousers' },
  { path: 'categories/coord-sets.svg', w: 300, h: 400, bg: '#8a6a4a', label: 'Co-ord Sets' },
  // Products
  { path: 'products/linen-shirt.svg', w: 300, h: 400, bg: '#d4b896', label: 'Linen Shirt' },
  { path: 'products/floral-maxi-dress.svg', w: 300, h: 400, bg: '#e8b4a0', label: 'Floral Maxi Dress' },
  { path: 'products/striped-jersey-tee.svg', w: 300, h: 400, bg: '#a0b4c8', label: 'Striped Jersey Tee' },
  { path: 'products/ribbed-crop-top.svg', w: 300, h: 400, bg: '#e8c8a8', label: 'Ribbed Crop Top' },
  { path: 'products/relaxed-fit-jeans.svg', w: 300, h: 400, bg: '#6a8aaa', label: 'Relaxed Fit Jeans' },
  { path: 'products/printed-coord-set.svg', w: 300, h: 400, bg: '#a08060', label: 'Printed Co-ord Set' },
  // Banners
  { path: 'banners/men-banner.svg', w: 700, h: 500, bg: '#8a6a4a', label: 'Men Banner' },
  { path: 'banners/women-banner.svg', w: 700, h: 500, bg: '#c48a8a', label: 'Women Banner' },
  // Instagram
  { path: 'instagram/post-1.svg', w: 400, h: 400, bg: '#c4a882', label: 'Post 1' },
  { path: 'instagram/post-2.svg', w: 400, h: 400, bg: '#8a9a7a', label: 'Post 2' },
  { path: 'instagram/post-3.svg', w: 400, h: 400, bg: '#b4906a', label: 'Post 3' },
  { path: 'instagram/post-4.svg', w: 400, h: 400, bg: '#9a8ab4', label: 'Post 4' },
  { path: 'instagram/post-5.svg', w: 400, h: 400, bg: '#7a9a8a', label: 'Post 5' },
]

function escapeXml(unsafe) {
  return unsafe.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;')
}

function createSVG({ w, h, bg, label }) {
  const lines = label.split('\n')
  const textY = h / 2
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${bg}"/>
  <rect width="${w}" height="${h}" fill="rgba(0,0,0,0.1)"/>
  ${lines.map((line, i) => `<text x="${w/2}" y="${textY + (i - (lines.length-1)/2) * 32}" font-family="Georgia, serif" font-size="24" font-weight="bold" fill="rgba(255,255,255,0.85)" text-anchor="middle" dominant-baseline="middle">${escapeXml(line)}</text>`).join('\n  ')}
  <text x="${w/2}" y="${h - 20}" font-family="Georgia, serif" font-size="12" fill="rgba(255,255,255,0.5)" text-anchor="middle">${w}×${h} placeholder</text>
</svg>`
}

let created = 0
for (const item of placeholders) {
  const fullPath = path.join(publicDir, item.path)
  const dir = path.dirname(fullPath)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.writeFileSync(fullPath, createSVG(item))
  console.log(`Created: ${item.path}`)
  created++
}

console.log(`\n✅ Created ${created} placeholder SVGs`)
