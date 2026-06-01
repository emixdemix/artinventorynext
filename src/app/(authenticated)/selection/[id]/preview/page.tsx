'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import { useTranslation } from 'react-i18next'
import axios from 'axios'
import { PublicSelectionView } from '@/components/public-selection'

interface PreviewArtpiece {
  _id: string
  title: string
  dimensions: string
  media: string
  description: string
  creation_date: string
  price: number
  pictureIds: string[]
}

interface PreviewData {
  selection: { _id: string; name: string; showPrice: boolean }
  owner: {
    userurl: string
    name?: string
    statement?: string
    picture?: string
    signature?: string
    valuta?: string
  }
  artpieces: PreviewArtpiece[]
  pictureMap: Record<string, string>
}

export default function PreviewPage() {
  const params = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [data, setData] = useState<PreviewData | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!params?.id) return
    const session = localStorage.getItem('session')
    if (!session) {
      setError('not_authenticated')
      return
    }
    axios
      .get('/api/selection/preview', {
        params: { id: params.id },
        headers: { 'X-Token': session },
      })
      .then((res) => setData(res.data as PreviewData))
      .catch(() => setError('not_found'))
  }, [params?.id])

  const fetchImage = useCallback(
    async (pictureId: string): Promise<string> => {
      if (!data) return ''
      const url = data.pictureMap[pictureId]
      if (!url) return ''
      const session = localStorage.getItem('session')
      if (!session) return ''
      try {
        const res = await axios.get('/api/image', {
          params: { image: url },
          headers: { 'X-Token': session },
        })
        if (res.status === 200 && typeof res.data === 'string') return res.data
        return ''
      } catch {
        return ''
      }
    },
    [data],
  )

  const artpieces = useMemo(
    () =>
      (data?.artpieces || []).map((p) => ({
        id: p._id,
        title: p.title,
        dimensions: p.dimensions,
        media: p.media,
        description: p.description,
        creation_date: p.creation_date,
        price: p.price,
        pictureIds: p.pictureIds,
      })),
    [data],
  )

  if (error) {
    return (
      <section className="edit">
        <p>Preview unavailable.</p>
      </section>
    )
  }
  if (!data) {
    return (
      <section className="edit">
        <p>Loading...</p>
      </section>
    )
  }

  return (
    <PublicSelectionView
      userurl={data.owner.userurl || ''}
      selectionname={data.selection._id}
      ownerName={data.owner.name || ''}
      ownerPicture={data.owner.picture || ''}
      ownerSignature={data.owner.signature || ''}
      statement={data.owner.statement || ''}
      selectionName={data.selection.name}
      showPrice={data.selection.showPrice}
      valuta={data.owner.valuta || ''}
      artpieces={artpieces}
      fetchImage={fetchImage}
      previewBanner={t('general.publish.previewbanner')}
    />
  )
}
