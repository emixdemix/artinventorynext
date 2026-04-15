import { useTranslation } from 'react-i18next'
const logosmall = '/images/logosmall.svg'
export const Footer = () => {
   const { t } = useTranslation()
   return (
      <div className="footer flex1 background paddingAllSmall">
         <img src={logosmall} className='bigImageW' /> 
         <p className='paddingH strong smallerText reverse'>Copyright ArtInventory 2025</p>
      </div>
   )
}