import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getArtSelections, removeFromSelection, deleteSelection } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const id = request.nextUrl.searchParams.get('id')
  if (!id) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await getArtSelections({
    _id: new ObjectId(id),
    owner: new ObjectId(userId as string)
  })
  return NextResponse.json(response, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selectionId || !body.ids) {
    return NextResponse.json({}, { status: 417 })
  }

  const response = await removeFromSelection({
    selectionId: body.selectionId,
    ids: body.ids,
    owner: new ObjectId(userId as string)
  })

  if (response.code === 0x0000) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 417 })
  }
}

export async function DELETE(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const selectionId = request.nextUrl.searchParams.get('id')
  if (!selectionId) {
    return NextResponse.json({}, { status: 417 })
  }

  const owner = new ObjectId(userId as string)
  const record = await deleteSelection(selectionId, owner)
  if (record.deletedCount <= 0) {
    return NextResponse.json({}, { status: 404 })
  }

  return NextResponse.json({}, { status: 200 })
}
