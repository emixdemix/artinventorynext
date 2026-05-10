import { NextRequest, NextResponse } from 'next/server'
import { requestLoginOtp } from '@/server/auth/otp'
import { verifyRecaptcha } from '@/server/recaptcha'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { email } = body as { email?: string }
  const recaptchaToken = body.recaptchaToken || body['g-recaptcha-response']

  if (!(await verifyRecaptcha(recaptchaToken))) {
    return NextResponse.json({}, { status: 403 })
  }
  if (!email || typeof email !== 'string') {
    return NextResponse.json({}, { status: 400 })
  }

  const result = await requestLoginOtp(email)
  if (result.ok) return NextResponse.json({}, { status: 200 })
  return NextResponse.json({}, { status: result.status })
}
