import { Ref, useEffect, useRef, useState } from "react"
import { ArtPiece, Category } from "../interfaces"
import { deleteArtPiece, displayLabel, Dotted, emitAddMoreMedia, emitItemOver, emitSelectRow, emitSwap, emitSwapOrder, getImagePathOriginal, hideWaiting, showWaiting, useItemOverListener } from "./utility"
import { useDrag, useDrop } from 'react-dnd'
const handle = '/images/handle.svg'
const pendingimage = '/images/cog.svg'

import { Modal } from "./modal"
import { ThreeDots } from "./threedots"
import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"

interface ArtPieceLineProps {
   artPiece: ArtPiece
   categories: Category[]
}

interface ArtPieceLineListProps {
   artPiece: ArtPiece
   categories: Category[]
   removePieceFromList: (id: string) => void
}

export const ArtPieceLine = (props: ArtPieceLineProps) => {
   const [itemOver, setItemOver] = useState('')
   const [showImage, setShowImage] = useState('')
   const [pending, setPending] = useState(false)
   const [original, setOriginal] = useState('')
   const [otherImages, setOtherImages] = useState([] as string[])
   const [showDeleteForm, setShowDeleteForm] = useState('')
   const [error, setError] = useState('')

   const router = useRouter()
   const { t } = useTranslation()
   console.log('CAT', props.artPiece.cats)

   useItemOverListener(item => {
      if (item === props.artPiece._id) {
         setItemOver(item)
      } else {
         setItemOver('')
      }
   })

   const [{ isOver }, drop] = useDrop(
      () => ({
         accept: "row",
         drop: (item: { id: string }, monitor) => { emitSwap({ source: item.id as string, destination: props.artPiece._id }); emitItemOver('') },
         collect: (monitor) => ({
            target: props.artPiece._id,
            isOver: !!monitor.isOver()
         }),
         hover(item, monitor) {
            emitItemOver(props.artPiece._id)
         }
      })
   )

   const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: "row",
      item: { id: props.artPiece._id },
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging()
      })
   }))

   useEffect(() => {
      // if (image) return
      // getImagePath(props.artPiece?.pictures[0]?.url).then(response => {
      //    setImage(response)
      // })
   }, [])

   useEffect(() => {
      setError('')
   }, [showDeleteForm])

   const selectRow = (id: string) => {
      emitSelectRow(id)
   }

   const switchImage = (index:number) => {
      const t = original
      setOriginal(otherImages[index])
      otherImages[index] = t
      setOtherImages([...otherImages])
   }

   const loadImage = async (id: string) => {
      setPending(true)
      getImagePathOriginal(id).then(res => {
         setOriginal(res)
         setPending(false)
      })
   }

   const loadOtherImages = async (id: string[]) => {
      const images = [] as string[]
      const promises = [] as Promise<any>[]
      setPending(true)
      id.forEach(url => {
         const response = getImagePathOriginal(url).then(res => {
            images.push(res)
         })
         promises.push(response)
      })

      await Promise.all(promises)
      setOtherImages(images)
   }

   const deletePiece = async (artPieceId: string) => {
      showWaiting()
      const response = await deleteArtPiece(artPieceId)
      hideWaiting()
      if (response === true) {
         setShowDeleteForm('')
         router.refresh()
      } else {
         setError(t('general.couldnotdelete'))
      }
   }

   const Dotted = (props: { text: string, chars: number }) => {
      const [showAll, setShowAll] = useState(false)

      const show = (e: React.MouseEvent) => {
         e.stopPropagation()
         setShowAll(!showAll)
      }

      if (props.text && props.text.length >= props.chars) {
         return <p onClick={(e) => show(e)} className="smallerText pointer">{showAll ? props.text : `${props.text.substring(0, props.chars)}...`}</p>
      } else {
         return <p className="smallerText">{props.text}</p>
      }
   }

   return (
      <>
         <div ref={(node) => { preview(drop(node)) }} onClick={(e) => selectRow(props.artPiece._id)} className={`gridTable1 paddingAllSmall gap24 borderBottom ${itemOver ? "over" : ""}`}>
            <div ref={drag as unknown as Ref<HTMLDivElement>} className="draggable"><img className="smallImageW" src={handle} /></div>
            <img className="iconImage round8 zoom" src={`data:image/png;base64,${props.artPiece.b64Image}`} onClick={(e) => { e.stopPropagation(); loadOtherImages(props.artPiece.otherMedia!.map(item => item.url)); loadImage(props.artPiece?.pictures[0]?.url); setShowImage(props.artPiece.title) }} />
            <div className="artinfo">
               <div className="smallText"><span onClick={(e) => { e.stopPropagation(); router.push(`/edit/${props.artPiece._id}`)} }>{props.artPiece.title}</span></div>
               <Dotted chars={20} text={props.artPiece.description}></Dotted>
               <div className="artmeasure smallerText">
                  <div>{props.artPiece.dimensions}</div>
                  <div>{props.artPiece.creation_date ? props.artPiece.creation_date.toString().substring(0, 4) : ""}</div>
                  <div className="boldText">{new Intl.NumberFormat('de-de').format(props.artPiece.price)}</div>
               </div>
               <div className="smallerText">{displayLabel(props, 'arttype', t('general.notset'))}</div>
               <div className="smallerText">{displayLabel(props, 'status', t('general.notset'))}</div>
            </div>
            <ThreeDots >
               <ul>
                  <li onClick={() => router.push(`/edit/${props.artPiece._id}`)}>{t('general.edit')}</li>
                  <li onClick={() => setShowDeleteForm(props.artPiece._id)}>{t('general.delete')}</li>
                  <li onClick={() => emitAddMoreMedia({ id: props.artPiece._id })}>{t('general.addmoremedia')}</li>
               </ul>
            </ThreeDots>
         </div>
         <Modal title={showImage} closeicon={""} visible={showImage !== ''} onClose={function (): void {
            setShowImage('')
         }} >
            <>
               {pending ?
                  <div className="upload">
                     <img className="iconImage rotate" src={pendingimage} />
                     <p className="smallText">{t('general.loading')}</p>
                  </div>
                  :
                  <>
                  <img className="fit" src={`data:image/png;base64,${original}`} />
                  <div>
                     { otherImages.map((image,index) => {
                         return (<img onClick={() => switchImage(index)} className="iconImage paddingH" src={`data:image/png;base64,${image}`} />)
                     })}
                  </div>
                  </>
               }
            </>
         </Modal>

         <Modal size="small" title={t('general.delete')} closeicon={""} visible={showDeleteForm !== ''} onClose={function (): void {
            setShowDeleteForm('')
         }} >
            <p>{t('general.suredelete')}</p>
            <div className="flex">
               <img className="iconImage round8 zoom" src={`data:image/png;base64,${props.artPiece.b64Image}`} />
               <p className="strong center paddingV paddingH">{props.artPiece.title}</p>
            </div>

            {error && <p className="error">{error}</p>}
            <div className="buttonblock">
               <button className="secondaryButton" onClick={() => setShowDeleteForm('')}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { deletePiece(showDeleteForm) }}>{t('general.delete')}</button>
            </div>
         </Modal>
      </>
   )
}

