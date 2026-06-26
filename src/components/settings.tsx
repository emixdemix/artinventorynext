import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
const categoryIcon = '/images/category.svg'
const statusIcon = '/images/status.svg'
const typeIcon = '/images/type.svg'

const iconStyle = (url: string): React.CSSProperties => ({
   WebkitMaskImage: `url(${url})`,
   maskImage: `url(${url})`,
   WebkitMaskRepeat: 'no-repeat',
   maskRepeat: 'no-repeat',
   WebkitMaskPosition: 'center',
   maskPosition: 'center',
   WebkitMaskSize: 'contain',
   maskSize: 'contain',
})

export const Settings = () => {
   const { t } = useTranslation()
   const router = useRouter()

   return (
      <section className="settings">
         <div className="managecategories">
            <p className="strong paddingV">{t('general.explain.settingscategories')}</p>
            <ul>
               <li className="smallText" >
                  <span className="settingsIcon" style={iconStyle(categoryIcon)} onClick={() => router.push('/categories/category')} />
                  {t('general.manageCategories')}
               </li>
               <li className="smallText " >
                  <span className="settingsIcon" style={iconStyle(typeIcon)} onClick={() => router.push('/categories/arttype')} />
                  {t('general.manageArttypes')}
               </li>
               <li className="smallText " >
                  <span className="settingsIcon" style={iconStyle(statusIcon)} onClick={() => router.push('/categories/status')} />
                  {t('general.manageStatuses')}
               </li>
            </ul>
         </div>
      </section>
   )
}
