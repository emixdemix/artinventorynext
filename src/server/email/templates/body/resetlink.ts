import { button, heading, paragraph } from '../layout.ts'

export const resetlink = {
  name: 'resetlink',
  preheader: 'Reset your ArtInventory password',
  body: `
${heading('Reset your password')}
${paragraph('Use the button below to set a new password for your ArtInventory account.')}
${paragraph('Please make sure you choose a complex password so it is harder for people and machines to access your account.')}
${paragraph('<strong>This link expires in one hour</strong>, so make sure you click on time.')}
${button('{{url}}', 'Reset password')}
  `.trim(),
}
