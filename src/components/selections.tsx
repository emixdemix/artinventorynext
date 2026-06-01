import { useContext, useEffect, useState } from "react"
import { apiDeleteSelection, apiPublishSelection, apiRemoveFromSelection, emitStore, getArtPieces, getSelection, getSelections, hideWaiting, showWaiting, slugify, updateSelectionOrder, useSwapOrderListener } from "./utility"
import { ArtPiece, ArtSelection } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { ArtPieceLine, ArtPieceLineList } from "./artpieceline"
import { ContextStorage } from "../store"
const trash = '/images/trash.svg'
import { Modal } from "./modal"
import { BackButton } from "./backbutton"
const empty = '/images/nothing.svg'

export const Selections = () => {
   const [selection, setSelection] = useState({} as ArtSelection)
   const [selections, setSelections] = useState([] as ArtSelection[])
   const [artPieces, setArtPieces] = useState([] as ArtPiece[])
   const [error, setError] = useState('')
   const store = useContext(ContextStorage);
   const { t } = useTranslation()
   const router = useRouter()
   const params = useParams();

   useSwapOrderListener(swap => {
      const selectedPieces = selection.artpieces
      const source = selectedPieces.findIndex(item => item._id === swap.source)
      const destination = selectedPieces.findIndex(item => item._id === swap.destination)
      if (source === destination) return

      const temp = selectedPieces[source]
      const newarray: ArtPiece[] = JSON.parse(JSON.stringify(selectedPieces.filter(item => item._id !== swap.source)))
      newarray.splice(destination, 0, temp)
      const piece = JSON.parse(JSON.stringify(selection))
      piece.artpieces = newarray
      setSelection(piece)
      updateSelectionOrder({ selections: newarray.map(item => item._id), selectionId: selection._id as string })
   })

   const reload = () => {
      if (params.id) {
         getSelection(params.id as string).then(data => {
            if (Array.isArray(data) && data.length > 0) {
               setSelection(data[0] as ArtSelection)
            } else {
               setSelection({} as ArtSelection)
            }
         })
      } else {
         if (selections.length > 0) {
            return
         }
         getSelections().then(data => {
            if (Array.isArray(data) && data.length > 0) {
               setSelections(data)
            } else {
               setSelections([])
            }
         })
      }
   }
   useEffect(() => {
      if (Array.isArray(store.artPieces)) {
         setArtPieces(store.artPieces)
      } else {
         showWaiting()
         getArtPieces().then(result => {
            hideWaiting()
            setArtPieces(result)
            emitStore({ key: 'artpieces', value: result, store: false })
         })
      }
   }, [])
   useEffect(() => {
      reload()
   }, [])

   const ShowSelections = () => {
      const [showDelete, setShowDelete] = useState('')

      const deleteSelection = async (id: string) => {
         showWaiting()
         apiDeleteSelection(id).then(response => {
            hideWaiting()
            setShowDelete('')
            router.refresh()
         })
      }

      return (
         <>
            <p className="breadcrumb">{t('general.showselection')}</p>
            <p className="smallText">{t('general.selections.publicintro')}</p>

            <section className="selection">
               {selections.map(item => {
                  return (
                     <div className="selectionBlock" onClick={() => router.push(`/selection/${item._id}`)}>
                        <p className="smallText strong">{item.name}</p>
                        <p className="smallerText">{item.artpieces?.length} {t('general.artwork')}</p>
                        {item.published && (
                           <span className="selectionPublicBadge">{t('general.publish.public')}</span>
                        )}
                        <img src={trash} onClick={(e) => { e.stopPropagation(); setShowDelete(item._id as string) }} className="smallImageW trash" />
                     </div>
                  )
               })}
            </section>
               {selections.length <=0 && <section className="flexC center  paddingV">
                        <img className="iconImageBig" src={empty} />
                        <p className="center">{t(`general.noselections`)}</p>
                        <p className="center">{t(`general.startselections`)}</p>
                     </section>
               }
            <Modal size="small" title={t('general.delete')} closeicon={""} visible={showDelete !== ''} onClose={function (): void {
                  setShowDelete('')
               }} >
                  <p>{t('general.suredelete')}</p>
                  {showDelete && <p className="strong">{selections.filter(item => item._id === showDelete)[0].name}</p>}

                  {error && <p className="error">{error}</p>}
                  <div className="buttonblock">
                     <button className="secondaryButton" onClick={() => setShowDelete('')}>{t('general.cancel')}</button>
                     <button className="primaryButton" onClick={() => { deleteSelection(showDelete) }}>{t('general.delete')}</button>
                  </div>
               </Modal>
         </>
      )
   }

   const EditSelection = () => {
      const [showPublish, setShowPublish] = useState(false)
      const [published, setPublished] = useState(!!selection.published)
      const [showPrice, setShowPrice] = useState(!!selection.showPrice)
      const [publishError, setPublishError] = useState('')
      const [copied, setCopied] = useState(false)
      const [showReportsUpsell, setShowReportsUpsell] = useState(false)
      const [showPublishUpsell, setShowPublishUpsell] = useState(false)

      useEffect(() => {
         setPublished(!!selection.published)
         setShowPrice(!!selection.showPrice)
      }, [selection._id, selection.published, selection.showPrice])

      const userurl = store.profile?.userurl
      const planAllowsPublish = (store.profile?.plan || 'free') === 'full'
      const planAllowsReports = (store.profile?.plan || 'free') !== 'free'
      const selectionSlug = slugify(selection.name || '')
      const publicUrl = userurl && selectionSlug
         ? `${typeof window !== 'undefined' ? window.location.origin : ''}/${userurl}/${selectionSlug}`
         : ''

      const deletePiece = async (id: string) => {
         showWaiting()
         apiRemoveFromSelection({ ids: [id], selectionId: selection._id as string }).then(response => {
            hideWaiting()
            router.refresh()
         })
      }

      const savePublish = async () => {
         if (published && !userurl) {
            setPublishError(t('general.publish.needsuserurl'))
            return
         }
         showWaiting()
         const res = await apiPublishSelection({
            selectionId: selection._id as string,
            published,
            showPrice,
         })
         hideWaiting()
         if (!res.ok) {
            if (res.error === 'userurl_required') setPublishError(t('general.publish.needsuserurl'))
            else setPublishError(t('general.error'))
            return
         }
         setShowPublish(false)
         setPublishError('')
         reload()
      }

      const copyLink = async () => {
         if (!publicUrl) return
         try {
            await navigator.clipboard.writeText(publicUrl)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
         } catch {}
      }

      return (
         <>
            <BackButton text={t('general.backto.selections')} where="/selection" />
            <div className="breadcrumb">
               <p className="">{t('general.editselection')}</p>
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => window.open(`/selection/${params.id}/preview`, '_blank', 'noopener,noreferrer')}>
                     {t('general.publish.preview')}
                  </button>
                  <button
                     className="secondaryButton"
                     onClick={() => planAllowsPublish ? setShowPublish(true) : setShowPublishUpsell(true)}
                  >
                     {selection.published ? t('general.publish.unpublish') : t('general.publish.action')}
                  </button>
                  <button
                     className="primaryButton"
                     onClick={() => planAllowsReports ? router.push(`/reports/${params.id}`) : setShowReportsUpsell(true)}
                  >
                     {t('general.createreport')}
                  </button>
               </div>
            </div>

            {selection.published && publicUrl && (
               <div className="smallText">
                  <p>
                     <a href={publicUrl} target="_blank" rel="noreferrer">{publicUrl}</a>
                     <button className="secondaryButton" style={{ marginLeft: 8 }} onClick={copyLink}>
                        {copied ? t('general.publish.linkcopied') : t('general.publish.copylink')}
                     </button>
                  </p>
               </div>
            )}

            <p className="smallText">{t('general.explainSelection')}</p>
            <p className="smallText strong">{t('general.selectedlist', { name: selection.name })}</p>
            <section className="selectionslist">
               {
                  artPieces.length > 0 ?
                     selection.artpieces?.map(item => {
                        const artpiece = artPieces.filter(el => el._id === item._id)
                        return (
                           <div key={item._id} className={`rowContainer`}>
                              <ArtPieceLineList artPiece={artpiece[0]} categories={[]} removePieceFromList={(id: string) => {
                                 deletePiece(id)
                              }} />
                           </div>
                        )
                     })
                     :
                     <></>
               }
            </section>

            <Modal size="small" title={t('general.plan.upsell.title')} closeicon={""} visible={showReportsUpsell} onClose={() => setShowReportsUpsell(false)}>
               <p>{t('general.plan.upgrade.intermediate')}</p>
               <div className="buttonblock">
                  <button className="primaryButton" onClick={() => setShowReportsUpsell(false)}>{t('general.plan.upsell.close')}</button>
               </div>
            </Modal>

            <Modal size="small" title={t('general.plan.upsell.title')} closeicon={""} visible={showPublishUpsell} onClose={() => setShowPublishUpsell(false)}>
               <p>{t('general.plan.upgrade.full')}</p>
               <div className="buttonblock">
                  <button className="primaryButton" onClick={() => setShowPublishUpsell(false)}>{t('general.plan.upsell.close')}</button>
               </div>
            </Modal>

            <Modal size="small" title={t('general.publish.title')} closeicon={""} visible={showPublish} onClose={() => { setShowPublish(false); setPublishError('') }}>
               <p className="smallText">{t('general.publish.explain')}</p>
               {!userurl && <p className="smallText error">{t('general.publish.needsuserurl')}</p>}
               <div className="inputfield">
                  <label>
                     <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} disabled={!userurl} />
                     {' '}{t('general.publish.action')}
                  </label>
               </div>
               <div className="inputfield">
                  <label>
                     <input type="checkbox" checked={showPrice} onChange={(e) => setShowPrice(e.target.checked)} />
                     {' '}{t('general.publish.showprice')}
                  </label>
               </div>
               {publicUrl && (
                  <p className="smallerText">{t('general.publish.publicurl')}: {publicUrl}</p>
               )}
               {publishError && <p className="error">{publishError}</p>}
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => { setShowPublish(false); setPublishError('') }}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={savePublish}>{t('general.save')}</button>
               </div>
            </Modal>
         </>
      )
   }

   return (
      <section className="edit">
         {params.id && selection ? <EditSelection /> : <ShowSelections />}
      </section>
   )
}