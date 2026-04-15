import { NextRequest, NextResponse } from 'next/server'
import { getUser } from '@/server/db/database'
import { set } from '@/server/db/session'
import { verifyRecaptcha } from '@/server/recaptcha'
import { sendRegistration } from '@/server/email/sendgrid'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { username, password } = body

  const recaptchaToken = body.recaptchaToken || body['g-recaptcha-response']
  const recaptchaValid = await verifyRecaptcha(recaptchaToken)
  if (!recaptchaValid) {
    return NextResponse.json({}, { status: 404 })
  }

  if (!username || !password) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await getUser({ email: username })
  if (response) {
    return NextResponse.json({}, { status: 417 })
  }

  const p = bcrypt.hashSync(password, 10)
  const session = uuidv4()
  await set({ key: session, data: { password: p, email: username }, timetolive: 3600 * 1000 })

  try {
    await sendRegistration(`${process.env.THIS_SERVER}/setup/${session}`, username)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
