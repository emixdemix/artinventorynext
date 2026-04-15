import { useEffect, useRef } from 'react'
import { PropsWithChildren } from "react"

const closeicon = '/images/closeicon.svg'

interface WaitingProps {
   title: string
   closeicon: string
   visible: boolean
   onClose: () => void
   size?: string
}

export const Modal = (props: PropsWithChildren<WaitingProps>) => {
   const ref = useRef<HTMLDivElement>(null)

   useEffect(() => {
      
   }, [props.visible])

   const closeModal = (event:React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.target === ref.current) {
         props.onClose()
      }
      event.stopPropagation()
   }

   return (
      <div ref={ref} className={`wrapperModal ${props.visible ? "" : "invisible"}`} onClick={(e) => closeModal(e)}>
         <div className={`wrapperContent ${props.size ? props.size : ""}`}>
            <div className="modalHeader">
               <h1>{props.title}</h1>
               <div className="modalClose"><img onClick={props.onClose}src={props.closeicon ? props.closeicon : closeicon} /></div>
            </div>
            <div className="modalChildren">
               {props.children}
            </div>
         </div>
      </div>
   )
}
