import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getImageOriginal, getImageS3 } from '@/server/utility/image'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const image = request.nextUrl.searchParams.get('image')
  if (!image) {
    return NextResponse.json({}, { status: 417 })
  }

  const path = `${info._id}/${image}`
  const h = request.nextUrl.searchParams.get('h')
  const w = request.nextUrl.searchParams.get('w')

  if (h && w) {
    const response = await getImageS3(path, parseInt(w), parseInt(h))
    return NextResponse.json(response, { status: 200 })
  }

  const response = await getImageOriginal(path)
  return NextResponse.json(response, { status: 200 })
}
