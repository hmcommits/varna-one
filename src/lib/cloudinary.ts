import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET
const cloudinaryUrl = process.env.CLOUDINARY_URL

const isCloudinaryConfigured = Boolean((cloudName && apiKey && apiSecret) || cloudinaryUrl)

// Vercel serverless lambdas have a read-only filesystem outside /tmp
const isVercel = Boolean(process.env.VERCEL)

if (isCloudinaryConfigured) {
  if (cloudName && apiKey && apiSecret) {
    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
      secure: true,
    })
  } else if (cloudinaryUrl) {
    cloudinary.config({
      cloudinary_url: cloudinaryUrl,
      secure: true,
    })
  }
}

export async function processAndUploadImage(
  buffer: Buffer,
  originalFilename: string
): Promise<{ url: string; provider: 'cloudinary' | 'local-sharp' }> {
  // Always convert to high-performance WebP via sharp
  const webpBuffer = await sharp(buffer)
    .resize(1600, 1600, { fit: 'inside', withoutEnlargement: true })
    .webp({ quality: 85 })
    .toBuffer()

  const safeBaseName = originalFilename
    .replace(/\.[^/.]+$/, '')
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .toLowerCase()
    .slice(0, 30)

  const filename = `${Date.now()}-${safeBaseName}.webp`

  // 1. If Cloudinary is configured, upload to Cloudinary CDN
  if (isCloudinaryConfigured) {
    try {
      const uploadResult = await new Promise<any>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: 'varna_store',
            public_id: `${Date.now()}-${safeBaseName}`,
            format: 'webp',
            resource_type: 'image',
          },
          (error, result) => {
            if (error) return reject(error)
            resolve(result)
          }
        )
        uploadStream.end(webpBuffer)
      })

      if (uploadResult && uploadResult.secure_url) {
        return {
          url: uploadResult.secure_url,
          provider: 'cloudinary',
        }
      }
    } catch (err) {
      console.warn('Cloudinary upload failed, falling back to local storage:', err)
    }
  }

  // 2. On Vercel, the filesystem is read-only — cannot write to public/
  if (isVercel) {
    throw new Error(
      'Image upload requires Cloudinary configuration. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your Vercel environment variables.'
    )
  }

  // 3. Local Fallback via Sharp (saved to public/images/uploads/) — dev only
  const uploadsDir = path.join(process.cwd(), 'public', 'images', 'uploads')
  try {
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true })
    }
    const filePath = path.join(uploadsDir, filename)
    fs.writeFileSync(filePath, webpBuffer)
  } catch (fsErr) {
    console.warn('Local filesystem write failed (read-only environment):', fsErr)
    throw new Error('Image upload failed: Cloudinary is not configured and local storage is unavailable.')
  }

  return {
    url: `/images/uploads/${filename}`,
    provider: 'local-sharp',
  }
}
