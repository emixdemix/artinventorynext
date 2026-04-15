import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getReports } from '@/server/db/database'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })

  const response = await getReports()
  return NextResponse.json(response, { status: 200 })
}
