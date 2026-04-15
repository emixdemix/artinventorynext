import { NextRequest, NextResponse } from 'next/server'
import { getUser, updatePassword } from '@/server/db/database'
import { get, del } from '@/server/db/session'
import { verifyRecaptcha } from '@/server/recaptcha'
import { ErrorCode, RedisData } from '@/server/interfaces'
import bcrypt from 'bcrypt'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password, token } = body

  const recaptchaToken = body.recaptchaToken || body['g-recaptcha-response']
  const recaptchaValid = await verifyRecaptcha(recaptchaToken)
  if (!recaptchaValid) {
    return NextResponse.json({}, { status: 404 })
  }

  if (!password || !token) {
    return NextResponse.json({}, { status: 403 })
  }

  const data = await get(token)
  if ((data as ErrorCode).code) {
    return NextResponse.json({}, { status: 403 })
  }

  // Remove token...
  await del(token)

  const email = (data as RedisData).data['resetEmail']

  const response = await getUser({ email })
  if (response) {
    const p = bcrypt.hashSync(password, 10)
    await updatePassword({ password: p, id: response._id })
    return NextResponse.json({}, { status: 200 })
  }

  return NextResponse.json({}, { status: 500 })
}
