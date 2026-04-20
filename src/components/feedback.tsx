import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select, { } from 'react-select'
import { addFeedback, apiGetFeedback, convertIsoDate } from "./utility";
import { Feedback } from "../interfaces";
import posthog from "posthog-js";

export const FeedbackForm = () => {
   const [option, setOption] = useState('')
   const [description, setDescription] = useState('')
   const [error, setError] = useState('')
   const [success, setSuccess] = useState(false)
   const [feedbacks, setFeedbacks] = useState([] as Feedback[])
   const { t } = useTranslation()

   const options = [
      { label: t('general.feedback.feature'), value: 'feature' },
      { label: t('general.feedback.function'), value: 'function' },
      { label: t('general.feedback.error'), value: 'error' }
   ]

   useEffect(() => {
      apiGetFeedback({}).then(data => {
         if (!data.error) {
            setFeedbacks(data.response.data)
         }
      })
   }, [])

   const checkFields = () => {
      if (option && description) {
         return false
      }
      return true
   }

   const submitFeedback = async () => {
      try {
         const response = await addFeedback({ option, description })
         posthog.capture("feedback_submitted", { feedback_type: option })
         setOption('')
         setDescription('')
         setSuccess(true)
         setTimeout(() => {
            setSuccess(false)
         }, 3000);
      } catch (e) {
         posthog.captureException(e)
         setError(t('general.error'))
      }
   }

   return (
      <section className="edit feedback">
         <section className="sendfeedback">
            <h1>{t('general.feedback.title')}</h1>
            <div className="inputfield">
               <label>{t('general.feedback.type')}*</label>
               <Select
                  placeholder={t('general.select')}
                  closeMenuOnSelect={true}
                  options={options}
                  onChange={(e) => setOption(e?.value as string)}
               />
            </div>
            <div className="inputfield">
               <label>{t('general.feedback.description')}*</label>
               <textarea name="description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">{t('general.feedbacksuccess')}</p>}
            <div className="buttonblock">
               <button disabled={checkFields()} className="primaryButton" onClick={() => { submitFeedback() }}>{t('general.submit')}</button>
            </div>
         </section>
         <section className="feedbacklist">
            <div className="feedbackrow title">
                     <p>{t('general.topic')}</p>
                     <p>{t('general.description')}</p>
                     <p>{t('general.senton')}</p>
                  </div>
            {feedbacks.map(item => {
               return (
                  <div className="feedbackrow">
                     <p>{item.option}</p>
                     <p>{item.description}</p>
                     <p>{convertIsoDate(new Date(item.createdAt).toISOString())}</p>
                  </div>
               )
            })}
         </section>
      </section>
   )
}