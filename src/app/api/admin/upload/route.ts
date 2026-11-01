import { NextResponse } from 'next/server'
import { processAndUploadImage } from '@/lib/cloudinary'
import { getMongoDb } from '@/lib/mongodb'
import { defaultStoreData } from '@/data/defaultStoreData'
import fs from 'fs'
import path from 'path'
import { StoreState } from '@/types/store'

const LOCAL_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'store.json')
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB ceiling

function readLocalPasscode(): string {
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const data = fs.readFileSync(LOCAL_STORE_FILE, 'utf-8')
      const parsed: StoreState = JSON.parse(data)
      if (parsed.settings?.passcode) return parsed.settings.passcode
    }
  } catch {
    // fallback
  }
  return defaultStoreData.settings.passcode || 'varna2026'
}

export async function POST(req: Request) {
  try {
    // 1. Authentication check
    const providedToken =
      req.headers.get('x-admin-token') ||
      req.headers.get('authorization')?.replace(/^Bearer\s+/i, '')

    const db = await getMongoDb()
    let expectedPasscode: string =
      process.env.ADMIN_SECRET_KEY || process.env.ADMIN_PASSCODE || ''

    if (!expectedPasscode) {
      if (db) {
        const existing = await db
          .collection('config')
          .findOne({ _id: 'store_config' as any })
        expectedPasscode =
          existing?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      } else {
        expectedPasscode = readLocalPasscode()
      }
    }

    if (!providedToken || providedToken.trim() !== expectedPasscode.trim()) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing administrator authorization token' },
        { status: 401 }
      )
    }

    // 2. Parse form data
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // 3. File size ceiling check (10MB limit)
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size (${(file.size / (1024 * 1024)).toFixed(1)}MB) exceeds the 10MB limit. Please upload an image under 10MB.`,
        },
        { status: 413 }
      )
    }

    // 4. File type check
    if (file.type && !file.type.startsWith('image/') && !file.name.match(/\.(png|jpe?g|webp|heic|avif)$/i)) {
      return NextResponse.json(
        { error: 'Invalid file format. Only images (PNG, JPG, HEIC, WEBP) are supported.' },
        { status: 400 }
      )
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 5. Transform to WebP via Sharp and upload to Cloudinary
    const result = await processAndUploadImage(buffer, file.name)

    return NextResponse.json({
      success: true,
      url: result.url,
      provider: result.provider,
      format: 'webp',
    })
  } catch (err: any) {
    console.error('Image upload failed:', err)
    return NextResponse.json(
      { error: err.message || 'Image processing failed' },
      { status: 500 }
    )
  }
}
