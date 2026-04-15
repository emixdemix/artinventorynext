import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getShows, addShow, updateShow } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const owner = new ObjectId(userId as string)
  const response = await getShows(owner)
  return NextResponse.json(response, { status: 200 })
}

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const { name, _id } = body

  if (!name) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    if (_id) {
      await updateShow(body, info)
    } else {
      await addShow(body, info)
    }
    return NextResponse.json({}, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}
