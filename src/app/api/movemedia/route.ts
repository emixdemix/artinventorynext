import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { movePictureToFolder } from '@/server/db/database'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const folder = body.destination
  const mediaId = body.mediaId

  if (!folder || (folder as string)?.startsWith('__profile') || !mediaId) {
    return NextResponse.json({}, { status: 417 })
  }

  if (await movePictureToFolder(mediaId, folder, info)) {
    return NextResponse.json({}, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 404 })
  }
}
