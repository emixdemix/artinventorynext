import { useEffect, useState } from "react"
import { getArtPiece, getCategories, hideWaiting, showWaiting, updateArtPiece } from "./utility"
import { ArtPiece, ArtPieceDAO, Category, PictureDao } from "../interfaces"
import { useRouter, useParams } from "next/navigation"
import { EditArtpiece } from "./forms"
import { useTranslation } from "react-i18next"
import { BackButton } from "./backbutton"
import posthog from "posthog-js"


export const Edit = () => {
   const [media, setMedia] = useState([] as PictureDao[])
   const [artPiece, setArtpPiece] = useState({} as ArtPiece)
   const [categories, setCategories] = useState([] as Category[])

   const [error, setError] = useState('')
   const { t } = useTranslation()

   const router = useRouter()
   const params = useParams();

   useEffect(() => {
      if (!params.id) {
         router.push('/dashboard')
      }
      getArtPiece(params.id as string).then(data => {
         if (Array.isArray(data) && data.length > 0) {
            setArtpPiece(data[0] as ArtPiece)
         }
      })
      getCategories('all').then(cats => {
         setCategories(cats)
      })
   }, [])

   const updatePiece = async (form: ArtPieceDAO) => {
      showWaiting()
      const formData = new FormData()

      formData.append("artPieceId", artPiece._id)
      formData.append("title", form.title)
      formData.append("dimensions", form.dimensions)
      formData.append("description", form.description)
      if (form?.image && typeof (form.image) === 'object') {
         formData.append("document", form.image);
         formData.append("originalname", form.image.name)
      } else {
         formData.append('imageId', form.image)
      }
      formData.append("categories", JSON.stringify(form.categories))

      formData.append("price", form.price?.toString() || '')
      formData.append("media", form.media?.toString() || '')
      formData.append("year", form.year)
      formData.append("quantity", form.quantity?.toString() || '1')
      const response = await updateArtPiece(formData)
      hideWaiting()
      if (response === true) {
         posthog.capture("art_piece_updated", { title: form.title, art_piece_id: artPiece._id })
         router.push('/dashboard')
      } else {
         setError(t('general.couldnotupdate'))
      }
   }

   return (
      <section className="edit">
         <BackButton text={t('general.backto.artwork')} where="/dashboard" />
         <p className="breadcrumb">{t('general.editartpiece')}</p>
         {artPiece?.title && <EditArtpiece onClose={function (): void {
            router.push('/dashboard')
         }} onSave={function (form: ArtPieceDAO): void {
            updatePiece(form)
         }} artpiece={artPiece} error={error} categories={categories} />}
      </section>
   )
}