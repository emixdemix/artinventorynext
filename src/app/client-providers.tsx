'use client'

import { useContext, useEffect, useState } from 'react'
import { ContextStorage } from '@/store'
import { StoreContext } from '@/interfaces'
import { emitAppState, useStoreListener } from '@/components/utility'
import { initializeLanguage } from '@/i18n'
import { pdfjs } from 'react-pdf'
import ReactGA from 'react-ga4'

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const [contextValue, setContextValue] = useState<StoreContext>({ profile: {} } as StoreContext)

  useEffect(() => {
    // Initialize Google Analytics
    ReactGA.initialize('G-SMJJT9V7WS')

    // Initialize PDF.js worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

    // Initialize i18n
    initializeLanguage()

    // Load context from localStorage
    const data = localStorage.getItem('context') || '{}'
    setContextValue(JSON.parse(data))

    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  return (
    <ContextStorage.Provider value={contextValue}>
      <StoreSync />
      {children}
    </ContextStorage.Provider>
  )
}

function StoreSync() {
  const store = useContext(ContextStorage)

  useStoreListener((data: { key: string; value: any; store?: boolean }) => {
    store[data.key as keyof StoreContext] = data.value as any
    if (data.store === true) {
      localStorage.setItem('context', JSON.stringify(store))
    }
    emitAppState(store)
  })

  return null
}
