import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { removeUserPushToken, upsertUserPushToken } from '@/server/db/database'

type Platform = 'ios' | 'android' | 'unknown'

const normalizePlatform = (raw: unknown): Platform => {
  if (raw === 'ios' || raw === 'android') return raw
  return 'unknown'
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })

  const body = await request.json().catch(() => ({}))
  const { token, platform } = body as { token?: string; platform?: string }

  if (!token || typeof token !== 'string') {
    return NextResponse.json({}, { status: 400 })
  }

  const res = await upsertUserPushToken(
    auth.user._id,
    token,
    normalizePlatform(platform),
  )
  if (!res) return NextResponse.json({}, { status: 500 })

  return NextResponse.json({}, { status: 200 })
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })

  const token = request.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({}, { status: 400 })

  const res = await removeUserPushToken(auth.user._id, token)
  if (!res) return NextResponse.json({}, { status: 500 })

  return NextResponse.json({}, { status: 200 })
}
