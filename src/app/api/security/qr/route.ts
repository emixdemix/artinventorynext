import { NextRequest, NextResponse } from 'next/server'
import { generateKeyPairSync, randomUUID, createSign } from 'crypto'

import { validateToken } from '@/server/auth'
import { setSessionSecurityArtifacts } from '@/server/db/session'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })

  const session = request.headers.get('X-Token')
  if (!session) return NextResponse.json({}, { status: 400 })

  try {
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicExponent: 0x10001,
    })

    const publicKeyPem = publicKey.export({ type: 'spki', format: 'pem' }).toString()
    const privateKeyPem = privateKey.export({ type: 'pkcs8', format: 'pem' }).toString()

    const uuid = randomUUID()

    const payload = { uuid, session }
    const canonical = JSON.stringify(payload)

    const signer = createSign('RSA-SHA256')
    signer.update(canonical)
    signer.end()
    const signature = signer
      .sign({
        key: privateKey,
        padding: 6, // RSA_PKCS1_PSS_PADDING
        saltLength: 32,
      })
      .toString('base64')

    const qrPayload = JSON.stringify({ ...payload, signature })

    const updated = await setSessionSecurityArtifacts(session, {
      qrPayload,
      publicKeyPem,
      privateKeyPem,
      uuid,
    })

    if ('code' in updated) {
      return NextResponse.json({}, { status: 500 })
    }

    return NextResponse.json({ qr: qrPayload }, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
