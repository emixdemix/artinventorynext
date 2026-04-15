import { PropsWithChildren, useEffect } from "react"
import { Header, HeaderOut } from "./header"
import { Footer } from "./footer"
import { DndProvider, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { Waiting } from "./waiting"
import { checkSession } from "./utility"
import { useRouter } from "next/navigation"

export interface LayoutProps {
}

export const Layout = (props: PropsWithChildren<LayoutProps>) => {
   const localSession = localStorage.getItem('session')
   const router = useRouter()

   useEffect(() => {
      checkSession().then(valid => {
         if (!valid) {
            router.push('/login')
         }
      })
   }, [])
   return (
      <>
         <Header /> 
         <section className="mainContent">
         <DndProvider backend={HTML5Backend}>
            {props.children}
            </DndProvider>
         </section>
         <Waiting />
         <Footer />
      </>
   )
}

export const LayoutAnonim = (props: PropsWithChildren<LayoutProps>) => {
   const localSession = localStorage.getItem('session')
   const router = useRouter()

   return (
      <>
        
         <HeaderOut /> 
         <section className="mainContent">
         <DndProvider backend={HTML5Backend}>
            {props.children}
            </DndProvider>
         </section>
         <Waiting />
         <Footer />
      </>
   )
}