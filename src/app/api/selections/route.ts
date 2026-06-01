import { NextRequest, NextResponse } from 'next/server'
import { validateToken } from '@/server/auth'
import {
  getArtSelections,
  getArtpiecesPictureKeys,
  updateSelection,
} from '@/server/db/database'
import { isRekognitionEnabled } from '@/server/rekognition'
import { runModerationScanAndAlert } from '@/server/rekognition/scan'
import { ObjectId } from 'mongodb'

const scheduleAddedScan = (args: {
  selectionId: string
  owner: ObjectId
  origin: string
  addedArtpieceIds: string[]
}): void => {
  if (!isRekognitionEnabled()) return
  if (!args.addedArtpieceIds.length) return
  void (async () => {
    const pictures = await getArtpiecesPictureKeys(
      args.addedArtpieceIds,
      args.owner,
    )
    if (!pictures.length) return
    await runModerationScanAndAlert({
      selectionId: args.selectionId,
      owner: args.owner,
      origin: args.origin,
      pictures,
      scope: 'add',
    })
  })().catch((e) => {
    console.error(
      '[rekognition] moderation scan (add) failed',
      (e as Error).message,
    )
  })
}

export async function GET(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const response = await getArtSelections({ owner: new ObjectId(userId as string) })
  return NextResponse.json(response, { status: 200 })
}

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selections) {
    return NextResponse.json({}, { status: 417 })
  }

  if (!body.name && !body.selectionId) {
    return NextResponse.json({}, { status: 417 })
  }

  const sels = body.selections.map((item: string) => new ObjectId(item))
  const owner = new ObjectId(userId as string)

  const response = await updateSelection({
    selectionId: body.selectionId,
    name: body.name,
    selections: sels,
    owner,
  })

  if (response.code === 0x0000) {
    if (response.published && response.addedArtpieceIds?.length) {
      scheduleAddedScan({
        selectionId: body.selectionId,
        owner,
        origin: request.nextUrl.origin,
        addedArtpieceIds: response.addedArtpieceIds,
      })
    }
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 417 })
  }
}

export async function PUT(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  const userId = auth.user._id

  const body = await request.json()

  if (!body.selections && !body.selectionId) {
    return NextResponse.json({}, { status: 417 })
  }

  const sels = body.selections.map((item: string) => new ObjectId(item))
  const owner = new ObjectId(userId as string)

  const response = await updateSelection({
    replace: true,
    selectionId: body.selectionId,
    selections: sels,
    owner,
  })

  if (response.code === 0x0000) {
    if (response.published && response.addedArtpieceIds?.length) {
      scheduleAddedScan({
        selectionId: body.selectionId,
        owner,
        origin: request.nextUrl.origin,
        addedArtpieceIds: response.addedArtpieceIds,
      })
    }
    return NextResponse.json(response, { status: 200 })
  } else {
    return NextResponse.json(response, { status: 417 })
  }
}
