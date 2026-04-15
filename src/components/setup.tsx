import { useTranslation } from "react-i18next"
import { LoginForm, RegisterForm } from "./forms"
import { useRouter, useParams } from "next/navigation"
import { useEffect, useState } from "react"
import { doConfirm, hideWaiting, showWaiting } from "./utility"

export const Setup = () => {
   const { t } = useTranslation()
   const router = useRouter()
   const [error, setError] = useState('')
   const params = useParams(); const id = params?.id as string | undefined

   useEffect(() => {
      if (id) {
         showWaiting()
         doConfirm({ token: id }).then(response => {
            hideWaiting()
            if (!response) {
               setError(t('general.tokenexpired'))
            } else {
               localStorage.setItem('session', response.session)
               router.push('/home')
            }
         })
      } else {
         setError(t('general.tokenexpired'))
      }
   }, [])
   
   return (
      <>
         <section className="registration">
            {!error && <p className="">{t('general.registrationsuccessfull')}</p>}
            <p className="pointer" onClick={()=> router.push('/login')}>{t('general.gotologin')}</p>
            {error && <p className="error">{error}</p>}
         </section>
      </>
   )}
