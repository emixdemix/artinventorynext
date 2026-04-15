import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getCategories } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const type = request.nextUrl.searchParams.get('type')

  if (type === 'all') {
    const response = await getCategories({ owner: new ObjectId(userId as string) })
    return NextResponse.json(response, { status: 200 })
  } else {
    const response = await getCategories({ type, owner: new ObjectId(userId as string) })
    return NextResponse.json(response, { status: 200 })
  }
}
