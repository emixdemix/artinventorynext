import { useTranslation } from "react-i18next"
import { LoginForm } from "./forms"

export const ErrorPage = () => {
   const { t } = useTranslation()
   return (
      <>
         <section className="backimage">
            <p className="">{t('general.nopage')}</p>
         </section>
      </>
   )
}