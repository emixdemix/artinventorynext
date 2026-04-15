import { useEffect, useState } from "react"
import { hideWaiting, showWaiting, uploadArtPiece } from "./utility"
import { ArtPiece, ArtPieceDAO, PictureDao } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { AddArtpiece } from "./forms"
import { useTranslation } from "react-i18next"
import { BackButton } from "./backbutton"


export const AddNew = () => {
   const [error, setError] = useState('')
   const { t } = useTranslation()

   const router = useRouter()
   const params = useParams();

   useEffect(() => {
   }, [])

   const saveArtPiece = async (form: ArtPieceDAO) => {
      showWaiting()
      const formData = new FormData()

      formData.append("title", form.title)
      formData.append("dimensions", form.dimensions)
      formData.append("description", form.description)
      formData.append("categories", JSON.stringify(form.categories))
      formData.append("quantity", form.quantity.toString())

      if (form?.image && typeof (form.image) === 'object') {
         formData.append("document", form.image);
         formData.append("originalname", form.image.name)
      } else {
         formData.append('imageId', form.image)
      }

      formData.append("media", form.media)
      formData.append("price", form.price.toString())
      formData.append("year", form.year)

      const response = await uploadArtPiece(formData)
      hideWaiting()
      if (response === true) {
         router.push('/dashboard')
      } else {
         setError(t('general.couldnotupdate'))
      }
   }

   return (
      <section className="edit">
         <BackButton text={t('general.backto.artwork')} where="/dashboard" />
         <p className="breadcrumb">{t('general.addartpiece')}</p>
         <AddArtpiece error={error} onClose={() => { router.push('/dashboard')}} onSave={(form: ArtPieceDAO) => { saveArtPiece(form) }} />
      </section>
   )
}