import { NextRequest, NextResponse } from 'next/server'
import { getUser, saveLoginInfo } from '@/server/db/database'
import { set } from '@/server/db/session'
import { verifyRecaptcha } from '@/server/recaptcha'
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
    return NextResponse.json({}, { status: 403 })
  }

  const response = await getUser({ email: username })
  if (!response) {
    return NextResponse.json({}, { status: 404 })
  }

  if (await bcrypt.compare(password, response.password)) {
    await saveLoginInfo(response)
    const session = uuidv4()
    await set({ key: session, data: response, timetolive: 3600 * 24 * 1000 })
    return NextResponse.json({ session, profile: response.profile }, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 404 })
  }
}
