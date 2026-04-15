import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getFeedback, addFeedback } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  const owner = new ObjectId(userId as string)
  const response = await getFeedback(id as string, owner)
  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const { option, description } = body

  if (!option || !description) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    await addFeedback(body, info)
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
