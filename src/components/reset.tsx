import { useParams } from "next/navigation"
import { LoginForm, PasswordForm, ResetForm } from "./forms"

export const ResetPassword = () => {
   const params = useParams(); const id = params?.id as string | undefined
   return (
      <>
         <section className="login">
            { id && <PasswordForm token={id}/>}
            { !id && <ResetForm /> }
         </section>
      </>
   )
}