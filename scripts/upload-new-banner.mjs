import { v2 as cloudinary } from 'cloudinary'
import sharp from 'sharp'
import fs from 'fs'
import path from 'path'

const sourceImagePath = 'C:/Users/Harsh/.gemini/antigravity/brain/f80683ab-eb2e-4752-860d-8c698526b25f/.user_uploaded/media_1793550200749_1924aab7.jpg'

cloudinary.config({
  cloud_name: 'o6jv6xte',
  api_key: '238668555296415',
  api_secret: 'tsNazDCfVPfmwki_811JTfmD_Pc',
  secure: true,
})

async function run() {
  console.log('Reading source image from:', sourceImagePath)
  const inputBuffer = fs.readFileSync(sourceImagePath)

  console.log('Converting to WebP with Sharp...')
  const webpBuffer = await sharp(inputBuffer)
    .resize(1920, 1080, { fit: 'cover', position: 'center' })
    .webp({ quality: 85 })
    .toBuffer()

  console.log('Uploading WebP to Cloudinary (folder: varna_store/admin)...')
  const uploadResult = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'varna_store/admin',
        public_id: 'admin-banner-hero',
        format: 'webp',
        resource_type: 'image',
        overwrite: true,
        invalidate: true,
      },
      (error, result) => {
        if (error) return reject(error)
        resolve(result)
      }
    )
    uploadStream.end(webpBuffer)
  })

  console.log('SUCCESS!')
  console.log('Cloudinary URL:', uploadResult.secure_url)
}

run().catch((err) => {
  console.error('Upload failed:', err)
  process.exit(1)
})
