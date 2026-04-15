import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { addMedia, deleteMedia } from '@/server/db/database'
import { putObject } from '@/server/s3'
import { ARTINVENTORY_BUCKET } from '@/server/interfaces'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const formData = await request.formData()
  const file = formData.get('document') as File | null
  const name = formData.get('name') as string

  if (!name || !file) {
    return NextResponse.json({}, { status: 417 })
  }

  let folder = (formData.get('folder') as string) || '/'

  const fileBuffer = Buffer.from(await file.arrayBuffer())
  const sh = sharp(fileBuffer)
  const metadata = await sh.metadata()

  const random = `${folder.substring(1)}${uuidv4()}.${metadata.format}`
  const filename = `${info._id}/${random}`

  try {
    await putObject(ARTINVENTORY_BUCKET, filename, fileBuffer)

    const body: Record<string, string> = {}
    for (const [key, value] of Array.from(formData.entries())) {
      if (key !== 'document') {
        body[key] = value as string
      }
    }

    await addMedia(body, random, info, fileBuffer)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const mediaId = request.nextUrl.searchParams.get('mediaId')
  if (!mediaId) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const record = await deleteMedia(mediaId, owner)
  if ((record && record.deletedCount <= 0) || !record) {
    return NextResponse.json({}, { status: 404 })
  }

  return NextResponse.json({}, { status: 200 })
}
