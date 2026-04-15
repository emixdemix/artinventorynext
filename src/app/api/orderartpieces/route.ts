import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { orderArtPieces } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()
  const ids = body.ids

  if (!Array.isArray(ids)) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await orderArtPieces({ ids, owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}
