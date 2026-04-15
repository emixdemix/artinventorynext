import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  return NextResponse.json({}, { status: 200 })
}
