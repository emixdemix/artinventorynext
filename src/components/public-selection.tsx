'use client'

import { useCallback, useEffect, useState } from 'react'
import axios from 'axios'
import useEmblaCarousel from 'embla-carousel-react'

interface PublicArtpiece {
  id: string
  title: string
  dimensions: string
  media: string
  description: string
  creation_date: string
  price: number
  pictureIds: string[]
}

type FetchImage = (pictureId: string) => Promise<string>

interface Props {
  userurl: string
  selectionname: string
  ownerName: string
  ownerPicture: string
  ownerSignature: string
  statement: string
  selectionName: string
  showPrice: boolean
  valuta?: string
  artpieces: PublicArtpiece[]
  fetchImage?: FetchImage
  previewBanner?: string
}

const currencySymbol = (valuta?: string): string => {
  if (valuta === 'dollar') return '$'
  return '€'
}

const formatPrice = (price: number | string, valuta?: string): string => {
  const n = typeof price === 'number' ? price : parseFloat(price)
  if (!Number.isFinite(n)) return ''
  const locale = valuta === 'dollar' ? 'en-US' : 'de-DE'
  const formatted = new Intl.NumberFormat(locale, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
  return `${currencySymbol(valuta)} ${formatted}`
}

const STATEMENT_PREVIEW_CHARS = 200

const StatementWithReadMore = ({ statement }: { statement: string }) => {
  const [expanded, setExpanded] = useState(false)
  if (!statement) return null
  if (statement.length <= STATEMENT_PREVIEW_CHARS) {
    return <p className="smallText publicSelectionStatement">{statement}</p>
  }
  const preview = statement.slice(0, STATEMENT_PREVIEW_CHARS).trimEnd()
  return (
    <p className="smallText publicSelectionStatement">
      {expanded ? statement : `${preview}...`}{' '}
      <button
        type="button"
        className="publicSelectionReadMore"
        onClick={() => setExpanded((v) => !v)}
      >
        {expanded ? 'Read less' : 'Read more'}
      </button>
    </p>
  )
}

const fetchPublicImage = async (
  userurl: string,
  selection: string,
  pictureId: string,
): Promise<string> => {
  try {
    const res = await axios.get(`/api/public/image`, {
      params: { userurl, selection, pictureId },
      headers: { 'Cache-Control': 'max-age=604800' },
    })
    if (res.status === 200 && typeof res.data === 'string') {
      return res.data
    }
    return ''
  } catch {
    return ''
  }
}

const PieceImage = ({
  userurl,
  selection,
  pictureId,
  alt,
  fetchImage,
}: {
  userurl: string
  selection: string
  pictureId: string
  alt: string
  fetchImage?: FetchImage
}) => {
  const [src, setSrc] = useState('')

  useEffect(() => {
    let cancelled = false
    const loader = fetchImage
      ? fetchImage(pictureId)
      : fetchPublicImage(userurl, selection, pictureId)
    loader.then((b64) => {
      if (cancelled) return
      if (b64) setSrc(`data:image/jpeg;base64,${b64}`)
    })
    return () => {
      cancelled = true
    }
  }, [userurl, selection, pictureId, fetchImage])

  if (!src) {
    return (
      <span
        className="publicSelectionSpinner"
        role="status"
        aria-label="Loading"
      />
    )
  }
  return <img src={src} alt={alt} />
}

const Lightbox = ({
  userurl,
  selection,
  piece,
  showPrice,
  valuta,
  onClose,
  fetchImage,
}: {
  userurl: string
  selection: string
  piece: PublicArtpiece
  showPrice: boolean
  valuta?: string
  onClose: () => void
  fetchImage?: FetchImage
}) => {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose])

  const pictureId = piece.pictureIds?.[0]

  return (
    <div
      className="publicSelectionLightbox"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        className="publicSelectionLightboxClose"
        onClick={onClose}
        aria-label="Close"
      >
        ×
      </button>
      <div
        className="publicSelectionLightboxContent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="publicSelectionLightboxImage">
          {pictureId && (
            <PieceImage
              userurl={userurl}
              selection={selection}
              pictureId={pictureId}
              alt={piece.title}
              fetchImage={fetchImage}
            />
          )}
        </div>
        <div className="publicSelectionLightboxMeta">
          {piece.title && (
            <p className="strong publicSelectionTitle">{piece.title}</p>
          )}
          {(piece.dimensions || piece.media || piece.creation_date) && (
            <p className="smallerText publicSelectionDidascalia">
              {[piece.dimensions, piece.media, piece.creation_date]
                .filter(Boolean)
                .join(', ')}
            </p>
          )}
          {piece.description && (
            <p className="smallText">{piece.description}</p>
          )}
          {showPrice && piece.price ? (
            <p className="smallText strong">{formatPrice(piece.price, valuta)}</p>
          ) : null}
        </div>
      </div>
    </div>
  )
}

