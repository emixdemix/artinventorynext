import { useTranslation } from "react-i18next"
import { useRouter } from "next/navigation"

interface CardProps {
   title: string
   text: string
   link: string
   buttonText: string
}
export const Card = (props: CardProps) => {
   const router = useRouter()
   const { t } = useTranslation()

   return (
      <section className="card">
         <h1>{props.title}</h1>
         <p className="smallText">{props.text}</p>
         <button className="primaryButton" onClick={() => router.push(props.link)}>{props.buttonText}</button>
      </section>

   )
}

export const Home = () => {
   const { t } = useTranslation()
   return (
      <>
         <section className="home">
            <h1>{t('general.welcome')}</h1>
            <p>{t('general.welcomeText')}</p>
            
            <section className="cards">
               <Card title={t('general.card.categoryTitle')} text={t('general.card.categoryText')} link={'/organize'} buttonText={t('general.card.categoryButton')} />
               <Card title={t('general.card.artworkTitle')} text={t('general.card.artworkText')} link={'/dashboard'} buttonText={t('general.card.artworkButton')} />
               <Card title={t('general.card.mediaTitle')} text={t('general.card.mediaText')} link={'/media'} buttonText={t('general.card.mediaButton')} />
               <Card title={t('general.card.reportTitle')} text={t('general.card.reportText')} link={'/selection'} buttonText={t('general.card.reportButton')} />
            </section>
         </section>
      </>
   )
}