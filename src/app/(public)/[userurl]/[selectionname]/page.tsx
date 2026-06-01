import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import { getPublicSelection } from '@/server/db/database'
import { isValidUserUrl } from '@/server/utility/slug'
import { PublicSelectionView } from '@/components/public-selection'

type RouteParams = { userurl: string; selectionname: string }

export async function generateMetadata(
  { params }: { params: Promise<RouteParams> },
): Promise<Metadata> {
  const { userurl, selectionname } = await params
  if (!isValidUserUrl(userurl)) return { title: 'Art Inventory' }
  const data = await getPublicSelection(userurl, selectionname)
  if (!data) return { title: 'Art Inventory' }

  const title = `${data.selection.name} by ${data.owner.name || userurl}`
  const description = data.owner.statement || ''
  return {
    title,
    description,
    openGraph: { title, description, type: 'website' },
    twitter: { card: 'summary_large_image', title, description },
  }
}

export default async function Page(
  { params }: { params: Promise<RouteParams> },
) {
  const { userurl, selectionname } = await params
  if (!isValidUserUrl(userurl)) notFound()

  const data = await getPublicSelection(userurl, selectionname)
  if (!data) notFound()

  return (
    <PublicSelectionView
      userurl={userurl}
      selectionname={selectionname}
      ownerName={data.owner.name || ''}
      ownerPicture={data.owner.picture || ''}
      ownerSignature={data.owner.signature || ''}
      statement={data.owner.statement || ''}
      selectionName={data.selection.name}
      showPrice={data.selection.showPrice}
      valuta={data.owner.valuta || ''}
      artpieces={data.artpieces.map((p) => ({
        id: p._id.toString(),
        title: p.title,
        dimensions: p.dimensions,
        media: p.media,
        description: p.description,
        creation_date: p.creation_date,
        price: p.price,
        pictureIds: p.pictureIds,
      }))}
    />
  )
}
