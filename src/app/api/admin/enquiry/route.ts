import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { EnquiryItem } from '@/types/store'

export async function POST(req: Request) {
  try {
    const body: Partial<EnquiryItem> = await req.json()

    const newEnquiry: EnquiryItem = {
      id: `enq-${Date.now()}`,
      timestamp: new Date().toLocaleString('en-IN', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      }),
      productName: body.productName || 'General Store Enquiry',
      color: body.color || 'Default',
      size: body.size || 'Standard',
      quantity: body.quantity || 1,
      customNotes: body.customNotes || '',
      source: body.source || 'Floating Concierge',
      completed: false,
    }

    const db = await getMongoDb()
    if (db) {
      await db.collection('enquiries').insertOne(newEnquiry)
      // also update in config document array if present
      await db.collection('config').updateOne(
        { _id: 'store_config' as any },
        { $push: { enquiries: { $each: [newEnquiry], $position: 0 } } } as any
      )
    }

    return NextResponse.json({ success: true, enquiry: newEnquiry })
  } catch (err: any) {
    console.error('Failed to log enquiry:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to log enquiry' },
      { status: 500 }
    )
  }
}
