import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { addCategory, deleteCategory, getArtPieces, removeCategoryFromArtPieces } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function POST(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const info = auth.user

  const body = await request.json()
  const { label, value, type } = body

  if (!label || !value || !type) {
    return NextResponse.json({}, { status: 417 })
  }

  try {
    const response = await addCategory({ label, value, type }, info)
    return NextResponse.json(response, { status: 200 })
  } catch (e) {
    return NextResponse.json({}, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  const force = request.nextUrl.searchParams.get('force')

  if (!id) {
    return NextResponse.json({}, { status: 419 })
  }

  const owner = new ObjectId(userId as string)

  const response = await getArtPieces({ owner, categories: new ObjectId(id) })
  if (response.length > 0) {
    if (force === 'true') {
      removeCategoryFromArtPieces(id)
    } else {
      return NextResponse.json({}, { status: 417 })
    }
  }

  deleteCategory(id, owner)
  return NextResponse.json({}, { status: 200 })
}
