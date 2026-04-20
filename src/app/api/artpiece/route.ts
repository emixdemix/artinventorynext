import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { addArtPiece, getArtPieces, updateArtPiece, deleteArtPiece } from '@/server/db/database'
import { putObject } from '@/server/s3'
import { ARTINVENTORY_BUCKET } from '@/server/interfaces'
import { ObjectId } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import sharp from 'sharp'
import { getPostHogClient } from '@/lib/posthog-server'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  const response = await getArtPieces({ _id: new ObjectId(id as string), owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const formData = await request.formData()
  const file = formData.get('document') as File | null
  const title = formData.get('title') as string
  const imageId = formData.get('imageId') as string

  if (!title || (!file && !imageId)) {
    return NextResponse.json({}, { status: 417 })
  }

  const body: Record<string, string> = {}
  for (const [key, value] of Array.from(formData.entries())) {
    if (key !== 'document') {
      body[key] = value as string
    }
  }

  if (imageId) {
    try {
      await addArtPiece(body, '', {} as any, info, Buffer.from(''))
      getPostHogClient().capture({
        distinctId: String(info._id),
        event: 'art_piece_created',
        properties: { title }
      })
      return NextResponse.json({}, { status: 200 })
    } catch (e) {
      return NextResponse.json({}, { status: 500 })
    }
  } else {
    const fileBuffer = Buffer.from(await file!.arrayBuffer())
    const random = uuidv4()
    const filename = `${info._id}/${random}`

    try {
      await putObject(ARTINVENTORY_BUCKET, filename, fileBuffer)
      const size = await sharp(fileBuffer).metadata()
      await addArtPiece(body, random, size, info, fileBuffer)
      getPostHogClient().capture({
        distinctId: String(info._id),
        event: 'art_piece_created',
        properties: { title }
      })
      return NextResponse.json({}, { status: 200 })
    } catch (e) {
      return NextResponse.json({}, { status: 500 })
    }
  }
}

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const formData = await request.formData()
  const file = formData.get('document') as File | null
  const title = formData.get('title') as string

  if (!title) {
    return NextResponse.json({}, { status: 417 })
  }

  const body: Record<string, string> = {}
  for (const [key, value] of Array.from(formData.entries())) {
    if (key !== 'document') {
      body[key] = value as string
    }
  }

  const record = await getArtPieces({ owner: info._id, _id: new ObjectId(body.artPieceId as string) })
  if (record.length <= 0) {
    return NextResponse.json({}, { status: 404 })
  }

  if (file) {
    const fileBuffer = Buffer.from(await file.arrayBuffer())
    const random = uuidv4()
    const filename = `${info._id}/${random}`

    try {
      await putObject(ARTINVENTORY_BUCKET, filename, fileBuffer)
      const size = await sharp(fileBuffer).metadata()
      await updateArtPiece(body, random, size, info, fileBuffer)
      return NextResponse.json({}, { status: 200 })
    } catch (e) {
      return NextResponse.json({}, { status: 500 })
    }
  } else {
    await updateArtPiece(body, '', {} as any, info, Buffer.from(''))
    return NextResponse.json({}, { status: 200 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const artPieceId = request.nextUrl.searchParams.get('artPieceId')
  if (!artPieceId) {
    return NextResponse.json({}, { status: 417 })
  }

  const record = await deleteArtPiece(artPieceId, info)
  if (record.deletedCount <= 0) {
    return NextResponse.json({}, { status: 404 })
  }

  getPostHogClient().capture({
    distinctId: String(info._id),
    event: 'art_piece_deleted',
    properties: { art_piece_id: artPieceId }
  })

  return NextResponse.json({}, { status: 200 })
}
