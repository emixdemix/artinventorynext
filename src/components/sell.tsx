import { useTranslation } from "react-i18next"
import { useContext, useEffect, useState } from "react"
import { ContextStorage } from "../store"
import { apiSellPieces, getArtPieces, getArtpieceSale, getCustomers, hideWaiting, showWaiting } from "./utility"
import { ArtPiece, Customer, KeyValue } from "../interfaces"
import Select, { SingleValue } from 'react-select'
import { Modal } from "./modal"
import posthog from "posthog-js"


export const ArtElement = (props: { artPieceSale: KeyValue[], artPieces: ArtPiece[], id: string, onChange: (id: string, value: number) => void }) => {
   const [quantity, setQuantity] = useState(1)
   const [total, setTotal] = useState(0)
   const item = props.artPieces.find(el => el._id === props.id)
   const { t } = useTranslation()

   useEffect(() => {
      const elements = props.artPieceSale.filter(item => item._id === props.id)
      let total = 0
      elements.forEach(item => total += parseInt(item.qt))
      setTotal(total)
   }, [])

   useEffect(() => {
      const qt = (item?.quantity as number) - total
      if (quantity > qt) {
         setQuantity(qt)
      }
      if (quantity <= 0) {
         setQuantity(1)
      }
      props.onChange(props.id, quantity)
   }, [quantity])

   if (item) {
      return (
         <div className="flex gap24 marginV">
            <img className="iconImage round8" src={`data:image/png;base64,${item.b64Image}`} />
            <p>{item.title}</p>
            <p>{item.price}</p>
            <div className="flex">
               <p className="smallerText paddingH">{t('general.quantity')}</p>
               <input type="number" name="quantity" value={quantity} onChange={(e) => setQuantity(e.target.valueAsNumber)} />
            </div>
         </div>
      )
   } else {
      return null
   }

}
export const Sell = () => {
   const { t } = useTranslation()
   const state = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('routeState') || 'null') : null;
   const [selectedCustomer, setSelectedCustomer] = useState<SingleValue<{ label: string, value: string }>>()
   const [artPieces, setArtPieces] = useState([] as ArtPiece[])
   const [artPieceSale, setArtPieceSales] = useState([] as KeyValue[])
   const [customers, setCustomers] = useState([] as Customer[])
   const [selected, setSelected] = useState([] as string[])
   const [values, setValues] = useState({} as KeyValue)
   const [showSell, setShowSell] = useState(false)

   const store = useContext(ContextStorage);

   useEffect(() => {
      if (store.artPieces) {
         setArtPieces(store.artPieces)
      } else {
         getArtPieces().then(data => {
            setArtPieces(data)
         })
      }
      getArtpieceSale().then(data => {
         setArtPieceSales(data)
      })
      getCustomers().then(data => {
         setCustomers(data)
      })
   }, [])


   useEffect(() => {
      if (Array.isArray(state) && state.length > 0) {
         setSelected(state)
      }
   }, [state])


   const setValue = (id: string, val: number) => {
      values[id] = val
      setValues({ ...values })
   }

   const sellPieces = () => {
      showWaiting()
      apiSellPieces({customerId:selectedCustomer?.value, artPieces:values}).then(response => {
         hideWaiting()
         posthog.capture("art_pieces_sold", {
            customer_id: selectedCustomer?.value,
            customer_name: selectedCustomer?.label,
            num_pieces: selected.length,
         })
         setShowSell(false)
      })
   }

   return (
      <>
         {selected.length>0 && <section className="reportMain">
            <p className="">{t('general.howtosell')}</p>
            <div className="sellContainer">
               <div className="images">
                  {selected.map(item => {
                     return (
                        <ArtElement artPieceSale={artPieceSale} artPieces={artPieces} id={item} onChange={(id, val) => setValue(id, val)} />
                     )
                  })}
               </div>
               {customers.length >= 0 && <div className="inputfield">
                  <Select
                     placeholder={t('general.select')}
                     closeMenuOnSelect={true}
                     value={selectedCustomer}
                     isMulti={false}
                     options={customers.map(item => { return { label: item.name, value: item._id as string } })}
                     onChange={(e) => setSelectedCustomer(e)}
                  />
               </div>}
               <div className="buttonblock">
                  <button disabled={!(selectedCustomer && selected.length > 0)} className="primaryButton" onClick={() => setShowSell(true)}>{t('general.sell')}</button>
               </div>
            </div>
            
         </section>
         }

         {selected.length<=0 && <section className="sales">
            <p className="">{t('general.selllist')}</p>
            <section className="salesBlocks">
            {customers.map(item => {
               if (item.artpieces && item.artpieces.length>0) {
                  let n = 0
                  item.artpieces.forEach(el => n+=parseInt(el.quantity))
                  return (
                     <div className="saleblock">
                     <h1>{item.name}</h1>
                     <p>{item.artpieces.length} Sales total {n} pieces</p>
                     </div>
                  )
               } else 
               return null
            })}
         </section>
         </section>
         }

         <Modal title={t('general.sellpieces')} closeicon={""} visible={showSell} onClose={function (): void {
               setShowSell(false)
            }} >
               <h1>{t('general.confirmsale')}</h1>
                <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setShowSell(false)}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { sellPieces() }}>{t('general.sell')}</button>
               </div>
            </Modal>
      </>
   )
}