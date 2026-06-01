import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { validateToken } from '@/server/auth'
import {
  getOwnedSelectionForPreview,
  getPicturesByIds,
} from '@/server/db/database'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({}, { status: 400 })

  const data = await getOwnedSelectionForPreview(
    id,
    new ObjectId(userId as string),
  )
  if (!data) return NextResponse.json({}, { status: 404 })

  const pictureIds = Array.from(
    new Set(data.artpieces.flatMap((p) => p.pictureIds)),
  )
  const pictures = await getPicturesByIds(pictureIds)
  const pictureMap: Record<string, string> = {}
  for (const p of pictures) {
    pictureMap[p._id.toString()] = p.url
  }

  return NextResponse.json(
    {
      selection: data.selection,
      owner: data.owner,
      artpieces: data.artpieces.map((p) => ({
        ...p,
        _id: p._id.toString(),
      })),
      pictureMap,
    },
    { status: 200 },
  )
}
