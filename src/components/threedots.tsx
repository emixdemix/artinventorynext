import { PropsWithChildren, useEffect, useRef, useState } from 'react';

const dots = '/images/dots.svg'

interface ThreeDotsProps {

}

export const ThreeDots = (props: PropsWithChildren<ThreeDotsProps>) => {
   const [visible, setVisible] = useState(false)
   const refImage = useRef(null)
   
   useEffect(()=>{
      document.body.addEventListener('click', handleOnClick);
      return () => {
         document.body.removeEventListener('click', handleOnClick);
      }
   },[])

   const handleOnClick = (event: MouseEvent) => {
      if (refImage.current && !event.composedPath().includes(refImage.current)) {
         setVisible(false)
      }
   }

   const showMenu = (e:React.MouseEvent) => {
      e.stopPropagation()
      setVisible(!visible)
   }

   return (
      <>
         <div ref={refImage} className="dots" onClick={(e) => showMenu(e)}>
            <img src={dots} />
            <div className={`menu ${visible ? "visible" : "hidden"}`}>
               {props.children}
            </div>
         </div>
      </>
   )
}