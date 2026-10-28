import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getUser, listLatestLogins } from '@/server/db/database'

const DEFAULT_LIMIT = 20
const MAX_LIMIT = 100

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })

  const caller = await getUser({ _id: auth.user._id })
  if (!caller || caller.deleted || caller.admin !== true) {
    return NextResponse.json({}, { status: 403 })
  }

  const parsed = Number(request.nextUrl.searchParams.get('limit'))
  const limit = Number.isFinite(parsed) && parsed > 0
    ? Math.min(Math.floor(parsed), MAX_LIMIT)
    : DEFAULT_LIMIT

  const logins = await listLatestLogins(limit)
  return NextResponse.json(logins, { status: 200 })
}
