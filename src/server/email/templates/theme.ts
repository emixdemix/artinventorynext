import { primary, secondary, neutral } from '../../../theme/palette.ts'

export const PRIMARY = primary[500]
export const PRIMARY_DARK = primary[600]
export const SECONDARY = secondary[500]
export const TEXT = secondary[500]
export const MUTED = neutral[500]
export const BORDER = neutral[200]
export const BG = neutral[50]
export const SURFACE = '#FFFFFF'

export const LOGO_CID = 'artinventory-logo'
export const LOGO_SRC = `cid:${LOGO_CID}`

export const SITE_URL = 'https://artinventory.de'
export const SUPPORT_EMAIL = 'support@artinventory.de'
export const APP_NAME = 'ArtInventory'

export const FONT_STACK = "Arial, Helvetica, 'Segoe UI', sans-serif"

export const year = (): number => new Date().getFullYear()
