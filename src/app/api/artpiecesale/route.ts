import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getSalesArtPieces } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const response = await getSalesArtPieces({ owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}
