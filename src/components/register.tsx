import { useTranslation } from "react-i18next"
import { RegisterForm } from "./forms"
import { useState } from "react"
import { useRouter } from "next/navigation"

export const Register = () => {
   const { t } = useTranslation()
   const router = useRouter()
   const [success, setSuccess] = useState('')
   
   return (
      <>
      { success ? 
         <section className="registration">
            <h1>{success}</h1>
            <p className="pointer" onClick={()=> router.push('/login')}>{t('general.gotologin')}</p>
         </section>
      :
         <section className="registration">
            <h1>{t('general.artinventoryRegistration')}</h1>
            <p className="subtitle">{t('general.registerText')}</p>
            <p className="">{t('general.howtoregister')}</p>
            <RegisterForm onSuccess={(message) => setSuccess(message)}/>
         </section>
}
      </>
   )
}