import { codeBlock, heading, paragraph } from '../layout.ts'

export const magiccode = {
  name: 'magiccode',
  preheader: 'Your ArtInventory login code',
  body: `
${heading('Login with magic code')}
${paragraph('Use the code below to log in to ArtInventory.')}
${paragraph('Please do not share this code with anyone — they could log into your account.')}
${codeBlock('{{code}}')}
<div style="height:16px;line-height:16px;font-size:0;">&nbsp;</div>
${paragraph('<strong>This code expires in ten minutes</strong>, so make sure you enter it on time.')}
  `.trim(),
}
