import { useTranslation } from 'react-i18next'
const logo = '/images/logo-bianco.svg'
const hamburger = '/images/menu.svg'
const closeicon = '/images/closeiconwhite.svg'

const profile = '/images/profile.svg'
import { useRouter } from "next/navigation"
import { useContext, useEffect, useRef, useState } from 'react'
import { Modal } from './modal'
import { emitStore, getProfile } from './utility'
import { ContextStorage } from '../store'

export const Header = () => {
   const [visible, setVisible] = useState(false)
   const [over, setOver] = useState(false)
   const [showLogout, setShowLogout] = useState(false)
   const [avatar, setAvatar] = useState('')
   const refImage = useRef(null)
   const refMenu = useRef(null)
   const [menuOpen, setMenuOpen] = useState(false)
   const store = useContext(ContextStorage);
   const { t } = useTranslation()
   const router = useRouter()


   useEffect(() => {
      getProfile().then(profile => {
         emitStore({key:'profile', value: profile, store:true})
         if (profile.picture) {
            setAvatar(`data:image/png;base64,${profile.picture}`)
         }
      })
      document.body.addEventListener('click', handleOnClick);
      return () => {
         document.body.removeEventListener('click', handleOnClick);
      }
   }, []);

   function handleOnClick(event: MouseEvent) {
      if (refImage.current && !event.composedPath().includes(refImage.current)) {
         setOver(false)
      }
      if (refMenu.current && !event.composedPath().includes(refMenu.current)) {
         setMenuOpen(false)
      }
   }

   const DropMenu = () => {
      const { t } = useTranslation()
      return (
      <div className={`dropmenu ${over ? "over" : ''}`}>
         <div onClick={() => router.push('/profile')} className=' pointer'>{t('general.menu.profile')}</div>
         <div onClick={() => setShowLogout(true)} className=' pointer'>{t('general.menu.logout')}</div>
      </div>
      )
   }

   return (
      <>
         <div className="header background paddingAllSmall paddingH nomobile">
            <img className="logo pointer" src={logo} onClick={() => router.push('/home')} />
            <div className='menucontainer last paddingH'>
               <div className='menuheader'>
                  <p onClick={() => router.push('/dashboard')}>{t('general.menu.artwork')}</p>
                  <p onClick={() => router.push('/media')}>{t('general.menu.media')}</p>
                  <div ref={refMenu} className='openmenu' onClick={()=>setMenuOpen(!menuOpen)}>
                     {t('general.menu.organize')}
                     <div className={`submenu ${menuOpen ? "open" : "close"}`}>
                        <p onClick={() => router.push('/shows')}>{t('general.menu.shows')}</p>
                        <p onClick={() => router.push('/customers')}>{t('general.menu.customers')}</p>
                        <p onClick={() => router.push('/reports')}>{t('general.menu.reports')}</p>
                        <p onClick={() => router.push('/selection')}>{t('general.menu.selections')}</p>
                        <p onClick={() => router.push('/organize')}>{t('general.menu.settings')}</p>
                     </div>
                  </div>
                  <p onClick={() => router.push('/feedback')}>{t('general.menu.feedback')}</p>
               </div>
               <p className='text reverse paddingH'>{t('general.hello')}</p>
               <div ref={refImage} className='relative avatarcontainer'>
                  { avatar ?
                     <img className="avatarheader pointer" src={avatar} onClick={() => setOver(!over)} /> 
                     : 
                     <img className="avatarprofile pointer" src={profile} onClick={() => setOver(!over)} /> 
                  }
                  <DropMenu />
               </div>
            </div>
         </div>
         <div className="header background paddingAllSmall paddingH mobile">
            <img className="logo pointer" src={logo} onClick={() => router.push('/')} />
            <div className='last paddingH mobile'>
               <img className="mediumImageW pointer last" onClick={() => setVisible(!visible)} src={visible ? closeicon :hamburger} />
               <section className={`mobilemenu ${visible ? "" : "hidden"}`}>
                  <div className='menuheader'>
                     <p onClick={() => { setVisible(false); router.push('/dashboard') }}>{t('general.menu.artwork')}</p>
                     <p onClick={() => { setVisible(false); router.push('/media') }}>{t('general.menu.media')}</p>

                     <p onClick={() => { setVisible(false); router.push('/shows')}}>{t('general.menu.shows')}</p>
                     <p onClick={() => { setVisible(false); router.push('/customers')}}>{t('general.menu.customers')}</p>
                     <p onClick={() => { setVisible(false); router.push('/reports') }}>{t('general.menu.reports')}</p>               
                     <p onClick={() => { setVisible(false); router.push('/selection')}}>{t('general.menu.selections')}</p>
                     <p onClick={() => { setVisible(false); router.push('/organize') }}>{t('general.menu.settings')}</p>

                     <p onClick={() => { setVisible(false); router.push('/feedback') }}>{t('general.menu.feedback')}</p>
                     <p onClick={() => { setVisible(false); router.push('/logout') }}>{t('general.menu.logout')}</p>
                  </div>
               </section>
            </div>
         </div>
         <Modal title={t('general.logout')} closeicon={""} visible={showLogout} onClose={function (): void {
            setShowLogout(false)
         }} >
            <div className="buttonblock">
               <button className="secondaryButton" onClick={() => setShowLogout(false)}>{t('general.cancel')}</button>
               <button className="primaryButton" onClick={() => { router.push('/logout') }}>{t('general.logout')}</button>
            </div>
         </Modal>
      </>
   )
}

export const HeaderOut = () => {
   const router = useRouter()
   return (
      <>
         <div className="header background paddingAllSmall paddingH nomobile">
            <img className="logo pointer" src={logo} onClick={() => router.push('/')} />
         </div>
         <div className="header background paddingAllSmall paddingH mobile">
            <img className="logo pointer" src={logo} onClick={() => router.push('/')} />
         </div>
      </>
   )
}