export const PublicSelectionView = ({
  userurl,
  selectionname,
  ownerName,
  ownerPicture,
  ownerSignature,
  statement,
  selectionName,
  showPrice,
  valuta,
  artpieces,
  fetchImage,
  previewBanner,
}: Props) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    containScroll: 'trimSnaps',
    dragFree: true,
    loop: false,
  })
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)
  const [zoomedId, setZoomedId] = useState<string | null>(null)

  const updateNav = useCallback((api: typeof emblaApi) => {
    if (!api) return
    setCanPrev(api.canScrollPrev())
    setCanNext(api.canScrollNext())
  }, [])

  useEffect(() => {
    if (!emblaApi) return
    updateNav(emblaApi)
    emblaApi.on('select', updateNav)
    emblaApi.on('reInit', updateNav)
    return () => {
      emblaApi.off('select', updateNav)
      emblaApi.off('reInit', updateNav)
    }
  }, [emblaApi, updateNav])

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  return (
    <section className="edit publicSelection">
      {previewBanner && (
        <div className="publicSelectionPreviewBanner">{previewBanner}</div>
      )}
      <header className="paddingV">
        <h1>{selectionName}</h1>
        {(ownerName || ownerPicture || ownerSignature || statement) && (
          <div className="publicSelectionAuthorBox">
            {ownerPicture && (
              <div className="publicSelectionAuthorPicture">
                <img
                  src={`data:image/png;base64,${ownerPicture}`}
                  alt={ownerName || 'Artist'}
                />
              </div>
            )}
            <div className="publicSelectionAuthorMeta">
              {ownerName && (
                <p className="strong publicSelectionAuthorName">{ownerName}</p>
              )}
              {ownerSignature && (
                <p className="smallerText publicSelectionAuthorSignature">
                  {ownerSignature}
                </p>
              )}
              <StatementWithReadMore statement={statement} />
            </div>
          </div>
        )}
      </header>

      <div className="publicSelectionCarousel">
        <button
          type="button"
          className="publicSelectionNav publicSelectionNavPrev"
          onClick={scrollPrev}
          disabled={!canPrev}
          aria-label="Previous"
        >
          ‹
        </button>
        <div className="publicSelectionViewport" ref={emblaRef}>
          <div className="publicSelectionTrack">
            {artpieces.map((piece) => {
              const pictureId = piece.pictureIds?.[0]
              return (
                <article key={piece.id} className="publicSelectionCard">
                  <button
                    type="button"
                    className="publicSelectionImageWrap publicSelectionImageButton"
                    onClick={() => setZoomedId(piece.id)}
                    aria-label={`Zoom ${piece.title || 'artwork'}`}
                  >
                    {pictureId && (
                      <PieceImage
                        userurl={userurl}
                        selection={selectionname}
                        pictureId={pictureId}
                        alt={piece.title}
                        fetchImage={fetchImage}
                      />
                    )}
                  </button>
                  <div className="publicSelectionMeta">
                    {piece.title && (
                      <p className="strong publicSelectionTitle">{piece.title}</p>
                    )}
                    {(piece.dimensions || piece.media || piece.creation_date) && (
                      <p className="smallerText publicSelectionDidascalia">
                        {[piece.dimensions, piece.media, piece.creation_date]
                          .filter(Boolean)
                          .join(', ')}
                      </p>
                    )}
                    {piece.description && (
                      <p className="smallText">{piece.description}</p>
                    )}
                    {showPrice && piece.price ? (
                      <p className="smallText strong">{formatPrice(piece.price, valuta)}</p>
                    ) : null}
                  </div>
                </article>
              )
            })}
          </div>
        </div>
        <button
          type="button"
          className="publicSelectionNav publicSelectionNavNext"
          onClick={scrollNext}
          disabled={!canNext}
          aria-label="Next"
        >
          ›
        </button>
      </div>

      {zoomedId && (
        <Lightbox
          userurl={userurl}
          selection={selectionname}
          piece={artpieces.find((p) => p.id === zoomedId)!}
          showPrice={showPrice}
          valuta={valuta}
          onClose={() => setZoomedId(null)}
          fetchImage={fetchImage}
        />
      )}
    </section>
  )
}
