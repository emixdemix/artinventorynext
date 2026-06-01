export const RESERVED_USERURL_WORDS = new Set([
  'api',
  'papi',
  '_next',
  'images',
  'image',
  'public',
  'static',
  'admin',
  'login',
  'logout',
  'setup',
  'test',
  'profile',
  'selection',
  'selections',
  'reports',
  'home',
  'dashboard',
  'shows',
  'customers',
  'media',
  'organize',
  'categories',
  'edit',
  'addartpiece',
  'addmedia',
  'addshow',
  'addcustomer',
  'feedback',
  'sell',
])

export const USERURL_REGEX = /^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/

export const slugify = (input: string): string => {
  if (!input) return ''
  return input
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

export const isValidUserUrl = (value: string): boolean => {
  if (!USERURL_REGEX.test(value)) return false
  if (RESERVED_USERURL_WORDS.has(value)) return false
  return true
}
