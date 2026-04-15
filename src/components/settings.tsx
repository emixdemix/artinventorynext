import { useRouter, useParams } from "next/navigation";
import { useContext, useEffect, useState } from "react";
import { KeyValue } from "../interfaces";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { useTranslation } from "react-i18next";
import { apiDownloadData, hideWaiting, saveProfile, showWaiting } from '../components/utility'
import useDownloader from 'react-use-downloader';
const categoryIcon = '/images/category.svg'
const statusIcon = '/images/status.svg'
const typeIcon = '/images/type.svg'
import { MenuItem, Select } from "@mui/material";
import { ContextStorage } from "../store";

export const Settings = () => {
   const [measures, setMeasures] = useState('cm')
   const [valuta, setValuta] = useState('euro')

   const { download } = useDownloader()
   const { t } = useTranslation()
   const router = useRouter()
   const store = useContext(ContextStorage);

   useEffect(() => {
      if (store.profile) {
         if (store.profile.measures) {
            setMeasures(store.profile.measures)
         } else {
            setMeasures('cm')
         }
         if (store.profile.valuta) {
            setValuta(store.profile.valuta)
         } else {
            setValuta('euro')
         }
      } else {
         setMeasures('cm')
      }
   }, [store])

   const downloadData = (type: string) => {
      showWaiting()
      apiDownloadData(type).then(response => {
         hideWaiting()
         const blob = new Blob([response as Blob])
         const file = URL.createObjectURL(blob)
         switch (type) {
            case 'data':
               download(file, `artdata.csv`)
               break
            case 'images':
               download(file, `images.zip`)
               break
         }
      })
   }

   const saveMeasures = async () => {
      const formData = new FormData()

      formData.append('measures', measures)
      formData.append('valuta', valuta)
      const response = await saveProfile(formData)
      if (response) {

      } else {

      }
   }

   return (
      <section className="settings">
         <Tabs>
            <TabList>
               <Tab>{t('general.categories')}</Tab>
               <Tab>{t('general.locale')}</Tab>
               <Tab>{t('general.settings')}</Tab>
            </TabList>

            <TabPanel>
               <div className="managecategories">
                  <p className="strong paddingV">{t('general.explain.settingscategories')}</p>
                  <ul>
                     <li className="smallText" >
                        <img src={categoryIcon} className="bigImageW" onClick={() => router.push('/categories/category')} />
                        {t('general.manageCategories')}
                     </li>
                     <li className="smallText " >
                        <img src={typeIcon} className="bigImageW" onClick={() => router.push('/categories/arttype')} />
                        {t('general.manageArttypes')}
                     </li>
                     <li className="smallText " >
                        <img src={statusIcon} className="bigImageW" onClick={() => router.push('/categories/status')} />
                        {t('general.manageStatuses')}
                     </li>
                  </ul>
               </div>
            </TabPanel>
            <TabPanel>
               <div className="localization">
                  <div className="inputfield">
                     <label>{t(`general.measures`)}*</label>
                     <Select
                        labelId="demo-simple-select-label"
                        id="measures"
                        value={measures}
                        onChange={(e) => setMeasures(e.target.value)}
                     >
                        <MenuItem value='inch'>Inches</MenuItem>
                        <MenuItem value='cm'>Centimeters</MenuItem>
                     </Select>
                  </div>
                  <div className="inputfield">
                     <label>{t(`general.valuta`)}*</label>
                     <Select
                        labelId="demo-simple-select-label"
                        id="valuta"
                        value={valuta}
                        onChange={(e) => setValuta(e.target.value)}
                     >
                        <MenuItem value='euro'>Euro</MenuItem>
                        <MenuItem value='dollar'>Dollar</MenuItem>
                     </Select>
                  </div>
                  <div className="buttonblock">
                     <button className="primaryButton" onClick={() => { saveMeasures() }}>{t('general.save')}</button>
                  </div>
               </div>
            </TabPanel>
            <TabPanel>
               <section className="form">
                  <div className="download">
                     <p>{t('general.downloadData')}</p>
                     <button className="primaryButton" onClick={() => { downloadData('data') }}>{t('general.download')}</button>
                  </div>
                  <div className="download">
                     <p>{t('general.downloadImages')}</p>
                     <button className="primaryButton" onClick={() => { downloadData('images') }}>{t('general.download')}</button>
                  </div>

               </section>
            </TabPanel>
         </Tabs>
      </section>
   )
}