import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { findUserByUserurl, getUser, updateProfile } from '@/server/db/database'
import { putObject } from '@/server/s3'
import { ARTINVENTORY_BUCKET } from '@/server/interfaces'
import { isValidUserUrl } from '@/server/utility/slug'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const response = await getUser({ _id: userId })
  if (response) {
    return NextResponse.json(
      { ...(response.profile ?? {}), plan: response.plan || 'free' },
      { status: 200 },
    )
  } else {
    return NextResponse.json({}, { status: 403 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const info = auth.user

  const formData = await request.formData()
  const file = formData.get('document') as File | null
  let filename = ''

  try {
    let fileBuffer: Buffer | undefined
    if (file) {
      const random = uuidv4()
      filename = `${info._id}/__profile/${random}`
      fileBuffer = Buffer.from(await file.arrayBuffer())
      await putObject(ARTINVENTORY_BUCKET, filename, fileBuffer)
    }

    const body: Record<string, string> = {}
    for (const [key, value] of Array.from(formData.entries())) {
      if (key !== 'document') {
        body[key] = value as string
      }
    }

    if (typeof body.userurl === 'string') {
      const trimmed = body.userurl.trim().toLowerCase()
      if (trimmed === '') {
        body.userurl = ''
      } else {
        if (!isValidUserUrl(trimmed)) {
          return NextResponse.json({ error: 'invalid_userurl' }, { status: 400 })
        }
        const existing = await findUserByUserurl(trimmed)
        if (existing && String(existing._id) !== String(info._id)) {
          return NextResponse.json({ error: 'userurl_taken' }, { status: 409 })
        }
        body.userurl = trimmed
      }
    }

    const profile = await updateProfile(body, info, file ? Buffer.from(await file.arrayBuffer()) : null, filename)
    return NextResponse.json(
      { ...(profile ?? {}), plan: info.plan || 'free' },
      { status: 200 },
    )
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
