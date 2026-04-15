import { KeyValue } from '../interfaces'
import { getTemplate } from '../db/database'
import nodemailer from 'nodemailer'

export const sendEmailThirdParty = async (data: KeyValue) => {
   const transporter = nodemailer.createTransport({
      host: "email-smtp.eu-west-1.amazonaws.com",
      port: 587,
      secure: false,
      auth: {
         user: "AKIAYPTG6O5OGX4UPPNN",
         pass: process.env.SES_PASSWORD,
      },
   })

   const record = await getTemplate(data.templateId)
   let text = record ? record.html : ''
   Object.keys(data.dynamic_template_data).forEach(key => {
      text = text.replaceAll(`{{${key}}}`, data.dynamic_template_data[key])
   })

   const info = await transporter.sendMail({
      from: 'support@artinventory.de',
      to: data.to,
      subject: data.dynamic_template_data.subject,
      text: text,
      html: text
   })

   return info
}
