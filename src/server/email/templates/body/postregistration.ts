import { heading, paragraph } from '../layout.ts'
import { SUPPORT_EMAIL } from '../theme.ts'

export const postregistration = {
  name: 'postregistration',
  preheader: 'Welcome to the ArtInventory community',
  body: `
${heading('Great to have you in the ArtInventory community!')}
${paragraph('We hope you find in ArtInventory everything you need to manage your artworks.')}
${paragraph('ArtInventory is a growing platform, and new features come regularly to enhance its capabilities.')}
${paragraph(`We love to hear from you. You can send us feedback from the <em>Feedback</em> form on the platform, or write to <a href="mailto:${SUPPORT_EMAIL}" style="color:#D90429;">${SUPPORT_EMAIL}</a> at any time.`)}
${paragraph('Let us know about any feature you would like to see, what you enjoy, and what you would like us to improve.')}
${paragraph('Thank you for your trust,<br/><strong>The ArtInventory team</strong>')}
  `.trim(),
}
