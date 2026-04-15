import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/server/db/database'
import { set } from '@/server/db/session'
import { verifyRecaptcha } from '@/server/recaptcha'
import { sendResetPassword } from '@/server/email/sendgrid'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { email } = body

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

  const session = uuidv4()
  await set({ key: session, data: { resetEmail: email }, timetolive: 3600 * 1000 })

  try {
    await sendResetPassword(`${process.env.THIS_SERVER}/reset/${session}`, email)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
