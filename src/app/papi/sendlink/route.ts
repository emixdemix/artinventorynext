import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/server/db/database'
import { set } from '@/server/db/session'
import { verifyRecaptcha } from '@/server/recaptcha'
import { sendOTPCode, sendOTPLink } from '@/server/email/sendgrid'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email, mobile } = body

  const recaptchaToken = body.recaptchaToken || body['g-recaptcha-response']
  const recaptchaValid = await verifyRecaptcha(recaptchaToken)
  if (!recaptchaValid) {
    return NextResponse.json({}, { status: 404 })
  }

  if (!email) {
    return NextResponse.json({}, { status: 403 })
  }

  const response = await getUser({ email })
  if (!response) {
    // Alles gut but no email....
    return NextResponse.json({}, { status: 200 })
  }

  try {
    if (mobile === true) {
      const session = uuidv4().substring(0, 6)
      await set({ key: `${response._id}${session}`, data: { loginEmail: email }, timetolive: 600 * 1000 })
      await sendOTPCode(`${session}`, email)
    } else {
      const session = uuidv4()
      await set({ key: session, data: { loginEmail: email }, timetolive: 600 * 1000 })
      await sendOTPLink(`${process.env.THIS_SERVER}/login/${session}`, email)
    }
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
