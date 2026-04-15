import { useState } from 'react'
const logomin = '/images/logomin.svg'
import { Timeout } from '../interfaces'
import { useWaitingListener } from './utility'

interface WaitingProps {
}

export const Spinner = () => {
   return (
   <div className="wrapperMoveit">
      <img  className="moveit" src={logomin} />
    </div>
   )
}

export const Waiting = (props: WaitingProps) => {
   const [waiting, setWaiting] = useState(false)

   useWaitingListener((payload: Timeout) => {
      if (payload.visible === false) {
         const t = Date.now()-payload.start
         if ( t > 1000) {
            setWaiting(false)
         } else {
            setTimeout(()=>setWaiting(false), 1000-t)
         }
      } else {
         setWaiting(true)
      }
   })

   return (
      <div className={`wrapperMoveit ${waiting ? "" : "hidden"}`}>
         <img  className="moveit" src={logomin} />
      </div>
   )
}
