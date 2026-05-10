import { NextRequest, NextResponse } from 'next/server'
import { createVerify, constants } from 'crypto'
import { v4 as uuidv4 } from 'uuid'

import { getUser, saveLoginInfo } from '@/server/db/database'
import { get, set } from '@/server/db/session'
import { ErrorCode } from '@/server/interfaces'

const SESSION_TTL_MS = 30 * 24 * 3600 * 1000
const NONCE_TTL_MS = 10 * 60 * 1000
const TIMESTAMP_SKEW_MS = 5 * 60 * 1000

const nonceKey = (email: string, nonce: string) =>
  `mobile-refresh-nonce:${email.toLowerCase()}:${nonce}`

const verifyPss = (publicKeyPem: string, message: string, signatureB64: string): boolean => {
  try {
    const verifier = createVerify('RSA-SHA256')
    verifier.update(message)
    verifier.end()
    return verifier.verify(
      {
        key: publicKeyPem,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32,
      },
      Buffer.from(signatureB64, 'base64'),
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}))
  const { email, timestamp, nonce, signature } = body as {
    email?: string
    timestamp?: number
    nonce?: string
    signature?: string
  }

  if (
    !email ||
    typeof email !== 'string' ||
    typeof timestamp !== 'number' ||
    !nonce ||
    typeof nonce !== 'string' ||
    !signature ||
    typeof signature !== 'string'
  ) {
    return NextResponse.json({}, { status: 400 })
  }

  if (Math.abs(Date.now() - timestamp) > TIMESTAMP_SKEW_MS) {
    return NextResponse.json({}, { status: 401 })
  }

  const existingNonce = await get(nonceKey(email, nonce))
  if (!(existingNonce as ErrorCode).code) {
    return NextResponse.json({}, { status: 401 })
  }

  const user = await getUser({ email })
  if (!user) {
    return NextResponse.json({}, { status: 401 })
  }

  const devices = user.profile?.devices ?? []
  if (devices.length === 0) {
    return NextResponse.json({}, { status: 401 })
  }

  const message = JSON.stringify({ email, timestamp, nonce })
  const verified = devices.some((d) => verifyPss(d.mobilePublicKeyPem, message, signature))
  if (!verified) {
    return NextResponse.json({}, { status: 401 })
  }

  await set({ key: nonceKey(email, nonce), data: { email }, timetolive: NONCE_TTL_MS })

  await saveLoginInfo(user)

  const session = uuidv4()
  await set({ key: session, data: user, timetolive: SESSION_TTL_MS })

  return NextResponse.json(
    { session, profile: user.profile, email: user.email },
    { status: 200 },
  )
}
