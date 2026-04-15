import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { createS3Folder, removeS3Folder } from '@/server/s3'
import { ARTINVENTORY_BUCKET } from '@/server/interfaces'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const folder = body.folder

  if (!folder || (folder as string)?.startsWith('__profile')) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    const filename = `${info._id}/${folder}/`
    await createS3Folder(ARTINVENTORY_BUCKET, filename)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const folder = request.nextUrl.searchParams.get('folder')

  if (!folder || (folder as string)?.startsWith('__profile')) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    const filename = `${info._id}/${folder}/`
    await removeS3Folder(ARTINVENTORY_BUCKET, filename)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
