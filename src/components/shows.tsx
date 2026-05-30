import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { apiDeleteShow, convertIsoDate, Dotted, getImagePathOriginal, getSelections, getShows, hideWaiting, showWaiting } from "./utility"
import { ArtSelection, Shows } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { Modal } from "./modal"
import { ThreeDots } from "./threedots"
import { BackButton } from "./backbutton"
const empty = '/images/nothing.svg'

const ShowGallery = (props: { pictures: { _id: string; url: string }[] }) => {
   const [previews, setPreviews] = useState<{ [id: string]: string | null }>({})
   const [zoom, setZoom] = useState<string | null>(null)

   useEffect(() => {
      props.pictures.forEach(p => {
         if (!p.url || previews[p._id] !== undefined) return
         getImagePathOriginal(p.url).then(b64 => {
            setPreviews(prev => ({ ...prev, [p._id]: b64 ? `data:image/png;base64,${b64}` : null }))
         })
      })
   }, [props.pictures])

   return (
      <>
         <div className="showImagesGrid">
            {props.pictures.map(p => {
               const src = previews[p._id]
               return (
                  <div key={p._id} className="showImagesCell">
                     {src ? (
                        <img className="showImagesThumb zoom" src={src} onClick={() => setZoom(src)} />
                     ) : (
                        <div className="showImagesPlaceholder" />
                     )}
                  </div>
               )
            })}
         </div>
         <Modal title="" closeicon="" visible={zoom !== null} onClose={() => setZoom(null)}>
            {zoom && <img className="fit" src={zoom} />}
         </Modal>
      </>
   )
}

