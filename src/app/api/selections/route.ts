import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import { getArtSelections, updateSelection } from '@/server/db/database'
import { ObjectId } from 'mongodb'

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const response = await getArtSelections({ owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selections) {
    return NextResponse.json({}, { status: 417 })
  }

  if (!body.name && !body.selectionId) {
    return NextResponse.json({}, { status: 417 })
  }

  const sels = body.selections.map((item: string) => new ObjectId(item))

  const response = await updateSelection({
    selectionId: body.selectionId,
    name: body.name,
    selections: sels,
    owner: new ObjectId(userId as string)
  })

  if (response.code === 0x0000) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 417 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 403 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selections && !body.selectionId) {
    return NextResponse.json({}, { status: 417 })
  }

  const sels = body.selections.map((item: string) => new ObjectId(item))

  const response = await updateSelection({
    replace: true,
    selectionId: body.selectionId,
    selections: sels,
    owner: new ObjectId(userId as string)
  })

  if (response.code === 0x0000) {
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 417 })
  }
}
