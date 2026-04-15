import { useEffect, useState } from "react"
import { apiCreateFolder, apiDeleteFolder, apiGetFolders, apiMoveMedia, deleteMediaPiece, emitFileDropped, getImageMedia, getImagePathOriginal, getMedia, hideWaiting, showWaiting, useFileDroppedListener } from "./utility"
import { KeyValue, PictureDao } from "../interfaces"
import { MediaData } from "../interfaces"
import { Modal } from "./modal"
import { useTranslation } from "react-i18next"
const pendingimage = '/images/cog.svg'
const empty = '/images/nothing.svg'
const trash = '/images/trash.svg'
const connected = '/images/connect.svg'
const disconnected = '/images/disconnect.svg'
const folder = '/images/folder.svg'
const rightIcon = '/images/rightarrow.svg'

import Tooltip from 'rc-tooltip'
import 'rc-tooltip/assets/bootstrap_white.css'
import { useRouter } from "next/navigation"
import { SearchBlock } from "./forms"
import { useDrag, useDrop } from "react-dnd"


const MediaLine = (props: { onSelect?: (data: MediaData) => void, artPiece: PictureDao }) => {
   const [showImage, setShowImage] = useState('')
   const [original, setOriginal] = useState('')
   const [image, setImage] = useState('')
   const [error, setError] = useState('')
   const [pending, setPending] = useState(false)
   const [showDelete, setShowDelete] = useState('')

   const router = useRouter()
   const { t } = useTranslation()

   const loadImage = async (id: string) => {
      setPending(true)
      getImagePathOriginal(id).then(res => {
         setOriginal(res)
         setPending(false)
      })
   }

   const deleteMedia = async (artPieceId: string) => {
      showWaiting()
      const response = await deleteMediaPiece(artPieceId)
      hideWaiting()
      if (response === true) {
         setShowDelete('')
         router.refresh()
      } else {
         setError(t('general.couldnotdelete'))
      }
   }

   const [{ isDragging }, drag, preview] = useDrag(() => ({
      type: "row",
      item: { id: props.artPiece._id },
      collect: (monitor) => ({
         isDragging: !!monitor.isDragging()
      }),
      end(item, monitor) {
         if (monitor.didDrop()) {
            const d = monitor.getDropResult() as KeyValue
            emitFileDropped({ source: item.id, destination: d.folder, type: d.type})
         }
      },
   }))

   return (
      <section ref={(node) => { drag(node) }} className="media center">
         <div className="relative">
            <img className={`round8 shadow2 zoom ${props.artPiece.details.length > 0 ? "" : "notused"}`} src={`data:image/png;base64,${props.artPiece.mediaImage}`} onClick={(e) => { e.stopPropagation(); loadImage(props.artPiece.url); setShowImage(`${props.artPiece.details.length > 0 ? props.artPiece.details[0].title : t('general.notconnected')}`) }} />
            {props.artPiece.details.length <= 0 && <img className="smallImageW trash" src={trash} onClick={() => setShowDelete(props.artPiece._id)} />}
            {props.artPiece.details.length > 0 ?
               <Tooltip placement="top" trigger={['hover']} overlay={<span>{t('general.connected')}</span>}>
                  <img className="smallImageW connect" src={connected} />
               </Tooltip>
               :
               <Tooltip placement="top" trigger={['hover']} overlay={<span>{t('general.noconnected')}</span>}>
                  <img className="smallImageW connect" src={disconnected} />
               </Tooltip>

            }
         </div>

         <div className="descriptions">
            <p className="smallerText strong marginH">{props.artPiece.name}</p>
            <p className="smallerText strong marginH">{props.artPiece.dimensions}</p>
            {props.onSelect && <p className="pointer select smallerText" onClick={() => props.onSelect ? props.onSelect({ url: props.artPiece.url, img: props.artPiece.mediaImage, id: props.artPiece._id, name: props.artPiece.name }) : {}}>Select</p>}
         </div>

         <Modal title={showImage} closeicon={""} visible={showImage !== ''} onClose={function (): void {
            setShowImage('')
         }} >
            {pending ?
               <img className="iconImage rotate" src={pendingimage} />
               :
               <img className="fit" src={`data:image/png;base64,${original}`} />
            }
         </Modal>
         <Modal title={t('general.delete')} closeicon={""} visible={showDelete !== ''} onClose={function (): void {
            setShowDelete('')
         }} >
            <p>{t('general.suredelete')}</p>
            <div className="flex">
               <img className="iconImage round8" src={`data:image/png;base64,${props.artPiece.b64Image}`} />
               <p className="strong center paddingV paddingH">{props.artPiece.name}</p>
            </div>
            <div className="buttonblock">
               <button className="secondaryButton" onClick={() => setShowDelete('')}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { deleteMedia(showDelete) }}>{t('general.delete')}</button>
            </div>
         </Modal>
      </section>
   )
}

