import { useEffect, useRef, useState } from "react"
import { apiSaveMediaToArtipiece, emitStore, getArtPieces, getCategories, getSelections, hideWaiting, saveNewList, showWaiting, updateArtPiecesOrder, useAddMoreMediaListener, useSelectRowListener, useSwapListener } from "./utility"
import { ArtPiece, ArtSelection, Category, KeyValue, MediaData } from "../interfaces"
import { ArtPieceLine } from "./artpieceline"
import { useTranslation } from "react-i18next"
const clear = '/images/no.svg'
const openIcon = '/images/filter.svg'
const closeFilter = '/images/filteroff.svg'
const closeIcon = '/images/close.svg'
const trash = '/images/trash.svg'

const empty = '/images/nothing.svg'

import { useRouter } from "next/navigation"
import Select, { MultiValue, SingleValue } from 'react-select'
import { Modal } from "./modal"
import { isTemplateExpression } from "typescript"
import { SearchBlock } from "./forms"
import { Media } from "./media"

interface FiltersProps {
   categories: Category[]
   onChange: (filters: MultiValue<Category>, type: string) => void
   onClose: () => void
}



const Filters = (props: FiltersProps) => {
   const [categories, setCategories] = useState([] as Category[])
   const [open, setOpen] = useState(true)
   const { t } = useTranslation()

   useEffect(() => {
      if (props.categories.length > 0) {
         setCategories(props.categories)
      }
   }, [props.categories])

   return (
      <section className="filterContainer">
         <img className="smallImageW pointer last" onClick={() => props.onClose()} src={closeIcon}></img>
         <p className="center smallText">{t('general.filters')}</p>
         <section className={`filters paddingV`}>
            <div className="filterBlock">
               <label className="smallerText">{t('general.categories')}</label>
               <Select
                  placeholder={t('general.select')}
                  closeMenuOnSelect={false}
                  isMulti
                  options={categories.filter(item => item.type === 'category')}
                  onChange={(e) => props.onChange(e, 'category')}
                  className="filter-container"
                  classNamePrefix="filter"
               />
            </div>
            <div className="filterBlock">
               <label className="smallerText">{t('general.statuses')}</label>
               <Select
                  placeholder={t('general.select')}
                  closeMenuOnSelect={false}
                  isMulti
                  options={categories.filter(item => item.type === 'status')}
                  onChange={(e) => props.onChange(e, 'status')}
                  className="filter-container"
                  classNamePrefix="filter"
               />
            </div>
            <div className="filterBlock">
               <label className="smallerText">{t('general.type')}</label>
               <Select
                  placeholder={t('general.select')}
                  closeMenuOnSelect={false}
                  isMulti
                  options={categories.filter(item => item.type === 'arttype')}
                  onChange={(e) => props.onChange(e, 'arttype')}
                  className="filter-container"
                  classNamePrefix="filter"
               />
            </div>
         </section>

      </section>
   )
}

interface SelectListProps {
   selections: ArtSelection[]
   artpieces: string[]
   onClose: () => void
}

export const SelectList = (props: SelectListProps) => {
   const [listName, setListName] = useState('')
   const [error, setError] = useState('')
   const [selectedList, setSelectedList] = useState({} as SingleValue<KeyValue>)
   const { t } = useTranslation()

   const doSave = () => {
      if (listName) {
         saveNewList(props.artpieces, listName, '').then(result => {
            if (result) {
               props.onClose()
            } else {
               setError(t('general.error'))
            }
         })
      }
      if (selectedList) {
         saveNewList(props.artpieces, '', selectedList.value as string).then(result => {
            if (result) {
               props.onClose()
            } else {
               setError(t('general.error'))
            }
         })
      }
   }

   return (
      <>
         <section className="listselect">
            <p className="description strong">{t('general.addtolistdescription')}</p>

            <div className="inputfield">
               <label>{t('general.listname')}</label>
               <input placeholder={t('general.placeholders.listname')} type="text" name="listname" value={listName} onChange={(e) => { setSelectedList(null); setListName(e.target.value) }} />
            </div>
            <div className="inputfield">
               <label>{t('general.selectlist')}</label>
               <Select
                  placeholder={t('general.select')}
                  closeMenuOnSelect={true}
                  value={selectedList || { label: t('general.select'), value: '' }}
                  options={[{ label: t('general.select'), value: '' }, ...props.selections.map(item => { return { label: item.name, value: item._id as string } })]}
                  onChange={(e) => { setListName(''); setSelectedList(e as SingleValue<KeyValue>) }}
                  className="filter-container"
                  classNamePrefix="filter"
               />
            </div>
            <div className="buttonblock">
               <button className="secondaryButton" onClick={() => props.onClose()}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { doSave() }}>{listName ? t('general.createList') : t('general.addList')}</button>
            </div>
         </section>
      </>
   )
}

