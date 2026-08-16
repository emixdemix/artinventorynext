import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { markUserDeleted } from '@/server/db/database'
import { del } from '@/server/db/session'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id
  if (!userId) return NextResponse.json({}, { status: 401 })

  const ok = await markUserDeleted(userId)
  if (!ok) return NextResponse.json({}, { status: 500 })

  const token = request.headers.get('X-Token')
  if (token) {
    try {
      await del(token)
    } catch {}
  }

  return NextResponse.json({}, { status: 200 })
}
