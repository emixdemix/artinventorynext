import { useParams } from "next/navigation"
import { LoginForm } from "./forms"
import { useEffect } from "react"

export const Login = () => {
   return (
      <>
         <section className="login">
            <LoginForm />
         </section>
      </>
   )
}