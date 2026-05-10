import { button, heading, paragraph } from '../layout.ts'

export const confirmlink = {
  name: 'confirmlink',
  preheader: 'Confirm your registration on the ArtInventory mobile app',
  body: `
${heading('Confirm your registration')}
${paragraph('Use the button below to confirm your registration on the ArtInventory mobile app.')}
${paragraph('Please do not share this link with anyone — they could log into your account.')}
${paragraph('<strong>This link expires in ten minutes</strong>, so make sure you click on time.')}
${button('{{url}}', 'Confirm email')}
  `.trim(),
}
