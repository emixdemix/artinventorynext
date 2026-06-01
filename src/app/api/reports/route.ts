import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { hasPlan } from '@/server/auth/plan'
import { getReports } from '@/server/db/database'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  if (!hasPlan(auth.user, 'intermediate')) {
    return NextResponse.json(
      { error: 'plan_required', required: 'intermediate' },
      { status: 403 },
    )
  }

  const response = await getReports()
  return NextResponse.json(response, { status: 200 })
}
