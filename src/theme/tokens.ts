import { primary, secondary, neutral } from './palette'

export type SemanticTokens = Record<string, string>

export const lightTokens: SemanticTokens = {
  'bg-canvas': neutral[50],
  'bg-surface': '#FFFFFF',
  'bg-surface-muted': neutral[100],

  'text-primary': secondary[500],
  'text-secondary': neutral[600],
  'text-muted': neutral[500],
  'text-on-primary': '#FFFFFF',
  'text-on-secondary': '#FFFFFF',

  'border-default': neutral[200],
  'border-strong': neutral[300],

  'btn-primary-bg': primary[500],
  'btn-primary-bg-hover': primary[600],
  'btn-primary-bg-active': primary[700],
  'btn-primary-fg': '#FFFFFF',

  'btn-secondary-bg': primary[50],
  'btn-secondary-bg-hover': primary[100],
  'btn-secondary-fg': primary[700],
  'btn-secondary-border': primary[300],

  'btn-ghost-bg': 'transparent',
  'btn-ghost-bg-hover': neutral[100],
  'btn-ghost-fg': secondary[500],
  'btn-ghost-border': neutral[300],

  'link-color': primary[600],
  'link-color-hover': primary[700],
  'link-color-visited': primary[700],

  'menu-bg': primary[500],
  'menu-fg': '#FFFFFF',
  'menu-item-hover-bg': primary[700],
  'menu-submenu-bg': '#FFFFFF',
  'menu-submenu-fg': secondary[500],
  'menu-submenu-hover-bg': primary[50],

  'tab-active-bg': secondary[500],
  'tab-active-fg': '#FFFFFF',
  'tab-rest-bg': secondary[50],
  'tab-rest-fg': secondary[500],
  'tab-list-border': secondary[100],

  'input-bg': '#FFFFFF',
  'input-border': neutral[300],
  'input-border-focus': primary[500],
  'input-fg': secondary[500],

  'focus-ring': primary[300],

  // legacy aliases — keep existing CSS that references --primary etc. working
  'primary': primary[500],
  'primary-light': primary[300],
  'primary-lighter': primary[100],
  'primary-dark': primary[700],
  'primary-darker': primary[800],
  'secondary': secondary[500],
  'secondary-lighter': secondary[100],
  'gray-light': neutral[200],
  'gray-lighter': neutral[50],
  'gray': neutral[400],
  'gray-dark': neutral[500],
}

export const darkTokens: SemanticTokens = {
  ...lightTokens,

  'bg-canvas': secondary[800],
  'bg-surface': secondary[700],
  'bg-surface-muted': secondary[600],

  'text-primary': neutral[100],
  'text-secondary': neutral[400],
  'text-muted': neutral[500],

  'border-default': secondary[600],
  'border-strong': secondary[500],

  'btn-secondary-bg': secondary[600],
  'btn-secondary-bg-hover': secondary[500],
  'btn-secondary-fg': primary[300],
  'btn-secondary-border': primary[400],

  'btn-ghost-bg-hover': secondary[600],
  'btn-ghost-fg': neutral[100],
  'btn-ghost-border': secondary[500],

  'link-color': primary[300],
  'link-color-hover': primary[200],
  'link-color-visited': primary[400],

  'menu-bg': secondary[800],
  'menu-fg': neutral[100],
  'menu-item-hover-bg': secondary[600],
  'menu-submenu-bg': secondary[700],
  'menu-submenu-fg': neutral[100],
  'menu-submenu-hover-bg': secondary[600],

  'tab-active-bg': primary[500],
  'tab-active-fg': '#FFFFFF',
  'tab-rest-bg': secondary[600],
  'tab-rest-fg': neutral[200],
  'tab-list-border': secondary[600],

  'input-bg': secondary[700],
  'input-border': secondary[500],
  'input-border-focus': primary[400],
  'input-fg': neutral[100],

  'focus-ring': primary[400],

  // legacy aliases for dark
  'gray-light': secondary[600],
  'gray-lighter': secondary[700],
  'gray': neutral[500],
  'gray-dark': neutral[400],
  'secondary-lighter': secondary[600],
}

export function tokensToCss(tokens: SemanticTokens): string {
  return Object.entries(tokens)
    .map(([key, value]) => `--${key}: ${value};`)
    .join('\n  ')
}
