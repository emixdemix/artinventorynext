import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRouter } from "next/navigation"

export const Logout = () => {
   const { t } = useTranslation()
   const router = useRouter() 

   useEffect(() => {
      localStorage.removeItem('session')
      localStorage.removeItem('context')
      router.push('/login')
   })
   return (
      <div className="header flex background paddingAllSmall">
         
      </div>
   )
}