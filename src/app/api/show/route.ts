import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getShow, deleteShow } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const response = await getShow({ owner, _id: new ObjectId(id) })
  if (response) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 404 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const response = await deleteShow(id, owner)
  if (response) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json({}, { status: 404 })
  }
}
