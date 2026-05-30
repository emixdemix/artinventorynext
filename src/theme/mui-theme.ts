import { createTheme, type Theme } from '@mui/material/styles'
import { primary, secondary, neutral, semantic } from './palette'

const sharedTypography = {
  fontFamily: 'Sansumi, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
  fontSize: 14,
  button: { textTransform: 'none' as const, fontWeight: 700 },
}

const sharedShape = { borderRadius: 8 }

function buildPalette(mode: 'light' | 'dark') {
  if (mode === 'light') {
    return {
      mode,
      primary: {
        light: primary[300],
        main: primary[500],
        dark: primary[700],
        contrastText: '#FFFFFF',
      },
      secondary: {
        light: secondary[300],
        main: secondary[500],
        dark: secondary[700],
        contrastText: '#FFFFFF',
      },
      error: { main: primary[500] },
      warning: { main: semantic.warning },
      info: { main: semantic.info },
      success: { main: semantic.success },
      grey: neutral,
      background: { default: neutral[50], paper: '#FFFFFF' },
      text: { primary: secondary[500], secondary: neutral[600] },
      divider: neutral[200],
    }
  }
  return {
    mode,
    primary: {
      light: primary[200],
      main: primary[400],
      dark: primary[600],
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: secondary[300],
      main: secondary[400],
      dark: secondary[600],
      contrastText: '#FFFFFF',
    },
    error: { main: primary[400] },
    warning: { main: semantic.warning },
    info: { main: semantic.info },
    success: { main: semantic.success },
    grey: neutral,
    background: { default: secondary[800], paper: secondary[700] },
    text: { primary: neutral[100], secondary: neutral[400] },
    divider: secondary[600],
  }
}

function buildComponents(mode: 'light' | 'dark') {
  return {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 700,
          padding: '8px 16px',
          minWidth: 96,
        },
        containedPrimary: {
          backgroundColor: 'var(--btn-primary-bg)',
          color: 'var(--btn-primary-fg)',
          '&:hover': { backgroundColor: 'var(--btn-primary-bg-hover)' },
          '&:active': { backgroundColor: 'var(--btn-primary-bg-active)' },
        },
        outlinedPrimary: {
          backgroundColor: 'var(--btn-secondary-bg)',
          color: 'var(--btn-secondary-fg)',
          borderColor: 'var(--btn-secondary-border)',
          '&:hover': {
            backgroundColor: 'var(--btn-secondary-bg-hover)',
            borderColor: 'var(--btn-secondary-border)',
          },
        },
        textPrimary: {
          color: 'var(--btn-secondary-fg)',
          '&:hover': { backgroundColor: 'var(--btn-ghost-bg-hover)' },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          color: 'var(--link-color)',
          textDecorationColor: 'currentColor',
          '&:hover': { color: 'var(--link-color-hover)' },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'var(--input-bg)',
          '& .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--input-border)' },
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'var(--border-strong)' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'var(--input-border-focus)',
            borderWidth: 2,
          },
        },
        input: { color: 'var(--input-fg)' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundColor: 'var(--bg-surface)', backgroundImage: 'none' },
      },
    },
    MuiTabs: {
      styleOverrides: {
        indicator: { backgroundColor: 'var(--tab-active-bg)' },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          color: 'var(--tab-rest-fg)',
          '&.Mui-selected': { color: 'var(--tab-active-bg)' },
        },
      },
    },
  }
}

export function createLightTheme(): Theme {
  return createTheme({
    palette: buildPalette('light') as any,
    typography: sharedTypography,
    shape: sharedShape,
    components: buildComponents('light') as any,
  })
}

export function createDarkTheme(): Theme {
  return createTheme({
    palette: buildPalette('dark') as any,
    typography: sharedTypography,
    shape: sharedShape,
    components: buildComponents('dark') as any,
  })
}
