import { NextRequest, NextResponse } from 'next/server'
import { createVerify, constants } from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { WithId } from 'mongodb'

import { addLinkedDevice, getUser, saveLoginInfo } from '@/server/db/database'
import {
  clearSessionSecurityArtifacts,
  get,
  set,
} from '@/server/db/session'
import { ErrorCode, RedisData, User } from '@/server/interfaces'
import { verifyAppCheck } from '@/server/auth/appCheck'

const SESSION_TTL_MS = 30 * 24 * 3600 * 1000
const QR_MAX_AGE_MS = 5 * 60 * 1000

type ScannedPayload = {
  uuid: string
  session: string
  signature: string
}

const parseQr = (raw: string): ScannedPayload | null => {
  try {
    const obj = JSON.parse(raw) as Partial<ScannedPayload>
    if (
      typeof obj.uuid === 'string' &&
      typeof obj.session === 'string' &&
      typeof obj.signature === 'string'
    ) {
      return obj as ScannedPayload
    }
  } catch {}
  return null
}

const verifyPssSignature = (
  publicKeyPem: string,
  payload: { uuid: string; session: string },
  signatureBase64: string,
): boolean => {
  try {
    const verifier = createVerify('RSA-SHA256')
    verifier.update(JSON.stringify(payload))
    verifier.end()
    return verifier.verify(
      {
        key: publicKeyPem,
        padding: constants.RSA_PKCS1_PSS_PADDING,
        saltLength: 32,
      },
      Buffer.from(signatureBase64, 'base64'),
    )
  } catch {
    return false
  }
}

export async function POST(request: NextRequest) {
  const appCheckToken = request.headers.get('X-Firebase-AppCheck')
  if (!(await verifyAppCheck(appCheckToken))) {
    return NextResponse.json({}, { status: 403 })
  }

  const body = await request.json().catch(() => ({}))
  const { qr, mobilePublicKey } = body as {
    qr?: string
    mobilePublicKey?: string
  }

  if (!qr || typeof qr !== 'string' || !mobilePublicKey || typeof mobilePublicKey !== 'string') {
    return NextResponse.json({}, { status: 400 })
  }

  const parsed = parseQr(qr)
  if (!parsed) {
    return NextResponse.json({}, { status: 400 })
  }

  const stored = await get(parsed.session)
  if ((stored as ErrorCode).code) {
    return NextResponse.json({}, { status: 404 })
  }

  const sessionData = (stored as RedisData).data as
    | (WithId<User> & {
        security?: {
          qrPayload: string
          publicKeyPem: string
          privateKeyPem: string
          uuid: string
          createdAt: number
        }
      })
    | undefined

  const security = sessionData?.security
  if (!security) {
    return NextResponse.json({}, { status: 410 })
  }

  if (Date.now() - security.createdAt > QR_MAX_AGE_MS) {
    await clearSessionSecurityArtifacts(parsed.session)
    return NextResponse.json({}, { status: 410 })
  }

  if (security.qrPayload !== qr || security.uuid !== parsed.uuid) {
    return NextResponse.json({}, { status: 401 })
  }

  const sigOk = verifyPssSignature(
    security.publicKeyPem,
    { uuid: parsed.uuid, session: parsed.session },
    parsed.signature,
  )
  if (!sigOk) {
    return NextResponse.json({}, { status: 401 })
  }

  if (!sessionData?._id) {
    return NextResponse.json({}, { status: 500 })
  }

  const updated = await addLinkedDevice(sessionData._id, {
    uuid: parsed.uuid,
    webPrivateKeyPem: security.privateKeyPem,
    mobilePublicKeyPem: mobilePublicKey,
    createdAt: Date.now(),
  })
  if (!updated) {
    return NextResponse.json({}, { status: 500 })
  }

  await clearSessionSecurityArtifacts(parsed.session)

  const user = await getUser({ _id: sessionData._id })
  if (!user) {
    return NextResponse.json({}, { status: 500 })
  }

  await saveLoginInfo(user)

  const newSession = uuidv4()
  await set({ key: newSession, data: user, timetolive: SESSION_TTL_MS })

  return NextResponse.json(
    {
      session: newSession,
      profile: user.profile,
      email: user.email,
      webPublicKey: security.publicKeyPem,
    },
    { status: 200 },
  )
}
