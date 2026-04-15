import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import HttpApi from 'i18next-http-backend'
import translations from './translations/translations.json'

export const initializeLanguage = async () => {
   const language = localStorage.getItem('lang')
   i18n
   .use(initReactI18next)
   .use(HttpApi)
   .init({
      partialBundledLanguages: true,
      lng: 'en-us',
      backend: {
         loadPath: `/papi/translations/${language ? language : 'en-us'}`,
         parse: (data:string) => { return {...JSON.parse(data), general: translations['en-us'].general} } 
      },
      fallbackLng: 'en-us',
      react: {
         useSuspense: true,
      },
      interpolation: {
         escapeValue: false
      },
   })

   //i18n.addResourceBundle('en-us', 'general', translations['en-us'].general);
}