export const Dashboard = () => {
   const [artPieces, setArtPieces] = useState([] as ArtPiece[])
   const [filtered, setFiltered] = useState([] as ArtPiece[])
   const [selected, setSelected] = useState([] as string[])
   const [categories, setCategories] = useState([] as Category[])
   const [showSelect, setShowSelect] = useState(false)
   const [selections, setSelections] = useState([] as ArtSelection[])
   const [showFilters, setShowFilters] = useState(false)
   const [action, setAction] = useState('')
   const [addMoreMedia, setAddMoreMedia] = useState('')
   const [mediaSelected, setMediaSelected] = useState([] as MediaData[])
   const [showManageSelection, setShowManageSelection] = useState(false)
   const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: MultiValue<Category> }>({ arttype: [], status: [], category: [] })
   const filterRef = useRef<HTMLDivElement>(null)
   const router = useRouter()
   const { t } = useTranslation()

   
   const listOptions = [
      { label: t('general.createList'), value: 'createList' },
      { label: t('general.createReport'), value: "report" },
      { label: t('general.sellpieces'), value: "sell" }
   ]

   let iterations = 20

   useSwapListener(swap => {
      const source = artPieces.findIndex(item => item._id === swap.source)
      const destination = artPieces.findIndex(item => item._id === swap.destination)
      if (source === destination) return

      const temp = artPieces[source]
      const newarray: ArtPiece[] = JSON.parse(JSON.stringify(artPieces.filter(item => item._id !== swap.source)))
      newarray.splice(destination, 0, temp)
      setArtPieces(newarray)
      updateArtPiecesOrder(newarray.map(item => item._id))
      setFiltered(newarray)
   })

   useEffect(() => {
      showWaiting()
      getArtPieces().then(result => {
         hideWaiting()
         setArtPieces(result)
         setFiltered(result)
         emitStore({ key: 'artpieces', value: result, store: false })
      })
      getCategories('all').then(cats => {
         setCategories(cats)
      })
      const sel = localStorage.getItem('selected')
      if (sel) {
         setSelected(JSON.parse(sel))
      }
   }, [])

   useSelectRowListener(id => {
      if (selected.includes(id)) {
         const n = [...selected.filter(item => item !== id)]
         localStorage.setItem('selected', JSON.stringify(n))
         setSelected(n)
      } else {
         selected.push(id)
         const items = [...selected]
         localStorage.setItem('selected', JSON.stringify(items))
         setSelected(items)
      }
   })

   useAddMoreMediaListener(payload => {
      const artpiece = artPieces.filter(item => item._id === payload.id)
      if (artpiece[0]?.otherMedia) {
         const v = artpiece[0].otherMedia.map(item => {
            return {
               id: item._id,
               img: item.b64Image,
               url: item.url,
               name: item.name
            }
         })
         setMediaSelected(v)
      }
      setAddMoreMedia(payload.id)
   })

   const reloadArtPieces = (filters: MultiValue<Category> | string, type: string) => {
      let sel = [] as ArtPiece[]
      let fFinal:Category[] = []

      if (type !== 'string') {
         if ((filters as MultiValue<Category>).length>0) {
            (filters as MultiValue<Category>).forEach(item => { fFinal.push(item) })
         } 
         switch (type) {
            case 'status':
               setSelectedFilters({...selectedFilters, status: [...fFinal]})
               selectedFilters['arttype'].forEach(item => fFinal.push(item))
               selectedFilters['category'].forEach(item => fFinal.push(item))
               break
            case 'arttype':
               setSelectedFilters({...selectedFilters, arttype: [...fFinal]})
               selectedFilters['status'].forEach(item => fFinal.push(item))
               selectedFilters['category'].forEach(item => fFinal.push(item))
               break
            case 'category': 
            setSelectedFilters({...selectedFilters, category: [...fFinal]})
               selectedFilters['arttype'].forEach(item => fFinal.push(item))
               selectedFilters['status'].forEach(item => fFinal.push(item))
               break
         }
      }


      if (typeof (filters) === 'string') {
         const f1 = artPieces.filter(item => (
            item.title.toLowerCase().includes(filters.toLowerCase()) ||
            item.description.includes(filters) ||
            item.creation_date.includes(filters)))
         if (f1.length > 0) {
            sel.push(...f1)
         }
      }

      if (fFinal.length === 0) {
         if (sel.length>0) {
            setFiltered(sel)
         } else {
            setFiltered([...artPieces])
         }
         return
      }

      fFinal.forEach((filter,index) => {
         if (sel.length>0) {
            const f1 = sel.filter(item => item.cats.findIndex(el => { return el._id === filter._id }) !== -1)
            if (f1.length > 0) {
               sel = f1
            }
         } else {
            const f1 = artPieces.filter(item => item.cats.findIndex(el => { return el._id === filter._id }) !== -1)
            if (f1.length > 0) {
               sel.push(...f1)
            }
         }
      })

      setFiltered([...sel])
   }

   const executeCommand = () => {
      setShowManageSelection(false)
      switch (action) {
         case 'createList':
            getSelections().then(data => {
               if (Array.isArray(data) && data.length > 0) {
                  setSelections(data)
               } else {
                  setSelections([])
               }
            })
            setShowSelect(true)
            break
         case 'report':
            sessionStorage.setItem('routeState', JSON.stringify(selected))
            router.push('/reports')
            break
         case 'sell':
            sessionStorage.setItem('routeState', JSON.stringify(selected))
            router.push('/sell')
            break
      }
   }

   const makeItVisible = async (how: boolean) => {
      let opacity = 0
      let top = -400
      const executeShow = () => {
         filterRef.current!.style.opacity = opacity.toString()
         filterRef.current!.style.top = `${top}px`
         opacity += 0.1
         top += 20

         if (iterations > 0) {
            iterations--
            setTimeout(executeShow, 50)
         } else {
            iterations = 20
         }
      }

      const executeHide = () => {
         filterRef.current!.style.opacity = opacity.toString()
         filterRef.current!.style.top = `${top}px`
         opacity -= 0.1
         top -= 20

         if (iterations > 0) {
            iterations--
            setTimeout(executeHide, 50)
         } else {
            iterations = 20
         }
      }

      if (how) {
         opacity = 0
         top = -400
         setTimeout(executeShow, 100)
      } else {
         opacity = 1
         top = -200 + 20 * 10
         setTimeout(executeHide, 100)
      }
   }

   const handleFilters = () => {
      iterations = 20
      if (showFilters) {
         setShowFilters(false)
         makeItVisible(false)
      } else {
         setShowFilters(true)
         makeItVisible(true)
      }
   }

   const addMediaToArtPiece = () => {
      const selections = mediaSelected.map(item => item.id)
      apiSaveMediaToArtipiece({ artPieceId: addMoreMedia, selections }).then(data => {
         if (data) {
            setAddMoreMedia('')
            setMediaSelected([])
            router.refresh()
         } else {

         }
      })
   }

   const addSelection = (data: MediaData) => {
      const index = mediaSelected.findIndex(item => item.id === data.id)
      if (index !== -1) return
      mediaSelected.push(data)
      setMediaSelected([...mediaSelected])
   }

   const removeMedia = (id: string) => {
      const v = mediaSelected.filter(item => item.id !== id)
      setMediaSelected([...v])
   }


   const SelectedMedia = () => {
      return (
         <section className="selectMedia">
            <p>{t('general.selectedtoadd')}</p>

            <div className="selectedImages">
               {
                  mediaSelected.map(item => {
                     return (
                        <div className="preview">
                           <img className="iconImage" src={`data:image/png;base64, ${item.img}`} />
                           <p className="smallerText">{item.name}</p>
                           <img onClick={() => removeMedia(item.id)} src={trash} className="trash" />
                        </div>
                     )
                  })
               }
            </div>
         </section>
      )
   }

   return (
      <>
         {artPieces.length > 0 && <div className="operation flex paddingAllSmall border8Round marginV">
            <div className="flex2">
               <button className="primaryButton" onClick={() => router.push('/addartpiece')}>{t('general.add')}</button>

               <div className="last searchBlock">
                  <div className="flex1">
                      {selected.length > 0 && <p>{t('general.click_operation')}</p> }
                     <button disabled={selected.length <= 0} onClick={() => setShowManageSelection(true)} className={`selected borderButton`}>Selected: <span>{selected.length ? selected.length : t('general.none')}</span></button>
                     {selected.length > 0 && <img className="smallImageW pointer" onClick={(e) => { e.stopPropagation(); localStorage.removeItem('selected'); setSelected([]) }} src={clear} />}
                  </div>
                  <div className="searchfilter">
                     <SearchBlock onChange={function (search: string): void {
                        reloadArtPieces(search, 'string')
                     }} />
                     <img className="smallImageW pointer" onClick={() => handleFilters()} src={showFilters ? closeFilter : openIcon} />
                  </div>

               </div>
            </div>

            <div className="filterBox">
               <div ref={filterRef} className="showFilter">
                  <Filters categories={categories} onClose={() => handleFilters()} onChange={(filters, type) => reloadArtPieces(filters, type)} />
               </div>
            </div>
         </div>
         }
         {filtered.length > 0 ?
            <>

               <div className={`gridTable1 paddingAllSmall gap24 borderBottom mobile`}>
                  <div className="draggable">&nbsp;</div>
                  <div className="iconImage round8 zoom" >&nbsp;</div>
                  <div className="artinfo">
                     <div className="">{t('general.header.name')}</div>
                     <div className="">{t('general.header.description')}</div>
                     <div className="artmeasure ">
                        <div>{t('general.header.dimensions')}</div>
                        <div>{t('general.header.date')}</div>
                        <div className="">{t('general.header.price')}</div>
                     </div>
                     <div className="">{t('general.header.type')}</div>
                     <div className="">{t('general.header.status')}</div>
                  </div>
                  <div>&nbsp;</div>
               </div>
               {filtered.map(item => {
                  return (
                     <div key={item._id} className={`rowContainer ${selected.includes(item._id) ? "selected" : ""}`}>
                        <ArtPieceLine artPiece={item} categories={categories} />
                     </div>
                  )
               })
               }
            </>
            :
            <>

               <section className="flexC center">
                  <img className="iconImageBig" src={empty} />
                  <p className="center">{t(`general.noartwork`)}</p>
                  {artPieces.length <= 0 && <p className="center">{t(`general.startentering`)}<span onClick={() => router.push('/addartpiece')} className="pointer underlined">{t('general.addartpiece')}</span></p>}
               </section>
            </>

         }
         <Modal title={t('general.addtolist')} closeicon={""} visible={showSelect} onClose={function (): void {
            setShowSelect(false)
         }} >
            <SelectList artpieces={selected} selections={selections} onClose={function (): void {
               setShowSelect(false)
            }} />
         </Modal>
         
         <Modal title={t('general.manageselection')} closeicon={""} visible={showManageSelection} onClose={function (): void {
            setShowManageSelection(false)
         }} >
            <div className={`paddingH  gap8 ${selected.length > 0 ? "enable" : "disable"}`}>

               <p>{t('general.operationselections', { sels: selected.length })}</p>
               <div className="inputfield selections">
                  <label>{t('general.withselect')}</label>
                  <Select
                     placeholder={t('general.select')}
                     closeMenuOnSelect={true}
                     isDisabled={selected.length <= 0}
                     options={listOptions}
                     onChange={(e) => { setAction(e?.value as string) }}
                     className="filter-selections"
                     classNamePrefix="filter"
                  />
               </div>
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setShowManageSelection(false)}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { executeCommand() }}>{t('general.go')}</button>
               </div>

            </div>
         </Modal>

         {addMoreMedia !== '' && <Modal title={t('general.addmoremedia')} closeicon={""} visible={addMoreMedia !== ''} onClose={function (): void {
            setMediaSelected([]); setAddMoreMedia('')
         }} >
            <SelectedMedia />
            <div className="mediatoselect">
               <Media onSelect={(data) => addSelection(data)} />
            </div>
            <div className="buttonblock mediaselect">
               <button className="secondaryButton" onClick={() => { setMediaSelected([]); setAddMoreMedia('') }}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { addMediaToArtPiece() }}>{t('general.addtoartpiece')}</button>
            </div>

         </Modal>
         }
      </>
   )
}