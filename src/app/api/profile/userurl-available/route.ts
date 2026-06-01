import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { findUserByUserurl } from '@/server/db/database'
import { isValidUserUrl } from '@/server/utility/slug'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const value = (request.nextUrl.searchParams.get('value') || '').trim().toLowerCase()
  if (!value) {
    return NextResponse.json({ available: false, reason: 'empty' }, { status: 200 })
  }
  if (!isValidUserUrl(value)) {
    return NextResponse.json({ available: false, reason: 'invalid' }, { status: 200 })
  }

  const existing = await findUserByUserurl(value)
  if (existing && String(existing._id) !== String(userId)) {
    return NextResponse.json({ available: false, reason: 'taken' }, { status: 200 })
  }

  return NextResponse.json({ available: true }, { status: 200 })
}
