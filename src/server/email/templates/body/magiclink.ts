import { button, heading, paragraph } from '../layout.ts'

export const magiclink = {
  name: 'magiclink',
  preheader: 'Your ArtInventory login link',
  body: `
${heading('Login with magic link')}
${paragraph('Use the button below to log in to ArtInventory.')}
${paragraph('Please do not share this link with anyone — they could log into your account.')}
${paragraph('<strong>This link expires in ten minutes</strong>, so make sure you click on time.')}
${button('{{url}}', 'Log me in')}
  `.trim(),
}
