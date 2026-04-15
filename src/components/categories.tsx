import { useParams } from "next/navigation";
import { ManageCategories } from "./forms"
import { useEffect, useState } from "react";
import { CategoryTypes } from "../interfaces";
import { BackButton } from "./backbutton";
import { useTranslation } from "react-i18next";

export const Categories = () => {
   const [type, setType] = useState('')
   const params = useParams();
   const id = params?.id as string | undefined

   const { t } = useTranslation()

   useEffect(()=>{
      if (id) {
         if (CategoryTypes.includes(id)) {
            setType(id)
         } else {
            setType('category')
         }
      } else {
         setType('category')
      }
   },[])

   return (
      <section className="edit">
         <BackButton text={t('general.backto.organize')} where="/organize" />
         {type && <ManageCategories type={type} /> }
      </section>
   )
}