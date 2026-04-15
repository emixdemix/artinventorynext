import { useTranslation } from "react-i18next"
const left = '/images/left.svg'
import { useRouter } from "next/navigation"

interface BackButtonProps {
   where: string
   text: string
   callback?: () => void
}

export const BackButton = (props:BackButtonProps) => {
   const { t } = useTranslation()
   const router = useRouter()
   
   return (
      <>
         <div className="backbutton pointer" onClick={()=> {if (props.callback) { props.callback() }  router.push(props.where)}}>
            <img src={left} className="mediumImageW"/>
            <p>{props.text}</p>
         </div>
      </>
   )
}