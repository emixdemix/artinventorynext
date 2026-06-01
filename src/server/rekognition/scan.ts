import { ObjectId } from 'mongodb'
import {
  getArtSelections,
  getUser,
} from '@/server/db/database'
import { slugify } from '@/server/utility/slug'
import { isRekognitionEnabled, scanKeys } from './index'
import { sendModerationAlert } from './alert'

interface RunModerationScanArgs {
  selectionId: string
  owner: ObjectId
  origin: string
  pictures: { pictureId: string; key: string }[]
  scope: 'publish' | 'add'
}

export const runModerationScanAndAlert = async (
  args: RunModerationScanArgs,
): Promise<void> => {
  if (!isRekognitionEnabled()) return
  const { selectionId, owner, origin, pictures, scope } = args
  if (!pictures.length && scope === 'add') return

  const report = await scanKeys(pictures)

  const [selectionDoc] = await getArtSelections({
    _id: new ObjectId(selectionId),
    owner,
  })
  const user = await getUser({ _id: owner })
  const userurl = user?.profile?.userurl || ''
  const selectionName: string =
    (selectionDoc as { name?: string })?.name || ''
  const slug = slugify(selectionName)
  const publicUrl = userurl && slug ? `${origin}/${userurl}/${slug}` : origin

  await sendModerationAlert({
    publicUrl,
    ownerEmail: user?.email || '',
    ownerName: user?.profile?.name,
    selectionName,
    report,
    scope,
  })
}
