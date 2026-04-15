import { useEffect, useState } from "react"
import { ArtPiece, PictureDao } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { AddShowForm, EditShowForm } from "./forms"
import { useTranslation } from "react-i18next"
import { BackButton } from "./backbutton"


export const AddShow = () => {
   const { t } = useTranslation()
   const params = useParams(); const id = params?.id as string | undefined;

   return (
      <section className="edit">
         <BackButton text={t('general.backto.shows')} where="/shows" />
         <p className="breadcrumb">{id ? t('general.editshows') : t('general.addshows')}</p>
         {!id && <AddShowForm  /> }
         {id && <EditShowForm id={id}  /> }
      </section>
   )
}