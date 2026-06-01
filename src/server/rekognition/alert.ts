import nodemailer from 'nodemailer'
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2'
import { ModerationReport } from './index'

interface AlertContext {
  publicUrl: string
  ownerEmail: string
  ownerName?: string
  selectionName: string
  report: ModerationReport
  scope?: 'publish' | 'add'
}

const escapeHtml = (s: string): string =>
  s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c] || c))

export const sendModerationAlert = async (ctx: AlertContext): Promise<void> => {
  const to = process.env.MODERATION_ALERT_EMAIL
  if (!to) {
    console.warn('[rekognition] MODERATION_ALERT_EMAIL not set; skipping alert')
    return
  }

  const { report } = ctx
  const scope = ctx.scope || 'publish'
  const total = report.images.length
  const flaggedCount = report.images.filter((i) => i.explicit).length
  const subjectAction =
    scope === 'add'
      ? 'New images added to published selection'
      : 'Published selection scanned'
  const subject = report.hasExplicit
    ? `DANGER: explicit content detected in ${scope === 'add' ? 'newly added images for' : 'published selection'}: ${ctx.selectionName} (${flaggedCount}/${total})`
    : `${subjectAction}: ${ctx.selectionName} (${total} image${total === 1 ? '' : 's'})`

  const lines: string[] = []
  lines.push(
    scope === 'add'
      ? `New images were added to a published selection.`
      : `A selection was just published.`,
  )
  lines.push('')
  lines.push(`Public URL: ${ctx.publicUrl}`)
  lines.push(`Selection: ${ctx.selectionName}`)
  lines.push(`Owner: ${ctx.ownerName || 'unknown'} <${ctx.ownerEmail}>`)
  lines.push('')
  if (report.hasExplicit) {
    lines.push(`Result: ${flaggedCount} of ${total} image(s) flagged as explicit.`)
  } else if (total > 0) {
    lines.push(`Result: scanned ${total} image(s); no explicit content detected.`)
  } else {
    lines.push(`Result: no images to scan.`)
  }
  lines.push('')
  lines.push(`Per-image report:`)
  for (const img of report.images) {
    const status = img.explicit ? '[EXPLICIT]' : img.scanned ? '[clean]' : '[skipped]'
    lines.push(`- ${status} ${img.key}`)
    if (img.labels.length) {
      for (const l of img.labels) {
        const parent = l.parent ? `${l.parent} > ` : ''
        lines.push(`    ${parent}${l.name} (${l.confidence}%)`)
      }
    }
  }
  const text = lines.join('\n')
  const html = `<pre>${escapeHtml(text)}</pre>`

  try {
    const sesClient = new SESv2Client({ region: 'eu-central-1' })
    const transporter = nodemailer.createTransport({
      SES: { sesClient, SendEmailCommand },
    })
    await transporter.sendMail({
      from: 'support@artinventory.de',
      to,
      subject,
      text,
      html,
    })
  } catch (e) {
    console.error('[rekognition] failed to send alert email', (e as Error).message)
  }
}
