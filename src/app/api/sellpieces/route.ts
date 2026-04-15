import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { sellArtPieces } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()
  const { customerId, artPieces } = body

  if (!customerId || !artPieces) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await sellArtPieces({
    customerId,
    pieces: artPieces,
    owner: new ObjectId(userId as string)
  })
  return NextResponse.json(response, { status: 200 })
}
