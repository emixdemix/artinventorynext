import { useContext, useEffect, useState } from "react"
import { apiDeleteSelection, apiRemoveFromSelection, emitStore, getArtPieces, getSelection, getSelections, hideWaiting, showWaiting, updateSelectionOrder, useSwapOrderListener } from "./utility"
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

            <section className="selection">
               {selections.map(item => {
                  return (
                     <div className="selectionBlock" onClick={() => router.push(`/selection/${item._id}`)}>
                        <p className="smallText strong">{item.name}</p>
                        <p className="smallerText">{item.artpieces?.length} {t('general.artwork')}</p>
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

      const deletePiece = async (id: string) => {
         showWaiting()
         apiRemoveFromSelection({ ids: [id], selectionId: selection._id as string }).then(response => {
            hideWaiting()
            router.refresh()
         })
      }

      return (
         <>
            <BackButton text={t('general.backto.selections')} where="/selection" />
            <div className="breadcrumb">
               <p className="">{t('general.editselection')}</p>
               <button className="primaryButton" onClick={() => router.push(`/reports/${params.id}`)}>{t('general.createreport')}</button>
            </div>

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
         </>
      )
   }

   return (
      <section className="edit">
         {params.id && selection ? <EditSelection /> : <ShowSelections />}
      </section>
   )
}