export const ShowsComponent = () => {
   const router = useRouter()
   const { t } = useTranslation()
   const params = useParams(); const id = params?.id as string | undefined
   const [shows, setShows] = useState([] as Shows[])
   const [selections, setSelections] = useState([] as ArtSelection[])
   const [selectedShow, setSelectedShow] = useState<Shows | undefined>()
   const [showDeleteForm, setShowDeleteForm] = useState('')
   const state = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('routeState') || 'null') : null

   useEffect(() => {
      loadShows()
   }, [state])

   const loadShows = () => {
      getShows().then(data => {
         getSelections().then(data => {
            if (Array.isArray(data) && data.length > 0) {
               setSelections(data)
            } else {
               setSelections([])
            }
         })
         setShows(data)
         if (id) {
            const t = data.find(item => item._id === id)
            if (t) setSelectedShow(t)
         }
      })
   }

   useEffect(() => {
      if (shows.length > 0) {
         if (id) {
            const t = shows.find(item => item._id === id)
            if (t) setSelectedShow(t)
         }
      } else {
         loadShows()
      }
   }, [id])

   const deleteShow = async (id: string) => {
      showWaiting()
      await apiDeleteShow(id)
      hideWaiting()
      setShows(prev => prev.filter(s => s._id !== id))
      if (selectedShow?._id === id) setSelectedShow(undefined)
   }

   return (
      <>
         <section className="reportMain">
            {selectedShow && <BackButton callback={()=>setSelectedShow(undefined)} text={t('general.backto.shows')} where="/shows" /> }
            <div className="breadcrumb">
               <p>{t(`general.shows`)}</p>
               <div className="buttonblock last">
               <button className="primaryButton" onClick={() => router.push('/addshow')}>{t('general.addshow')}</button>
               </div>
            </div>
            <p className="">{t('general.howtoshows')}</p>
            {!selectedShow && shows.length>0 && 
               <div className="showlist">
                  <div className="show showheader borderBottom">
                     <p >{t('general.showname')}</p>
                     <p>{t('general.showlocation')}</p>
                     <p className="nomobilesmall">{t('general.showbegin')}</p>
                     <p className="nomobilesmall">{t('general.showend')}</p>
                     <p className="nomobile">{t('general.showdescription')}</p>
                     <p className="nomobile">{t('general.showwebsite')}</p>
                     <div>&nbsp;</div>
                  </div>
                  {shows && shows.map(rep => {
                     return (
                        <div className="show borderBottom">
                           <p className="title select" onClick={() => router.push(`/shows/${rep._id}`)}>{rep.name}</p>
                           <Dotted chars={20} text={rep.location}></Dotted>
                           <p className="nomobilesmall">{convertIsoDate(rep.begin)}</p>
                           <p className="nomobilesmall">{convertIsoDate(rep.end)}</p>
                           <Dotted className="nomobile" chars={20} text={rep.description}></Dotted>
                           <p className="nomobile" >{rep.website}</p>
                           <ThreeDots >
                              <ul>
                                 <li onClick={() => router.push(`/addshow/${rep._id}`)}>{t('general.edit')}</li>
                                 <li onClick={() => setShowDeleteForm(rep._id as string)}>{t('general.remove')}</li>
                              </ul>
                           </ThreeDots>
                        </div>
                     )
                  })}
               </div>
            }
            {!selectedShow && shows.length<=0 &&  
            <section className="flexC center shows paddingV">
               <img className="iconImageBig" src={empty} />
               <p className="center">{t(`general.noshows`)}</p>
               <p className="center">{t(`general.startenteringshow`)}<span onClick={() => router.push('/addshow')} className="pointer underlined paddingH">{t('general.addshow')}</span></p> 
            </section>
            }

            {selectedShow && <div className="">
               <h1>{t('general.showDetail', { name: selectedShow.name })}</h1>
               <section className="showcontainer">
                  <div className="detailshow">
                     <p className="name">{t('general.showlocation')} <span>{selectedShow.location}</span></p>
                  </div>
                  <div className="detailshow">
                     <p className="name">{t('general.showbegin')} <span>{convertIsoDate(selectedShow.begin)}</span></p>
                  </div>
                  <div className="detailshow">
                     <p className="name">{t('general.showend')} <span>{convertIsoDate(selectedShow.end)}</span></p>
                  </div>
                  <div className="detailshow">
                     <p className="name">{t('general.showdescription')} <span>{selectedShow.description}</span></p>
                  </div>
                  <div className="detailshow">
                     <p className="name">{t('general.showwebsite')} <span>{selectedShow.website}</span></p>
                  </div>
                  {(() => {
                     const linked = selections.find(item => item._id === selectedShow.list)
                     const pieces = linked?.artpieces ?? []
                     const pictures = (selectedShow.pictures ?? []).filter(p => p && p.url)
                     if (pieces.length === 0 && pictures.length === 0) {
                        return (
                           <section className="artlist">
                              <p className="center">{t('general.noshowimages')}</p>
                           </section>
                        )
                     }
                     return (
                        <section className="artlist">
                           {pictures.length > 0 && (
                              <>
                                 <p className="strong">{t('general.showimages')}</p>
                                 <ShowGallery pictures={pictures as { _id: string; url: string }[]} />
                              </>
                           )}
                           {pieces.length > 0 && (
                              <>
                                 <p>{linked?.name}</p>
                                 <div className="pieces">
                                    {pieces.map(item => (
                                       <div className="detaillist">
                                          <img className="iconImage round8 zoom" src={`data:image/png;base64,${item.b64Image}`} />
                                          <div className="detailtext">
                                             <div className="smallText">{item.title}</div>
                                             <div>{item.creation_date.toString().substring(0, 4)}</div>
                                             <div className="boldText">{new Intl.NumberFormat('de-de').format(item.price)}</div>
                                          </div>
                                       </div>
                                    ))}
                                 </div>
                              </>
                           )}
                        </section>
                     )
                  })()}
               </section>
            </div>
            }
            <Modal size="small" title={t('general.remove')} closeicon={""} visible={showDeleteForm !== ''} onClose={function (): void {
               setShowDeleteForm('')
            }} >
               <p>{t('general.sureremove')}</p>
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setShowDeleteForm('')}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { setShowDeleteForm(''); deleteShow(showDeleteForm) }}>{t('general.delete')}</button>
               </div>
            </Modal>
         </section>
      </>
   )
}