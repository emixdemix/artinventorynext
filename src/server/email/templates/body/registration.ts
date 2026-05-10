import { button, heading, paragraph } from '../layout.ts'

export const registration = {
  name: 'registration',
  preheader: 'Welcome to ArtInventory — set up your account',
  body: `
${heading('Welcome to ArtInventory!')}
${paragraph('Thank you for registering with us. Managing your artworks has never been so easy.')}
${paragraph('Click the button below to set up your account and discover all the features in the platform.')}
${paragraph('<strong>This link expires in one hour</strong>, so make sure you click on time.')}
${button('{{url}}', 'Set up account')}
  `.trim(),
}