export const ArtPieceLineList = (props: ArtPieceLineListProps) => {
   const [itemOver, setItemOver] = useState('')
   const [showImage, setShowImage] = useState('')
   const [pending, setPending] = useState(false)
   const [original, setOriginal] = useState('')
   const [showDeleteForm, setShowDeleteForm] = useState('')
   const [error, setError] = useState('')

   const router = useRouter()
   const { t } = useTranslation()

   useItemOverListener(item => {
      if (item === props.artPiece._id) {
         setItemOver(item)
      } else {
         setItemOver('')
      }
   })

   const [{ isOver }, drop] = useDrop(
      () => ({
         accept: "row",
         drop: (item: { id: string }, monitor) => {
            emitSwapOrder({ source: item.id as string, destination: props.artPiece._id });
            emitItemOver('')
         },
         collect: (monitor) => ({
            target: props.artPiece._id,
            isOver: !!monitor.isOver()
         }),
         hover(item, monitor) {
            emitItemOver(props.artPiece._id)
         }
      })
   )

   const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: "row",
      item: { id: props.artPiece._id },
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging()
      })
   }))

   useEffect(() => {
      setError('')
   }, [showDeleteForm])

   const selectRow = (id: string) => {
      emitSelectRow(id)
   }

   const loadImage = async (id: string) => {
      setPending(true)
      getImagePathOriginal(id).then(res => {
         setOriginal(res)
         setPending(false)
      })
   }

   return (
      <>
         <div ref={(node) => { preview(drop(node)) }} onClick={(e) => selectRow(props.artPiece._id)} className={`gridTable1 paddingAllSmall gap24 borderBottom ${itemOver ? "over" : ""}`}>
            <div ref={drag as unknown as Ref<HTMLDivElement>} className="draggable"><img className="smallImageW" src={handle} /></div>
            <img className="iconImage round8 zoom" src={`data:image/png;base64,${props.artPiece.b64Image}`} onClick={(e) => { e.stopPropagation(); loadImage(props.artPiece?.pictures[0]?.url); setShowImage(props.artPiece.title) }} />
            <div className="artinfo">
               <div className="smallText">{props.artPiece.title}</div>
               <Dotted chars={20} text={props.artPiece.description}></Dotted>
               <div className="artmeasure smallerText">
                  <div>{props.artPiece.dimensions}</div>
                  <div>{props.artPiece.creation_date ? props.artPiece.creation_date.toString().substring(0, 4) : ""}</div>
                  <div className="boldText">{new Intl.NumberFormat('de-de').format(props.artPiece.price)}</div>
               </div>
               <div className="smallerText">{displayLabel(props, 'arttype', t('general.notset'))}</div>
               <div className="smallerText">{displayLabel(props, 'status', t('general.notset'))}</div>
            </div>
            <ThreeDots >
               <ul>
                  <li onClick={() => router.push(`/edit/${props.artPiece._id}`)}>{t('general.edit')}</li>
                  <li onClick={() => setShowDeleteForm(props.artPiece._id)}>{t('general.remove')}</li>
               </ul>
            </ThreeDots>
         </div>
         <Modal title={showImage} closeicon={""} visible={showImage !== ''} onClose={function (): void {
            setShowImage('')
         }} >
            <>
               {pending ?
                  <div className="upload">
                     <img className="iconImage rotate" src={pendingimage} />
                     <p className="smallText">{t('general.loading')}</p>
                  </div>
                  :
                  <img className="fit" src={`data:image/png;base64,${original}`} />
               }
            </>

         </Modal>

         <Modal size="small" title={t('general.remove')} closeicon={""} visible={showDeleteForm !== ''} onClose={function (): void {
            setShowDeleteForm('')
         }} >
            <p>{t('general.sureremove')}</p>
            <div className="flex">
               <img className="iconImage round8 zoom" src={`data:image/png;base64,${props.artPiece.b64Image}`} />
               <p className="strong center paddingV paddingH">{props.artPiece.title}</p>
            </div>

            {error && <p className="error">{error}</p>}
            <div className="buttonblock">
               <button className="secondaryButton" onClick={() => setShowDeleteForm('')}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { setShowDeleteForm(''); props.removePieceFromList(showDeleteForm) }}>{t('general.delete')}</button>
            </div>
         </Modal>
      </>
   )
}