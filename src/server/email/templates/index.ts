import { layout } from './layout.ts'
import { confirmlink } from './body/confirmlink.ts'
import { magiccode } from './body/magiccode.ts'
import { magiclink } from './body/magiclink.ts'
import { postregistration } from './body/postregistration.ts'
import { registration } from './body/registration.ts'
import { resetlink } from './body/resetlink.ts'

interface BodyTemplate {
  name: string
  preheader?: string
  body: string
}

const sources: BodyTemplate[] = [
  registration,
  resetlink,
  magiclink,
  confirmlink,
  magiccode,
  postregistration,
]

export interface RenderedTemplate {
  name: string
  html: string
}

export const renderedTemplates: RenderedTemplate[] = sources.map((s) => ({
  name: s.name,
  html: layout({ preheader: s.preheader, body: s.body }),
}))
