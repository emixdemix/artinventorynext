import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { addMediaToArtpiece } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selections || !body.artPieceId) {
    return NextResponse.json({}, { status: 417 })
  }

  const sels: ObjectId[] = body.selections.map((item: string) => new ObjectId(item))

  try {
    const response = await addMediaToArtpiece({
      selections: sels,
      id: new ObjectId(body.artPieceId as string),
      owner: new ObjectId(userId as string)
    })
    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
