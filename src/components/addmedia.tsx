import { useState } from "react"
import { GetImage, hideWaiting, showWaiting, uploadMediaPiece } from "./utility"
import { useRouter, useParams } from "next/navigation"
import { useTranslation } from "react-i18next"
import { FileUploader } from "react-drag-drop-files"
const uploadimage = '/images/upload.svg'
const pendingimage = '/images/cog.svg'
import { BackButton } from "./backbutton"

export const AddMedia = () => {
   const [error, setError] = useState('')
   const [files, setFiles] = useState([] as File[])
   const [pending, setPending] = useState(false)
   const [name, setName] = useState('')
   const state = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('routeState') || 'null') : null
   const { t } = useTranslation()
   const router = useRouter()
   const params = useParams();

   const currentFolder = state?.folder || '/'

   const saveMedia = async () => {
      showWaiting()
      const formData = new FormData()

      formData.append("name", name)
      formData.append("document", files[0]);
      formData.append("originalname", files[0].name)
      formData.append("folder", currentFolder)
      
      const response = await uploadMediaPiece(formData)
      hideWaiting()
      if (response === true) {
         router.push('/media')
      } else {
         setError(t('general.couldnotupdate'))
      }
   }

   const handleChange = (file: File) => {
      setFiles([file])
   }

   return (
      <section className="edit">
         <BackButton text={t('general.backto.media')} where="/media" />
         
         <p className="breadcrumb">{t('general.addmediaonfolder', {folder:currentFolder})}</p>
         <div className="inputfield">
               <label>{t('general.name')}</label>
               <input placeholder={t('general.placeholders.name')} type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
         <FileUploader
            multiple={false}
            handleChange={handleChange}
            name="file"
            types={['png', 'jpg', 'jpeg']}
         >

            <div className="uploadContainer">
               <label className="marginV">{t('general.imageonmedia')}</label>
               {
                  files.length > 0 ?
                     <div className="uploadpreview">
                        <GetImage file={files[0]} />
                        <p>{`${t('general.filename')} ${files[0].name}`}</p>
                     </div>

                     :
                     
                        pending ?
                           <div className="upload">
                              <img className="iconImage rotate" src={pendingimage} />
                              <p className="smallText">{t('general.loading')}</p>
                           </div>
                           :
                           <div className="upload">
                              <img className="iconImage" src={uploadimage} />
                              <p className="smallText">{t('general.upload')}</p>
                           </div>
               }
            </div>
         </FileUploader>
         <div className="buttonblock">
               <button disabled={files.length<=0 || !name} className="primaryButton" onClick={() => { saveMedia() }}>{t('general.save')}</button>
            </div>
      </section>
   )
}