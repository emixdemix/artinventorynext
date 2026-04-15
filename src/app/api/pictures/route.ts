import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getPictures } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const response = await getPictures({ owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}
