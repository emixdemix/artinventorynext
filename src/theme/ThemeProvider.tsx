'use client'

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import { createDarkTheme, createLightTheme } from './mui-theme'

export type ColorScheme = 'light' | 'dark'

const STORAGE_KEY = 'theme'

type ColorSchemeContextValue = {
  scheme: ColorScheme
  toggle: () => void
  setScheme: (s: ColorScheme) => void
}

const ColorSchemeContext = createContext<ColorSchemeContextValue | null>(null)

export function useColorScheme(): ColorSchemeContextValue {
  const ctx = useContext(ColorSchemeContext)
  if (!ctx) throw new Error('useColorScheme must be used inside <ThemeProvider>')
  return ctx
}

function readInitialScheme(): ColorScheme {
  if (typeof document === 'undefined') return 'light'
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'dark' || attr === 'light') return attr
  return 'light'
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [scheme, setSchemeState] = useState<ColorScheme>('light')

  useEffect(() => {
    setSchemeState(readInitialScheme())
  }, [])

  const setScheme = useCallback((next: ColorScheme) => {
    setSchemeState(next)
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('data-theme', next)
    }
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }, [])

  const toggle = useCallback(() => {
    setScheme(scheme === 'dark' ? 'light' : 'dark')
  }, [scheme, setScheme])

  const muiTheme = useMemo(
    () => (scheme === 'dark' ? createDarkTheme() : createLightTheme()),
    [scheme],
  )

  const ctxValue = useMemo<ColorSchemeContextValue>(
    () => ({ scheme, toggle, setScheme }),
    [scheme, toggle, setScheme],
  )

  return (
    <ColorSchemeContext.Provider value={ctxValue}>
      <MuiThemeProvider theme={muiTheme}>
        {children}
      </MuiThemeProvider>
    </ColorSchemeContext.Provider>
  )
}

// Inline script that runs before React hydration to set data-theme from
// localStorage and avoid a flash of incorrect theme.
export const themeInitScript = `(() => {
  try {
    var saved = localStorage.getItem('${STORAGE_KEY}');
    var t = (saved === 'dark' || saved === 'light') ? saved : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();`
