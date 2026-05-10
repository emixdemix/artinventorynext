import { NextRequest, NextResponse } from 'next/server'
import { requestLoginOtp } from '@/server/auth/otp'
import { verifyAppCheck } from '@/server/auth/appCheck'

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck')
  if (!(await verifyAppCheck(appCheckToken))) {
    return NextResponse.json({}, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { email } = body as { email?: string }

  if (!email || typeof email !== 'string') {
    return NextResponse.json({}, { status: 400 })
  }

  const result = await requestLoginOtp(email)
  if (result.ok) return NextResponse.json({}, { status: 200 })
  return NextResponse.json({}, { status: result.status })
}
