import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')
const rawDir = path.join(rootDir, 'raw-images')
const publicImagesDir = path.join(rootDir, 'public', 'images')

// Recommended max limits per category to keep images ultra-sharp yet lightweight
const sectionLimits = {
  hero: { maxWidth: 1920, maxHeight: 1080 },
  banners: { maxWidth: 1400, maxHeight: 900 },
  categories: { maxWidth: 1080, maxHeight: 1440 },
  products: { maxWidth: 1080, maxHeight: 1440 },
  instagram: { maxWidth: 1080, maxHeight: 1080 },
}

const SUPPORTED_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.avif', '.heif', '.tiff', '.bmp', '.gif']

/**
 * Converts a single source image file into an optimized WebP at target path.
 */
export async function convertImage(sourcePath, targetRelPath) {
  const normKey = targetRelPath.replace(/\\/g, '/').replace(/\.webp$/, '')
  const [section] = normKey.split('/')
  const limits = sectionLimits[section] || { maxWidth: 1440, maxHeight: 1440 }

  const destinationPath = path.join(publicImagesDir, `${normKey}.webp`)
  const destDir = path.dirname(destinationPath)
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  const isHighQuality = section === 'hero' || section === 'instagram'
  const quality = isHighQuality ? 95 : 90
  const isInstagram = section === 'instagram'

  const pipeline = isInstagram
    ? sharp(sourcePath)
        .rotate()
        .resize({
          width: 1080,
          height: 1080,
          fit: 'cover',
          position: 'top',
        })
        .webp({
          quality: 95,
          effort: 4,
        })
    : sharp(sourcePath)
        .rotate()
        .resize({
          width: limits.maxWidth,
          height: limits.maxHeight,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({
          quality,
          effort: 4,
        })

  await pipeline.toFile(destinationPath)

  const inStat = fs.statSync(sourcePath)
  const outStat = fs.statSync(destinationPath)
  const inKb = (inStat.size / 1024).toFixed(1)
  const outKb = (outStat.size / 1024).toFixed(1)
  const reduction = Math.round((1 - outStat.size / inStat.size) * 100)

  console.log(`✅ [Converted] ${normKey}.webp (${inKb} KB -> ${outKb} KB, ${reduction > 0 ? '-' + reduction + '%' : 'optimized'})`)
  return destinationPath
}

/**
 * Scans raw-images folder and processes all images into public/images/*.webp
 */
export async function convertAllFromRaw() {
  if (!fs.existsSync(rawDir)) {
    fs.mkdirSync(rawDir, { recursive: true })
    console.log(`Created raw-images directory at ${rawDir}`)
    return
  }

  function findFiles(dir, baseDir = dir) {
    let results = []
    const list = fs.readdirSync(dir)
    for (const file of list) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) {
        results = results.concat(findFiles(fullPath, baseDir))
      } else {
        const ext = path.extname(file).toLowerCase()
        if (SUPPORTED_EXTS.includes(ext)) {
          const relPath = path.relative(baseDir, fullPath)
          results.push({ fullPath, relPath })
        }
      }
    }
    return results
  }

  const files = findFiles(rawDir)
  if (files.length === 0) {
    console.log(`ℹ️  No raw images found in raw-images/.`)
    console.log(`👉 Drop your photos (JPG, PNG, WebP, AVIF, etc.) into raw-images/<folder>/ and run npm run convert-images`)
    return
  }

  console.log(`🚀 Found ${files.length} raw image(s) to process in raw-images/...`)
  let convertedCount = 0
  for (const { fullPath, relPath } of files) {
    const ext = path.extname(relPath)
    const slotKey = relPath.slice(0, -ext.length).replace(/\\/g, '/')
    try {
      await convertImage(fullPath, slotKey)
      convertedCount++
    } catch (err) {
      console.error(`❌ Error converting ${relPath}:`, err.message)
    }
  }
  console.log(`\n✨ Successfully converted ${convertedCount} of ${files.length} images to WebP in public/images/!`)
}

// CLI argument parsing
const args = process.argv.slice(2)
let inputArg = null
let slotArg = null

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--input' || args[i] === '-i') {
    inputArg = args[i + 1]
    i++
  } else if (args[i] === '--slot' || args[i] === '-s' || args[i] === '--target' || args[i] === '-t') {
    slotArg = args[i + 1]
    i++
  }
}

if (inputArg && slotArg) {
  convertImage(inputArg, slotArg)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err)
      process.exit(1)
    })
} else {
  convertAllFromRaw().catch((err) => {
    console.error(err)
    process.exit(1)
  })
}
