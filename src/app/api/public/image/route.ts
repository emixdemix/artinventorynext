import { NextRequest, NextResponse } from 'next/server'
import { isPictureInPublishedSelection } from '@/server/db/database'
import { getImageOriginal } from '@/server/utility/image'
import { isValidUserUrl } from '@/server/utility/slug'

export async function GET(request: NextRequest) {
  const userurl = (request.nextUrl.searchParams.get('userurl') || '').toLowerCase()
  const selection = request.nextUrl.searchParams.get('selection') || ''
  const pictureId = request.nextUrl.searchParams.get('pictureId') || ''

  if (!userurl || !selection || !pictureId) {
    return NextResponse.json({}, { status: 400 })
  }
  if (!isValidUserUrl(userurl)) {
    return NextResponse.json({}, { status: 404 })
  }

  const gate = await isPictureInPublishedSelection(userurl, selection, pictureId)
  if (!gate.ok || !gate.key) {
    return NextResponse.json({}, { status: 404 })
  }

  const b64 = await getImageOriginal(gate.key)
  if (!b64) {
    return NextResponse.json({}, { status: 404 })
  }

  return NextResponse.json(b64, {
    status: 200,
    headers: { 'Cache-Control': 'public, max-age=604800, immutable' },
  })
}
