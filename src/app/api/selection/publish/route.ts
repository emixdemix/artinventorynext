import { NextRequest, NextResponse } from 'next/server'
import { ObjectId } from 'mongodb'
import { validateToken } from '@/server/auth'
import { hasPlan } from '@/server/auth/plan'
import {
  getSelectionPictureKeys,
  getUser,
  setSelectionPublished,
} from '@/server/db/database'
import { isRekognitionEnabled } from '@/server/rekognition'
import { runModerationScanAndAlert } from '@/server/rekognition/scan'

export async function PATCH(request: NextRequest) {
  const auth = await validateToken(request)
  if (!auth) return NextResponse.json({}, { status: 401 })
  if (!hasPlan(auth.user, 'full')) {
    return NextResponse.json(
      { error: 'plan_required', required: 'full' },
      { status: 403 },
    )
  }
  const userId = auth.user._id

  const body = await request.json()
  if (!body.selectionId) {
    return NextResponse.json({ error: 'missing_selectionId' }, { status: 400 })
  }

  const owner = new ObjectId(userId as string)

  if (body.published) {
    const user = await getUser({ _id: owner })
    if (!user?.profile?.userurl) {
      return NextResponse.json({ error: 'userurl_required' }, { status: 400 })
    }
  }

  const response = await setSelectionPublished({
    selectionId: body.selectionId,
    owner,
    published: !!body.published,
    showPrice: !!body.showPrice,
  })

  if (response.code === 0x0000) {
    if (body.published && isRekognitionEnabled()) {
      const origin = request.nextUrl.origin
      const selectionId = body.selectionId
      void (async () => {
        const pictures = await getSelectionPictureKeys(selectionId, owner)
        await runModerationScanAndAlert({
          selectionId,
          owner,
          origin,
          pictures,
          scope: 'publish',
        })
      })().catch((e) => {
        console.error(
          '[rekognition] moderation scan failed',
          (e as Error).message,
        )
      })
    }
    return NextResponse.json(response, { status: 200 })
  }
  return NextResponse.json(response, { status: 417 })
}
