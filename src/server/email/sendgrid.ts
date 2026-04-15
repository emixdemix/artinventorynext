import { sendEmailThirdParty } from './smtp'

const TEMPLATE_REGISTRATION = 'registration'
const TEMPLATE_RESETPASSWORD = 'resetlink'
const TEMPLATE_OTPLINK = 'magiclink'
const TEMPLATE_POSTREGISTRATION = 'postregistration'
const TEMPLATE_OTPCODE = 'magiccode'

export const sendRegistration = async (link: string, email: string): Promise<any> => {
   const msg = {
      templateId: TEMPLATE_REGISTRATION,
      from: { email: 'support@artinventory.de', name: "Artinventory Team" },
      to: email,
      dynamic_template_data: { subject: `Thank you for registering!`, url: link }
   }
   return await sendEmailThirdParty(msg)
}

export const sendResetPassword = async (link: string, email: string): Promise<any> => {
   const msg = {
      templateId: TEMPLATE_RESETPASSWORD,
      from: { email: 'support@artinventory.de', name: "Artinventory Team" },
      to: email,
      dynamic_template_data: { subject: `Your link to reset your password!`, url: link }
   }
   return await sendEmailThirdParty(msg)
}

export const sendOTPLink = async (link: string, email: string): Promise<any> => {
   const msg = {
      templateId: TEMPLATE_OTPLINK,
      from: { email: 'support@artinventory.de', name: "Artinventory Team" },
      dynamic_template_data: { subject: `Your link to login`, url: link },
      to: email
   }
   return await sendEmailThirdParty(msg)
}

export const sendOTPCode = async (code: string, email: string): Promise<any> => {
   const msg = {
      templateId: TEMPLATE_OTPCODE,
      from: { email: 'support@artinventory.de', name: "Artinventory Team" },
      dynamic_template_data: { subject: `Your code to login`, code },
      to: email
   }
   return await sendEmailThirdParty(msg)
}

export const sendPostRegistration = async (email: string): Promise<any> => {
   const msg = {
      templateId: TEMPLATE_POSTREGISTRATION,
      from: { email: 'support@artinventory.de', name: "Artinventory Team" },
      to: email,
      dynamic_template_data: { subject: `Thank you for joining Artinventory!` }
   }
   return await sendEmailThirdParty(msg)
}
