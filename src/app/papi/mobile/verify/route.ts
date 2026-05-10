import { NextRequest, NextResponse } from 'next/server'
import { verifyLoginOtp } from '@/server/auth/otp'
import { verifyAppCheck } from '@/server/auth/appCheck'

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck')
  if (!(await verifyAppCheck(appCheckToken))) {
    return NextResponse.json({}, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { email, code } = body as { email?: string; code?: string }

  if (!email || !code) {
    return NextResponse.json({}, { status: 400 })
  }

  const result = await verifyLoginOtp(email, code)
  if (!result.ok) return NextResponse.json({}, { status: result.status })

  return NextResponse.json(
    { session: result.session, profile: result.profile, email: result.email },
    { status: 200 },
  )
}
