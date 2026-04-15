import { useRouter, useParams } from "next/navigation";
import { ManageCategories } from "./forms"
import { useContext, useEffect, useRef, useState } from "react";
import { CategoryTypes, KeyValue, StoreContext } from "../interfaces";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useTranslation } from "react-i18next";
import { emitStore, saveProfile, useAppStateListener } from "./utility";
import { Modal } from "./modal";
import AvatarEditor from 'react-avatar-editor'
const emptyprofile = '/images/profileback.svg'
import { ContextStorage } from "../store";

export const PersonalInformation = () => {
   const { t } = useTranslation()
   const [name, setName] = useState('')
   const [describe, setDescribe] = useState('')
   const [website, setWebsite] = useState('')
   const [file, setFile] = useState<File>()
   const [avatar, setAvatar] = useState(false)
   const [image, setImage] = useState(emptyprofile)
   const store = useContext(ContextStorage);
   const router = useRouter()
   const editorRef = useRef<AvatarEditor | null>(null);
   const fileUpload = useRef<HTMLInputElement>(null);

   useEffect(()=>{
      if (store.profile) {
         setImage(`data:image/png;base64,${store.profile.picture}`)
         setName(store.profile.name)
         setDescribe(store.profile.describe)
         setWebsite(store.profile.website)
      }
   },[store])

   useAppStateListener(store=> {
      if (store.profile) {
         setImage(`data:image/png;base64,${store.profile.picture}`)
         setName(store.profile.name)
         setDescribe(store.profile.describe)
         setWebsite(store.profile.website)
      }
   })

   const save = async () => {
      const formData = new FormData()

      formData.append("name", name)
      formData.append("describe", describe)
      formData.append("website", website)
      formData.append("filetype", "avatar")
      
      if (file) {
         formData.append("document", file);
         formData.append("originalname", file.name)
      } 

      const response = await saveProfile(formData)
      emitStore({key:'profile', value: response, store:true})
      router.refresh()
   }

   const handleImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
         const selectedFile = e.target.files[0];
         const previewUrl = URL.createObjectURL(selectedFile);
         setImage(previewUrl);
         setFile(e.target.files[0])
      }
   };

   return (
      <section className="pinfo">
         <p className="strong paddingV">{t('general.explain.profilepersonal')}</p>
         <div className="inputfield">
             <label>{t('general.picture')}</label>
            <input type="file" onChange={handleImgChange} ref={fileUpload} hidden />
            <img src={image} alt="profile" onClick={() => fileUpload!.current!.click()} className="avatar pointer"/>
         </div>
         <div className="inputfield">
            <label>{t('general.firstname')}</label>
            <input type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} />
         </div>
         <div className="inputfield">
            <label>{t('general.describe')}</label>
            <textarea name="describe" value={describe} onChange={(e) => setDescribe(e.target.value)} />
         </div>
         <div className="inputfield">
            <label>{t('general.website')}</label>
            <input type="text" name="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
         </div>
         <div className="buttonblock">
            <button className="primaryButton" onClick={() => { save() }}>{t('general.save')}</button>
         </div>
      </section>



   )
}

export const WorkInformation = () => {
   const { t } = useTranslation()
   const store = useContext(ContextStorage);
   const [statement, setStatement] = useState('')
   const [signature, setSignature] = useState('')
   const router = useRouter()

   useEffect(()=>{
      if (store.profile) {
         setStatement(store.profile.statement)
         setSignature(store.profile.signature ? store.profile.signature : `Art Inventory (c) ${new Date().getFullYear()}`)
      }
   },[])

   const save = async () => {
      const formData = new FormData()

      formData.append("signature", signature)
      formData.append("statement", statement)

      const response = await saveProfile(formData)
      emitStore({key:'profile', value: response, store:true})
      router.refresh()
   }

   return (
      <section className="pinfo">
         <p className="strong paddingV">{t('general.explain.profilework')}</p>

         <div className="inputfield">
            <label>{t('general.statement')}</label>
            <textarea name="statement" value={statement} onChange={(e) => setStatement(e.target.value)} />
         </div>

         <div className="inputfield">
            <label>{t('general.signatureonreports')}</label>
            <input type="text" name="signature" value={signature} onChange={(e) => setSignature(e.target.value)} />
         </div>

         <div className="buttonblock">
            <button className="primaryButton" onClick={() => { save() }}>{t('general.save')}</button>
         </div>
      </section>



   )
}

export const Profile = () => {
   const { t } = useTranslation()

   return (
      <section className="settings">
         <Tabs>
            <TabList>
               <Tab>{t('general.personal')}</Tab>
               <Tab>{t('general.work')}</Tab>
            </TabList>

            <TabPanel>
               <div className="managecategories">
                  <PersonalInformation />
               </div>
            </TabPanel>
            <TabPanel>
               <div className="localization">
                  <WorkInformation />
               </div>
            </TabPanel>
         </Tabs>
      </section>
   )
}