import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { EnquiryItem } from '@/types/store'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 10

/**
 * Clamp a string to a maximum length, preventing payload abuse.
 */
function clamp(val: string | undefined, maxLen: number, fallback: string): string {
  const v = (val || fallback).trim()
  return v.length > maxLen ? v.slice(0, maxLen) : v
}

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
      productName: clamp(body.productName, 120, 'General Store Enquiry'),
      color: clamp(body.color, 50, 'Default'),
      size: clamp(body.size, 50, 'Standard'),
      quantity: Math.max(1, Math.min(100, Number(body.quantity) || 1)),
      customNotes: clamp(body.customNotes, 500, ''),
      source: (body.source || 'Floating Concierge') as EnquiryItem['source'],
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
