import { NextRequest, NextResponse } from 'next/server'
import { verifySignupOtp } from '@/server/auth/otp'
import { verifyRecaptcha } from '@/server/recaptcha'

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { email, code } = body as { email?: string; code?: string }
  const recaptchaToken = body.recaptchaToken || body['g-recaptcha-response']

  if (!(await verifyRecaptcha(recaptchaToken))) {
    return NextResponse.json({}, { status: 403 })
  }
  if (!email || !code) {
    return NextResponse.json({}, { status: 400 })
  }

  const result = await verifySignupOtp(email, code)
  if (!result.ok) return NextResponse.json({}, { status: result.status })

  return NextResponse.json(
    { session: result.session, profile: result.profile, email: result.email },
    { status: 200 },
  )
}
