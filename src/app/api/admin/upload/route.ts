import { NextResponse } from 'next/server'
import { processAndUploadImage } from '@/lib/cloudinary'

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

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
