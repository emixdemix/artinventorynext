import { useTranslation } from "react-i18next"
import { useEffect, useState } from "react"
import { apiDeleteCustomer, apiDeleteShow, convertIsoDate, Dotted, getCustomers, getSelections, getShows, hideWaiting, showWaiting } from "./utility"
import { Address, ArtSelection, Customer, Shows } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { Modal } from "./modal"
import { ThreeDots } from "./threedots"
import { BackButton } from "./backbutton"
const empty = '/images/nothing.svg'

export const CustomerComponent = () => {
   const router = useRouter()
   const { t } = useTranslation()
   const params = useParams(); const id = params?.id as string | undefined
   const [customers, setCustomers] = useState([] as Customer[])
   const [selections, setSelections] = useState([] as ArtSelection[])
   const [selectedCustomer, setSelectedCustomer] = useState<Customer | undefined>()
   const [customerDeleteForm, setCustomerDeleteForm] = useState('')
   const [showDetail, setShowDetail] = useState('')
   const state = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('routeState') || 'null') : null

   useEffect(() => {
      loadCustomers()
   }, [state])

   const loadCustomers = () => {
      getCustomers().then(data => {
         setCustomers(data)
         if (id) {
            const t = data.find(item => item._id === id)
            if (t) setSelectedCustomer(t)
         }
      })
   }

   useEffect(() => {
      if (customers.length > 0) {
         if (id) {
            const t = customers.find(item => item._id === id)
            if (t) setSelectedCustomer(t)
         }
      } else {
         loadCustomers()
      }
   }, [id])

   const deleteCustomer = async (id:string) => {
      showWaiting()
      const reponse = await apiDeleteCustomer(id)
      hideWaiting()
      router.refresh()
   }

   const DisplayLocation = (props:{location: Address}) => {
      return (
         <div className="address">
            <p>{props.location.street}</p>
            <p>{props.location.city}</p>
            <p>{props.location.state}</p>
            <p>{props.location.country}</p>
         </div>
      )
   }

   return (
      <>
         <section className="reportMain">
            {selectedCustomer && <BackButton callback={()=>setSelectedCustomer(undefined)} text={t('general.backto.customers')} where="/customers" /> }
            <div className="breadcrumb">
               <p>{t(`general.customers`)}</p>
               <div className="buttonblock last">
               <button className="primaryButton" onClick={() => router.push('/addcustomer')}>{t('general.addcustomer')}</button>
               </div>
            </div>
            <p className="">{t('general.howtocustomer')}</p>
            {!selectedCustomer && customers.length>0 && 
               <div className="showlist">
                  <div className="customer showheader borderBottom">
                     <p >{t('general.showname')}</p>
                     <p className="nomobile">{t('general.showdescription')}</p>
                     <p className="nomobile">{t('general.showemail')}</p>
                     <div>&nbsp;</div>
                  </div>
                  {customers && customers.map(rep => {
                     return (
                        <div className="customer borderBottom">
                           <p className="title select" onClick={() => router.push(`/customers/${rep._id}`)}>{rep.name}</p>
                           <Dotted className="nomobile" chars={20} text={rep.description}></Dotted>
                           <p className="nomobile" >{rep.contactEmail}</p>
                           <ThreeDots >
                              <ul>
                                 <li onClick={() => router.push(`/addcustomer/${rep._id}`)}>{t('general.edit')}</li>
                                 <li onClick={() => setCustomerDeleteForm(rep._id as string)}>{t('general.remove')}</li>
                              </ul>
                           </ThreeDots>
                        </div>
                     )
                  })}
               </div>
            }
            {!selectedCustomer && customers.length<=0 &&  
            <section className="flexC center shows paddingV">
               <img className="iconImageBig" src={empty} />
               <p className="center">{t(`general.nocustomers`)}</p>
               <p className="center">{t(`general.startenteringcustomer`)}<span onClick={() => router.push('/addcustomer')} className="pointer underlined paddingH">{t('general.addcustomer')}</span></p> 
            </section>
            }

            {selectedCustomer && <div className="">
               <h1>{t('general.customerDetail', { name: selectedCustomer.name })}</h1>
               <section className="showcontainer">
                  <div className="detailshow">
                     <p className="name">{t('general.showlocation')} <span><DisplayLocation location={selectedCustomer.location} /></span></p>
                  </div>
                 
                  <div className="detailshow">
                     <p className="name">{t('general.showdescription')} <span>{selectedCustomer.description}</span></p>
                  </div>
                  <div className="detailshow">
                     <p className="name">{t('general.showemail')} <span>{selectedCustomer.contactEmail}</span></p>
                  </div>
                 
               </section>
            </div>
            }
            <Modal size="small" title={t('general.remove')} closeicon={""} visible={customerDeleteForm !== ''} onClose={function (): void {
               setCustomerDeleteForm('')
            }} >
               <p>{t('general.sureremove')}</p>
               <div className="buttonblock">
                  <button className="secondaryButton" onClick={() => setCustomerDeleteForm('')}>{t('general.cancel')}</button>
                  <button className="primaryButton" onClick={() => { setCustomerDeleteForm(''); deleteCustomer(customerDeleteForm) }}>{t('general.delete')}</button>
               </div>
            </Modal>
         </section>
      </>
   )
}