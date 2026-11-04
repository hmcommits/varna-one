import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { EnquiryItem } from '@/types/store'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
export const maxDuration = 10

const LOCAL_STORE_FILE = path.join(process.cwd(), 'src', 'data', 'store.json')
const isVercel = Boolean(process.env.VERCEL)

/**
 * Clamp a string to a maximum length, preventing payload abuse.
 */
function clamp(val: string | undefined, maxLen: number, fallback: string): string {
  const v = (val || fallback).trim()
  return v.length > maxLen ? v.slice(0, maxLen) : v
}

function updateLocalStoreEnquiries(updater: (enquiries: EnquiryItem[]) => EnquiryItem[]) {
  if (isVercel) return
  try {
    if (fs.existsSync(LOCAL_STORE_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_STORE_FILE, 'utf-8'))
      const currentEnquiries = Array.isArray(data.enquiries) ? data.enquiries : []
      data.enquiries = updater(currentEnquiries)
      fs.writeFileSync(LOCAL_STORE_FILE, JSON.stringify(data, null, 2), 'utf-8')
    }
  } catch (err) {
    console.warn('Could not update local store enquiries:', err)
  }
}

export async function POST(req: Request) {
  try {
    const body: Partial<EnquiryItem> = await req.json()

    const newEnquiry: EnquiryItem = {
      id: body.id || `ord-${Date.now()}`,
      timestamp:
        body.timestamp ||
        new Date().toLocaleString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
      productName: clamp(body.productName, 200, 'General Store Enquiry'),
      color: clamp(body.color, 100, 'Default'),
      size: clamp(body.size, 100, 'Standard'),
      quantity: Math.max(1, Math.min(5000, Number(body.quantity) || 1)),
      customNotes: clamp(body.customNotes, 1000, ''),
      source: (body.source || 'WhatsApp Checkout') as EnquiryItem['source'],
      completed: Boolean(body.completed),
      customerName: body.customerName ? clamp(body.customerName, 100, '') : undefined,
      customerPhone: body.customerPhone ? clamp(body.customerPhone, 20, '') : undefined,
      address: body.address
        ? {
            fullName: clamp(body.address.fullName, 100, ''),
            phoneNumber: clamp(body.address.phoneNumber, 20, ''),
            houseNumber: clamp(body.address.houseNumber, 200, ''),
            streetAddress: clamp(body.address.streetAddress, 200, ''),
            landmark: clamp(body.address.landmark, 200, ''),
            city: clamp(body.address.city, 100, ''),
            state: clamp(body.address.state, 100, ''),
            pincode: clamp(body.address.pincode, 10, ''),
            addressType: body.address.addressType || 'Home',
          }
        : undefined,
      items: Array.isArray(body.items) ? body.items : undefined,
      totalAmount: typeof body.totalAmount === 'number' ? body.totalAmount : undefined,
      status: body.status || 'New',
    }

    const db = await getMongoDb()
    if (db) {
      await db.collection('enquiries').insertOne(newEnquiry)
      // Also update in config document array if present
      await db.collection('config').updateOne(
        { _id: 'store_config' as any },
        { $push: { enquiries: { $each: [newEnquiry], $position: 0 } } } as any
      )
    }

    // Save to local dev store.json if running locally
    updateLocalStoreEnquiries((prev) => [newEnquiry, ...prev])

    return NextResponse.json({ success: true, enquiry: newEnquiry })
  } catch (err: any) {
    console.error('Failed to log enquiry:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to log enquiry' },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { id, status, completed } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Missing enquiry id' }, { status: 400 })
    }

    const updateFields: any = {}
    if (status !== undefined) updateFields.status = status
    if (completed !== undefined) updateFields.completed = completed

    const db = await getMongoDb()
    if (db) {
      await db.collection('enquiries').updateOne({ id }, { $set: updateFields })
      // Update inside config.enquiries array
      await db.collection('config').updateOne(
        { _id: 'store_config' as any, 'enquiries.id': id },
        {
          $set: {
            'enquiries.$.status': status,
            'enquiries.$.completed': completed,
          },
        } as any
      )
    }

    updateLocalStoreEnquiries((prev) =>
      prev.map((e) => (e.id === id ? { ...e, ...updateFields } : e))
    )

    return NextResponse.json({ success: true, id, updateFields })
  } catch (err: any) {
    console.error('Failed to update enquiry:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to update enquiry' },
      { status: 500 }
    )
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    if (!id) {
      return NextResponse.json({ error: 'Missing enquiry id' }, { status: 400 })
    }

    const db = await getMongoDb()
    if (db) {
      await db.collection('enquiries').deleteOne({ id })
      await db.collection('config').updateOne(
        { _id: 'store_config' as any },
        { $pull: { enquiries: { id } } } as any
      )
    }

    updateLocalStoreEnquiries((prev) => prev.filter((e) => e.id !== id))

    return NextResponse.json({ success: true, deletedId: id })
  } catch (err: any) {
    console.error('Failed to delete enquiry:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to delete enquiry' },
      { status: 500 }
    )
  }
}
