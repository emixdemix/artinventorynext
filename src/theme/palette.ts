export const primary = {
  50: '#FFF1F3',
  100: '#FFE0E5',
  200: '#FCB8C2',
  300: '#F7818F',
  400: '#ED4358',
  500: '#D90429',
  600: '#B30220',
  700: '#8C0119',
  800: '#660113',
  900: '#45000C',
} as const

export const secondary = {
  50: '#F2F3F7',
  100: '#E0E2EB',
  200: '#BFC2D2',
  300: '#8B90A8',
  400: '#555B79',
  500: '#2B2D42',
  600: '#232539',
  700: '#1B1D2D',
  800: '#131421',
  900: '#0B0C16',
} as const

export const neutral = {
  50: '#FAFAFA',
  100: '#F4F4F5',
  200: '#E4E4E7',
  300: '#D4D4D8',
  400: '#A1A1AA',
  500: '#71717A',
  600: '#52525B',
  700: '#3F3F46',
  800: '#27272A',
  900: '#18181B',
} as const

export const semantic = {
  success: '#10B981',
  warning: '#F59E0B',
  info: '#3B82F6',
  error: primary[500],
} as const

export type Ramp = typeof primary