interface MediaProps {
   onSelect?: (data: MediaData) => void
}

interface FolderStructure {
   [key: string]: string[]
}

export const Media = (props: MediaProps) => {
   const [media, setMedia] = useState([] as PictureDao[])
   const [filtered, setFiltered] = useState([] as PictureDao[])
   const [folders, setFolders] = useState<FolderStructure | null>(null)
   const [currentFolder, setCurrentFolder] = useState('/')
   const [search, setSearch] = useState('')
   const [showCreateFolder, setShowCreateFolder] = useState(false)
   const [folderName, setFolderName] = useState('')
   const [paths, setPaths] = useState({} as KeyValue)
   const [error, setError] = useState('')
   const [showDelete, setShowDelete] = useState('')

   const router = useRouter()
   const { t } = useTranslation()

   useEffect(() => {
      showWaiting()
      const path = localStorage.getItem('path')
      if (path) {
         setCurrentFolder(path)
      }
      apiGetFolders().then(result => {
         setFolders(result)
      })

      getMedia().then(result => {
         hideWaiting()
         setMedia(result)
         filesInFolder(result)
      })
   }, [])

   useFileDroppedListener(payload => {
      showWaiting()
      let path
      if (payload.type === 'forward') {
         path = `${currentFolder.substring(1)}${payload.destination}/`
      } else {
         path = payload.destination
      }

      const data = {
         mediaId: payload.source,
         destination: path
      }
      apiMoveMedia(data).then(response => {
         hideWaiting()
         router.refresh()
      })
   })

   const filesInFolder = (media: PictureDao[]) => {
      const paths = {} as KeyValue
      const f2 = media.map(item => {
         const items = item.url.split('/')
         if (items) {
            let fp = ''
            for (let i = 0; i < items.length - 1; i++) {
               fp = `${fp}${items[i]}`
               const w = `${fp}/`
               if (!paths[fp]) {
                  paths[fp] = media.filter(el => el.url.startsWith(w)).length
               }
               fp = `${fp}/`
            }
         } else {
            if (paths['/']) {
               paths['/']++
            } else {
               paths['/'] = 1
            }
         }
      })
      setPaths(paths)
   }

   const reloadMedia = (filters: string) => {
      const sel = [] as PictureDao[]

      const f2 = media.filter(item => {
         const t = item.url.substring(currentFolder.length - 1)
         if (currentFolder === '/') {
            if (t.indexOf('/') !== -1) {
               return false
            } else {
               return true
            }
         }

         if (t.indexOf('/') !== -1) {
            return false
         }
         else {
            if (item.url.startsWith(currentFolder.substring(1))) {
               return true
            }

            return false
         }
      })

      const f1 = f2.filter(item => item.name.toLowerCase().includes(filters.toLowerCase()))
      setFiltered([...f1])
   }

   useEffect(() => {
      if (currentFolder) {
         reloadMedia(search)
      }

   }, [currentFolder, media])

   const createFolder = async () => {
      if (folderName.match(/^[a-zA-Z_$0-9][a-zA-Z_$0-9 ]*$/)) {
         const d = await apiCreateFolder(`${currentFolder}${folderName}`.substring(1))
         setShowCreateFolder(false)
         router.refresh()
      } else {
         setError(t('general.notvalidname'))
      }
   }

   const deleteFolder = async () => {
      showWaiting()
      apiDeleteFolder(showDelete).then(response => {
         router.refresh()
         hideWaiting()
      })
   }

   const goBackFolder = (path: string) => {
      setCurrentFolder(path)
      localStorage.setItem('path',path)
      return
   }

   const getFolders = (folders: FolderStructure | null): string[] => {
      if (!folders) return []
      let fs
      const key = `${currentFolder}`
      fs = folders[key]

      if (!fs) {
         return []
      }

      const final = fs.map(item => {
         let name = item.substring(currentFolder.length)
         const idx = name.indexOf('/')
         return name.substring(0, idx)
      })
      return final
   }

   interface FolderProps {
      onChange: (where: string) => void
   }

   const FolderItem = (props: { item: string, onChange: (where: string) => void }) => {
      const [{ isOver, canDrop }, drop] = useDrop(
         () => ({
            accept: "row",
            drop: (item: { id: string }, monitor) => {
               return { folder: props.item, type: "forward" }
            },
            collect: (monitor) => {
               return {
                  isOver: !!monitor.isOver(),
                  canDrop: !!monitor.canDrop()
               }
            }
         })
      )

      const full = paths[`${currentFolder.substring(1)}${props.item}`] ? true : false
      return (
         <div className="folder" ref={(node) => { drop(node) }}>
            <img onClick={() => props.onChange(props.item)} src={folder} className={`folderImage ${canDrop ? 'dropme' : ''} ${full ? 'full' : 'empty'}`} />
            {!full && <img className="trash" src={trash} onClick={(e) => { e.stopPropagation(); setShowDelete(`${currentFolder.substring(1)}${props.item}`) }} />}
            <p>{props.item}</p>
         </div>
      )
   }

   const FolderPathItem = (props: {item:string, current: boolean, currentPath:string}) => {
      const [{ isOver, canDrop }, drop] = useDrop(
         () => ({
            accept: "row",
            drop: (item: { id: string }, monitor) => {
               return { folder: props.item, type: "backward" }
            },
            collect: (monitor) => {
               return {
                  isOver: !!monitor.isOver(),
                  canDrop: !!monitor.canDrop()
               }
            }
         })
      )
      return (
         <>
            <div ref={!props.current ? (node) => { drop(node) } : null} key={props.item} className={`pathfolder`} onClick={() => goBackFolder(props.currentPath)}>
               <img src={folder} className={`iconImage ${canDrop && !props.current ? 'dropme' : ''} ${!props.current ? '' : 'current'}`} />
               {!props.current && <img src={rightIcon} className="smallImageW" />}
               <p>{props.item}</p>
            </div>
         </>
      )
   }

   const FolderPath = (props: { path: string }) => {
      let fullPath = ''
      let paths
      if (props.path === '/') {
         paths = ["home"]
      } else {
         paths = props.path.substring(0, props.path.length - 1).split('/')
         paths[0] = 'home'
      }

      return (
         <>
            <section className="pathfoldercontainer">
               {paths.map((item, index) => {
                  if (index === 0) {
                     fullPath = '/'
                  } else {
                     fullPath += `${item}/`
                  }
                  const currentPath = fullPath
                  return <FolderPathItem key={item} current={index === paths.length - 1 } item={item} currentPath={currentPath}/>
               })}
            </section>
         </>
      )
   }

   const Folders = (props: FolderProps) => {
      return (
         <section className="folders">
            <div className="folderheader">
               <p className="goback">
                  {t('general.youarein')}
               </p>
               <FolderPath path={currentFolder} />
            </div>

            <div className="folderContainer">
               {getFolders(folders).map(item => {
                  return (
                     <FolderItem key={item} onChange={props.onChange} item={item} />
                  )
               })}
            </div>
         </section>
      )
   }

   return (
      <>
         <div className="breadcrumb">
            <p>{t(`general.media`)}</p>
            <div className="buttonblock last">
               <button className="secondaryButton" onClick={() => setShowCreateFolder(true)}>{t('general.createfolder')}</button>
               <button className="primaryButton paddingH" onClick={() => { sessionStorage.setItem('routeState', JSON.stringify({ folder: currentFolder })); router.push('/addmedia') }}>{t('general.addmedia')}</button>
            </div>
         </div>
         <div className="last searchBlock">
            <SearchBlock onChange={function (search: string): void {
               setSearch(search)
               reloadMedia(search)
            }} />
         </div>
         <div className="mediaObjects">
            <Folders onChange={(where) => {
               const p = `${currentFolder}${where}/`;
               setCurrentFolder(p);
               localStorage.setItem('path',p);
            }} />
            {filtered.length > 0 ?
               <section className="medialist">
                  {filtered.map(item => {
                     return (
                        <div key={item._id} className="rowContainer">
                           <MediaLine onSelect={props.onSelect ? () => props.onSelect!({ url: item.url as string, id: item._id, img: item.b64Image, name: item.name }) : undefined} artPiece={item} />
                        </div>
                     )
                  })
                  }
               </section>
               :
               <section className="flexC center">
                  <img className="iconImageBig" src={empty} />
                  <p className="center">{t(`general.nomedia`)}</p>
                  {media.length <= 0 && <p className="center">{t(`general.startenteringmedia`)}<span onClick={() => router.push('/addmedia')} className="pointer underlined">{t('general.addmedia')}</span></p>}
               </section>
            }
         </div>
         <Modal title={t('general.createfolder')} closeicon={""} visible={showCreateFolder} onClose={function (): void {
            setShowCreateFolder(false)
         }} >
            <>
               <div className="inputfield">
                  <label>{t(`general.foldername`)}</label>
                  <input placeholder={t(`general.placeholders.foldername`)} type="text" name="category" value={folderName} onChange={(e) => { setError(''); setFolderName(e.target.value) }} />
               </div>
               {error && <p className="error">{error}</p>}
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setShowCreateFolder(false)}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { createFolder() }}>{t('general.createfolder')}</button>
               </div>
            </>

         </Modal>
         <Modal title={t('general.deleteFolder')} closeicon={""} visible={showDelete !== ''} onClose={function (): void {
            setShowDelete('')
         }} >
            <>
               <p>{t('general.confirmdeletefolder', {folder: showDelete})}</p>
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setShowDelete('')}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { deleteFolder() }}>{t('general.deleteFolder')}</button>
               </div>
            </>

         </Modal>
      </>

   )
}