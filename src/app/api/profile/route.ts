import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getUser, updateProfile } from '@/server/db/database'
import { putObject } from '@/server/s3'
import { ARTINVENTORY_BUCKET } from '@/server/interfaces'
import { v4 as uuidv4 } from 'uuid'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const response = await getUser({ _id: userId })
  if (response) {
    return NextResponse.json(response.profile, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 403 })
  }
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
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

    const profile = await updateProfile(body, info, file ? Buffer.from(await file.arrayBuffer()) : null, filename)
    return NextResponse.json(profile, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
