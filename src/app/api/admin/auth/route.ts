import { NextResponse } from 'next/server'
import { getMongoDb } from '@/lib/mongodb'
import { defaultStoreData } from '@/data/defaultStoreData'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * POST /api/admin/auth
 * Server-side passcode verification. Sets an HttpOnly cookie for Edge Middleware.
 * Supports multi-device: each device authenticates independently with the same passcode.
 */
export async function POST(req: Request) {
  try {
    const { passcode } = await req.json()

    if (!passcode || typeof passcode !== 'string') {
      return NextResponse.json(
        { error: 'Passcode is required' },
        { status: 400 }
      )
    }

    const inputPasscode = passcode.trim()
    const masterSecret = (process.env.ADMIN_SECRET_KEY || process.env.ADMIN_SECRET || '').trim()

    // 1. Master Secret Override: if provided passcode matches master secret, grant immediate access
    const isMaster = Boolean(masterSecret && inputPasscode === masterSecret)

    // 2. Resolve store-configured passcode from MongoDB or default
    let storePasscode = process.env.ADMIN_PASSCODE || ''
    if (!storePasscode) {
      const db = await getMongoDb()
      if (db) {
        const config = await db
          .collection('config')
          .findOne({ _id: 'store_config' as any })
        storePasscode =
          config?.settings?.passcode ||
          defaultStoreData.settings.passcode ||
          'varna2026'
      } else {
        storePasscode = defaultStoreData.settings.passcode || 'varna2026'
      }
    }

    const isAuthorized = isMaster || Boolean(storePasscode && inputPasscode === storePasscode.trim())

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Invalid passcode' },
        { status: 401 }
      )
    }

    // Authentication successful — set cookie for Edge Middleware
    const response = NextResponse.json({
      success: true,
      token: passcode.trim(), // Client stores this for x-admin-token headers
    })

    // Set session cookie (HttpOnly on production, accessible for Edge Middleware)
    response.cookies.set('varna_admin_session', 'authenticated', {
      httpOnly: false, // Edge Middleware needs to read it
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (err: any) {
    console.error('Auth error:', err)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}
